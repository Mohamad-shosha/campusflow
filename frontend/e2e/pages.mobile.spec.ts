import { registerStudent } from './support/api';
import { test, expect, LOCALES, tag, goTo, hasHorizontalOverflow } from './support/fixtures';
import { PAGES } from './support/pages';

for (const locale of LOCALES) {
  test(`every page fits a 360px phone ${tag(locale)}`, async ({ page, request, openApp }) => {
    const session = await registerStudent(request);
    await openApp({ ...locale, session });
    for (const tab of PAGES) {
      await goTo(page, tab);
      expect(await hasHorizontalOverflow(page), `${tab}: no horizontal scroll at 360px`).toBe(
        false
      );
    }
  });
}
