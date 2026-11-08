# كتالوج الميزات الشامل (Feature Catalog) — CampusFlow
**دليل جميع ميزات النظام المستخرجة من الكود الفعلي وقواعد البيانات والواجهات**

---

## فهرس الميزات المكتشفة (16 ميزة رئيسية)
1. **F-01:** البنية التحتية للحرم الجامعي والجامعات المتعددة (Campus Multi-Tenant Core)
2. **F-02:** الهوية الرقمية، المصادقة والتحكم بالصلاحيات (Identity, Auth & RBAC)
3. **F-03:** سجل المركبات ونظام اللوحات السعودية (Vehicle Registry & Saudi Plates)
4. **F-04:** المحفظة الجامعية ودفتر الأستاذ المالي (Digital Wallet & Double-Entry Ledger)
5. **F-05:** الرسوم الدراسية والفواتير الضريبية المعتمدة (Tuition & Official Tax Receipts)
6. **F-06:** خريطة المواقف وحساسات الـ IoT اللحظية (Smart Parking & IoT Occupancy Map)
7. **F-07:** حجز مواقف السيارات والتصريح الرقمي (Parking Reservation & Digital QR Pass)
8. **F-08:** نظام تبادل المواقف الذكي (AI Flex-Share P2P Exchange)
9. **F-09:** قراءة اللوحات آلياً وبوابة الدخول الذكية (ALPR Gate Barrier System)
10. **F-10:** شبكة دروس التقوية الطلابية (Peer-to-Peer Academic Tutoring)
11. **F-11:** الساعات المكتبية والإرشاد الأكاديمي (Faculty Office Hours & Advising)
12. **F-12:** حجز غرف الدراسة والبودات التفاعلية (Smart Study Rooms & Pods)
13. **F-13:** التنبيهات الجامعية متعددة القنوات (Unified Campus Notifications)
14. **F-14:** الإدارة والعمليات المركزية وسجل التدقيق (Campus Admin Operations & Audit)
15. **F-15:** التحليلات والذكاء التشغيلي (Campus Analytics & Intelligence)
16. **F-16:** أمان المؤسسات، فحص E2E، وجاهزية الإنتاج (Enterprise Hardening & Ops)

---

### F-01: البنية التحتية للحرم الجامعي (Campus Multi-Tenant Core)
- **Feature ID:** `F-01`
- **Feature Name:** Campus Multi-Tenant Core Infrastructure
- **Business Description:** الأساس الهيكلي للنظام الذي يدعم وجود كليات، مبانٍ، فصول دراسية، وجامعات متعددة بناءً على كود الجامعة (`FBSU`).
- **المشكلة التي تحلها:** منع تداخل بيانات الجامعات المختلفة وربط كل الموارد (مواقف، غرف، مستخدمين) بالمباني والكليات الحقيقية.
- **المستخدم المستفيد:** النظام بأكمله، مسؤولو الجامعات والمبرمجون.
- **User Value:** قابلية التوسع لخدمة أكثر من جامعة في المستقبل دون إعادة كتابة النظام.
- **User Stories:**
  - كمسؤول نظام، أريد تسجيل كليات ومباني وفصول الجامعة حتى ترتبط بها الغرف والمواقف بدقة.
- **Current Implementation Status:** `VERIFIED` (خلفية وقاعدة بيانات متكاملة).
- **Frontend Status:** مدمج ضمنياً في نماذج التسجيل وشاشات التصفية حسب القطاعات والمباني.
- **Backend Status:** جداول ومستودعات `CampusRepository` وكائنات الدومين `University`, `College`, `Building`, `AcademicTerm`.
- **Database Status:** مدعوم بالهجرة `V2__campus.sql`.
- **API Integration Status:** جاهز ومفحوص ضمنياً في عمليات المصادقة وإرجاع بيانات الحرم.
- **Testing Status:** 5 اختبارات في `CampusRepositoryIntegrationTest.java`.
- **Security Status:** عزل البيانات باستخدام `university_code = 'FBSU'`.
- **Dependencies:** لا يعتمد على ميزات سابقة (Foundation Layer).
- **Missing Capabilities:** لوحة تحكم للـ Super Admin لإنشاء جامعة جديدة عبر الـ UI ديناميكياً.
- **Known Bugs:** لا توجد.
- **Priority:** `P0` (Critical Foundation).
- **Complexity:** منخفضة - تم استقراره بالكامل.
- **Suggested Implementation Order:** مكتمل في Phase 2.

---

### F-02: الهوية الرقمية والمصادقة (Identity, Auth & RBAC)
- **Feature ID:** `F-02`
- **Feature Name:** Identity, Authentication & Role-Based Access Control
- **Business Description:** دورة حياة أمان المستخدم الكاملة تشمل التسجيل برقم الهوية/الإقامة، تسجيل الدخول بـ JWT، تجديد التوكن، فحص الجلسة، إدارة الملف الشخصي، وتغيير كلمة المرور.
- **المشكلة التي تحلها:** حماية بيانات الجامعة والتأكد من هوية الطالب وعضو هيئة التدريس والإداري وفق نظام صارم.
- **المستخدم المستفيد:** جميع مستخدمي النظام (طالب، دكتور، إداري، زائر).
- **User Value:** دخول آمن وسريع، وتجربة سلسة لحفظ الهوية دون إعادة إدخال البيانات يومياً.
- **User Stories:**
  - كطالب أو دكتور، أريد إنشاء حساب وتسجيل الدخول بإيميلي الجامعي حتى أتمكن من الوصول لخدماتي الخاصة.
  - كمستخدم، أريد تعديل بياناتي الشخصية وتغيير كلمة المرور لحماية حسابي.
