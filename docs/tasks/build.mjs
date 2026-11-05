import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { tasks, phases } from './tasks-data.mjs';

const root = path.resolve(import.meta.dirname, '..', '..');
const htmlDir = path.join(import.meta.dirname, 'html');
const pdfDir = path.join(import.meta.dirname, 'pdf');
const edge = ['C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'].find(existsSync);

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const list = (a, ord) => ((a && a.length) ? `<${ord ? 'ol' : 'ul'}>${a.map((x) => `<li>${esc(x)}</li>`).join('')}</${ord ? 'ol' : 'ul'}>` : '<p class="muted">لا يوجد</p>');
const dep = (t) => ((t.deps && t.deps.length) ? t.deps.join('، ') : 'لا يوجد');

// ---------- Metrics & Tracking ----------
const totalDone = tasks.filter((t) => t.status === 'Done').length;
const totalInProgress = tasks.filter((t) => t.status === 'In Progress').length;
const totalInReview = tasks.filter((t) => t.status === 'In Review').length;
const totalBacklog = tasks.filter((t) => t.status === 'Backlog').length;
const percent = Math.round((totalDone / tasks.length) * 100);
const activeTask = tasks.find((t) => t.status === 'In Progress');

const statusBadge = (s) => {
  if (s === 'Done') return `<span class="badge badge-done">Done ✅ منجز</span>`;
  if (s === 'In Progress') return `<span class="badge badge-prog">In Progress ⏳ قيد التنفيذ الآن</span>`;
  if (s === 'In Review') return `<span class="badge badge-rev">In Review 🔍 للمراجعة</span>`;
  return `<span class="badge badge-back">Backlog 📋 لم يبدأ</span>`;
};

// ---------- TASKS.md ----------
const done = (p) => tasks.filter((t) => t.id.startsWith(p));
let md = `# TASKS.md — سجل متابعة تنفيذ المشروع

> هذا الملف **مولَّد آلياً** من \`docs/tasks/tasks-data.mjs\` بالأمر \`node docs/tasks/build.mjs\`.
> ملف الـ PDF المجمع الرئيسي: [\`docs/tasks/pdf/ALL-TASKS.pdf\`](file:///d:/Rakan/docs/tasks/pdf/ALL-TASKS.pdf)
> ملفات PDF المستقلة لكل تاسك: \`docs/tasks/pdf/\`

---

## 📊 لوحة المتابعة المباشرة (Live Project Dashboard)

- **إجمالي المهام المخططة:** ${tasks.length} تاسك
- **المنجز بالكامل (Done):** ${totalDone} تاسك ✅
- **قيد العمل حالياً (In Progress):** ${totalInProgress} تاسك ⏳
- **المتبقي للبدء (Backlog):** ${totalBacklog} تاسك 📋
- **نسبة الإنجاز الإجمالية للمشروع:** **${percent}%**

${activeTask ? `> 📌 **التاسك الشغالين عليه دلوقتي:** **\`${activeTask.id}\` — ${activeTask.title}** (الفرع: \`${activeTask.branch}\`)` : ''}

| Phase | الاسم | إجمالي | منجز (Done) ✅ | قيد التنفيذ ⏳ | متبقي 📋 |
|---|---|---|---|---|---|
${Object.entries(phases).map(([k, v]) => {
  const pTasks = done(k);
  const pDone = pTasks.filter((t) => t.status === 'Done').length;
  const pProg = pTasks.filter((t) => t.status === 'In Progress').length;
  const pBack = pTasks.filter((t) => t.status === 'Backlog').length;
  return `| ${k} | ${v} | ${pTasks.length} | ${pDone} | ${pProg} | ${pBack} |`;
}).join('\n')}
| **الإجمالي** | | **${tasks.length}** | **${totalDone}** | **${totalInProgress}** | **${totalBacklog}** |

