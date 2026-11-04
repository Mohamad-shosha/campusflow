# -*- coding: utf-8 -*-
"""
Sections 16 to 18 for Master Figma UI/UX Showcase (Smart Campus Ecosystem Expansion)
- Section 16: Student Peer Tutoring & University Tuition Offset (Dark & Light)
- Section 17: Faculty Office Hours & Department Leadership Hub (Dark & Light)
- Section 18: Computer Labs & Study Pods with Countdown Timer (Dark & Light)
"""

def get_sections_16_to_18():
    return """
    <!-- ====================================================================
         SECTION 16: STUDENT PEER TUTORING & TUITION OFFSET (DUAL THEME)
         ==================================================================== -->
    <section id="f-tutoring">
      <div class="board-section-header">
        <div class="board-title">
          <h2>16. النشاط الطلابي والتدريس الأقراني وسداد الرسوم (Student Peer Tutoring & Economy)</h2>
          <span class="board-tag">Peer Tutoring & Tuition Settlement Hub</span>
        </div>
      </div>

      <div class="figma-dual-container">
        <!-- Frame 16-A: Dark Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 16-Tutoring-Dark / Peer Tutoring (70 SAR/hr) & Tuition Settlement</span>
              <span class="frame-theme-badge theme-badge-dark">🌙 Dark Theme #081211</span>
              <span class="frame-size-badge">1440 × 520</span>
            </div>
            <div class="frame-actions">
              <span class="frame-spec-chip">70 SAR / Hour</span>
              <span class="frame-spec-chip">Direct Tuition Credit</span>
            </div>
          </div>
          <div class="figma-frame-body-dark" style="padding:22px; background:radial-gradient(ellipse at 20% 20%, rgba(17,110,99,0.3) 0%, #081211 75%);">
            <div class="responsive-split-2col">
              <!-- Column 1: Active Tutoring Sessions -->
              <div style="display:flex; flex-direction:column; gap:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-weight:800; font-size:13px; color:#fff;">الحصص والشروحات الطلابية المعتمدة</span>
                  <span class="status-pill pill-available">سعر موحد: 70 ر.س / ساعة</span>
                </div>

                <!-- Session Card: Eyad -->
                <div style="background:rgba(12,28,25,0.85); border:1.5px solid rgba(17,110,99,0.5); border-radius:12px; padding:14px;">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                    <div style="display:flex; gap:10px; align-items:center;">
                      <div style="width:36px; height:36px; border-radius:10px; background:#116E63; display:flex; align-items:center; justify-content:center; font-weight:800; color:#fff; font-size:13px;">إياد</div>
                      <div>
                        <div style="font-weight:800; font-size:12.5px; color:#fff;">إياد الحربي (طالب متميز بالرياضيات)</div>
                        <div style="font-size:10px; color:#38c2b0;">مقرر الرياضيات MATH 101 • معدل: 4.94 / 5.00</div>
                      </div>
                    </div>
                    <span style="background:rgba(215,162,55,0.15); border:1px solid rgba(215,162,55,0.4); color:var(--fbsu-gold); font-size:11px; font-weight:800; padding:3px 8px; border-radius:999px;">70 ر.س / س</span>
                  </div>
                  <div style="background:rgba(0,0,0,0.3); border-radius:8px; padding:8px 10px; font-size:11px; color:#cbd5e1; margin-bottom:10px; line-height:1.5;">
                    مراجعة مكثفة لمحاضرات Lecture 1 to 4 وشرح تفصيلي لشباتر التفاضل والتكامل استعداداً للميدتيرم، مع حل نماذج أسئلة سابقة.
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px; color:#94a3b8;">
                    <span>📍 معمل حاسب 2 - كلية الهندسة</span>
                    <span class="btn btn-teal-primary" style="padding:4px 10px; font-size:10.5px; border-radius:6px;">احجز حصة تقوية</span>
                  </div>
                </div>

                <!-- Session Card: Rakan -->
                <div style="background:rgba(12,28,25,0.85); border:1.5px solid rgba(215,162,55,0.4); border-radius:12px; padding:14px;">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                    <div style="display:flex; gap:10px; align-items:center;">
                      <div style="width:36px; height:36px; border-radius:10px; background:#d7a237; display:flex; align-items:center; justify-content:center; font-weight:800; color:#000; font-size:13px;">راكان</div>
                      <div>
                        <div style="font-weight:800; font-size:12.5px; color:#fff;">راكان المطيري (طالب متميز بالبرمجة)</div>
                        <div style="font-size:10px; color:var(--fbsu-gold);">مقرر البرمجة CS 102 & Web Dev • معدل: 4.90 / 5.00</div>
                      </div>
                    </div>
                    <span style="background:rgba(215,162,55,0.15); border:1px solid rgba(215,162,55,0.4); color:var(--fbsu-gold); font-size:11px; font-weight:800; padding:3px 8px; border-radius:999px;">70 ر.س / س</span>
                  </div>
                  <div style="background:rgba(0,0,0,0.3); border-radius:8px; padding:8px 10px; font-size:11px; color:#cbd5e1; margin-bottom:10px; line-height:1.5;">
                    شرح مفاهيم Object-Oriented Programming والتعامل مع الخوارزميات وتطبيق عملي لمشاريع الفصل.
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px; color:#94a3b8;">
                    <span>📍 معمل البرمجيات C-104</span>
                    <span class="btn btn-gold-accent" style="padding:4px 10px; font-size:10.5px; border-radius:6px; color:#000;">احجز حصة تقوية</span>
                  </div>
                </div>
              </div>

              <!-- Column 2: University Balance & Tuition Offset -->
              <div style="display:flex; flex-direction:column; gap:12px;">
                <div style="font-weight:800; font-size:13px; color:var(--fbsu-gold);">المحفظة وسداد الرسوم الجامعية (Tuition Settlement)</div>
                
                <div style="background:linear-gradient(145deg, #0e2722, #071513); border:1.5px solid var(--fbsu-gold-border); border-radius:14px; padding:16px; box-shadow:0 8px 24px rgba(0,0,0,0.4);">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div style="font-size:11px; color:#94a3b8;">رصيد التدريس المكتسب (إياد الحربي)</div>
                    <span style="font-family:var(--font-mono); font-size:20px; font-weight:900; color:var(--fbsu-gold);">720.00 ر.س</span>
                  </div>

                  <div style="background:rgba(0,0,0,0.4); border-radius:8px; padding:10px; margin-bottom:12px;">
                    <div style="display:flex; justify-content:space-between; font-size:10.5px; margin-bottom:4px;">
                      <span style="color:#cbd5e1;">الرسوم الجامعية المتبقية:</span>
                      <span style="font-weight:700; color:#fff;">3,500.00 ر.س</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:10.5px; margin-bottom:6px;">
                      <span style="color:#cbd5e1;">المُسدد من رصيد الشروحات:</span>
                      <span style="font-weight:700; color:#10b981;">1,500.00 ر.س (30%)</span>
                    </div>
                    <div style="width:100%; height:6px; background:#1c3b35; border-radius:999px; overflow:hidden;">
                      <div style="width:30%; height:100%; background:linear-gradient(90deg, #10b981, #d7a237); border-radius:999px;"></div>
                    </div>
                  </div>

                  <!-- Tuition Receipt Preview -->
                  <div style="border:1px dashed rgba(215,162,55,0.4); border-radius:8px; padding:10px; background:rgba(215,162,55,0.04); font-size:10px; color:#cbd5e1;">
                    <div style="display:flex; justify-content:space-between; font-weight:800; color:var(--fbsu-gold); margin-bottom:4px;">
                      <span>إيصال سداد رسوم دراسية إلكتروني</span>
                      <span style="font-family:var(--font-mono);">TXN-FBSU-9821</span>
                    </div>
                    <div>المستفيد: <strong>إياد الحربي (طالب جامعة فهد بن سلطان)</strong></div>
                    <div>المبلغ المخصوم: <strong>700.00 ر.س (مكافأة 10 ساعات تدريس)</strong></div>
                    <div style="margin-top:4px; color:#10b981; font-weight:700;">✔ معتمد من عمادة القبول والتسجيل والشؤون المالية</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Frame 16-B: Light Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 16-Tutoring-Light / Institutional Academic Student Economy</span>
              <span class="frame-theme-badge theme-badge-light">☀️ Light Theme</span>
              <span class="frame-size-badge">1440 × 520</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">Official SIS Integrated</span></div>
          </div>
          <div class="figma-frame-body-light" style="padding:22px; background:#f8fafc;">
            <div class="responsive-split-2col">
              <div style="display:flex; flex-direction:column; gap:12px;">
                <div style="background:#ffffff; border:1.5px solid rgba(17,110,99,0.3); border-radius:12px; padding:14px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                  <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <div style="display:flex; gap:10px; align-items:center;">
                      <div style="width:36px; height:36px; border-radius:10px; background:#116E63; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800;">إياد</div>
                      <div>
                        <div style="font-weight:800; font-size:12.5px; color:#0f172a;">إياد الحربي • مقرر الرياضيات</div>
                        <div style="font-size:10px; color:#116E63;">سعر الحصة: 70 ر.س / ساعة (معتمد)</div>
                      </div>
                    </div>
                    <span style="background:rgba(17,110,99,0.1); color:#116E63; font-weight:800; font-size:11px; padding:3px 8px; border-radius:999px;">MATH 101</span>
                  </div>
                  <p style="font-size:11px; color:#475569; line-height:1.5; margin-bottom:8px;">
                    تغطية كاملة لمحاضرات Lectures 1-4 وشروحات مسائل الشباتر لطلاب السنة التحضيرية وكلية الهندسة.
                  </p>
                  <button class="btn btn-teal-primary" style="padding:4px 10px; font-size:11px; border-radius:6px; width:100%;">حجز حصة الآن (خصم 70 ر.س للرصيد الجامعي)</button>
                </div>
              </div>

              <div style="background:#ffffff; border:1.5px solid rgba(215,162,55,0.4); border-radius:12px; padding:14px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                <div style="font-size:12.5px; font-weight:800; color:#0f172a; margin-bottom:8px;">نظام سداد الرسوم الجامعية المباشر</div>
                <div style="font-size:11px; color:#475569; line-height:1.5; margin-bottom:12px;">
                  وفقاً للسياسة المالية للجامعة، كافة إيرادات التدريس تتحول مباشرة إلى <strong>رصيد جامعي رسمي</strong> يستخدم حصراً في تسديد الرسوم الجامعية أو حجز المواقف.
                </div>
                <div style="background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.3); border-radius:8px; padding:10px; font-size:11px; color:#065f46;">
                  ✔ تم سداد 1,500.00 ر.س من أقساط الفصل الدراسي الحالي بنجاح عبر رصيد الشروحات.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====================================================================
         SECTION 17: FACULTY OFFICE HOURS & LEADERSHIP HUB (DUAL THEME)
         ==================================================================== -->
    <section id="f-office-hours">
      <div class="board-section-header">
        <div class="board-title">
          <h2>17. حجز الساعات المكتبية للعمداء ورؤساء الأقسام (Faculty Office Hours)</h2>
          <span class="board-tag">Academic Leadership & Consultation</span>
        </div>
      </div>

      <div class="figma-dual-container">
        <!-- Frame 17-A: Dark Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 17-OfficeHours-Dark / Dr. Raghad & Dr. Mezher Office Slots</span>
              <span class="frame-theme-badge theme-badge-dark">🌙 Dark Theme</span>
              <span class="frame-size-badge">1440 × 480</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">Instant Push Alerts</span></div>
          </div>
          <div class="figma-frame-body-dark" style="padding:22px;">
            <div class="responsive-split-2col">
              <!-- Dr. Raghad Al-Nefaie -->
              <div style="background:rgba(12,28,25,0.85); border:1.5px solid var(--fbsu-teal); border-radius:12px; padding:16px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                  <div style="display:flex; gap:12px; align-items:center;">
                    <div style="width:42px; height:42px; border-radius:10px; background:linear-gradient(135deg, #116E63, #0b4941); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:14px;">ر.ن</div>
                    <div>
                      <div style="font-weight:800; font-size:13.5px; color:#fff;">د. رغد النفيعي</div>
                      <div style="font-size:11px; color:#38c2b0;">رئيسة قسم كلية الحاسبات وتقنية المعلومات</div>
                    </div>
                  </div>
                  <span class="status-pill pill-available">متاح للحجز</span>
                </div>
                <div style="font-size:11px; color:#cbd5e1; line-height:1.5; margin-bottom:12px;">
                  ساعات مكتبية مخصصة لمناقشة مشاريع التخرج، ومقرر <strong>التصميم المنطقي (Logic Design)</strong>، والإرشاد الأكاديمي.
                </div>
                <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px;">
                  <span style="background:rgba(0,0,0,0.4); border:1px solid #1c3b35; padding:4px 8px; border-radius:6px; font-size:10px; color:#cbd5e1;">الأحد (10:00 - 10:30 ص)</span>
                  <span style="background:rgba(0,0,0,0.4); border:1px solid #1c3b35; padding:4px 8px; border-radius:6px; font-size:10px; color:#cbd5e1;">الثلاثاء (11:00 - 11:30 ص)</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:10px; color:#94a3b8;">📍 مبنى كلية الحاسب - مكتب C-105</span>
                  <button class="btn btn-teal-primary" style="padding:5px 12px; font-size:11px;">حجز موعد (15 / 30 د)</button>
                </div>
              </div>

              <!-- Dr. Mohammad Mezher -->
              <div style="background:rgba(12,28,25,0.85); border:1.5px solid var(--fbsu-gold-border); border-radius:12px; padding:16px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                  <div style="display:flex; gap:12px; align-items:center;">
                    <div style="width:42px; height:42px; border-radius:10px; background:linear-gradient(135deg, #d7a237, #966f20); display:flex; align-items:center; justify-content:center; color:#000; font-weight:800; font-size:14px;">م.م</div>
                    <div>
                      <div style="font-weight:800; font-size:13.5px; color:#fff;">د. محمد مزهر</div>
                      <div style="font-size:11px; color:var(--fbsu-gold);">عميد كلية الحاسب الآلي وتقنية المعلومات</div>
                    </div>
                  </div>
                  <span class="status-pill pill-available">متاح للحجز</span>
                </div>
                <div style="font-size:11px; color:#cbd5e1; line-height:1.5; margin-bottom:12px;">
                  لقاءات واستشارات عمادة الكلية لمناقشة مقترحات المشاريع البحثية والاعتماد الأكاديمي للطلاب.
                </div>
                <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px;">
                  <span style="background:rgba(0,0,0,0.4); border:1px solid #1c3b35; padding:4px 8px; border-radius:6px; font-size:10px; color:#cbd5e1;">الاثنين (11:00 - 11:30 ص)</span>
                  <span style="background:rgba(0,0,0,0.4); border:1px solid #1c3b35; padding:4px 8px; border-radius:6px; font-size:10px; color:#cbd5e1;">الأربعاء (01:00 - 01:30 م)</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:10px; color:#94a3b8;">📍 مبنى الإدارة - جناح العميد C-201</span>
                  <button class="btn btn-gold-accent" style="padding:5px 12px; font-size:11px; color:#000;">حجز موعد مع العميد</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Frame 17-B: Light Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 17-OfficeHours-Light / Dean & Chairperson Consultation Portal</span>
              <span class="frame-theme-badge theme-badge-light">☀️ Light Theme</span>
              <span class="frame-size-badge">1440 × 480</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">Instant SMS & Notification</span></div>
          </div>
          <div class="figma-frame-body-light" style="padding:22px; background:#f8fafc;">
            <div class="responsive-split-2col">
              <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:16px;">
                <div style="font-weight:800; font-size:13px; color:#0f172a; margin-bottom:4px;">د. رغد النفيعي • رئيسة قسم الحاسب</div>
                <div style="font-size:11px; color:#64748b; margin-bottom:10px;">إشعار فوري: يتم إرسال تنبيه مباشر إلى هاتف ولوحة تحكم الدكتورة بمجرد حجز الموعد.</div>
                <button class="btn btn-teal-primary" style="width:100%; font-size:11px;">طلب موعد لمناقشة Logic Design</button>
              </div>

              <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:16px;">
                <div style="font-weight:800; font-size:13px; color:#0f172a; margin-bottom:4px;">د. محمد مزهر • عميد كلية الحاسب</div>
                <div style="font-size:11px; color:#64748b; margin-bottom:10px;">جلسات إشرافية لمشاريع التخرج والابتكارات الطلابية للكلية.</div>
                <button class="btn btn-gold-accent" style="width:100%; font-size:11px; color:#000;">طلب موعد مع العميد</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====================================================================
         SECTION 18: COMPUTER LABS & STUDY PODS WITH TIMER (DUAL THEME)
         ==================================================================== -->
    <section id="f-rooms">
      <div class="board-section-header">
        <div class="board-title">
          <h2>18. حجز القاعات ومعامل الحاسوب ومؤقت الإخلاء (Study Rooms & Lab Pods)</h2>
          <span class="board-tag">Teamwork & Countdown Timer</span>
        </div>
      </div>

      <div class="figma-dual-container">
        <!-- Frame 18-A: Dark Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 18-Labs-Dark / Teamwork Hub (Eyad, Rakan, Abdulaziz) & 20-min Timer</span>
              <span class="frame-theme-badge theme-badge-dark">🌙 Dark Theme</span>
              <span class="frame-size-badge">1440 × 480</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">Strict Exit Time: 09:20 AM</span></div>
          </div>
          <div class="figma-frame-body-dark" style="padding:22px;">
            <div class="responsive-split-2col">
              <!-- Lab 01 Card: Active Booking with Countdown -->
              <div style="background:rgba(12,28,25,0.85); border:1.5px solid #3b82f6; border-radius:12px; padding:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                  <div style="font-weight:800; font-size:13px; color:#fff;">معمل الابتكار والبرمجة LAB-01</div>
                  <span class="status-pill pill-occupied" style="background:rgba(239,68,68,0.15); color:#ef4444; border-color:rgba(239,68,68,0.4);">مشغول حالياً</span>
                </div>
                <div style="font-size:11px; color:#cbd5e1; margin-bottom:8px;">
                  فريق العمل: <strong>إياد الحربي، راكان المطيري، عبد العزيز السالم</strong>
                </div>
                <div style="font-size:10.5px; color:#94a3b8; margin-bottom:12px;">
                  الغرض: إنجاز واجبات Classwork & Homework لمقرر هندسة البرمجيات.
                </div>

                <!-- Live Countdown Timer Frame -->
                <div style="background:rgba(0,0,0,0.5); border:1px solid rgba(239,68,68,0.4); border-radius:8px; padding:10px; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <div style="font-size:10px; color:#fca5a5;">الوقت المتبقي للإخلاء الإلزامي:</div>
                    <div style="font-family:var(--font-mono); font-size:18px; font-weight:900; color:#ef4444;">18:42 دقيقة</div>
                  </div>
                  <div style="text-align:left; font-size:10px; color:#cbd5e1;">
                    <div>البداية: <strong>09:00 ص</strong></div>
                    <div>المغادرة: <strong>09:20 ص</strong></div>
                  </div>
                </div>
              </div>

              <!-- Lab 02 Card: Available for Booking -->
              <div style="background:rgba(12,28,25,0.85); border:1.5px solid rgba(16,185,129,0.5); border-radius:12px; padding:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                  <div style="font-weight:800; font-size:13px; color:#fff;">قاعة العمل الجماعي Pod B-04</div>
                  <span class="status-pill pill-available">متاحة للحجز الآن</span>
                </div>
                <div style="font-size:11px; color:#cbd5e1; margin-bottom:12px;">
                  مجهزة بشاشات عرض ذكية، وسبورة بيضاء، واتصال شبكي فائق السرعة لدراسة ومراجعة المقررات.
                </div>
                <div style="background:rgba(0,0,0,0.3); border-radius:8px; padding:10px; font-size:10.5px; color:#94a3b8; margin-bottom:12px;">
                  الفترات المتاحة: حجز مسبق من (09:30 إلى 09:50 ص) أو (10:00 إلى 10:30 ص).
                </div>
                <button class="btn btn-teal-primary" style="width:100%; font-size:11px;">احجز القاعة لفريقك الآن</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Frame 18-B: Light Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 18-Labs-Light / Institutional Lab Pod Allocation</span>
              <span class="frame-theme-badge theme-badge-light">☀️ Light Theme</span>
              <span class="frame-size-badge">1440 × 480</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">Automated Door Lock System</span></div>
          </div>
          <div class="figma-frame-body-light" style="padding:22px; background:#f8fafc;">
            <div class="responsive-split-2col">
              <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:16px;">
                <div style="font-weight:800; font-size:13px; color:#0f172a; margin-bottom:4px;">معمل البرمجة LAB-01 (مؤقت الإخلاء النشط)</div>
                <div style="font-size:11px; color:#64748b; margin-bottom:10px;">
                  حجز محدد بدقة من 09:00 إلى 09:20 صباحاً لضمان العدالة في استغلال مرافق الكلية.
                </div>
                <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:8px 12px; color:#991b1b; font-size:11px; font-weight:700;">
                  ⏳ متبقي 18 دقيقة على موعد الإخلاء الإلزامي
                </div>
              </div>

              <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:16px;">
                <div style="font-weight:800; font-size:13px; color:#0f172a; margin-bottom:4px;">قاعة الاستذكار Pod B-04</div>
                <div style="font-size:11px; color:#64748b; margin-bottom:10px;">
                  مخصصة لحل الواجبات والتكاليف الدراسية المشتركة بين طلاب الكلية.
                </div>
                <button class="btn btn-teal-primary" style="width:100%; font-size:11px;">تأكيد حجز القاعة</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    """