- **Current Implementation Status:** `VERIFIED`.
- **Frontend Status:** `INTEGRATED` عبر `AuthModal.tsx` (تبويبات تسجيل الدخول والتسجيل)، `ProfileModal.tsx`، وسياق `AuthContext.tsx`.
- **Backend Status:** `AuthController.java` (6 مسارات) و `MeController.java` (3 مسارات)، `JwtService`، و `SecurityConfig`.
- **Database Status:** الهجرة `V3__identity.sql` (جداول `app_user`, `user_role`, `refresh_token`).
- **API Integration Status:** متكامل بالكامل مع Interceptors لتجديد التوكن التلقائي عند انتهاء صلاحيته (401 Refresh Flow).
- **Testing Status:** اختبارات وحدة وتكامل متكاملة: `AuthControllerIntegrationTest` (2)، `AuthServiceTest` (4)، `ProfileServiceTest` (5)، `PasswordServiceTest` (4)، `JwtServiceTest` (2)، `AuthModal.test.tsx` (5)، `ProfileModal.test.tsx` (2).
- **Security Status:** تشفير كلمات المرور باستخدام BCrypt، توكنات JWT مع Refresh Tokens في قاعدة البيانات، وحماية CSRF/CORS.
- **Dependencies:** يعتمد على `F-01`.
- **Missing Capabilities:** استعادة كلمة المرور عبر الإيميل الحقيقي (Password Reset via Email OTP).
- **Known Bugs:** لا توجد أخطاء حالية.
- **Priority:** `P0` (Critical Foundation).
- **Complexity:** متوسطة.
- **Suggested Implementation Order:** مكتمل في Phase 2 و Phase 3.

---

### F-03: سجل المركبات واللوحات السعودية (Vehicle Registry & Saudi Plates)
- **Feature ID:** `F-03`
- **Feature Name:** Vehicle Registry & Saudi License Plate System
- **Business Description:** تسجيل سيارات الطلاب والموظفين، التحقق الصارم من مواصفات اللوحات السعودية (حروف عربية وإنجليزية مطابقة مع 1 إلى 4 أرقام)، وتعيين سيارة رئيسية.
- **المشكلة التي تحلها:** منع دخول سيارات غير مصرح لها ومطابقة السيارة المسجلة مع كاميرات البوابة الذكية (ALPR).
- **المستخدم المستفيد:** الطلاب، الدكاترة، ومسؤولو الأمن والسلامة.
- **User Value:** ربط حجز الموقف برقم اللوحة الفعلي لمنع سرقة المواقف والدخول التلقائي عند البوابة.
- **User Stories:**
  - كطالب، أريد إضافة سيارتي برقم لوحتها الرسمي واختيارها كسيارة أساسية لاستخدامها في حجز المواقف.
- **Current Implementation Status:** `VERIFIED`.
- **Frontend Status:** `INTEGRATED` عبر `ProfileModal.tsx` ومكون `SaudiPlate.tsx` المعتمد.
- **Backend Status:** `VehicleController.java` (6 مسارات CRUD كاملة)، كائن `SaudiPlate.java` للتحقق الصارم.
- **Database Status:** جدول `vehicle` في الهجرة `V3__identity.sql`.
- **API Integration Status:** مربوط بالـ Frontend عبر `profileApi.ts` ومفحوص حياً.
- **Testing Status:** 7 اختبارات في `VehicleServiceTest.java`، 4 في `SaudiPlateTest.java`، واختبارين لمكون `SaudiPlate.test.tsx`.
- **Security Status:** منع أي مستخدم من تعديل أو حذف مركبة مستخدم آخر (مفحوص ومضمون).
- **Dependencies:** يعتمد على `F-02`.
- **Missing Capabilities:** ربط استعلام أوتوماتيكي مع نظام "أبشر" أو إدارة المرور (محاكاة داخلية حالياً).
- **Known Bugs:** لا توجد.
- **Priority:** `P1` (High Priority).
- **Complexity:** متوسطة.
- **Suggested Implementation Order:** مكتمل في Phase 2.

---

### F-04: المحفظة الجامعية ودفتر الأستاذ (Digital Wallet & Double-Entry Ledger)
- **Feature ID:** `F-04`
- **Feature Name:** Digital Campus Wallet & Double-Entry Ledger
- **Business Description:** محفظة مالية رقمية لكل مستخدم جامعي ترتكز على نظام قيد محاسبي مزدوج حقيقي (Ledger) يمنع التلاعب المالي ويضمن توازن الأرصدة في كل حركة.
- **المشكلة التي تحلها:** القضاء على التعاملات النقدية داخل الحرم الجامعي وتوفير وسيلة دفع موحدة لكل الخدمات (مواقف، رسوم، تقوية).
- **المستخدم المستفيد:** الطلاب، أعضاء هيئة التدريس، والإدارة المالية.
- **User Value:** شحن فوري، تحويل أموال بين الطلاب، وسجل كشف حساب دقيق وشفاف لا يمكن حذفه.
- **User Stories:**
  - كطالب، أريد شحن محفظتي برصيد تجريبي أو بنكي، والاطلاع على تفاصيل كل العمليات السابقة.
  - كمستخدم، أريد تحويل رصيد لزميل لي لمشاركته تكلفة مشروع أو رسوم دراسية.
