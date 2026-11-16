import { login, registerStudent, SEEDED } from './support/api';
import { test, expect, goTo } from './support/fixtures';

test('a student cannot scan plates or open the admin panel', async ({ page, request, openApp }) => {
  const student = await registerStudent(request, 'Roles');
  await openApp({ lang: 'en', theme: 'dark', session: student });

  await goTo(page, 'gate');
  await expect(page.getByTestId('trigger-gate-scan-btn')).toBeDisabled();
  await expect(page.getByTestId('gate-scan-restricted')).toBeVisible();

  await page.getByTestId('header-auth-btn').click();
  await expect(page.getByTestId('profile-modal-overlay')).toBeVisible();
  await expect(page.getByTestId('open-admin-panel-btn')).toHaveCount(0);

  // The API enforces the same rules (UI hiding alone is not security).
  const scan = await request.post('/api/v1/parking/gate/scan', {
    headers: { Authorization: `Bearer ${student.accessToken}` },
    data: { plateLettersAr: 'أ ب ح', plateDigits: '1234', gateId: 'MAIN_GATE_IN' },
  });
  expect(scan.status()).toBe(403);
  const admin = await request.get('/api/v1/admin/users', {
    headers: { Authorization: `Bearer ${student.accessToken}` },
  });
  expect(admin.status()).toBe(403);
});

for (const lang of ['ar', 'en'] as const) {
  test(`a security officer scans plates and sees the gate log [${lang}]`, async ({
    page,
    request,
    openApp,
  }) => {
    const officer = await login(request, SEEDED.security);
    await openApp({ lang, theme: lang === 'ar' ? 'light' : 'dark', session: officer });
    await goTo(page, 'gate');

    for (const preset of ['preset-student-btn', 'preset-faculty-btn', 'preset-unregistered-btn']) {
      await page.getByTestId(preset).click();
      await expect(page.getByTestId('trigger-gate-scan-btn')).toBeEnabled();
      const [res] = await Promise.all([
        page.waitForResponse(r => r.url().includes('/gate/scan')),
        page.getByTestId('trigger-gate-scan-btn').click(),
      ]);
      expect(res.status(), preset).toBe(200);
      const decision = (await res.json()) as { decision: string };
      expect(['GRANTED', 'DENIED']).toContain(decision.decision);
      await expect(page.getByTestId('scan-decision-result')).toBeVisible({ timeout: 15_000 });
    }
    await expect(page.getByTestId('gate-events-table').locator('tbody tr').first()).toBeVisible();
  });
}

test('an admin can open every admin panel tab', async ({ page, request, openApp }) => {
  const admin = await login(request, SEEDED.admin);
  await openApp({ lang: 'en', theme: 'light', session: admin });

  await page.getByTestId('header-auth-btn').click();
  await page.getByTestId('open-admin-panel-btn').click();
  await expect(page.getByTestId('admin-panel-content')).toBeVisible();
  for (const tab of ['spots', 'tariffs', 'rooms', 'transit', 'users', 'gate', 'audit']) {
    await page.getByTestId(`admin-tab-${tab}`).click();
    await expect(page.getByTestId(`admin-${tab}-panel`), tab).toBeVisible();
  }
});

test('the assigned faculty member can share only their own bay', async ({
  page,
  request,
  openApp,
}) => {
  const faculty = await login(request, SEEDED.assignedFaculty);
  await openApp({ lang: 'en', theme: 'dark', session: faculty });
  await goTo(page, 'share');
  const select = page.getByTestId('spot-select');
  await expect(select.locator('option:not([value=""])')).toHaveCount(1);
  await expect(select.locator('option:not([value=""])')).toContainText('#19');
  await expect(page.getByTestId('shareable-spot-hint')).toContainText('assigned faculty bay');
});
