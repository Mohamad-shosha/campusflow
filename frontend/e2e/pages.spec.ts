import { registerStudent } from './support/api';
import { PAGES } from './support/pages';
import { test, expect, LOCALES, tag, goTo, hasHorizontalOverflow } from './support/fixtures';

const BROKEN_TEXT = /\bundefined\b|\bNaN\b|\[object Object\]|Invalid Date/;

for (const locale of LOCALES) {
  test.describe(`every page renders ${tag(locale)}`, () => {
    test('signed out', async ({ page, openApp }) => {
      await openApp(locale);
      for (const tab of PAGES) {
        await goTo(page, tab);
        await expect(page.locator('main, #root').first(), tab).not.toBeEmpty();
        expect(await hasHorizontalOverflow(page), `${tab}: no horizontal scroll`).toBe(false);
        expect(await page.locator('body').innerText(), `${tab}: no broken values`).not.toMatch(
          BROKEN_TEXT
        );
      }
    });

    test('signed in as a new student', async ({ page, request, openApp }) => {
      const session = await registerStudent(request);
      await openApp({ ...locale, session });
      for (const tab of PAGES) {
        await goTo(page, tab);
        expect(await hasHorizontalOverflow(page), `${tab}: no horizontal scroll`).toBe(false);
        expect(await page.locator('body').innerText(), `${tab}: no broken values`).not.toMatch(
          BROKEN_TEXT
        );
      }
    });
  });
}
