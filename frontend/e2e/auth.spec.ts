import { registerStudent, login, SEEDED } from './support/api';
import { test, expect, LOCALES, tag } from './support/fixtures';

for (const locale of LOCALES) {
  test.describe(`sign-in ${tag(locale)}`, () => {
    test('a new student signs in with the form and signs out', async ({
      page,
      request,
      openApp,
    }) => {
      const student = await registerStudent(request, 'Auth');
      await openApp(locale);

      await page.getByTestId('header-auth-btn').click();
      const form = page.getByTestId('login-form');
      await expect(form).toBeVisible();
      await form.locator('input[type="text"], input[type="email"]').first().fill(student.email);
      await form.locator('input[type="password"]').fill('E2eStudent!2026');
      const [res] = await Promise.all([
        page.waitForResponse(r => r.url().includes('/auth/login')),
        page.getByTestId('submit-login-btn').click(),
      ]);
      expect(res.status()).toBe(200);

      await expect(page.getByTestId('header-logout-btn')).toBeVisible();
      await expect(page.getByTestId('header-wallet-balance')).toContainText(/0([.,٫]00)?/);

      await page.getByTestId('header-logout-btn').click();
      await expect(page.getByTestId('header-logout-btn')).toHaveCount(0);
      expect(await page.evaluate(() => localStorage.getItem('fbsu_access_token'))).toBeNull();
    });

    test('a wrong password is rejected with a message', async ({ page, openApp }) => {
      await openApp(locale);
      await page.getByTestId('header-auth-btn').click();
      const form = page.getByTestId('login-form');
      await form.locator('input[type="text"], input[type="email"]').first().fill(SEEDED.student);
      await form.locator('input[type="password"]').fill('definitely-wrong-1');
      const [res] = await Promise.all([
        page.waitForResponse(r => r.url().includes('/auth/login')),
        page.getByTestId('submit-login-btn').click(),
      ]);
      expect(res.status()).toBe(401);
      await expect(page.getByTestId('auth-error-banner')).toBeVisible();
      await expect(page.getByTestId('header-logout-btn')).toHaveCount(0);
    });
  });
}

test('a stored session is restored on reload, and a revoked one is dropped', async ({
  page,
  request,
  openApp,
}) => {
  const session = await login(request, SEEDED.student);
  await openApp({ lang: 'en', theme: 'dark', session });
  await page.reload();
  await expect(page.getByTestId('header-logout-btn')).toBeVisible();

  // An invalid token must not leave the UI looking signed in.
  await page.evaluate(() => {
    localStorage.setItem('fbsu_access_token', 'not-a-real-token');
    localStorage.setItem('fbsu_refresh_token', 'not-a-real-token');
  });
  await page.reload();
  await expect(page.getByTestId('header-logout-btn')).toHaveCount(0);
});
