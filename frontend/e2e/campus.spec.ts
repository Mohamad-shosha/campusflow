import { registerStudent, topUp, balance, postJson } from './support/api';
import { test, expect, LOCALES, tag, goTo } from './support/fixtures';

for (const locale of LOCALES) {
  test.describe(`campus services ${tag(locale)}`, () => {
    test('book a study room, then release it', async ({ page, request, openApp }) => {
      const student = await registerStudent(request, 'Rooms');
      await openApp({ ...locale, session: student });
      await goTo(page, 'rooms');

      const bookButton = page.locator('[data-testid^="book-room-btn-"]:enabled:visible').first();
      await expect(bookButton).toBeVisible();
      await bookButton.click();
      await expect(page.getByTestId('book-room-modal')).toBeVisible();
      const [res] = await Promise.all([
        page.waitForResponse(
          r => /\/rooms\/.+\/book$/.test(r.url()) && r.request().method() === 'POST'
        ),
        page.getByTestId('confirm-room-booking-btn').click(),
      ]);
      expect(res.status()).toBeLessThan(300);
      const room = (await res.json()) as { activeBooking?: { bookingId?: string } };
      const bookingId = room.activeBooking?.bookingId;
      expect(bookingId, 'the booker sees their booking id').toBeTruthy();

      const released = await postJson(request, `/rooms/bookings/${bookingId}/release`, student);
      expect(released.status).toBe(200);
    });

    test('enrol in a tutoring session and pay the tutor', async ({ page, request, openApp }) => {
      const student = await registerStudent(request, 'Tutoring');
      await topUp(request, student, 300);
      await openApp({ ...locale, session: student });
      await goTo(page, 'tutoring');

      const bookButton = page.locator('[data-testid^="book-tutoring-btn-"]:enabled').first();
      await expect(bookButton).toBeVisible();
      await bookButton.click();
      await expect(page.getByTestId('book-tutoring-modal')).toBeVisible();
      const before = await balance(request, student);
      const [res] = await Promise.all([
        page.waitForResponse(r => r.url().includes('/tutoring') && r.request().method() === 'POST'),
        page.getByTestId('confirm-book-tutoring-btn').click(),
      ]);
      expect(res.status()).toBeLessThan(300);
      const enrolment = (await res.json()) as { amountPaid?: number; pricePaid?: number };
      const paid = Number(enrolment.amountPaid ?? enrolment.pricePaid ?? Number.NaN);
      const after = await balance(request, student);
      expect(after).toBeLessThan(before);
      if (!Number.isNaN(paid)) expect(after).toBeCloseTo(before - paid, 2);
    });

    test('book an office-hour slot, then cancel it', async ({ page, request, openApp }) => {
      const student = await registerStudent(request, 'Office');
      await openApp({ ...locale, session: student });
      await goTo(page, 'office-hours');

      const facultyButtons = page.locator('[data-testid^="open-book-faculty-"]:enabled');
      const count = await facultyButtons.count();
      expect(count).toBeGreaterThan(0);
      let appointmentId: string | undefined;
      for (let i = 0; i < count && !appointmentId; i++) {
        await facultyButtons.nth(i).click();
        const modal = page.getByTestId('book-office-hours-modal');
        await expect(modal).toBeVisible();
        const slot = modal.locator('.time-slot-btn:enabled').first();
        if ((await slot.count()) === 0) {
          await modal.locator('.modal-close-btn').click();
          continue;
        }
        await slot.click();
        const [res] = await Promise.all([
          page.waitForResponse(
            r => r.url().endsWith('/office-hours/appointments') && r.request().method() === 'POST'
          ),
          page.getByTestId('confirm-office-hours-btn').click(),
        ]);
        expect(res.status()).toBeLessThan(300);
        appointmentId = ((await res.json()) as { id: string }).id;
      }
      expect(appointmentId, 'an upcoming free slot exists').toBeTruthy();

      // Give the slot back so repeated runs on a dev database keep finding free slots.
      const cancelled = await postJson(
        request,
        `/office-hours/appointments/${appointmentId}/cancel`,
        student
      );
      expect(cancelled.status).toBe(200);
    });

    test('get a shuttle boarding pass in the right language', async ({
      page,
      request,
      openApp,
    }) => {
      const student = await registerStudent(request, 'Transit');
      await openApp({ ...locale, session: student });
      await goTo(page, 'bus');

      const passButton = page.locator('[data-testid^="book-transit-pass-btn-"]:enabled').first();
      await expect(passButton).toBeVisible();
      await passButton.scrollIntoViewIfNeeded();
      const [res] = await Promise.all([
        page.waitForResponse(r => r.url().includes('/transit') && r.request().method() === 'POST'),
        passButton.click(),
      ]);
      expect(res.status()).toBeLessThan(300);
      const modal = page.getByTestId('transit-pass-modal');
      await expect(modal).toBeVisible();
      const expectedName = locale.lang === 'en' ? student.fullNameEn : 'طالب اختبار';
      await expect(modal).toContainText(expectedName);
    });
  });
}