- **Current Implementation Status:** `VERIFIED`.
- **Frontend Status:** `INTEGRATED` عبر شاشة `WalletPage.tsx` ومكونات `BalanceCard`, `LedgerTable`, `TopUpModal`, `TransferModal`.
- **Backend Status:** `WalletController.java` (4 مسارات)، `WalletService.java` مع استخدام الحبس التشاؤمي (`Pessimistic Locking`) لمنع Race Conditions.
- **Database Status:** الهجرة `V4__wallet.sql` (جدولي `wallet` و `ledger_entry`).
- **API Integration Status:** متكامل مع معالجة الأخطاء والـ Pagination لكشف الحساب.
- **Testing Status:** 5 في `WalletServiceTest.java`، 6 في `WalletTest.java`، و 9 اختبارات في مكونات الواجهة.
- **Security Status:** حماية كاملة ضد تكرار المعاملات، ومنع السحب على المكشوف (Overdraft Protection).
- **Dependencies:** يعتمد على `F-02`.
- **Missing Capabilities:** ربط بوابة دفع سعودية حقيقية (مثل Mada / Apple Pay عبر Moyasar أو Geidea) - يعمل حالياً بمحاكي دفع معتمد.
- **Known Bugs:** لا توجد.
- **Priority:** `P0` (Critical Foundation).
- **Complexity:** عالية - تم اختبار التزامن والمحاسبة بنجاح.
- **Suggested Implementation Order:** مكتمل في Phase 4.

---

### F-05: الرسوم الدراسية والفواتير الضريبية (Tuition Invoicing & Tax Receipts)
- **Feature ID:** `F-05`
- **Feature Name:** University Tuition Invoicing & Official Tax Receipts
- **Business Description:** نظام فوترة أكاديمية يصدر فواتير الساعات الدراسية المعتمدة مع احتساب ضريبة القيمة المضافة (15% VAT)، سداد جزئي أو كلي من المحفظة، وإصدار إيصال سداد رسمي مشفر بـ Hash وكود QR متوافق مع هيئة الزكاة والضريبة.
- **المشكلة التي تحلها:** إنهاء طوابير سداد الرسوم بالخزينة وإصدار إيصالات فورية موثقة للطالب والجهات الراعية.
- **المستخدم المستفيد:** الطلاب وأولياء الأمور والإدارة المالية بالجامعة.
- **User Value:** سداد رسوم الترم في أي وقت بضغطة زر مع تحميل وطباعة الفاتورة الضريبية فوراً.
- **User Stories:**
  - كطالب، أريد استعراض فواتيري الدراسية وسداد الرسوم من رصيد محفظتي والحصول على إيصال رسمي فوري معتمد.
- **Current Implementation Status:** `VERIFIED`.
- **Frontend Status:** `INTEGRATED` عبر `TuitionPage.tsx`، `TuitionInvoiceCard`، `PayTuitionModal`، و `TuitionReceiptModal`.
- **Backend Status:** `TuitionController.java` (5 مسارات)، `TuitionService.java`.
- **Database Status:** الهجرة `V5__tuition.sql` (جدولي `tuition_invoice` و `tuition_receipt`).
- **API Integration Status:** ربط كامل بين سداد الفاتورة وخصم المحفظة عبر `WalletService`.
- **Testing Status:** 5 في `TuitionServiceTest.java` و 6 في اختبارات واجهة الرسوم.
- **Security Status:** التحقق من ملكية الفاتورة، ومنع السداد المزدوج للفاتورة المسددة، وتوليد Hash إثبات السداد غير القابل للتزوير.
- **Dependencies:** يعتمد على `F-04` و `F-02`.
- **Missing Capabilities:** تصدير ملف PDF مباشر للتحميل على الجهاز (يعرض حالياً عبر Modal طباعة رسمي).
- **Known Bugs:** لا توجد.
- **Priority:** `P1` (High Priority).
- **Complexity:** متوسطة.
- **Suggested Implementation Order:** مكتمل في Phase 4.

---

### F-06: خريطة المواقف وحساسات الـ IoT (Smart Parking & IoT Map)
- **Feature ID:** `F-06`
- **Feature Name:** Smart Parking Bays & Real-Time IoT Occupancy Map
- **Business Description:** لوحة عرض حية لـ 30 موقفاً موزعة على 4 قطاعات (الهندسة والحاسب، الأعمال والطب، كادر التدريس، شحن كهربائي وذوي الهمم)، مع مصابيح حساسات سقفية (Ultrasonic LEDs) تعكس الحالة لحظياً، ورسم واقعي ثلاثي الأبعاد للسيارات الواقفة (Photorealistic Top-Down SVG) بألوان وموديلات متطابقة مع أصحابها.
- **المشكلة التي تحلها:** هدر وقت السائقين في البحث العشوائي عن مواقف فارغة داخل الحرم الجامعي.
- **المستخدم المستفيد:** كل قائد مركبة في الحرم الجامعي، ومسؤولو الأمن والحركة.
- **User Value:** رؤية الموقف الشاغر في ثوانٍ وتحديد القطاع الأنسب لمبنى الكلية قبل الدخول.
- **User Stories:**
  - كسائق، أريد رؤية خريطة مواقف حية توضح المواقف الشاغرة والمشغولة بنظرة واحدة مع تفاصيل السيارات الواقفة.
