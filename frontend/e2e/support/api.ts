import type { APIRequestContext } from '@playwright/test';
import { test } from '@playwright/test';
import { expect } from '@playwright/test';

/** Password of every seeded dev account (see DevSeeder). */
export const SEED_PASSWORD = 'FbsuDev2026!';

/** Seeded dev accounts used read-mostly by the suite. Mutating tests register fresh students. */
export const SEEDED = {
  admin: 'admin@fbsu.edu.sa',
  security: 'security@fbsu.edu.sa',
  faculty: 'm.mezher@fbsu.edu.sa',
  assignedFaculty: 'a.ghamdi@fbsu.edu.sa', // owns bay 19 (spot_assignment)
  student: 'eyad.harbi@fbsu.edu.sa', // has seeded tuition invoices
} as const;

export interface Session {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  fullNameEn: string;
}

const api = (path: string) => `/api/v1${path}`;
const rnd = () => Math.random().toString(36).slice(2, 8);
const ARABIC_LETTERS = [
  'أ',
  'ب',
  'ح',
  'د',
  'ر',
  'س',
  'ص',
  'ط',
  'ع',
  'ق',
  'ك',
  'ل',
  'م',
  'ن',
  'هـ',
  'و',
  'ى',
];
const pick = () => ARABIC_LETTERS[Math.floor(Math.random() * ARABIC_LETTERS.length)];

function toSession(json: Record<string, unknown>, email: string): Session {
  const user = (json.user ?? {}) as Record<string, unknown>;
  return {
    accessToken: String(json.accessToken),
    refreshToken: String(json.refreshToken),
    userId: String(user.id ?? json.userId ?? ''),
    email,
    fullNameEn: String(user.fullNameEn ?? ''),
  };
}

export async function login(request: APIRequestContext, email: string, password = SEED_PASSWORD) {
  const res = await request.post(api('/auth/login'), {
    data: { universityCode: 'FBSU', identifier: email, password },
  });
  expect(res.status(), `login ${email}`).toBe(200);
  return toSession(await res.json(), email);
}

/** Registers a brand-new student (empty wallet, own vehicle) so tests never share state. */
export async function registerStudent(request: APIRequestContext, label = 'E2E') {
  const id = `${Date.now().toString(36)}${rnd()}`;
  const email = `e2e-${id}@fbsu.edu.sa`;
  const fullNameEn = `${label} Student ${id.slice(-4).toUpperCase()}`;
  const res = await request.post(api('/auth/register'), {
    data: {
      universityCode: 'FBSU',
      universityNumber: `E2E-${id}`,
      email,
      password: 'E2eStudent!2026',
      fullNameAr: `طالب اختبار ${id.slice(-4)}`,
      fullNameEn,
      userType: 'STUDENT',
      phone: `05${String(Date.now()).slice(-8)}`,
      plateLettersAr: `${pick()} ${pick()} ${pick()}`,
      plateDigits: String(1000 + Math.floor(Math.random() * 8999)),
      makeModel: 'Toyota Camry 2024',
      color: 'White',
    },
  });
  expect(res.status(), `register ${email}: ${await res.text()}`).toBe(201);
  return toSession(await res.json(), email);
}

const auth = (s: Session) => ({ Authorization: `Bearer ${s.accessToken}` });

export async function getJson<T = unknown>(request: APIRequestContext, path: string, s?: Session) {
  const res = await request.get(api(path), s ? { headers: auth(s) } : {});
  expect(res.ok(), `GET ${path} -> ${res.status()}`).toBeTruthy();
  return (await res.json()) as T;
}

export async function postJson<T = unknown>(
  request: APIRequestContext,
  path: string,
  s: Session,
  data?: unknown
) {
  const res = await request.post(api(path), { headers: auth(s), data: data ?? {} });
  return { status: res.status(), json: (await res.json().catch(() => null)) as T };
}

export async function balance(request: APIRequestContext, s: Session) {
  const w = await getJson<{ balance: number | string }>(request, '/wallet', s);
  return Number(w.balance);
}

export async function topUp(request: APIRequestContext, s: Session, amount: number) {
  const r = await postJson(request, '/wallet/top-up', s, {
    amount,
    idempotencyKey: `e2e-top-${Date.now()}-${rnd()}`,
    paymentMethod: 'MADA',
  });
  expect(r.status, 'top-up').toBe(200);
}

export interface SpotDto {
  id: string;
  bayNumber: number;
  status: string;
  spotType: string;
  zoneCode: string;
}

/**
 * Picks a bay reserved for the current worker (bay number modulo worker count), so tests running
 * in parallel never race for the same bay. Falls back to any bay if this worker has none left.
 */
export function pickForWorker<T extends { bayNumber: number }>(bays: T[]): T {
  expect(bays.length, 'a free bay').toBeGreaterThan(0);
  const info = test.info();
  const workers = Math.max(1, info.config.workers);
  const mine = bays.filter(b => b.bayNumber % workers === info.parallelIndex % workers);
  const pool = mine.length ? mine : bays;
  return pool[Math.floor(Math.random() * pool.length)]!;
}

export async function availableBay(request: APIRequestContext) {
  const spots = await getJson<SpotDto[]>(request, '/parking/spots');
  // Bays are split between parallel workers by pickForWorker, so tests never race for one.
  // Standard and EV bays are bookable by every student (faculty and accessible bays are not used).
  const free = spots.filter(
    sp => sp.status === 'AVAILABLE' && (sp.spotType === 'STANDARD' || sp.spotType === 'EV_CHARGING')
  );
  return pickForWorker(free);
}

export async function bookSpot(
  request: APIRequestContext,
  s: Session,
  spotId: string,
  hours: number
) {
  const r = await postJson<{ id: string; totalAmount: number }>(request, '/parking/bookings', s, {
    spotId,
    durationHours: hours,
    idempotencyKey: `e2e-book-${Date.now()}-${rnd()}`,
  });
  expect(r.status, `book bay: ${JSON.stringify(r.json)}`).toBe(201);
  return r.json;
}

/** Parses a displayed amount such as "1,250.00 ر.س" or "٢٠٠٫٥٠" into a number. */
export function parseAmount(text: string | null | undefined): number {
  if (!text) return Number.NaN;
  const western = text
    .replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/٫/g, '.')
    .replace(/[,٬]/g, '');
  const m = western.match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : Number.NaN;
}
