import {
  registerStudent,
  balance,
  topUp,
  getJson,
  postJson,
  bookSpot,
  availableBay,
  pickForWorker,
  type SpotDto,
} from './support/api';
import { test, expect, LOCALES, tag, goTo, headerBalance } from './support/fixtures';

// The wizard books from one zone; run its two locales one after the other so they never race.
test.describe('booking wizard', () => {
  test.describe.configure({ mode: 'serial' });
  for (const locale of LOCALES) {
    test(`book a bay, get a pass, cancel for a full refund ${tag(locale)}`, async ({
      page,
      request,
      openApp,
    }) => {
      const student = await registerStudent(request, 'Parking');
      await topUp(request, student, 100);
      await openApp({ ...locale, session: student });
      await goTo(page, 'booking');

      // Pick one of the free zone-A bays the wizard offers, reserved for this worker.
      const options = page.getByTestId('wizard-spot-select').locator('option');
      await expect(options.first()).toBeAttached();
      const offered = await options.evaluateAll(els =>
        els.map(e => (e as HTMLOptionElement).value)
      );
      const spots = await getJson<SpotDto[]>(request, '/parking/spots');
      const spot = pickForWorker(spots.filter(sp => offered.includes(sp.id)));
      await page.getByTestId('wizard-spot-select').selectOption(spot.id);
      expect(spot.status).toBe('AVAILABLE');
      const before = await headerBalance(page);
      expect(before).toBeCloseTo(100, 2);

      const [res] = await Promise.all([
        page.waitForResponse(
          r => r.url().endsWith('/parking/bookings') && r.request().method() === 'POST'
        ),
        page.getByTestId('confirm-booking-btn').click(),
      ]);
      expect(res.status()).toBe(201);
      const booking = (await res.json()) as { id: string; totalAmount: number };
      expect(Number(booking.totalAmount)).toBeGreaterThan(0);

      // Charged exactly the booking price; the bay is no longer free; a digital pass is shown.
      await expect
        .poll(() => headerBalance(page))
        .toBeCloseTo(100 - Number(booking.totalAmount), 2);
      const bay = await getJson<SpotDto>(request, `/parking/spots/${spot.bayNumber}`);
      expect(bay.status).not.toBe('AVAILABLE');
      await expect(page.getByTestId('digital-pass-modal')).toBeVisible();
      await page.getByTestId('digital-pass-modal').locator('.modal-close-btn').click();

      // Cancel from "My bookings": the full amount comes back and the bay is free again.
      const cancel = page.getByTestId(`cancel-booking-btn-${booking.id}`);
      await cancel.scrollIntoViewIfNeeded();
      const [cancelRes] = await Promise.all([
        page.waitForResponse(r => r.url().includes(booking.id) && r.request().method() === 'POST'),
        cancel.click(),
      ]);
      expect(cancelRes.status()).toBe(200);
      await expect.poll(() => headerBalance(page)).toBeCloseTo(100, 2);
      expect(await balance(request, student)).toBeCloseTo(100, 2);
      expect((await getJson<SpotDto>(request, `/parking/spots/${spot.bayNumber}`)).status).toBe(
        'AVAILABLE'
      );
    });
  }
});

test('a booking without enough balance is refused and the bay stays free', async ({ request }) => {
  const student = await registerStudent(request, 'Broke');
  const spot = await availableBay(request);
  const r = await postJson(request, '/parking/bookings', student, {
    spotId: spot.id,
    durationHours: 2,
    idempotencyKey: `e2e-broke-${Date.now()}`,
  });
  expect(r.status).toBeGreaterThanOrEqual(400);
  expect(r.status).toBeLessThan(500);
  expect((await getJson<SpotDto>(request, `/parking/spots/${spot.bayNumber}`)).status).toBe(
    'AVAILABLE'
  );
});

