import type { ProblemDetail } from '../types/auth';

/**
 * Extracts a user-facing message from a failed API call (RFC 7807 ProblemDetail
 * returned by the backend), falling back to the provided localized message.
 * Never use a failed call's absence of data as a reason to show success.
 */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  const data = (err as { response?: { data?: Partial<ProblemDetail> } })?.response?.data;
  const detail = typeof data?.detail === 'string' ? data.detail.trim() : '';
  if (detail) return detail;
  const title = typeof data?.title === 'string' ? data.title.trim() : '';
  return title || fallback;
}

/** True when the request failed because the user is not signed in / session expired. */
export function isUnauthorizedError(err: unknown): boolean {
  const status = (err as { response?: { status?: number } })?.response?.status;
  return status === 401 || status === 403;
}