- **Current Implementation Status:** `VERIFIED`.
- **Frontend Status:** `INTEGRATED` عبر `ParkingLotView.tsx`، `SpotCard.tsx`، ومحرك الرسوم الواقعية `CarSvg.tsx` ومصنف الثيمات `carTheme.ts`.
- **Backend Status:** `ParkingController.java` (مسارات `/zones`, `/spots`, `/spots/{bay}`, `/summary`, `/tariffs`).
- **Database Status:** الهجرة `V6__parking.sql` (جداول `parking_zone`, `parking_spot`, `parking_tariff`, `spot_assignment`).
- **API Integration Status:** جلب بيانات المواقف لحظياً وتحديث الـ Polling التلقائي في الصفحة.
- **Testing Status:** 5 في `ParkingControllerIntegrationTest.java` و 4 في `ParkingLotView.test.tsx`.
- **Security Status:** قراءة البيانات عامة للمصرح لهم، وحماية سرية بيانات أرقام الهويات.
- **Dependencies:** يعتمد على `F-01`.
- **Missing Capabilities:** البث عبر WebSocket/SSE بدلاً من REST Polling لتقليل استهلاك السيرفر.
- **Known Bugs:** تم إصلاح مشكلة عدم ظهور صور السيارات الواقعية في PR #41.
- **Priority:** `P0` (Core Differentiator).
- **Complexity:** متوسطة.
- **Suggested Implementation Order:** مكتمل ومحدث في Phase 5 وتحديث PR #41.

---

### F-07: حجز مواقف السيارات والتصريح الرقمي (Parking Reservation & Digital Pass)
- **Feature ID:** `F-07`
- **Feature Name:** Parking Spot Reservation & Digital QR Pass
- **Business Description:** معالج حجز مواقف تفاعلي (Wizard) يتيح اختيار الموقف، والوقت، ونوع الحجز (ساعي، يومي، فصلي)، مع احتساب التسعيرة وخصمها من المحفظة، وتوليد تصريح دخول رقمي يحمل كود QR مشفر للعبور من البوابات.
- **المشكلة التي تحلها:** ضمان وجود موقف محجوز باسم الطالب قبل مغادرة منزله في أوقات الذروة والاختبارات.
- **المستخدم المستفيد:** الطلاب والزوار وأعضاء هيئة التدريس.
- **User Value:** حجز مضمون وتصريح دخول فوري على الهاتف الذكي.
- **User Stories:**
  - كطالب، أريد حجز موقف محدد لعدة ساعات وسداد قيمته من محفظتي واستلام تصريح QR لدخول الجامعة.
  - كمستخدم، أريد إلغاء حجزي إذا تغيرت خطتي واستعادة المبلغ وفق سياسة الإلغاء.
- **Current Implementation Status:** `VERIFIED`.
- **Frontend Status:** `INTEGRATED` عبر `BookingWizardView.tsx` ومكونات التصريح الرقمي `QR.tsx`.
- **Backend Status:** `BookingController.java` (4 مسارات للحجز، عرض الحجوزات، كود التصريح، والإلغاء)، مع منع الحجز المزدوج لنفس الموقف والفترة.
- **Database Status:** الهجرة `V7__booking.sql` (جدول `parking_booking`).
- **API Integration Status:** متكامل مع خصم المحفظة في معاملة موحدة (Atomic Transaction).
- **Testing Status:** 2 في `BookingControllerIntegrationTest.java` و 2 في `BookingWizardView.test.tsx`.
- **Security Status:** التحقق من صلاحية التصريح الرقمي وتطابق رقم السيارة مع المستخدم.
- **Dependencies:** يعتمد على `F-06` و `F-04` و `F-03`.
- **Missing Capabilities:** استرجاع تلقائي لقيمة الحجز في المحفظة عند الإلغاء قبل بدء الموعد (Partial Refund Policy).
- **Known Bugs:** لا توجد.
- **Priority:** `P1` (High Priority).
- **Complexity:** عالية.
- **Suggested Implementation Order:** مكتمل في Phase 5.

---

### F-08: تبادل المواقف الذكي (AI Flex-Share P2P Exchange)
- **Feature ID:** `F-08`
- **Feature Name:** AI Flex-Share P2P Parking Exchange
- **Business Description:** ميزة فريدة تتيح لأصحاب المواقف المحجوزة مسبقاً (دكاترة أو طلاب) عرض مواقفهم للاستخدام المشترك أثناء فترات خروجهم أو فراغ جداولهم، مقابل حصولهم على مكافأة مالية تضاف لمحفظتهم عند مطالبة طالب آخر بالموقف.
- **المشكلة التي تحلها:** ظاهرة المواقف الشاغرة المحجوزة التي لا يستفيد منها أحد بينما الحرم الجامعي مزدحم.
- **المستخدم المستفيد:** أعضاء هيئة التدريس والطلاب أصحاب المواقف والباحثون عن مواقف اقتصادية.
- **User Value:** استثمار الموقف الخالي وكسب أموال إضافية، وتوفير مواقف رخيصة للطلاب الآخرين في أوقات الذروة.
- **User Stories:**
  - كدكتور، أريد إتاحة موقفي للطلاب من الساعة 12 إلى 2 ظهراً وكسب رصيد في محفظتي.
  - كطالب، أريد الاستفادة من موقف Flex-Share بتكلفة مخفضة.