---
`;

for (const [k, v] of Object.entries(phases)) {
  md += `\n---\n# Phase ${k} — ${v}\n`;
  for (const t of done(k)) {
    const statusIcon = t.status === 'Done' ? '✅ Done' : (t.status === 'In Progress' ? '⏳ In Progress (جاري العمل)' : t.status);
    md += `
### ${t.id} — ${t.title}
- **ماذا سيعمل:** ${t.goal}
- **Priority:** ${t.pri} · **Complexity:** ${t.cx} · **Status:** ${statusIcon}
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
@page{size:A4;margin:14mm}
body{font-family:'Segoe UI',Tahoma,Arial,sans-serif;direction:rtl;color:#0f172a;line-height:1.65;font-size:12px;background:#fff}
.page{page-break-after:always}
.hdr{background:#116E63;color:#fff;padding:16px 20px;border-radius:10px;margin-bottom:12px;box-shadow:0 2px 6px rgba(0,0,0,0.1)}
.hdr .id{font-size:12px;opacity:.9;direction:ltr;text-align:right}
.hdr h1{margin:4px 0 0;font-size:18px;direction:ltr;text-align:right;font-weight:700}
.ph{font-size:12px;opacity:.95;margin-top:4px}
.goal{background:#fdf6e3;border-right:5px solid #d7a237;padding:10px 14px;border-radius:6px;margin:10px 0;font-size:13px}
table{border-collapse:collapse;width:100%;margin:8px 0;font-size:11.5px}
td,th{border:1px solid #cbd5e1;padding:6px 9px;text-align:right;vertical-align:middle}
th{background:#f1f5f9;width:20%;font-weight:600;color:#334155}
h2{font-size:13.5px;color:#116E63;margin:14px 0 4px;border-bottom:2px solid #d7a237;padding-bottom:3px}
ul,ol{margin:4px 0;padding-right:20px}
code{direction:ltr;unicode-bidi:embed;background:#f1f5f9;padding:1px 5px;border-radius:4px;font-size:11px;font-family:Consolas,monospace}
.muted{color:#64748b}
.ltr{direction:ltr;unicode-bidi:embed;text-align:center}
.foot{margin-top:14px;font-size:10px;color:#64748b;border-top:1px solid #e2e8f0;padding-top:5px;text-align:center}

/* Badges */
.badge{display:inline-block;padding:2px 8px;border-radius:9999px;font-size:10.5px;font-weight:600;direction:rtl;text-align:center;white-space:nowrap}
.badge-done{background:#dcfce7;color:#15803d;border:1px solid #86efac}
.badge-prog{background:#dbeafe;color:#1d4ed8;border:1px solid #93c5fd}
.badge-rev{background:#ede9fe;color:#6d28d9;border:1px solid #c4b5fd}
.badge-back{background:#f1f5f9;color:#475569;border:1px solid #cbd5e1}

/* Cover Dashboard */
.dash-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;margin-bottom:14px}
.stats-grid{display:flex;gap:10px;margin-top:8px}
.stat-box{flex:1;background:#fff;border:1px solid #cbd5e1;border-radius:8px;padding:10px;text-align:center}
.stat-box .num{font-size:20px;font-weight:700}
.stat-box .lbl{font-size:11px;color:#64748b}
.prog-container{margin-top:12px;background:#e2e8f0;border-radius:9999px;height:16px;overflow:hidden;position:relative}
.prog-bar{background:#116E63;height:100%;text-align:center;color:#fff;font-size:10px;line-height:16px;font-weight:700}
.active-task-banner{background:#eff6ff;border:1.5px solid #3b82f6;border-radius:8px;padding:10px 14px;margin-top:12px;display:flex;align-items:center;justify-content:space-between}
`;

const page = (t) => `<div class="page">
<div class="hdr"><div class="id">${t.id} · Phase ${t.id.split('-')[0]} — ${esc(phases[t.id.split('-')[0]])}</div><h1>${esc(t.title)}</h1></div>
<div class="goal"><b>ماذا سيعمل هذا الـ Task:</b><br>${esc(t.goal)}</div>
<table>
<tr><th>Priority</th><td>${t.pri}</td><th>Complexity</th><td>${t.cx}</td></tr>
<tr><th>Status</th><td>${statusBadge(t.status)}</td><th>Pull Request</th><td class="ltr"><code>${esc(t.pr)}</code></td></tr>
<tr><th>Git Branch</th><td colspan="3"><code class="ltr">${esc(t.branch)}</code></td></tr>
<tr><th>Dependencies</th><td colspan="3">${esc(dep(t))}</td></tr>
<tr><th>ينتظر قرارات</th><td colspan="3">${t.blockedBy.length ? esc(t.blockedBy.join('، ')) + ' (راجع docs/discovery/07-open-questions.md)' : 'لا يوجد'}</td></tr>
</table>
<h2>خطوات التنفيذ (Implementation Steps)</h2>${list(t.steps, true)}
<h2>الملفات المتوقع إنشاؤها/تعديلها</h2><ul>${t.files.map((f) => `<li><code>${esc(f)}</code></li>`).join('')}</ul>
<h2>معايير القبول (Acceptance Criteria)</h2>${list(t.accept)}
<h2>الاختبارات المطلوبة (Testing Requirements)</h2>${list(t.tests)}
<div class="foot">FBSU Smart Campus & Parking Platform — تقرير متابعة التاسك المباشر · آخر تحديث آلي</div>
</div>`;

const doc = (body) => `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>${css}</style></head><body>${body}</body></html>`;

if (existsSync(htmlDir)) rmSync(htmlDir, { recursive: true });
if (existsSync(pdfDir)) rmSync(pdfDir, { recursive: true });
mkdirSync(htmlDir, { recursive: true });
mkdirSync(pdfDir, { recursive: true });

const jobs = tasks.map((t) => [`${t.id}`, doc(page(t))]);

// Master Overview Cover
const cover = `<div class="page">
<div class="hdr">
  <h1>FBSU University SaaS Platform — Master Tasks Backlog & Progress</h1>
  <div class="ph">${tasks.length} إجمالي التاسكات المخططة · ${Object.keys(phases).length} مراحل رئيسية (Phases)</div>
</div>

<div class="dash-card">
  <div style="font-weight:700;font-size:13px;color:#116E63">📊 مؤشر الإنجاز المباشر للمشروع (Live Execution Metrics)</div>
  <div class="stats-grid">
    <div class="stat-box"><div class="num" style="color:#0f172a">${tasks.length}</div><div class="lbl">إجمالي التاسكات</div></div>
    <div class="stat-box"><div class="num" style="color:#15803d">${totalDone}</div><div class="lbl">منجز بالكامل (Done) ✅</div></div>
    <div class="stat-box"><div class="num" style="color:#1d4ed8">${totalInProgress}</div><div class="lbl">شغالين عليه الآن ⏳</div></div>
    <div class="stat-box"><div class="num" style="color:#64748b">${totalBacklog}</div><div class="lbl">متبقي (Backlog) 📋</div></div>
    <div class="stat-box"><div class="num" style="color:#116E63">${percent}%</div><div class="lbl">نسبة الإنجاز</div></div>
  </div>
  <div class="prog-container">
    <div class="prog-bar" style="width: ${Math.max(percent, 5)}%">${percent}% مكتمل</div>
  </div>
  ${activeTask ? `
  <div class="active-task-banner">
    <div>
      <span style="font-weight:700;color:#1e40af">📌 التاسك الشغالين عليه دلوقتي:</span> 
      <b style="color:#0f172a">${activeTask.id} — ${esc(activeTask.title)}</b>
    </div>
    <span class="badge badge-prog">In Progress ⏳ قيد التنفيذ</span>
  </div>` : ''}
</div>

<table style="margin-top:10px">
  <thead>
    <tr>
      <th style="width:12%;text-align:center">Task ID</th>
      <th>عنوان المهمة (Task Title)</th>
      <th style="width:8%;text-align:center">التعقيد</th>
      <th style="width:24%;text-align:center">الحالة الحالية (Status)</th>
    </tr>
  </thead>
  <tbody>
    ${tasks.map((t) => `<tr>
      <td class="ltr" style="font-weight:600"><code>${t.id}</code></td>
      <td>${esc(t.title)}</td>
      <td class="ltr">${t.cx}</td>
      <td style="text-align:center">${statusBadge(t.status)}</td>
    </tr>`).join('')}
  </tbody>
</table>
<div class="foot">FBSU Smart Campus & Parking Platform — تم التوليد آلياً لضمان دقة المتابعة خطوة بخطوة</div>
</div>`;

jobs.push(['ALL-TASKS', doc(cover + tasks.map(page).join(''))]);

console.log(`Building ${jobs.length} task PDFs with headless browser...`);
for (const [name, html] of jobs) {
  const h = path.join(htmlDir, `${name}.html`);
  writeFileSync(h, html, 'utf8');
  const out = path.join(pdfDir, `${name}.pdf`);
  execFileSync(edge, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${out}`, pathToFileURL(h).href], { stdio: 'ignore' });
}
console.log(`OK: TASKS.md + ${jobs.length} PDFs generated successfully in docs/tasks/pdf/`);
