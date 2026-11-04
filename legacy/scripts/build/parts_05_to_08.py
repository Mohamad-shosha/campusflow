# -*- coding: utf-8 -*-
"""
Sections 05 to 08 for Master Figma UI/UX Showcase (Ultra-Responsive Mobile & Desktop)
- Section 05: The Eyad & Rakan Simulation Engine (Dark & Light)
- Section 06: ALPR Smart Gate Vision & Neural OCR (Dark & Light)
- Section 07: Academic Schedule Booking Wizard & Digital Pass (Dark & Light)
- Section 08: Share & Earn Portal (Dark & Light)
"""

def get_sections_05_to_08():
    return """
    <!-- ====================================================================
         SECTION 05: THE EYAD & RAKAN SIMULATION ARENA (DUAL THEME)
         ==================================================================== -->
    <section id="f-simulator">
      <div class="board-section-header">
        <div class="board-title">
          <h2>05. محاكي التبادل الذكي بين الطلاب (Eyad & Rakan Simulation Engine)</h2>
          <span class="board-tag">Dual-Theme AI Swapping Flow</span>
        </div>
      </div>

      <div class="figma-dual-container">
        <!-- Frame 05-A: Dark Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 05-Simulation-Dark / 5-Step Swapping Timeline & Reward Calculation</span>
              <span class="frame-theme-badge theme-badge-dark">🌙 Dark Theme</span>
              <span class="frame-size-badge">1440 × 560</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">Zero Wasted Spaces Logic</span></div>
          </div>
          <div class="figma-frame-body-dark">
            <!-- Timeline Dark (Scrollable on mobile) -->
            <div class="timeline-scroll-wrapper">
              <div class="timeline-step-item" style="background:#132a25; border:1px solid var(--fbsu-teal);">
                <span style="font-family:var(--font-mono); font-size:10px; color:var(--fbsu-gold);">09:45 AM</span>
                <div style="font-size:11.5px; font-weight:700; color:#fff;">1. إياد بالمحاضرة</div>
              </div>
              <div class="timeline-step-item" style="background:#132a25; border:1px solid var(--fbsu-teal);">
                <span style="font-family:var(--font-mono); font-size:10px; color:var(--fbsu-gold);">10:00 AM</span>
                <div style="font-size:11.5px; font-weight:700; color:#fff;">2. خروج إياد في بريك</div>
              </div>
              <div class="timeline-step-item" style="background:var(--fbsu-teal); box-shadow:0 0 15px rgba(17,110,99,0.5);">
                <span style="font-family:var(--font-mono); font-size:10px; color:#fef08a;">10:05 AM (الآن)</span>
                <div style="font-size:11.5px; font-weight:800; color:#fff;">3. مطابقة جدول راكان</div>
              </div>
              <div class="timeline-step-item" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08);">
                <span style="font-family:var(--font-mono); font-size:10px; color:#888;">10:15 AM</span>
                <div style="font-size:11.5px; font-weight:700; color:#888;">4. وصول راكان للبوابة</div>
              </div>
              <div class="timeline-step-item" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08);">
                <span style="font-family:var(--font-mono); font-size:10px; color:#888;">01:30 PM</span>
                <div style="font-size:11.5px; font-weight:700; color:#888;">5. عودة إياد + كاشباك</div>
              </div>
            </div>

            <div class="responsive-split-2col" style="margin-top:16px;">
              <div style="background:radial-gradient(circle, rgba(17,110,99,0.2) 0%, #0c1a18 70%); border:1px solid rgba(17,110,99,0.4); border-radius:12px; padding:18px; text-align:center;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                  <span style="font-size:11.5px; font-weight:800; color:var(--fbsu-gold);">موقف #01 - كلية الهندسة</span>
                  <span class="status-pill pill-flex">حجز مؤكد لراكان</span>
                </div>
                <div style="width:100px; height:135px; margin:8px auto;">
                  <svg viewBox="0 0 100 160" width="100%" height="100%"><rect x="18" y="10" width="64" height="135" rx="24" fill="#0b6d87" stroke="#ffffff" stroke-width="2"/><ellipse cx="50" cy="50" rx="20" ry="12" fill="#072023"/></svg>
                </div>
                <div style="font-weight:800; font-size:15px; color:#fff;">سيارة راكان المطيري (سوناتا)</div>
                <div style="font-size:11px; color:#94a3b8; margin-top:3px;">اللوحة: د ل س 8892 | الكلاس: 10:15 ص</div>
                <div style="display:flex; justify-content:center; gap:10px; margin-top:12px; font-size:11px; flex-wrap:wrap;">
                  <span style="background:rgba(16,185,129,0.15); color:#10b981; padding:3px 8px; border-radius:6px; font-weight:700;">+100% استغلال السعة</span>
                  <span style="background:rgba(215,162,55,0.15); color:var(--fbsu-gold); padding:3px 8px; border-radius:6px; font-weight:700;">17.25 ر.س كاشباك لإياد</span>
                </div>
              </div>

              <div style="display:flex; flex-direction:column; justify-content:space-between;">
                <div style="background:#0f2420; border:1px solid #1e3d36; border-radius:10px; padding:14px; margin-bottom:12px;">
                  <div style="font-size:12.5px; font-weight:800; color:var(--fbsu-gold); margin-bottom:5px;">الذكاء الاصطناعي يطابق جدول راكان:</div>
                  <p style="font-size:11.5px; color:#cbd5e1; line-height:1.5;">
                    الذكاء الاصطناعي حلل جداول الطلاب واكتشف أن راكان لديه كلاس الساعة 10:15 ص في كلية الحاسب. أرسل النظام فوراً إشعاراً لهاتفه: "تم حجز موقف رقم #01 لك حتى 01:00 م بتعرفة ذكية 5.75 ر.س/ساعة"!
                  </p>
                </div>
                <div class="responsive-2col-gap" style="margin-bottom:12px;">
                  <div style="background:#0a1614; border:1px solid #1a302c; border-radius:8px; padding:10px;">
                    <div style="font-weight:700; font-size:12px; color:#fff;">إياد الحربي (هندسة)</div>
                    <div style="font-size:10px; color:#888;">الحالة: بريك (3.5 ساعات)</div>
                    <div style="font-size:10.5px; color:var(--fbsu-gold); margin-top:2px;">يكسب: 17.25 ر.س بالمحفظة</div>
                  </div>
                  <div style="background:#0a1614; border:1px solid var(--fbsu-teal); border-radius:8px; padding:10px;">
                    <div style="font-weight:700; font-size:12px; color:#fff;">راكان المطيري (حاسب)</div>
                    <div style="font-size:10px; color:#888;">الحالة: تم توجيهه لموقف #01</div>
                    <div style="font-size:10.5px; color:#10b981; margin-top:2px;">وقت البحث: 0 ثانية</div>
                  </div>
                </div>
                <div class="btn-cluster-wrap">
                  <button class="btn btn-gold-accent" style="flex:1;">وصول سيارة راكان إلى البوابة ⬅</button>
                  <button class="btn btn-ghost-outline-dark">تشغيل تلقائي ▶</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Frame 05-B: Light Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 05-Simulation-Light / 5-Step Swapping Timeline & Reward Calculation</span>
              <span class="frame-theme-badge theme-badge-light">☀️ Light Theme</span>
              <span class="frame-size-badge">1440 × 560</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">Elevated Narrative Cards</span></div>
          </div>
          <div class="figma-frame-body-light">
            <!-- Timeline Light (Scrollable on mobile) -->
            <div class="timeline-scroll-wrapper">
              <div class="timeline-step-item" style="background:#e8f4f2; border:1.5px solid var(--fbsu-teal);">
                <span style="font-family:var(--font-mono); font-size:10px; color:#b45309; font-weight:800;">09:45 AM</span>
                <div style="font-size:11.5px; font-weight:700; color:#0d554c;">1. إياد بالمحاضرة</div>
              </div>
              <div class="timeline-step-item" style="background:#e8f4f2; border:1.5px solid var(--fbsu-teal);">
                <span style="font-family:var(--font-mono); font-size:10px; color:#b45309; font-weight:800;">10:00 AM</span>
                <div style="font-size:11.5px; font-weight:700; color:#0d554c;">2. خروج إياد في بريك</div>
              </div>
              <div class="timeline-step-item" style="background:var(--fbsu-teal); box-shadow:0 4px 12px rgba(17,110,99,0.3);">
                <span style="font-family:var(--font-mono); font-size:10px; color:#fef08a; font-weight:800;">10:05 AM (الآن)</span>
                <div style="font-size:11.5px; font-weight:800; color:#fff;">3. مطابقة جدول راكان</div>
              </div>
              <div class="timeline-step-item" style="background:#ffffff; border:1px solid #cbd5e1;">
                <span style="font-family:var(--font-mono); font-size:10px; color:#64748b;">10:15 AM</span>
                <div style="font-size:11.5px; font-weight:700; color:#64748b;">4. وصول راكان للبوابة</div>
              </div>
              <div class="timeline-step-item" style="background:#ffffff; border:1px solid #cbd5e1;">
                <span style="font-family:var(--font-mono); font-size:10px; color:#64748b;">01:30 PM</span>
                <div style="font-size:11.5px; font-weight:700; color:#64748b;">5. عودة إياد + كاشباك</div>
              </div>
            </div>

            <div class="responsive-split-2col" style="margin-top:16px;">
              <div style="background:#ffffff; border:1.5px solid rgba(17,110,99,0.25); border-radius:12px; padding:18px; text-align:center; box-shadow:0 8px 24px rgba(17,110,99,0.06);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                  <span style="font-size:11.5px; font-weight:800; color:#b45309;">موقف #01 - كلية الهندسة</span>
                  <span class="status-pill pill-flex">حجز مؤكد لراكان</span>
                </div>
                <div style="width:100px; height:135px; margin:8px auto;">
                  <svg viewBox="0 0 100 160" width="100%" height="100%"><rect x="18" y="10" width="64" height="135" rx="24" fill="#0b6d87" stroke="#ffffff" stroke-width="2"/><ellipse cx="50" cy="50" rx="20" ry="12" fill="#072023"/></svg>
                </div>
                <div style="font-weight:800; font-size:15px; color:#0f172a;">سيارة راكان المطيري (سوناتا)</div>
                <div style="font-size:11px; color:#64748b; margin-top:3px;">اللوحة: د ل س 8892 | الكلاس: 10:15 ص</div>
                <div style="display:flex; justify-content:center; gap:10px; margin-top:12px; font-size:11px; flex-wrap:wrap;">
                  <span style="background:rgba(16,185,129,0.12); color:#059669; padding:3px 8px; border-radius:6px; font-weight:800;">+100% استغلال السعة</span>
                  <span style="background:rgba(215,162,55,0.15); color:#a16207; padding:3px 8px; border-radius:6px; font-weight:800;">17.25 ر.س كاشباك لإياد</span>
                </div>
              </div>

              <div style="display:flex; flex-direction:column; justify-content:space-between;">
                <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:14px; margin-bottom:12px; box-shadow:0 4px 12px rgba(0,0,0,0.03);">
                  <div style="font-size:12.5px; font-weight:800; color:#b45309; margin-bottom:5px;">الذكاء الاصطناعي يطابق جدول راكان:</div>
                  <p style="font-size:11.5px; color:#334155; line-height:1.5;">
                    الذكاء الاصطناعي حلل جداول الطلاب واكتشف أن راكان لديه كلاس الساعة 10:15 ص في كلية الحاسب. أرسل النظام فوراً إشعاراً لهاتفه: "تم حجز موقف رقم #01 لك حتى 01:00 م بتعرفة ذكية 5.75 ر.س/ساعة"!
                  </p>
                </div>
                <div class="responsive-2col-gap" style="margin-bottom:12px;">
                  <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px;">
                    <div style="font-weight:700; font-size:12px; color:#0f172a;">إياد الحربي (هندسة)</div>
                    <div style="font-size:10px; color:#64748b;">الحالة: بريك (3.5 ساعات)</div>
                    <div style="font-size:10.5px; color:#b45309; font-weight:700; margin-top:2px;">يكسب: 17.25 ر.س بالمحفظة</div>
                  </div>
                  <div style="background:#f8fafc; border:1.5px solid var(--fbsu-teal); border-radius:8px; padding:10px;">
                    <div style="font-weight:700; font-size:12px; color:#0f172a;">راكان المطيري (حاسب)</div>
                    <div style="font-size:10px; color:#64748b;">الحالة: تم توجيهه لموقف #01</div>
                    <div style="font-size:10.5px; color:#059669; font-weight:700; margin-top:2px;">وقت البحث: 0 ثانية</div>
                  </div>
                </div>
                <div class="btn-cluster-wrap">
                  <button class="btn btn-gold-accent" style="flex:1;">وصول سيارة راكان إلى البوابة ⬅</button>
                  <button class="btn btn-ghost-outline-light">تشغيل تلقائي ▶</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Specs Panel -->
        <div class="figma-inspect-panel">
          <div class="inspect-panel-header">
            <span class="inspect-panel-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--figma-blue)" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              <span>Algorithm Parameters & Event Trigger Pipeline: Flex Swapping</span>
            </span>
            <span class="frame-spec-chip">5-Step Sequence Pipeline</span>
          </div>
          <div class="token-grid">
            <div class="token-item"><span class="token-name">trigger-event</span><span class="token-val">ALPR Exit Event + 2+ hr Lecture Gap</span></div>
            <div class="token-item"><span class="token-name">matching-algorithm</span><span class="token-val">Geofence + SIS Timetable Proximity</span></div>
            <div class="token-item"><span class="token-name">cashback-rate</span><span class="token-val">5.75 SAR/hour credited to university wallet</span></div>
            <div class="token-item"><span class="token-name">guaranteed-return</span><span class="token-val">100% reservation buffer (15 min prior)</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====================================================================
         SECTION 06: ALPR SMART GATE VISION & NEURAL RECOGNITION (DUAL THEME)
         ==================================================================== -->
    <section id="f-gate">
      <div class="board-section-header">
        <div class="board-title">
          <h2>06. بوابات الجامعة ونظام كاميرات ALPR (Gate Vision & Neural OCR)</h2>
          <span class="board-tag">Dual-Theme Computer Vision</span>
        </div>
      </div>

      <div class="figma-dual-container">
        <!-- Frame 06-A: Dark Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 06-ALPR-Dark / 4K Optical Bounding Box & Motorized Barrier Arm HUD</span>
              <span class="frame-theme-badge theme-badge-dark">🌙 Dark Theme</span>
              <span class="frame-size-badge">1440 × 520</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">Inference: 14ms (YOLOv8)</span></div>
          </div>
          <div class="figma-frame-body-dark">
            <div class="responsive-split-2col">
              <div style="background:#000; border:2px solid #222; border-radius:12px; position:relative; overflow:hidden; min-height:260px; display:flex; flex-direction:column; justify-content:space-between; padding:14px;">
                <div style="display:flex; justify-content:space-between; align-items:center; font-family:var(--font-mono); font-size:10.5px; flex-wrap:wrap; gap:6px;">
                  <span style="color:#ff3344; display:flex; align-items:center; gap:6px;">
                    <span style="width:7px; height:7px; background:#ff3344; border-radius:50%; box-shadow:0 0 8px #ff3344;"></span>
                    <span>LIVE: CAM-01 (MAIN_NORTH_GATE_FBSU)</span>
                  </span>
                  <span style="color:#888;">60 FPS | 4K | CONFIDENCE: 99.8%</span>
                </div>
                <div style="border:2px dashed #0d99ff; border-radius:8px; width:220px; height:80px; margin:10px auto; display:flex; align-items:center; justify-content:center; position:relative; box-shadow:0 0 25px rgba(13,153,255,0.3);">
                  <div style="position:absolute; top:0; left:0; right:0; height:2px; background:#0d99ff; box-shadow:0 0 10px #0d99ff;"></div>
                  <span class="saudi-plate" style="transform:scale(1.05);">
                    <div class="plate-letters-section"><span class="plate-ar">د ل س</span><span class="plate-en">D L S</span></div>
                    <div class="plate-digits-section"><span class="plate-ar">٨ ٨ ٩ ٢</span><span class="plate-en">8 8 9 2</span></div>
                    <div class="plate-emblem"><span>KSA</span><span>🇸🇦</span></div>
                  </span>
                </div>
                <div style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:8px;">
                  <div style="width:14px; height:28px; background:#444; border-radius:4px; display:flex; align-items:center; justify-content:center;">
                    <span style="width:7px; height:7px; border-radius:50%; background:#10b981; box-shadow:0 0 10px #10b981;"></span>
                  </div>
                  <div style="height:5px; flex:1; background:repeating-linear-gradient(45deg, #ef4444, #ef4444 10px, #ffffff 10px, #ffffff 20px); border-radius:3px;"></div>
                  <span style="color:#10b981; font-weight:800; font-size:11.5px;">البوابة مفتوحة (90°)</span>
                </div>
              </div>

              <div style="display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <h4 style="font-size:13px; font-weight:800; color:#fff; margin-bottom:10px;">فحص مطابقة السيارات المصرحة:</h4>
                  <div style="display:flex; flex-direction:column; gap:8px;">
                    <div style="background:#0f2420; border:1px solid #1a3c34; border-radius:8px; padding:8px 12px; display:flex; justify-content:space-between; align-items:center;">
                      <div>
                        <div style="font-weight:700; font-size:12px; color:#fff;">سيارة إياد الحربي (كامري)</div>
                        <div style="font-size:10.5px; color:#888;">لوحة: ب ط ك 1234 - موقف #01</div>
                      </div>
                      <span class="status-pill pill-available">مصرّح</span>
                    </div>
                    <div style="background:#0f2420; border:1px solid var(--fbsu-gold); border-radius:8px; padding:8px 12px; display:flex; justify-content:space-between; align-items:center;">
                      <div>
                        <div style="font-weight:700; font-size:12px; color:#fff;">سيارة راكان المطيري (سوناتا)</div>
                        <div style="font-size:10.5px; color:var(--fbsu-gold);">لوحة: د ل س 8892 - حجز تبادل ذكي</div>
                      </div>
                      <span class="status-pill pill-flex">تبادل نشط</span>
                    </div>
                    <div style="background:#0f2420; border:1px solid #1a3c34; border-radius:8px; padding:8px 12px; display:flex; justify-content:space-between; align-items:center;">
                      <div>
                        <div style="font-weight:700; font-size:12px; color:#fff;">سيارة د. عبد الله الغامدي (جينيسيس)</div>
                        <div style="font-size:10.5px; color:#888;">لوحة: أ ح م 5501 - موقف #19 (دكاترة)</div>
                      </div>
                      <span class="status-pill pill-faculty">VIP كادر</span>
                    </div>
                  </div>
                </div>
                <div class="btn-cluster-wrap" style="margin-top:12px;">
                  <button class="btn btn-teal-primary" style="flex:1;">إعادة المسح (Re-scan)</button>
                  <button class="btn btn-ghost-outline-dark">فتح طوارئ يدوي</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Frame 06-B: Light Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 06-ALPR-Light / 4K Optical Bounding Box & Motorized Barrier Arm HUD</span>
              <span class="frame-theme-badge theme-badge-light">☀️ Light Theme</span>
              <span class="frame-size-badge">1440 × 520</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">Daylight Monitor Contrast</span></div>
          </div>
          <div class="figma-frame-body-light">
            <div class="responsive-split-2col">
              <div style="background:#1e293b; border:2px solid #cbd5e1; border-radius:12px; position:relative; overflow:hidden; min-height:260px; display:flex; flex-direction:column; justify-content:space-between; padding:14px;">
                <div style="display:flex; justify-content:space-between; align-items:center; font-family:var(--font-mono); font-size:10.5px; flex-wrap:wrap; gap:6px;">
                  <span style="color:#f87171; display:flex; align-items:center; gap:6px; font-weight:800;">
                    <span style="width:7px; height:7px; background:#ef4444; border-radius:50%;"></span>
                    <span>LIVE: CAM-01 (MAIN_NORTH_GATE_FBSU)</span>
                  </span>
                  <span style="color:#cbd5e1;">60 FPS | 4K | CONFIDENCE: 99.8%</span>
                </div>
                <div style="border:2px dashed #38bdf8; border-radius:8px; width:220px; height:80px; margin:10px auto; display:flex; align-items:center; justify-content:center; position:relative; box-shadow:0 0 20px rgba(56,189,248,0.25);">
                  <div style="position:absolute; top:0; left:0; right:0; height:2px; background:#38bdf8;"></div>
                  <span class="saudi-plate" style="transform:scale(1.05);">
                    <div class="plate-letters-section"><span class="plate-ar">د ل س</span><span class="plate-en">D L S</span></div>
                    <div class="plate-digits-section"><span class="plate-ar">٨ ٨ ٩ ٢</span><span class="plate-en">8 8 9 2</span></div>
                    <div class="plate-emblem"><span>KSA</span><span>🇸🇦</span></div>
                  </span>
                </div>
                <div style="display:flex; align-items:center; gap:12px; background:#ffffff; padding:8px 12px; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
                  <div style="width:14px; height:28px; background:#334155; border-radius:4px; display:flex; align-items:center; justify-content:center;">
                    <span style="width:7px; height:7px; border-radius:50%; background:#10b981;"></span>
                  </div>
                  <div style="height:5px; flex:1; background:repeating-linear-gradient(45deg, #ef4444, #ef4444 10px, #ffffff 10px, #ffffff 20px); border-radius:3px;"></div>
                  <span style="color:#059669; font-weight:800; font-size:11.5px;">البوابة مفتوحة (90°)</span>
                </div>
              </div>

              <div style="display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <h4 style="font-size:13px; font-weight:800; color:#0f172a; margin-bottom:10px;">فحص مطابقة السيارات المصرحة:</h4>
                  <div style="display:flex; flex-direction:column; gap:8px;">
                    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:8px 12px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
                      <div>
                        <div style="font-weight:700; font-size:12px; color:#0f172a;">سيارة إياد الحربي (كامري)</div>
                        <div style="font-size:10.5px; color:#64748b;">لوحة: ب ط ك 1234 - موقف #01</div>
                      </div>
                      <span class="status-pill pill-available">مصرّح</span>
                    </div>
                    <div style="background:#ffffff; border:1.5px solid rgba(215,162,55,0.6); border-radius:8px; padding:8px 12px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
                      <div>
                        <div style="font-weight:700; font-size:12px; color:#0f172a;">سيارة راكان المطيري (سوناتا)</div>
                        <div style="font-size:10.5px; color:#b45309; font-weight:700;">لوحة: د ل س 8892 - حجز تبادل ذكي</div>
                      </div>
                      <span class="status-pill pill-flex">تبادل نشط</span>
                    </div>
                    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:8px 12px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
                      <div>
                        <div style="font-weight:700; font-size:12px; color:#0f172a;">سيارة د. عبد الله الغامدي (جينيسيس)</div>
                        <div style="font-size:10.5px; color:#64748b;">لوحة: أ ح م 5501 - موقف #19 (دكاترة)</div>
                      </div>
                      <span class="status-pill pill-faculty">VIP كادر</span>
                    </div>
                  </div>
                </div>
                <div class="btn-cluster-wrap" style="margin-top:12px;">
                  <button class="btn btn-teal-primary" style="flex:1;">إعادة المسح (Re-scan)</button>
                  <button class="btn btn-ghost-outline-light">فتح طوارئ يدوي</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Specs Panel -->
        <div class="figma-inspect-panel">
          <div class="inspect-panel-header">
            <span class="inspect-panel-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--figma-blue)" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              <span>ALPR Computer Vision Specification</span>
            </span>
            <span class="frame-spec-chip">YOLOv8 + CRNN OCR Pipeline</span>
          </div>
          <div class="token-grid">
            <div class="token-item"><span class="token-name">camera-model</span><span class="token-val">Hikvision 4K DeepinView ANPR</span></div>
            <div class="token-item"><span class="token-name">accuracy-rate</span><span class="token-val">99.8% under varied daylight & headlights</span></div>
            <div class="token-item"><span class="token-name">barrier-arm-motor</span><span class="token-val">Brushless DC Motor (Open speed: 0.9s)</span></div>
            <div class="token-item"><span class="token-name">safety-loop</span><span class="token-val">Dual Inductive Ground Loop + IR Safety Beam</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====================================================================
         SECTION 07: SMART BOOKING WIZARD & DIGITAL PASS (DUAL THEME)
         ==================================================================== -->
    <section id="f-booking">
      <div class="board-section-header">
        <div class="board-title">
          <h2>07. معالج حجز المواقف والتصريح الذكي (Smart Booking Wizard & Digital Pass)</h2>
          <span class="board-tag">Dual-Theme Booking & QR Pass</span>
        </div>
      </div>

      <div class="figma-dual-container">
        <!-- Frame 07-A: Dark Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 07-Booking-Dark / 3-Tier Tariff Selector & Vector QR Boarding Pass</span>
              <span class="frame-theme-badge theme-badge-dark">🌙 Dark Theme</span>
              <span class="frame-size-badge">1440 × 520</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">Dynamic SAR Engine</span></div>
          </div>
          <div class="figma-frame-body-dark">
            <div class="responsive-split-2col">
              <!-- Left: Form Dark -->
              <div style="background:#0f2420; border:1px solid #1e3d36; border-radius:12px; padding:16px;">
                <h4 style="font-size:13px; font-weight:800; color:#fff; margin-bottom:12px;">جدول ومواعيد المحاضرات الأكاديمية:</h4>
                <div class="responsive-3col-grid" style="margin-bottom:12px;">
                  <div style="background:#081211; border:1.5px solid var(--fbsu-teal); border-radius:8px; padding:8px; text-align:center;">
                    <div style="font-weight:700; font-size:11.5px; color:#fff;">الأحد / الثلاثاء</div>
                    <div style="font-size:9.5px; color:#888;">محاضرات منتظمة</div>
                  </div>
                  <div style="background:#081211; border:1px solid #1a302c; border-radius:8px; padding:8px; text-align:center;">
                    <div style="font-weight:700; font-size:11.5px; color:#fff;">الاثنين / الأربعاء</div>
                    <div style="font-size:9.5px; color:#888;">محاضرات منتظمة</div>
                  </div>
                  <div style="background:#081211; border:1px solid #1a302c; border-radius:8px; padding:8px; text-align:center;">
                    <div style="font-weight:700; font-size:11.5px; color:#fff;">الخميس</div>
                    <div style="font-size:9.5px; color:#888;">معامل ولابات</div>
                  </div>
                </div>

                <div class="responsive-3col-grid" style="margin-bottom:12px;">
                  <div style="background:#081211; border:1.5px solid var(--fbsu-gold); border-radius:8px; padding:8px; text-align:center;">
                    <div style="font-weight:700; font-size:11.5px; color:#fff;">بالساعة</div>
                    <div style="font-size:10.5px; color:var(--fbsu-gold); font-weight:800;">5.75 ر.س / س</div>
                  </div>
                  <div style="background:#081211; border:1px solid #1a302c; border-radius:8px; padding:8px; text-align:center;">
                    <div style="font-weight:700; font-size:11.5px; color:#fff;">سقف يومي</div>
                    <div style="font-size:10.5px; color:#888;">15.00 ر.س / يوم</div>
                  </div>
                  <div style="background:#081211; border:1px solid #1a302c; border-radius:8px; padding:8px; text-align:center;">
                    <div style="font-weight:700; font-size:11.5px; color:#fff;">اشتراك شهري</div>
                    <div style="font-size:10.5px; color:#888;">225 ر.س (خصم 50%)</div>
                  </div>
                </div>

                <div style="background:rgba(215,162,55,0.12); border:1px solid rgba(215,162,55,0.3); border-radius:8px; padding:8px 12px;">
                  <span style="font-size:11.5px; font-weight:700; color:var(--fbsu-gold);">✓ تفعيل ميزة التبادل الذكي التلقائي:</span>
                  <span style="font-size:10.5px; color:#cbd5e1; display:block; margin-top:2px;">عند خروجك من الجامعة بالبريك، يُتاح الموقف لزملائك وتُضاف الأرباح فوراً لمحفظتك.</span>
                </div>
              </div>

              <!-- Right: Boarding Pass Dark -->
              <div style="background:#ffffff; color:#0f172a; border-radius:14px; padding:18px; box-shadow:0 12px 30px rgba(0,0,0,0.4); display:flex; flex-direction:column; justify-content:space-between;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px dashed #cbd5e1; padding-bottom:10px;">
                  <div>
                    <div style="font-weight:900; font-size:13.5px; color:#116E63;">تذكرة الموقف الذكية (FBSU PASS)</div>
                    <div style="font-size:10.5px; color:#64748b;">رقم الحجز: FBSU-2026-9921</div>
                  </div>
                  <span style="background:#116E63; color:#fff; padding:2px 7px; border-radius:4px; font-size:9.5px; font-weight:800;">مؤكد</span>
                </div>

                <div class="responsive-2col-gap" style="margin:12px 0; font-size:11.5px;">
                  <div>
                    <span style="color:#64748b; font-size:9.5px;">الطالب:</span>
                    <div style="font-weight:700;">راكان المطيري (كلية الحاسب)</div>
                  </div>
                  <div>
                    <span style="color:#64748b; font-size:9.5px;">الموقف المخصص:</span>
                    <div style="font-weight:800; color:#116E63;">#01 (قطاع A)</div>
                  </div>
                  <div>
                    <span style="color:#64748b; font-size:9.5px;">الفترة الزمنية:</span>
                    <div style="font-weight:700;">10:15 ص - 01:00 م</div>
                  </div>
                  <div>
                    <span style="color:#64748b; font-size:9.5px;">الإجمالي المدفوع:</span>
                    <div style="font-weight:800; color:#d97706;">12.94 ر.س (شامل الخصم)</div>
                  </div>
                </div>

                <div style="text-align:center; padding:8px 0; border-top:2px dashed #cbd5e1;">
                  <svg width="80" height="80" viewBox="0 0 200 200" fill="none" style="margin:0 auto; display:block;">
                    <rect width="200" height="200" fill="white" rx="10"/>
                    <rect x="20" y="20" width="45" height="45" rx="6" fill="#116E63"/>
                    <rect x="28" y="28" width="29" height="29" rx="3" fill="white"/>
                    <rect x="34" y="34" width="17" height="17" rx="2" fill="#116E63"/>
                    <rect x="135" y="20" width="45" height="45" rx="6" fill="#116E63"/>
                    <rect x="143" y="28" width="29" height="29" rx="3" fill="white"/>
                    <rect x="149" y="34" width="17" height="17" rx="2" fill="#116E63"/>
                    <rect x="20" y="135" width="45" height="45" rx="6" fill="#116E63"/>
                    <rect x="28" y="143" width="29" height="29" rx="3" fill="white"/>
                    <rect x="34" y="149" width="17" height="17" rx="2" fill="#116E63"/>
                    <circle cx="90" cy="90" r="10" fill="#d7a237"/>
                  </svg>
                  <span style="font-size:9.5px; color:#64748b; font-family:var(--font-mono); margin-top:3px; display:block;">مسح الباركود على قارئ البوابة</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Frame 07-B: Light Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 07-Booking-Light / 3-Tier Tariff Selector & Vector QR Boarding Pass</span>
              <span class="frame-theme-badge theme-badge-light">☀️ Light Theme</span>
              <span class="frame-size-badge">1440 × 520</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">Printable Pass Contrast</span></div>
          </div>
          <div class="figma-frame-body-light">
            <div class="responsive-split-2col">
              <!-- Left: Form Light -->
              <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:16px; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
                <h4 style="font-size:13px; font-weight:800; color:#0f172a; margin-bottom:12px;">جدول ومواعيد المحاضرات الأكاديمية:</h4>
                <div class="responsive-3col-grid" style="margin-bottom:12px;">
                  <div style="background:#e8f4f2; border:1.5px solid var(--fbsu-teal); border-radius:8px; padding:8px; text-align:center;">
                    <div style="font-weight:800; font-size:11.5px; color:#0d554c;">الأحد / الثلاثاء</div>
                    <div style="font-size:9.5px; color:#64748b;">محاضرات منتظمة</div>
                  </div>
                  <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:8px; text-align:center;">
                    <div style="font-weight:700; font-size:11.5px; color:#0f172a;">الاثنين / الأربعاء</div>
                    <div style="font-size:9.5px; color:#64748b;">محاضرات منتظمة</div>
                  </div>
                  <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:8px; text-align:center;">
                    <div style="font-weight:700; font-size:11.5px; color:#0f172a;">الخميس</div>
                    <div style="font-size:9.5px; color:#64748b;">معامل ولابات</div>
                  </div>
                </div>

                <div class="responsive-3col-grid" style="margin-bottom:12px;">
                  <div style="background:#fefce8; border:1.5px solid #d97706; border-radius:8px; padding:8px; text-align:center;">
                    <div style="font-weight:800; font-size:11.5px; color:#92400e;">بالساعة</div>
                    <div style="font-size:10.5px; color:#b45309; font-weight:800;">5.75 ر.س / س</div>
                  </div>
                  <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:8px; text-align:center;">
                    <div style="font-weight:700; font-size:11.5px; color:#0f172a;">سقف يومي</div>
                    <div style="font-size:10.5px; color:#64748b;">15.00 ر.س / يوم</div>
                  </div>
                  <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:8px; text-align:center;">
                    <div style="font-weight:700; font-size:11.5px; color:#0f172a;">اشتراك شهري</div>
                    <div style="font-size:10.5px; color:#64748b;">225 ر.س (خصم 50%)</div>
                  </div>
                </div>

                <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:8px; padding:8px 12px;">
                  <span style="font-size:11.5px; font-weight:800; color:#b45309;">✓ تفعيل ميزة التبادل الذكي التلقائي:</span>
                  <span style="font-size:10.5px; color:#475569; display:block; margin-top:2px;">عند خروجك من الجامعة بالبريك، يُتاح الموقف لزملائك وتُضاف الأرباح فوراً لمحفظتك.</span>
                </div>
              </div>

              <!-- Right: Boarding Pass Light -->
              <div style="background:#ffffff; color:#0f172a; border:1.5px solid #cbd5e1; border-radius:14px; padding:18px; box-shadow:0 8px 24px rgba(0,0,0,0.06); display:flex; flex-direction:column; justify-content:space-between;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px dashed #cbd5e1; padding-bottom:10px;">
                  <div>
                    <div style="font-weight:900; font-size:13.5px; color:#116E63;">تذكرة الموقف الذكية (FBSU PASS)</div>
                    <div style="font-size:10.5px; color:#64748b;">رقم الحجز: FBSU-2026-9921</div>
                  </div>
                  <span style="background:#116E63; color:#fff; padding:2px 7px; border-radius:4px; font-size:9.5px; font-weight:800;">مؤكد</span>
                </div>

                <div class="responsive-2col-gap" style="margin:12px 0; font-size:11.5px;">
                  <div>
                    <span style="color:#64748b; font-size:9.5px;">الطالب:</span>
                    <div style="font-weight:700;">راكان المطيري (كلية الحاسب)</div>
                  </div>
                  <div>
                    <span style="color:#64748b; font-size:9.5px;">الموقف المخصص:</span>
                    <div style="font-weight:800; color:#116E63;">#01 (قطاع A)</div>
                  </div>
                  <div>
                    <span style="color:#64748b; font-size:9.5px;">الفترة الزمنية:</span>
                    <div style="font-weight:700;">10:15 ص - 01:00 م</div>
                  </div>
                  <div>
                    <span style="color:#64748b; font-size:9.5px;">الإجمالي المدفوع:</span>
                    <div style="font-weight:800; color:#b45309;">12.94 ر.س (شامل الخصم)</div>
                  </div>
                </div>

                <div style="text-align:center; padding:8px 0; border-top:2px dashed #cbd5e1;">
                  <svg width="80" height="80" viewBox="0 0 200 200" fill="none" style="margin:0 auto; display:block;">
                    <rect width="200" height="200" fill="white" rx="10"/>
                    <rect x="20" y="20" width="45" height="45" rx="6" fill="#116E63"/>
                    <rect x="28" y="28" width="29" height="29" rx="3" fill="white"/>
                    <rect x="34" y="34" width="17" height="17" rx="2" fill="#116E63"/>
                    <rect x="135" y="20" width="45" height="45" rx="6" fill="#116E63"/>
                    <rect x="143" y="28" width="29" height="29" rx="3" fill="white"/>
                    <rect x="149" y="34" width="17" height="17" rx="2" fill="#116E63"/>
                    <rect x="20" y="135" width="45" height="45" rx="6" fill="#116E63"/>
                    <rect x="28" y="143" width="29" height="29" rx="3" fill="white"/>
                    <rect x="34" y="149" width="17" height="17" rx="2" fill="#116E63"/>
                    <circle cx="90" cy="90" r="10" fill="#d7a237"/>
                  </svg>
                  <span style="font-size:9.5px; color:#64748b; font-family:var(--font-mono); margin-top:3px; display:block;">مسح الباركود على قارئ البوابة</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Specs Panel -->
        <div class="figma-inspect-panel">
          <div class="inspect-panel-header">
            <span class="inspect-panel-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--figma-blue)" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
              <span>Booking Engine & Pass Cryptography Specifications</span>
            </span>
            <span class="frame-spec-chip">HMAC-SHA256 Signed QR</span>
          </div>
          <div class="token-grid">
            <div class="token-item"><span class="token-name">tariff-rates</span><span class="token-val">Hourly: 5.75 SAR | Cap: 15 SAR | Monthly: 225 SAR</span></div>
            <div class="token-item"><span class="token-name">qr-security</span><span class="token-val">Rotating dynamic token (valid for 60s at barrier)</span></div>
            <div class="token-item"><span class="token-name">payment-gateway</span><span class="token-val">Mada, Apple Pay, STC Pay, University Wallet</span></div>
            <div class="token-item"><span class="token-name">cancellation-sla</span><span class="token-val">100% refund up to 10 min prior to booked slot</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====================================================================
         SECTION 08: SHARE & EARN FLEXIBLE SWAPPING HUB (DUAL THEME)
         ==================================================================== -->
    <section id="f-share">
      <div class="board-section-header">
        <div class="board-title">
          <h2>08. بوابة شارك واربح بالتبادل الذكي (Share & Earn Crowdsourced Portal)</h2>
          <span class="board-tag">Dual-Theme Student Monetization Hub</span>
        </div>
      </div>

      <div class="figma-dual-container">
        <!-- Frame 08-A: Dark Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 08-Share-Dark / Break Hours Slider & Instant Wallet Credit Formula</span>
              <span class="frame-theme-badge theme-badge-dark">🌙 Dark Theme</span>
              <span class="frame-size-badge">1440 × 440</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">Cashback Engine</span></div>
          </div>
          <div class="figma-frame-body-dark">
            <div class="responsive-split-2col">
              <div style="background:#0f2420; border:1px solid #1e3d36; border-radius:12px; padding:16px;">
                <h4 style="font-size:13px; font-weight:800; color:var(--fbsu-gold); margin-bottom:10px;">كم ساعة بريك لديك اليوم؟</h4>
                <p style="font-size:11.5px; color:#cbd5e1; margin-bottom:14px;">حدد الساعات التي لن تتواجد فيها بالجامعة ليتم فتح الموقف واسترداد الكاشباك فوراً:</p>
                <div class="btn-cluster-wrap" style="margin-bottom:16px;">
                  <span style="background:var(--fbsu-teal); color:#fff; padding:6px 12px; border-radius:6px; font-weight:700; font-size:11.5px;">ساعتان (11.50 ر.س)</span>
                  <span style="background:var(--fbsu-gold); color:#000; padding:6px 12px; border-radius:6px; font-weight:800; font-size:11.5px; box-shadow:0 0 10px rgba(215,162,55,0.4);">3.5 ساعات (17.25 ر.س)</span>
                  <span style="background:#142824; border:1px solid #204038; color:#fff; padding:6px 12px; border-radius:6px; font-size:11.5px;">5 ساعات (28.75 ر.س)</span>
                </div>
                <button class="btn btn-gold-accent" style="width:100%;">تأكيد فتح الموقف لمبادرة التبادل الذكي</button>
              </div>

              <div style="background:linear-gradient(135deg, rgba(215,162,55,0.2) 0%, #0a1614 100%); border:1px solid rgba(215,162,55,0.4); border-radius:12px; padding:16px; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <span style="font-size:11.5px; color:#cbd5e1;">العائد المالي المتوقع إيداعه بمحفظتك:</span>
                  <div style="font-family:var(--font-mono); font-size:28px; font-weight:900; color:var(--fbsu-gold); margin:4px 0;">+17.25 ر.س</div>
                  <p style="font-size:11px; color:#94a3b8;">تُضاف مباشرة بعد خروجك من البوابة ورصد كاميرات ALPR لسيارتك.</p>
                </div>
                <div style="font-size:10.5px; color:#10b981; background:rgba(16,185,129,0.15); padding:8px 10px; border-radius:6px; border:1px solid rgba(16,185,129,0.3); margin-top:10px;">
                  ✓ خفضت تكلفة اشتراكك هذا الشهر بنسبة 45%! بالإضافة إلى حجز مقعدك بضمان 100% عند العودة.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Frame 08-B: Light Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 08-Share-Light / Break Hours Slider & Instant Wallet Credit Formula</span>
              <span class="frame-theme-badge theme-badge-light">☀️ Light Theme</span>
              <span class="frame-size-badge">1440 × 440</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">Monetization Card</span></div>
          </div>
          <div class="figma-frame-body-light">
            <div class="responsive-split-2col">
              <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:16px; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
                <h4 style="font-size:13px; font-weight:800; color:#b45309; margin-bottom:10px;">كم ساعة بريك لديك اليوم؟</h4>
                <p style="font-size:11.5px; color:#475569; margin-bottom:14px;">حدد الساعات التي لن تتواجد فيها بالجامعة ليتم فتح الموقف واسترداد الكاشباك فوراً:</p>
                <div class="btn-cluster-wrap" style="margin-bottom:16px;">
                  <span style="background:var(--fbsu-teal); color:#fff; padding:6px 12px; border-radius:6px; font-weight:700; font-size:11.5px;">ساعتان (11.50 ر.س)</span>
                  <span style="background:var(--fbsu-gold); color:#000; padding:6px 12px; border-radius:6px; font-weight:800; font-size:11.5px; box-shadow:0 2px 8px rgba(215,162,55,0.3);">3.5 ساعات (17.25 ر.س)</span>
                  <span style="background:#f1f5f9; border:1px solid #cbd5e1; color:#334155; padding:6px 12px; border-radius:6px; font-size:11.5px;">5 ساعات (28.75 ر.س)</span>
                </div>
                <button class="btn btn-gold-accent" style="width:100%;">تأكيد فتح الموقف لمبادرة التبادل الذكي</button>
              </div>

              <div style="background:linear-gradient(135deg, #fffbeb 0%, #ffffff 100%); border:1.5px solid rgba(215,162,55,0.4); border-radius:12px; padding:16px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 4px 15px rgba(215,162,55,0.06);">
                <div>
                  <span style="font-size:11.5px; color:#475569;">العائد المالي المتوقع إيداعه بمحفظتك:</span>
                  <div style="font-family:var(--font-mono); font-size:28px; font-weight:900; color:#b45309; margin:4px 0;">+17.25 ر.س</div>
                  <p style="font-size:11px; color:#64748b;">تُضاف مباشرة بعد خروجك من البوابة ورصد كاميرات ALPR لسيارتك.</p>
                </div>
                <div style="font-size:10.5px; color:#059669; background:#ecfdf5; border:1px solid #a7f3d0; padding:8px 10px; border-radius:6px; font-weight:700; margin-top:10px;">
                  ✓ خفضت تكلفة اشتراكك هذا الشهر بنسبة 45%! بالإضافة إلى حجز مقعدك بضمان 100% عند العودة.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Specs Panel -->
        <div class="figma-inspect-panel">
          <div class="inspect-panel-header">
            <span class="inspect-panel-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--figma-blue)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><line x1="12" y1="18" x2="12" y2="20"/><line x1="12" y1="4" x2="12" y2="6"/></svg>
              <span>Share & Earn Formula & Campus Return SLA</span>
            </span>
            <span class="frame-spec-chip">Cashback Multiplier</span>
          </div>
          <div class="token-grid">
            <div class="token-item"><span class="token-name">cashback-equation</span><span class="token-val">Credit = Duration (hrs) × 5.75 SAR × 0.85 (Host share)</span></div>
            <div class="token-item"><span class="token-name">host-payout-speed</span><span class="token-val">Instant upon ALPR camera exit detection</span></div>
            <div class="token-item"><span class="token-name">guaranteed-spot-buffer</span><span class="token-val">System reserves new bay 15 mins before student return</span></div>
            <div class="token-item"><span class="token-name">no-penalty-grace</span><span class="token-val">20-minute traffic delay tolerance without charges</span></div>
          </div>
        </div>
      </div>
    </section>
    """