- **Current Implementation Status:** `VERIFIED`.
- **Frontend Status:** `INTEGRATED` عبر `ShareSpotView.tsx` (حاسبة العائد الفوري وعرض ومطالبة العروض المتاحة).
- **Backend Status:** `FlexShareController.java` (5 مسارات للعروض، المطالبة، الإلغاء، واستعراض العروض الشخصية).
- **Database Status:** الهجرة `V8__flex_share.sql` (جدول `flex_offer`).
- **API Integration Status:** مربوط بالكامل بنظام الأحداث وإيداع المكافآت المالية في المحفظة.
- **Testing Status:** اختبار تكامل `FlexShareControllerIntegrationTest.java` و 4 اختبارات في `ShareSpotView.test.tsx`.
- **Security Status:** التأكد من أن صاحب الموقف هو الوحيد القادر على طرحه، ومنع المطالبة بالعرض بعد انتهائه.
- **Dependencies:** يعتمد على `F-07` و `F-04`.
- **Missing Capabilities:** خوارزمية ذكاء اصطناعي تتنبأ بأوقات فراغ الدكتور بناءً على جدول المحاضرات الأكاديمي أوتوماتيكياً (حالياً يحدد الدكتور الساعات يدوياً).
- **Known Bugs:** لا توجد.
- **Priority:** `P1` (Key Innovation).
- **Complexity:** متوسطة - عالية.
- **Suggested Implementation Order:** مكتمل في Phase 5.

---

### F-09: قراءة اللوحات آلياً وبوابة الدخول الذكية (ALPR Gate Barrier System)
- **Feature ID:** `F-09`
- **Feature Name:** Automated License Plate Recognition (ALPR) & Smart Gate Barrier
- **Business Description:** نظام محاكاة ومعالجة لبوابات الحرم الجامعي يقرأ لوحة السيارة بالكاميرات، ويتحقق فوراً من وجود تصريح نشط أو حجز موقف أو تصريح دكتور، ويصدر قرار فتح البوابة (`OPEN` أو `DENIED`) ويسجل العملية في سجلات الأمن.
- **المشكلة التي تحلها:** طوابير السيارات الطويلة أمام بوابات الجامعة والاعتماد على الفحص اليدوي من حراس الأمن.
- **المستخدم المستفيد:** سائقو المركبات، حراس الأمن، وإدارة العمليات والسلامة.
- **User Value:** عبور الحرم الجامعي خلال 3 ثوانٍ دون التوقف أو إنزال زجاج السيارة.
- **User Stories:**
  - كسائق، أريد فتح البوابة تلقائياً بمجرد وصول سيارتي إذا كان لدي حجز أو تصريح سارٍ.
  - كرجل أمن، أريد رؤية سجل دخول السيارات اللحظي وأسباب رفض أي مركبة غير مصرحة.
- **Current Implementation Status:** `VERIFIED`.
- **Frontend Status:** `INTEGRATED` عبر شاشة `AlprGateView.tsx` ومحاكي الحساسات `SimulatorView.tsx`.
- **Backend Status:** `GateController.java` (مسار `/parking/gate/scan`) مع خدمة اتخاذ القرار وتوثيق الحدث.
- **Database Status:** الهجرة `V9__gate_logs.sql` (جدول `gate_event_log`).
- **API Integration Status:** متكامل مع الـ Backend لاستقبال رقم اللوحة والقطاع وإرجاع القرار الفوري.
- **Testing Status:** 3 اختبارات في `GateControllerIntegrationTest.java` و 3 في `AlprGateView.test.tsx`.
- **Security Status:** تدقيق اللوحة وتسجيل بصمة الوقت لمنع استخدام تصريح واحد لعدة سيارات في نفس الوقت (Anti-Passback).
- **Dependencies:** يعتمد على `F-07` و `F-03`.
- **Missing Capabilities:** ربط فيزيائي بكاميرات IP حقيقية عبر بروتوكول ONVIF/RTSP (يعمل حالياً بمحاكي تفاعلي فائق الدقة).
- **Known Bugs:** لا توجد.
- **Priority:** `P1` (Core Differentiator).
- **Complexity:** متوسطة.
- **Suggested Implementation Order:** مكتمل في Phase 5.

---

### F-10: شبكة دروس التقوية الطلابية (Peer-to-Peer Academic Tutoring)
- **Feature ID:** `F-10`
- **Feature Name:** Peer-to-Peer Academic Tutoring Network
- **Business Description:** منصة أكاديمية تشاركية تتيح للطلاب المتميزين والمعيدين طرح حصص تقوية في المواد الهندسية والطبية والحاسوبية، مع تحديد المقاعد والأجر بالساعة، ويتيح للطلاب حجز المقاعد مع حجز المقابل المالي وتحويله للمدرب فور إتمام الجلسة.
- **المشكلة التي تحلها:** صعوبة إيجاد مساعدة دراسية موثوقة داخل الجامعة، وغياب إطار مالي رسمي يضمن حقوق المعلم والطالب.
- **المستخدم المستفيد:** الطلاب المتعثرون دراسياً والطلاب المتميزون الراغبون في تحقيق دخل إضافي.
- **User Value:** رفع المعدل التراكمي وتوفير بيئة تعليمية تعاونية معتمدة داخل الجامعة.
- **User Stories:**
  - كطالب متميز، أريد طرح جلسة مراجعة لمادة خوارزميات وتحديد عدد المقاعد والأجر بالساعة.
  - كطالب، أريد تصفح جلسات التقوية المتاحة وحجز مقعد والدفع من محفظتي.
