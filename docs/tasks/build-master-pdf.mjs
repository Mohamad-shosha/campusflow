import { writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..', '..');
const edge = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
].find(existsSync);

const htmlPath = path.join(root, 'docs', 'CAMPUSFLOW-MASTER-BLUEPRINT.html');
const pdfPath = path.join(root, 'docs', 'CAMPUSFLOW-MASTER-BLUEPRINT.pdf');

const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>CampusFlow — وثيقة إعادة تنظيم وهيكلة المنتج الشاملة</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
    
    @page {
      size: A4;
      margin: 18mm 14mm 18mm 14mm;
      @bottom-right {
        content: counter(page);
      }
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      font-family: 'Tajawal', 'Segoe UI', Tahoma, sans-serif;
      background: #ffffff;
      color: #1e293b;
      margin: 0;
      padding: 0;
      font-size: 13px;
      line-height: 1.6;
    }

    .page-break {
      page-break-before: always;
    }

    .header-cover {
      background: linear-gradient(135deg, #0d524a 0%, #116e63 50%, #064e3b 100%);
      color: #ffffff;
      padding: 40px 30px;
      border-radius: 12px;
      margin-bottom: 25px;
      box-shadow: 0 10px 25px rgba(17, 110, 99, 0.2);
    }

    .header-cover h1 {
      margin: 0 0 10px 0;
      font-size: 28px;
      font-weight: 900;
      color: #ffffff;
    }

    .header-cover .subtitle {
      font-size: 16px;
      color: #99f6e4;
      margin-bottom: 15px;
      font-weight: 500;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 20px;
      border-top: 1px solid rgba(255,255,255,0.2);
      padding-top: 15px;
    }

    .meta-item {
      font-size: 11px;
      color: #ccfbf1;
    }

    .meta-item strong {
      display: block;
      font-size: 13px;
      color: #ffffff;
      margin-top: 2px;
    }

    h2 {
      color: #0d524a;
      font-size: 18px;
      font-weight: 800;
      border-right: 4px solid #116e63;
      padding-right: 10px;
      margin: 25px 0 12px 0;
    }

    h3 {
      color: #1e293b;
      font-size: 15px;
      font-weight: 700;
      margin: 18px 0 8px 0;
    }

    p {
      margin: 0 0 10px 0;
      color: #334155;
      text-align: justify;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 20px 0;
      font-size: 11px;
      page-break-inside: avoid;
    }

    th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      text-align: right;
      padding: 8px 10px;
      border: 1px solid #cbd5e1;
    }

    td {
      padding: 7px 10px;
      border: 1px solid #cbd5e1;
      color: #334155;
    }

    tr:nth-child(even) td {
      background: #f8fafc;
    }

    .badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 10px;
      text-align: center;
    }

    .badge-verified { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
    .badge-partial { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }
    .badge-missing { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
    .badge-planned { background: #e0e7ff; color: #3730a3; border: 1px solid #a5b4fc; }
    .badge-p0 { background: #fee2e2; color: #991b1b; font-weight: 800; }
    .badge-p1 { background: #ffedd5; color: #9a3412; font-weight: 800; }
    .badge-p2 { background: #e0f2fe; color: #075985; }

    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 12px;
      page-break-inside: avoid;
    }

    .card-title {
      font-weight: 800;
      font-size: 13px;
      color: #0d524a;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
    }

    .callout {
      background: #f0fdfa;
      border-right: 4px solid #14b8a6;
      padding: 12px;
      border-radius: 4px;
      margin: 15px 0;
      font-size: 12px;
    }

    .callout-title {
      font-weight: 700;
      color: #0f766e;
      margin-bottom: 4px;
    }

    .footer {
      margin-top: 30px;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
      font-size: 10px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>

  <!-- Cover Header -->
  <div class="header-cover">
    <h1>منظومة CampusFlow — المخطط الهيكلي الشامل للمنتج</h1>
    <div class="subtitle">وثيقة إعادة تنظيم المنظومة وتصنيف الميزات — جامعة فهد بن سلطان (FBSU Smart Campus OS)</div>
    <div class="meta-grid">
      <div class="meta-item">نسبة جاهزية المنتج<strong>83.1% (متقدم جداً)</strong></div>
      <div class="meta-item">المهام المنجزة<strong>42 من 53 مهمة (79%)</strong></div>
      <div class="meta-item">الميزات المكتشفة<strong>16 ميزة متكاملة</strong></div>
      <div class="meta-item">تاريخ الاعتماد<strong>نوفمبر 2026</strong></div>
    </div>
  </div>

  <div class="callout">
    <div class="callout-title">📌 الغرض من هذه الوثيقة:</div>
    هذه الوثيقة تمثل المرجع النهائي والشامل لمنتج CampusFlow. تم بناؤها بعد فحص وتدقيق كامل لـ 100% من الكود المصدري، وهجرات قواعد البيانات، ومسارات الـ REST APIs، ومكونات الواجهة الأمامية، لتوفير خريطة طريق واقعية مبنية على الواقع البرمجي الفعلي وليس مجرد تخطيط نظري.
  </div>

  <!-- Section 1: Product Overview -->
  <h2>1. نظرة عامة على المنظومة (Executive Summary)</h2>
  <p>
    <strong>CampusFlow</strong> هو نظام تشغيل جامعي سحابي متكامل مبني بنمط <em>Modular Monolith</em> متماسك، يجمع بين أربع ركائز أساسية:
  </p>
  <ul>
    <li><strong>التنقل والمواقف الذكية (Mobility & Parking):</strong> إدارة 30 موقفاً ذكياً، حساسات سقفية (Ultrasonic LEDs)، بوابات قراءة اللوحات آلياً (ALPR)، وتبادل المواقف الذكي (AI Flex-Share).</li>
    <li><strong>الخدمات الأكاديمية التشاركية (Collaborative Academic):</strong> شبكة دروس التقوية الطلابية (P2P Tutoring)، حجز الساعات المكتبية للأساتذة، وغرف الدراسة والبودات التفاعلية بعداد تنازلي حي.</li>
    <li><strong>المالية والمحفظة الرقمية (Fintech & Wallet):</strong> محفظة رقمية بدفتر أستاذ مزدوج القيد (Double-Entry Ledger) وسداد الرسوم الدراسية مع فواتير ضريبية معتمدة وباركود QR.</li>
    <li><strong>الحوكمة والإدارة المركزية (Governance & Audit):</strong> لوحة تحكم إدارية مركزية للتحكم بالأسعار والمواقف والغرف والمستخدمين مع سجل تدقيق غير قابل للتعديل (Immutable Audit Log).</li>
  </ul>

  <!-- Section 2: Dashboard Table -->
  <h2>2. لوحة تقييم حالة الميزات (Feature Status Dashboard)</h2>
  <table>
    <thead>
      <tr>
        <th>الميزة (Feature ID & Name)</th>
        <th>الواجهة (Frontend)</th>
        <th>الخلفية (Backend)</th>
        <th>قاعدة البيانات</th>
        <th>التكامل (Integration)</th>
        <th>الاختبارات</th>
        <th>الحالة العامة</th>
        <th>النسبة</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>F-01: Campus Core</strong></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">V2 (Campus)</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">5 Tests</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><strong>100%</strong></td>
      </tr>
      <tr>
        <td><strong>F-02: Identity, Auth & RBAC</strong></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">V3 (Identity)</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">29 Tests</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><strong>100%</strong></td>
      </tr>
      <tr>
        <td><strong>F-03: Vehicle Registry & Saudi Plates</strong></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">V3 (Vehicles)</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">13 Tests</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><strong>100%</strong></td>
      </tr>
      <tr>
        <td><strong>F-04: Digital Wallet & Ledger</strong></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">V4 (Ledger)</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">20 Tests</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><strong>100%</strong></td>
      </tr>
      <tr>
        <td><strong>F-05: Tuition & Tax Receipts</strong></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">V5 (Tuition)</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">11 Tests</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><strong>100%</strong></td>
      </tr>
      <tr>
        <td><strong>F-06: Smart Parking & IoT Map</strong></td>
        <td><span class="badge badge-verified">VERIFIED (PR 41)</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">V6 (Parking)</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">9 Tests</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><strong>100%</strong></td>
      </tr>
      <tr>
        <td><strong>F-07: Parking Booking & Pass</strong></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">V7 (Booking)</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">4 Tests</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><strong>100%</strong></td>
      </tr>
      <tr>
        <td><strong>F-08: AI Flex-Share P2P</strong></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">V8 (Flex)</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">5 Tests</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><strong>100%</strong></td>
      </tr>
      <tr>
        <td><strong>F-09: ALPR Gate Barrier System</strong></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">V9 (Gate)</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">6 Tests</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><strong>100%</strong></td>
      </tr>
      <tr>
        <td><strong>F-10: Peer Tutoring Network</strong></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">V10 (Tutoring)</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">8 Tests</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><strong>100%</strong></td>
      </tr>
      <tr>
        <td><strong>F-11: Faculty Office Hours</strong></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">V11 (Office)</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">6 Tests</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><strong>100%</strong></td>
      </tr>
      <tr>
        <td><strong>F-12: Smart Study Rooms & Pods</strong></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">V12 (Rooms)</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">8 Tests</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><strong>100%</strong></td>
      </tr>
      <tr>
        <td><strong>F-13: Campus Notifications</strong></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">V13 (Notifs)</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><span class="badge badge-verified">25 Tests</span></td>
        <td><span class="badge badge-verified">VERIFIED</span></td>
        <td><strong>100%</strong></td>
      </tr>
      <tr>
        <td><strong>F-14: Admin Operations & Audit</strong></td>
        <td><span class="badge badge-partial">PARTIAL (Placeholder)</span></td>
        <td><span class="badge badge-verified">VERIFIED (PR 40)</span></td>
        <td><span class="badge badge-verified">V14 (Audit)</span></td>
        <td><span class="badge badge-partial">PARTIAL</span></td>
        <td><span class="badge badge-partial">6 Backend</span></td>
        <td><span class="badge badge-partial">BACKEND_ONLY</span></td>
        <td><strong>70%</strong></td>
      </tr>
      <tr>
        <td><strong>F-15: Campus Analytics</strong></td>
        <td><span class="badge badge-partial">UI_ONLY (Mocked)</span></td>
        <td><span class="badge badge-missing">MISSING</span></td>
        <td><span class="badge badge-partial">PARTIAL</span></td>
        <td><span class="badge badge-missing">MISSING</span></td>
        <td><span class="badge badge-missing">0 Tests</span></td>
        <td><span class="badge badge-missing">UI_ONLY</span></td>
        <td><strong>35%</strong></td>
      </tr>
      <tr>
        <td><strong>F-16: Enterprise Hardening & Ops</strong></td>
        <td><span class="badge badge-planned">PLANNED</span></td>
        <td><span class="badge badge-partial">PARTIAL</span></td>
        <td><span class="badge badge-partial">PARTIAL</span></td>
        <td><span class="badge badge-planned">PLANNED</span></td>
        <td><span class="badge badge-partial">CI Active</span></td>
        <td><span class="badge badge-planned">PLANNED</span></td>
        <td><strong>25%</strong></td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- Section 3: Priority Matrix -->
  <h2>3. مصفوفة الأولويات وخطة السبرنتات (Prioritization & Roadmaps)</h2>
  
  <h3>المسار الحرج الحالي (Current Critical Path):</h3>
  <div class="callout">
    <strong>الترتيب الإلزامي للتنفيذ لضمان إطلاق الإصدار الإنتاجي v1.0:</strong><br>
    <code>[F-14: Admin UI (P7-05)]</code> ➔ <code>[F-15: Analytics Backend (P7-06)]</code> ➔ <code>[F-16: Security & E2E (Sprint 09)]</code> ➔ <code>[F-16: Prod Release (Sprint 10)]</code>
  </div>

  <table>
    <thead>
      <tr>
        <th>السبرنت (Sprint)</th>
        <th>المهمة والهدف</th>
        <th>المخرجات المتوقعة</th>
        <th>الحالة</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Sprint 01 to 07</strong></td>
        <td>تأسيس المنوريبو، الهوية، المحفظة، المواقف، البوابات، الخدمات الأكاديمية، والتنبيهات</td>
        <td>42 مهمة منجزة + 14 هجرة داتابيز + 173 اختباراً ناجحاً بنسبة 100%</td>
        <td><span class="badge badge-verified">100% DONE</span></td>
      </tr>
      <tr>
        <td><strong>Sprint 08 (النشط)</strong></td>
        <td><strong>P7-05: Admin UI</strong> (شاشات لوحة الإدارة للمواقف والغرف والأسعار وسجل التدقيق)</td>
        <td>واجهة إدارة متجاوبة متصلة بالباك إند تمكن الإداري من التحكم في الحرم</td>
        <td><span class="badge badge-p1">READY (الخطوة التالية)</span></td>
      </tr>
      <tr>
        <td><strong>Sprint 08</strong></td>
        <td><strong>P7-06: Analytics</strong> (مسارات إحصائيات الإشغال والإيرادات وربطها بالواجهة)</td>
        <td>شاشة تحليلات حية تعكس بيانات حقيقية بدلاً من الأرقام الوهمية</td>
        <td><span class="badge badge-p2">BACKLOG (بعد P7-05)</span></td>
      </tr>
      <tr>
        <td><strong>Sprint 09</strong></td>
        <td><strong>Phase 8: Enterprise Hardening</strong> (فحص OWASP، سويت Playwright E2E، وضغط k6)</td>
        <td>تقرير أمني خالٍ من الثغرات، واختبارات E2E باللغتين AR/EN، وامتثال لـ PDPL</td>
        <td><span class="badge badge-planned">PLANNED</span></td>
      </tr>
      <tr>
        <td><strong>Sprint 10</strong></td>
        <td><strong>Phase 9: Production Launch</strong> (سيرفرات الإنتاج، شهادات SSL، النسخ الاحتياطي، v1.0)</td>
        <td>نظام إنتاجي حي مستقر بنسبة 99.9% وأدلة تشغيل شاملة</td>
        <td><span class="badge badge-planned">PLANNED</span></td>
      </tr>
    </tbody>
  </table>

  <!-- Section 4: Architecture & Quality -->
  <h2>4. المعمارية الفنية ومعايير الجودة (Technical Architecture & Quality)</h2>
  
  <div class="card">
    <div class="card-title">
      <span>نمط Modular Monolith عالي التماسك (High Cohesion, Loose Coupling)</span>
      <span class="badge badge-verified">Java 21 / Spring Boot 3.3.4</span>
    </div>
    <p>
      التطبيق مجمع في خدمة واحدة عالية الكفاءة مقسمة داخلياً إلى موديولات أعمال منفصلة: <code>identity</code>, <code>wallet</code>, <code>parking</code>, <code>rooms</code>, <code>tutoring</code>, <code>officehours</code>, <code>notifications</code>, <code>admin</code>. لا توجد أي استيرادات دائرية أو فوضى معمارية، والالتزام مفحوص آلياً عبر ArchUnit.
    </p>
  </div>

  <div class="card">
    <div class="card-title">
      <span>دفتر الحسابات المزدوج والأمان المالي (Financial Integrity)</span>
      <span class="badge badge-verified">ACID / Double-Entry Ledger</span>
    </div>
    <p>
      كل حركة مالية في المحفظة تسجل في جدول <code>ledger_entry</code> غير القابل للحذف. رصيد المحفظة محمي بقيد صلب في الداتابيز <code>CHECK (balance >= 0)</code> يمنع أي سحب على المكشوف، مدعوماً بحبس تشاؤمي <code>SELECT ... FOR UPDATE</code> يمنع تضارب العمليات المتزامنة (Race Conditions).
    </p>
  </div>

  <div class="card">
    <div class="card-title">
      <span>سجل التدقيق الإداري الصارم (Immutable Admin Audit Logging)</span>
      <span class="badge badge-verified">Flyway V14 / Spring Security</span>
    </div>
    <p>
      كل إجراء إداري ينفذه مسؤول الحرم (تعديل تسعيرة، قفل موقف للصيانة، تجميد مستخدم) يسجل فورياً في جدول <code>admin_audit_log</code> مع بصمة المستخدم الإداري والوقت والبيانات السابقة والجديدة بدون أي صلاحية لحذف السجل.
    </p>
  </div>

  <div class="footer">
    <span>© 2026 جامعة فهد بن سلطان (FBSU) — منظومة الحرم الجامعي الذكي CampusFlow</span>
    <span>جميع الحقوق محفوظة — وثيقة معتمدة لإدارة المنتج والهندسة البرمجية</span>
  </div>

</body>
</html>`;

writeFileSync(htmlPath, htmlContent, 'utf8');

if (edge) {
  try {
    execFileSync(edge, [
      '--headless=new',
      '--disable-gpu',
      '--no-pdf-header-footer',
      `--print-to-pdf=${pdfPath}`,
      pathToFileURL(htmlPath).href
    ], { stdio: 'ignore' });
    console.log(`OK: Master PDF generated at: ${pdfPath}`);
  } catch (err) {
    console.error('Error generating PDF:', err);
  }
} else {
  console.error('No Edge or Chrome browser found to render PDF.');
}

