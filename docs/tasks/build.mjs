import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { tasks, phases } from './tasks-data.mjs';

const root = path.resolve(import.meta.dirname, '..', '..');
const htmlDir = path.join(import.meta.dirname, 'html');
const pdfDir = path.join(import.meta.dirname, 'pdf');
const edge = ['C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'].find(existsSync);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const list = (a, ord) => (a.length ? `<${ord ? 'ol' : 'ul'}>${a.map((x) => `<li>${esc(x)}</li>`).join('')}</${ord ? 'ol' : 'ul'}>` : '<p class="muted">لا يوجد</p>');
const dep = (t) => (t.deps.length ? t.deps.join('، ') : 'لا يوجد');

// ---------- TASKS.md ----------
const done = (p) => tasks.filter((t) => t.id.startsWith(p));
let md = `# TASKS.md

> هذا الملف **مولَّد** من \`docs/tasks/tasks-data.mjs\` بالأمر \`node docs/tasks/build.mjs\` — عدّل ملف البيانات وليس هذا الملف.
> ملفات PDF لكل Task: \`docs/tasks/pdf/\` (وملف مجمّع \`ALL-TASKS.pdf\`).

الحالات: \`Backlog\` · \`Ready\` · \`In Progress\` · \`In Review\` · \`Blocked\` · \`Done\`
التعقيد: S (≤ نصف يوم) · M (يوم) · L (2–3 أيام) · XL (يُقسَّم)

## Dashboard
| Phase | الاسم | عدد التاسكات | Done | In Review |
|---|---|---|---|---|
${Object.entries(phases).map(([k, v]) => `| ${k} | ${v} | ${done(k).length} | ${done(k).filter((t) => t.status === 'Done').length} | ${done(k).filter((t) => t.status === 'In Review').length} |`).join('\n')}
| **الإجمالي** | | **${tasks.length}** | 0 | 1 |

`;
for (const [k, v] of Object.entries(phases)) {
  md += `\n---\n# Phase ${k} — ${v}\n`;
  for (const t of done(k)) {
    md += `
### ${t.id} — ${t.title}
- **ماذا سيعمل:** ${t.goal}
- **Priority:** ${t.pri} · **Complexity:** ${t.cx} · **Status:** ${t.status}
- **Dependencies:** ${dep(t)}
- **Git Branch:** \`${t.branch}\` · **Pull Request:** ${t.pr}
- **الملفات المتوقعة:** ${t.files.map((f) => `\`${f}\``).join('، ')}
- **Implementation Steps:** ${t.steps.map((s, i) => `${i + 1}) ${s}`).join(' ')}
- **Acceptance Criteria:** ${t.accept.join(' · ')}
- **Testing Requirements:** ${t.tests.join(' · ')}
- **ينتظر قرارات:** ${t.blockedBy.length ? t.blockedBy.join('، ') : 'لا يوجد'}
`;
  }
}
writeFileSync(path.join(root, 'TASKS.md'), md, 'utf8');

// ---------- HTML / PDF ----------
const css = `
@page{size:A4;margin:16mm}
body{font-family:'Segoe UI',Tahoma,Arial,sans-serif;direction:rtl;color:#0f172a;line-height:1.7;font-size:12.5px}
.page{page-break-after:always}
.hdr{background:#116E63;color:#fff;padding:14px 18px;border-radius:10px;margin-bottom:12px}
.hdr .id{font-size:12px;opacity:.85;direction:ltr;text-align:right}
.hdr h1{margin:2px 0 0;font-size:19px;direction:ltr;text-align:right}
.ph{font-size:11px;opacity:.9}
.goal{background:#fdf6e3;border-right:5px solid #d7a237;padding:10px 14px;border-radius:6px;margin:10px 0;font-size:13.5px}
table{border-collapse:collapse;width:100%;margin:8px 0}
td,th{border:1px solid #cbd5e1;padding:6px 9px;text-align:right;vertical-align:top}
th{background:#e6f2f0;width:22%}
h2{font-size:14px;color:#116E63;margin:14px 0 4px;border-bottom:2px solid #d7a237;padding-bottom:2px}
ul,ol{margin:4px 0;padding-right:22px}
code{direction:ltr;unicode-bidi:embed;background:#f1f5f9;padding:0 4px;border-radius:3px;font-size:11.5px}
.muted{color:#64748b}
.ltr{direction:ltr;unicode-bidi:embed}
.foot{margin-top:16px;font-size:10.5px;color:#64748b;border-top:1px solid #e2e8f0;padding-top:5px}
`;
const page = (t) => `<div class="page">
<div class="hdr"><div class="id">${t.id} · Phase ${t.id.split('-')[0]} — ${esc(phases[t.id.split('-')[0]])}</div><h1>${esc(t.title)}</h1></div>
<div class="goal"><b>ماذا سيعمل هذا الـ Task:</b><br>${esc(t.goal)}</div>
<table>
<tr><th>Priority</th><td>${t.pri}</td><th>Complexity</th><td>${t.cx}</td></tr>
<tr><th>Status</th><td>${t.status}</td><th>Pull Request</th><td>${t.pr}</td></tr>
<tr><th>Git Branch</th><td colspan="3"><code>${esc(t.branch)}</code></td></tr>
<tr><th>Dependencies</th><td colspan="3">${esc(dep(t))}</td></tr>
<tr><th>ينتظر قرارات</th><td colspan="3">${t.blockedBy.length ? esc(t.blockedBy.join('، ')) + ' (راجع docs/discovery/07-open-questions.md)' : 'لا يوجد'}</td></tr>
</table>
<h2>خطوات التنفيذ (Implementation Steps)</h2>${list(t.steps, true)}
<h2>الملفات المتوقع إنشاؤها/تعديلها</h2><ul>${t.files.map((f) => `<li><code>${esc(f)}</code></li>`).join('')}</ul>
<h2>معايير القبول (Acceptance Criteria)</h2>${list(t.accept)}
<h2>الاختبارات المطلوبة (Testing Requirements)</h2>${list(t.tests)}
<div class="foot">لا يُعتبر أي اختبار ناجحًا إلا بعد تنفيذه فعليًا ومشاهدة نتيجته · ممنوع Push/Merge بدون إذن صريح</div>
</div>`;
const doc = (body) => `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>${css}</style></head><body>${body}</body></html>`;

if (existsSync(htmlDir)) rmSync(htmlDir, { recursive: true });
if (existsSync(pdfDir)) rmSync(pdfDir, { recursive: true });
mkdirSync(htmlDir, { recursive: true });
mkdirSync(pdfDir, { recursive: true });

const jobs = tasks.map((t) => [`${t.id}`, doc(page(t))]);
// master overview (cover + table) then all pages
const cover = `<div class="page"><div class="hdr"><h1>FBSU University SaaS Platform — Tasks</h1><div class="ph">${tasks.length} Task · ${Object.keys(phases).length} Phases</div></div>
<table><tr><th style="width:12%">ID</th><th>Task</th><th style="width:10%">Cx</th><th style="width:14%">Status</th></tr>
${tasks.map((t) => `<tr><td class="ltr">${t.id}</td><td>${esc(t.title)}</td><td>${t.cx}</td><td>${t.status}</td></tr>`).join('')}</table></div>`;
jobs.push(['ALL-TASKS', doc(cover + tasks.map(page).join(''))]);

for (const [name, html] of jobs) {
  const h = path.join(htmlDir, `${name}.html`);
  writeFileSync(h, html, 'utf8');
  const out = path.join(pdfDir, `${name}.pdf`);
  execFileSync(edge, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${out}`, pathToFileURL(h).href], { stdio: 'ignore' });
}
console.log(`OK: TASKS.md + ${jobs.length} PDFs`);