- **Current Implementation Status:** `VERIFIED`.
- **Frontend Status:** `INTEGRATED` عبر شاشة `TutoringView.tsx` ومودال حجز الجلسات.
- **Backend Status:** `TutoringController.java` (5 مسارات)، مع خصم المحفظة عبر `WalletService`.
- **Database Status:** الهجرة `V10__tutoring.sql` (جدولي `tutoring_session` و `tutoring_enrollment`).
- **API Integration Status:** متكامل مع تحديث المقاعد المتاحة فورياً وإصدار إشعارات فور الحجز.
- **Testing Status:** 3 في `TutoringControllerIntegrationTest.java` و 2 في `TutoringBookingIntegrationTest.java` و 3 في الواجهة.
- **Security Status:** منع التسجيل إذا كانت المقاعد ممتلئة، ومنع الطالب من حجز نفس الجلسة مرتين.
- **Dependencies:** يعتمد على `F-04` و `F-02`.
- **Missing Capabilities:** نظام تقييم المعلم (Ratings & Reviews 1-5 Stars).
- **Known Bugs:** لا توجد.
- **Priority:** `P2` (High Value Academic Feature).
- **Complexity:** متوسطة.
- **Suggested Implementation Order:** مكتمل في Phase 6.

---

### F-11: الساعات المكتبية والإرشاد الأكاديمي (Faculty Office Hours & Advising)
- **Feature ID:** `F-11`
- **Feature Name:** Faculty Office Hours & Academic Advising
- **Business Description:** نظام إدارة مواعيد أعضاء هيئة التدريس يتيح للدكتور نشر فترات ساعات مكتبية أسبوعية، ويتيح للطالب حجز موعد استشارة أكاديمية لمدة محددة مع ذكر سبب المقابلة، مع ميزة إلغاء الموعد للطرفين.
- **المشكلة التي تحلها:** إهدار وقت الطلاب أمام مكاتب الدكاترة دون جدوى، والازدحام العشوائي في أوقات الاختبارات.
- **المستخدم المستفيد:** الطلاب، المرشدون الأكاديميون، وأعضاء هيئة التدريس.
- **User Value:** تنظيم كامل للمواعيد الأكاديمية وضمان خصوصية ووقت كل طالب.
- **User Stories:**
  - كدكتور، أريد تحديد مواعيدي المكتبية الأسبوعية وغرفتي المعتمدة ليتمكن الطلاب من الحجز المنظم.
  - كطالب، أريد حجز موعد مع أستاذ المادة لمناقشة مشروعي الأكاديمي.
- **Current Implementation Status:** `VERIFIED`.
- **Frontend Status:** `INTEGRATED` عبر `OfficeHoursView.tsx` ومودال الحجز.
- **Backend Status:** `OfficeHoursController.java` (6 مسارات).
- **Database Status:** الهجرة `V11__office_hours.sql` (جداول `faculty_office_profile`, `office_hour_slot`, `office_hour_appointment`).
- **API Integration Status:** مربوط بالـ Frontend ويدعم استرجاع المواعيد الشخصية للطالب وإلغائها.
- **Testing Status:** 3 اختبارات في `OfficeHoursIntegrationTest.java` و 3 في `OfficeHoursView.test.tsx`.
- **Security Status:** حماية المواعيد ومنع حجز موعد محجوز بالفعل (Slot Conflict Prevention).
- **Dependencies:** يعتمد على `F-02` و `F-01`.
- **Missing Capabilities:** مزامنة مع تقويم Google Calendar أو Microsoft Outlook الخاص بعضو هيئة التدريس.
- **Known Bugs:** لا توجد.
- **Priority:** `P2` (Academic Core).
- **Complexity:** متوسطة.
- **Suggested Implementation Order:** مكتمل في Phase 6.

---

### F-12: غرف الدراسة والبودات التفاعلية (Smart Study Rooms & Pods)
- **Feature ID:** `F-12`
- **Feature Name:** Smart Study Rooms & Collaborative Pods
- **Business Description:** نظام حجز غرف المذاكرة والمناقشة الجماعية داخل المكتبة ومباني الكليات، يوضح التجهيزات (شاشات ذكية، سبورات، مكيفات) والسعة، مع عداد تنازلي حي لفترة الحجز، وإمكانية تمديد الحجز 15 دقيقة إضافية أو إخلاء الغرفة مبكراً لزملائه.
- **المشكلة التي تحلها:** الصراعات والنزاعات على غرف المكتبة وغياب الشفافية في معرفة الغرف المشغولة.
- **المستخدم المستفيد:** المجموعات الطلابية والفرق البحثية.
- **User Value:** بيئة دراسية هادئة مضمونة ومجهزة للعمل الجماعي.
- **User Stories:**
  - كفريق طلابي، نريد حجز غرفة دراسة في المكتبة لمدة ساعة وتمديدها إذا احتجنا وقتاً إضافياً.
  - كمستخدم، أريد تحرير الغرفة فور انتهائي لإتاحتها لغيري.
- **Current Implementation Status:** `VERIFIED`.
- **Frontend Status:** `INTEGRATED` عبر `StudyRoomsView.tsx` مع عداد حي متناقص وأزرار الحجز والتمديد والإخلاء.
- **Backend Status:** `RoomsController.java` (5 مسارات)، مع قواعد منع التمديد إذا كانت الغرفة محجوزة لاحقاً.
- **Database Status:** الهجرة `V12__rooms.sql` (جدولي `study_room` و `room_booking`).
- **API Integration Status:** متكامل بالكامل عبر `roomsApi.ts`.
- **Testing Status:** 3 اختبارات في `RoomsControllerIntegrationTest.java` و 5 في `StudyRoomsView.test.tsx`.
- **Security Status:** إلزام وجود مستخدم مسجل لإتمام الحجز وضمان عدم تجاوز الحد الأقصى للسعة.
- **Dependencies:** يعتمد على `F-02` و `F-01`.
- **Missing Capabilities:** فتح باب الغرفة الذكي بواسطة كود QR أو NFC.
- **Known Bugs:** لا توجد.
- **Priority:** `P2` (Student Quality of Life).
- **Complexity:** متوسطة.
- **Suggested Implementation Order:** مكتمل في Phase 6.