for (const locale of LOCALES) {
  test(`Flex-Share: the booking holder shares, a peer claims, the owner earns cashback ${tag(locale)}`, async ({
    page,
    browser,
    request,
    openApp,
  }) => {
    const owner = await registerStudent(request, 'Owner');
    const peer = await registerStudent(request, 'Peer');
    await topUp(request, owner, 50);
    const spot = await availableBay(request);
    const ownerBooking = await bookSpot(request, owner, spot.id, 2);
    const ownerBefore = await balance(request, owner);

    // Owner: only their own bay is offered; longer breaks than the booking are disabled.
    await openApp({ ...locale, session: owner });
    await goTo(page, 'share');
    const select = page.getByTestId('spot-select');
    await expect(select).toHaveValue(spot.id);
    await expect(select.locator('option:not([value=""])')).toHaveCount(1);
    await expect(page.getByTestId('break-option-3')).toHaveAttribute('aria-disabled', 'true');
    await expect(page.getByTestId('break-option-4')).toHaveAttribute('aria-disabled', 'true');
    const [offerRes] = await Promise.all([
      page.waitForResponse(
        r => r.url().endsWith('/parking/flex/offers') && r.request().method() === 'POST'
      ),
      page.getByTestId('activate-flex-share-btn').click(),
    ]);
    expect(offerRes.status()).toBe(201);
    const offer = (await offerRes.json()) as { id: string; rewardAmount: number };
    await expect(page.getByTestId('flex-share-success-banner')).toBeVisible();

    // Peer, in a separate browser session: claims the offer from the Browse tab.
    const peerContext = await browser.newContext({ baseURL: test.info().project.use.baseURL! });
    const peerPage = await peerContext.newPage();
    await peerPage.addInitScript(
      ({ lang, theme, access, refresh }) => {
        localStorage.setItem('fbsu_lang', lang);
        localStorage.setItem('fbsu_theme', theme);
        localStorage.setItem('fbsu_access_token', access);
        localStorage.setItem('fbsu_refresh_token', refresh);
      },
      { ...locale, access: peer.accessToken, refresh: peer.refreshToken }
    );
    await peerPage.goto('/');
    await goTo(peerPage, 'share');
    await peerPage.getByTestId('tab-browse-flex-spots').click();
    const [claimRes] = await Promise.all([
      peerPage.waitForResponse(r => r.url().includes(`/flex/offers/${offer.id}/claim`)),
      peerPage.getByTestId(`claim-offer-btn-${offer.id}`).click(),
    ]);
    expect(claimRes.status()).toBe(200);
    await expect(peerPage.getByTestId('claim-success-banner')).toBeVisible();
    await peerContext.close();

    // The owner is paid the cashback exactly once.
    expect(await balance(request, owner)).toBeCloseTo(ownerBefore + Number(offer.rewardAmount), 2);
    const again = await postJson(request, `/parking/flex/offers/${offer.id}/claim`, peer);
    expect(again.status).toBe(400);
    expect(await balance(request, owner)).toBeCloseTo(ownerBefore + Number(offer.rewardAmount), 2);

    // While the peer holds the bay the owner cannot cancel for a refund (that would let the owner
    // keep the cashback and get the parking fee back).
    const cancel = await postJson(request, `/parking/bookings/${ownerBooking.id}/cancel`, owner);
    expect(cancel.status).toBe(400);
    expect(await balance(request, owner)).toBeCloseTo(ownerBefore + Number(offer.rewardAmount), 2);
  });
}

test('Flex-Share: a student without a booking has nothing to share and cannot offer a bay', async ({
  page,
  request,
  openApp,
}) => {
  const stranger = await registerStudent(request, 'Stranger');
  await openApp({ lang: 'en', theme: 'light', session: stranger });
  await goTo(page, 'share');
  await expect(page.getByTestId('spot-select-unavailable')).toContainText('Book a bay first');
  await expect(page.getByTestId('activate-flex-share-btn')).toBeDisabled();

  // Any bay will do: without a booking or an assignment, no bay may be offered.
  const [spot] = await getJson<SpotDto[]>(request, '/parking/spots');
  const r = await postJson(request, '/parking/flex/offers', stranger, {
    spotId: spot.id,
    durationMinutes: 60,
  });
  expect(r.status).toBe(403);
});
