import { test as base, expect, type Page } from '@playwright/test';
import type { Session } from './api';

export type Lang = 'ar' | 'en';
export type Theme = 'light' | 'dark';
export interface Locale {
  lang: Lang;
  theme: Theme;
}

/** The two combinations every user journey runs in: Arabic/light and English/dark. */
export const LOCALES: Locale[] = [
  { lang: 'ar', theme: 'light' },
  { lang: 'en', theme: 'dark' },
];

export const tag = (l: Locale) => `[${l.lang}/${l.theme}]`;

interface Fixtures {
  /** Console errors, page errors and failed API calls collected for the current page. */
  problems: string[];
  /** Opens the app in the given language/theme, optionally already signed in. */
  openApp: (opts: Locale & { session?: Session }) => Promise<void>;
}

export const test = base.extend<Fixtures>({
  problems: [
    async ({ page }, use) => {
      const problems: string[] = [];
      page.on('console', msg => {
        if (msg.type() !== 'error') return;
        // Chrome logs every 4xx answer as "Failed to load resource"; tests that provoke a 4xx
        // (wrong password, forbidden action) assert it themselves. 5xx is caught below.
        if (/Failed to load resource: the server responded with a status of 4\d\d/.test(msg.text()))
          return;
        problems.push(`console: ${msg.text().slice(0, 300)}`);
      });
      page.on('pageerror', err => problems.push(`pageerror: ${String(err).slice(0, 300)}`));
      page.on('response', res => {
        const url = res.url();
        // 4xx answers that a test provokes on purpose are asserted by that test itself.
        if (url.includes('/api/') && res.status() >= 500) {
          problems.push(`HTTP ${res.status()} ${res.request().method()} ${url}`);
        }
      });
      await use(problems);
      expect(problems, 'no console errors, page errors or 5xx responses').toEqual([]);
    },
    { auto: true },
  ],

  openApp: async ({ page }, use) => {
    await use(async ({ lang, theme, session }) => {
      await page.addInitScript(
        ({ lang, theme, access, refresh }) => {
          // Only on the first load of this test, so in-app toggles survive reloads.
          if (sessionStorage.getItem('e2e-init')) return;
          sessionStorage.setItem('e2e-init', '1');
          localStorage.setItem('fbsu_lang', lang);
          localStorage.setItem('fbsu_theme', theme);
          localStorage.setItem('fbsu_sound', 'false');
          if (access && refresh) {
            localStorage.setItem('fbsu_access_token', access);
            localStorage.setItem('fbsu_refresh_token', refresh);
          }
        },
        {
          lang,
          theme,
          access: session?.accessToken ?? null,
          refresh: session?.refreshToken ?? null,
        }
      );
      await page.goto('/');
      await expect(page.getByTestId('main-header')).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      if (session) await expect(page.getByTestId('header-logout-btn')).toBeVisible();
    });
  },
});

export { expect };

/** The group in the header menu that holds each page. */
const NAV_GROUP: Record<string, string> = {
  map: 'parking',
  booking: 'parking',
  gate: 'parking',
  share: 'parking',
  tutoring: 'campus',
  'office-hours': 'campus',
  rooms: 'campus',
  bus: 'campus',
  wallet: 'finance',
  tuition: 'finance',
};

/** Navigates through the real header menu (desktop dropdowns or the mobile panel). */
export async function goTo(page: Page, tab: string) {
  const mobileToggle = page.locator('.cf-menu-toggle');
  if (await mobileToggle.isVisible()) {
    await mobileToggle.click();
    await page.locator(`.cf-mobile-panel [data-nav="${tab}"]`).click();
  } else if (tab === 'analytics') {
    await page.locator('.cf-nav [data-nav="analytics"]').click();
  } else {
    const group = NAV_GROUP[tab];
    if (!group) throw new Error(`unknown tab ${tab}`);
    await page.locator(`.cf-nav [data-nav-group="${group}"]`).click();
    await page.locator(`.cf-nav [data-nav="${tab}"]`).click();
  }
  await page.waitForLoadState('networkidle');
}

export async function headerBalance(page: Page) {
  const { parseAmount } = await import('./api');
  return parseAmount(await page.getByTestId('header-wallet-balance').textContent());
}

/** True when the page scrolls sideways (a layout bug on every viewport). */
export async function hasHorizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
}