---

### F-13: التنبيهات الجامعية الموحدة (Unified Campus Notifications)
- **Feature ID:** `F-13`
- **Feature Name:** Unified Multi-Channel Campus Notifications
- **Business Description:** مركز إشعارات لحظي مدمج في الترويسة العلوية يظهر عدد التنبيهات غير المقروءة، وقائمة قابلة للفلترة والتحديد كمقروء، متصل بمحرك أحداث (Domain Event Listener) يطلق تنبيهات تلقائية عند: تأكيد حجز موقف، خصم أو إيداع بالمحفظة، سداد فاتورة دراسية، حجز غرفة دراسة، حجز جلسة تقوية، أو حجز موعد مكتب مع دكتور.
- **المشكلة التي تحلها:** غياب الإحاطة بالمعاملات الفورية واضطرار المستخدم لتحديث الصفحات يدوياً لمعرفة حالة طلباته.
- **المستخدم المستفيد:** جميع مستخدمي النظام.
- **User Value:** إشعار فوري وتوجيه بنقرة واحدة (Deep Navigation) للشاشة المعنية بالحدث.
- **User Stories:**
  - كمستخدم، أريد رؤية جرس التنبيهات وعدد الإشعارات الجديدة وتصفحها وفتح المعاملة المعنية فوراً.
- **Current Implementation Status:** `VERIFIED`.
- **Frontend Status:** `INTEGRATED` عبر أيقونة الجرس في `Header.tsx` ومودال `NotificationsModal.tsx`.
- **Backend Status:** `NotificationController.java` (4 مسارات) و `NotificationEventListener.java` المرتبط بأحداث الدومين.
- **Database Status:** الهجرة `V13__notifications.sql` (جدول `campus_notification`).
- **API Integration Status:** متكامل بالكامل مع خيارات `markAsRead` و `markAllAsRead`.
- **Testing Status:** 5 في `NotificationControllerIntegrationTest.java`، 6 في `NotificationEventsIntegrationTest.java`، و 14 في اختبارات الواجهة.
- **Security Status:** خصوصية صارمة - لا يمكن للمستخدم رؤية إشعارات مستخدم آخر.
- **Dependencies:** يعتمد على `F-02` وجميع الميزات السابقة التي تطلق أحداثاً.
- **Missing Capabilities:** إرسال إشعارات خارجية عبر SMS أو Web Push Notifications.
- **Known Bugs:** لا توجد.
- **Priority:** `P1` (Core Engagement).
- **Complexity:** متوسطة.
- **Suggested Implementation Order:** مكتمل في Phase 7 (P7-01, P7-02, P7-03).

---

### F-14: الإدارة والعمليات المركزية وسجل التدقيق (Campus Admin Operations & Audit)
- **Feature ID:** `F-14`
- **Feature Name:** Campus Administrative Operations & Governance
- **Business Description:** منصة حوكمة وإشراف مركزية لمسؤولي الجامعة (CAMPUS_ADMIN) تتيح التحكم في حالات المواقف وأنواعها، وتعديل تسعيرات المواقف حسب نوع المستخدم، وإدارة غرف الدراسة وإدخالها في الصيانة، وإدارة حسابات المستخدمين وأدوارهم وتجميدها، مع تسجيل كل حركة إدارية في سجل تدقيق غير قابل للتعديل (Audit Log).
- **المشكلة التي تحلها:** فقدان السيطرة المركزية على الحرم وغياب المساءلة والشفافية في القرارات الإدارية والتسعيرية.
- **المستخدم المستفيد:** عمداء الكليات، مسؤولو التقنية، ورئيس أمن وحركة الحرم الجامعي.
- **User Value:** تحكم كامل وفوري في تشغيل الحرم الجامعي وسجل جنائي/أمني موثق لكل تغيير.
- **User Stories:**
  - كمسؤول نظام، أريد تعديل تسعيرة مواقف الطلاب أو تحويل موقف إلى صيانة ومراجعة من قام بأي تعديل سابق.
  - كمسؤول، أريد تجميد حساب مخالف وتعديل صلاحياته مع حفظ سبب الإجراء في السجل.
