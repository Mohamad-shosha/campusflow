/** Human-readable label for a user's most privileged role (never the raw enum code). */
const ROLE_LABELS: Array<{ role: string; ar: string; en: string }> = [
  { role: 'CAMPUS_ADMIN', ar: 'مشرف الحرم', en: 'Campus Admin' },
  { role: 'SECURITY_OFFICER', ar: 'أمن البوابات', en: 'Security Officer' },
  { role: 'DEPARTMENT_CHAIR', ar: 'رئيس قسم', en: 'Department Chair' },
  { role: 'FACULTY', ar: 'عضو هيئة تدريس', en: 'Faculty' },
  { role: 'STAFF', ar: 'إداري', en: 'Staff' },
  { role: 'STUDENT', ar: 'طالب', en: 'Student' },
];

export function userRoleLabel(
  roles: readonly string[] | undefined,
  userType?: string
): { ar: string; en: string } {
  const owned = new Set([...(roles ?? []), ...(userType ? [userType] : [])]);
  const match = ROLE_LABELS.find(r => owned.has(r.role));
  return match ? { ar: match.ar, en: match.en } : { ar: 'طالب', en: 'Student' };
}
