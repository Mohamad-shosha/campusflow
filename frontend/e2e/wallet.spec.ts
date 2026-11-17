import {
  registerStudent,
  login,
  balance,
  topUp,
  getJson,
  parseAmount,
  SEEDED,
} from './support/api';
import { test, expect, LOCALES, tag, goTo, headerBalance } from './support/fixtures';

for (const locale of LOCALES) {
  test(`top-up credits the exact amount and is recorded ${tag(locale)}`, async ({
    page,
    request,
    openApp,
  }) => {
    const student = await registerStudent(request, 'Wallet');
    await openApp({ ...locale, session: student });
    await goTo(page, 'wallet');

    const before = await headerBalance(page);
    await page.getByTestId('btn-open-topup').click();
    const preset = page.locator('[data-testid^="preset-amount-"]').first();
    const amount = Number(
      (await preset.getAttribute('data-testid'))!.replace('preset-amount-', '')
    );
    await preset.click();
    const [res] = await Promise.all([
      page.waitForResponse(
        r => r.url().includes('/wallet/top-up') && r.request().method() === 'POST'
      ),
      page.getByTestId('btn-confirm-topup').click(),
    ]);
    expect(res.status()).toBe(200);

    await expect.poll(() => headerBalance(page)).toBeCloseTo(before + amount, 2);
    await expect
      .poll(async () => parseAmount(await page.getByTestId('wallet-balance-amount').textContent()))
      .toBeCloseTo(before + amount, 2);
    expect(await balance(request, student)).toBeCloseTo(before + amount, 2);

    const ledger = await getJson<{ content: { transactionType: string; amount: number }[] }>(
      request,
      '/wallet/ledger',
      student
    );
    expect(
      ledger.content.some(e => e.transactionType === 'TOP_UP' && Number(e.amount) === amount)
    ).toBe(true);
    await expect(page.getByTestId('ledger-table')).toBeVisible();
  });
}

test('paying part of a tuition invoice debits exactly that amount', async ({
  page,
  request,
  openApp,
}) => {
  // Seeded student with open tuition invoices.
  const student = await login(request, SEEDED.student);
  await topUp(request, student, 5);
  await openApp({ lang: 'ar', theme: 'light', session: student });
  await goTo(page, 'tuition');

  await expect(page.locator('[data-testid^="btn-pay-tuition-"]').first()).toBeVisible();
  const payButton = page.locator('[data-testid^="btn-pay-tuition-"]:enabled').first();
  test.skip((await payButton.count()) === 0, 'no open invoice left in this database');
  const before = await balance(request, student);
  await payButton.click();
  await expect(page.getByTestId('pay-tuition-modal')).toBeVisible();
  await page.getByTestId('pay-mode-custom').click();
  await page.getByTestId('input-tuition-custom-amount').fill('1');
  const [res] = await Promise.all([
    page.waitForResponse(r => r.url().includes('/tuition') && r.request().method() === 'POST'),
    page.getByTestId('btn-confirm-tuition-pay').click(),
  ]);
  expect(res.status()).toBeLessThan(300);
  expect(await balance(request, student)).toBeCloseTo(before - 1, 2);
  await expect.poll(() => headerBalance(page)).toBeCloseTo(before - 1, 2);
});