- **Current Implementation Status:** `BACKEND_ONLY` (الخلفية مكتملة 100% في PR #40؛ الواجهة ما زالت مجرد شاشة فارغة / Placeholder).
- **Frontend Status:** `MISSING / UI_PLACEHOLDER` (يوجد كارت فارغ محمي بـ `ProtectedRoute` في `App.tsx` فقط - متبقي في مهمة P7-05).
- **Backend Status:** `ParkingAdminController`, `RoomsAdminController`, `UserAdminController`, `AdminAuditController` (11 مساراً محمية بـ `@PreAuthorize("hasRole('CAMPUS_ADMIN')")`).
- **Database Status:** الهجرة `V14__admin_audit_log.sql` (جدول `admin_audit_log` مع فهارس أداء وتوسيع قيد حالة المواقف لـ `MAINTENANCE`).
- **API Integration Status:** جاهز للاستهلاك من الـ Frontend.
- **Testing Status:** 6 اختبارات تكاملية شاملة في `AdminApiIntegrationTest.java` تفحص كل الصلاحيات وسجلات التدقيق بنجاح.
- **Security Status:** حماية مزدوجة عبر مسار الربط وحقن الصلاحية، وسجل تدقيق غير قابل للحذف (Immutable Append-Only).
- **Dependencies:** يعتمد على `F-02`, `F-06`, `F-12`.
- **Missing Capabilities:** بناء واجهات لوحة التحكم الإدارية (Admin Dashboard UI) بتبويبات المواقف، الغرف، التسعيرات، المستخدمين، وسجل التدقيق (وهي المهمة الحالية القادمة P7-05).
- **Known Bugs:** لا توجد أخطاء في الـ Backend.
- **Priority:** `P1` (Core Governance).
- **Complexity:** متوسطة - عالية (الـ Backend انتهى، متبقي واجهات العرض والتفاعل).
- **Suggested Implementation Order:** Backend مكتمل (P7-04) - Frontend في مهمة P7-05 الحالية.

---

### F-15: التحليلات والذكاء التشغيلي (Campus Analytics & Intelligence)
- **Feature ID:** `F-15`
- **Feature Name:** Campus Analytics & Predictive Intelligence
- **Business Description:** لوحة مؤشرات أداء وتشغيل ذكية تبرز معدلات إشغال المواقف على مدار اليوم، وتوزيع الإيرادات المالية بين الخدمات، وساعات الذروة، ومعدلات استغلال غرف الدراسة وجلسات التقوية.
- **المشكلة التي تحلها:** صعوبة اتخاذ قرارات توسعة الحرم الجامعي أو تعديل جداول الكليات بدون بيانات إحصائية واقعية.
- **المستخدم المستفيد:** قيادات الجامعة، عمداء الكليات، ورؤساء الأقسام التشغيلية.
- **User Value:** رؤية تحليلية شاملة تساعد على تحسين تجربة الطلاب وتوزيع الموارد بكفاءة.
- **User Stories:**
  - كعميد، أريد معرفة أوقات الذروة ونسبة إشغال غرف الدراسة والمواقف لاتخاذ قرارات التوسعة المناسبة.
- **Current Implementation Status:** `UI_ONLY` (الواجهة موجودة في `AnalyticsView.tsx` لكنها تعتمد على أرقام ومخططات ثابتة Mocked، ولا يوجد Backend API لها بعد).
- **Frontend Status:** `UI_ONLY` مع وجود تصاميم بيانية ممتازة في `AnalyticsView.tsx`.
- **Backend Status:** `MISSING` (لا يوجد Controller خاص بالتحليلات بعد - مدرج في مهمة P7-06).
- **Database Status:** البيانات موجودة في الجداول الحالية لكن تحتاج كويريز تجميعية (Aggregate Queries).
- **API Integration Status:** غير مربوط.
- **Testing Status:** لا توجد اختبارات مخصصة له.
- **Security Status:** سيتطلب صلاحيات `CAMPUS_ADMIN` أو `FACULTY`.
- **Dependencies:** يعتمد على `F-06`, `F-04`, `F-12`, `F-10`.
- **Missing Capabilities:** كتابة `AnalyticsController` وخدمات التجميع الإحصائي (Task P7-06).
- **Known Bugs:** لا توجد أخطاء، ولكن البيانات غير ديناميكية.
- **Priority:** `P2` (Strategic Intelligence).
- **Complexity:** متوسطة.
- **Suggested Implementation Order:** مقرر في مهمة P7-06 القادمة بعد P7-05.

---

### F-16: أمان المؤسسات، فحص E2E، وجاهزية الإنتاج (Enterprise Hardening & Ops)
- **Feature ID:** `F-16`
- **Feature Name:** Enterprise System Hardening, Security, E2E & Production Operations
- **Business Description:** الحزمة الختامية لتجهيز النظام للعمل في بيئة إنتاج حقيقية وفق معايير الأمن السيبراني السعودية (PDPL و NCA-ECC)، وتشمل فحص الثغرات (OWASP ASVS)، واختبارات E2E شاملة عبر Playwright، وتحسين إمكانية الوصول والتوافقية (WCAG 2.1 AA)، واختبارات تحمل الضغط (Concurrency Load Testing)، وأتمتة النشر والنسخ الاحتياطي (CD Pipelines & Disaster Recovery Runbooks).
- **المشكلة التي تحلها:** مخاطر الاختراق، وتوقف النظام في أوقات الذروة، وفقدان البيانات في حال الأعطال.
- **المستخدم المستفيد:** الجامعة، الطلاب، وفريق الـ DevOps والدعم الفني.
- **User Value:** استقرار بنسبة 99.9%، أمان بيانات تام، وتجربة خالية من الأخطاء غير المتوقعة.
- **Current Implementation Status:** `BACKLOG / PLANNED` (موزع على المهام من P8-01 حتى P9-04).
- **Frontend Status:** يحتاج اختبارات E2E وضبط معايير سهولة الوصول.
- **Backend Status:** مهيأ معمارياً بحماية Spring Security، ويحتاج مراجعة معايير OWASP ومحاكاة الحمل.
- **Database Status:** يدعم الـ ACID ويحتاج إعدادات النسخ الاحتياطي التلقائي (pg_dump automated script).
- **Dependencies:** يعتمد على اكتمال جميع الميزات من F-01 إلى F-15.
- **Priority:** `P1` (Production Readiness).
- **Complexity:** عالية.
- **Suggested Implementation Order:** Phase 8 و Phase 9.
