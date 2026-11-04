# -*- coding: utf-8 -*-
import os

def build_full_html():
    from generate_master_showcase import build_showcase_html
    from generate_all import get_header_code
    from generate_sections import get_hero_code, get_grid_code
    from generate_full_system import get_sensor_code

    html = []
    html.append(build_showcase_html())
    html.append(get_header_code())
    html.append(get_hero_code())
    html.append(get_grid_code())
    html.append(get_sensor_code())

    # ====================================================================
    # SECTION 05: THE EYAD & RAKAN SIMULATION ARENA (DUAL THEME)
    # ====================================================================
    html.append("""
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
            <!-- Timeline Dark -->
            <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:8px; margin-bottom:20px;">
              <div style="background:#132a25; border:1px solid var(--fbsu-teal); border-radius:8px; padding:8px 12px;">
                <span style="font-family:var(--font-mono); font-size:10px; color:var(--fbsu-gold);">09:45 AM</span>
                <div style="font-size:12px; font-weight:700; color:#fff;">1. إياد بالمحاضرة</div>
              </div>
              <div style="background:#132a25; border:1px solid var(--fbsu-teal); border-radius:8px; padding:8px 12px;">
                <span style="font-family:var(--font-mono); font-size:10px; color:var(--fbsu-gold);">10:00 AM</span>
                <div style="font-size:12px; font-weight:700; color:#fff;">2. خروج إياد في بريك</div>
              </div>
              <div style="background:var(--fbsu-teal); border-radius:8px; padding:8px 12px; box-shadow:0 0 15px rgba(17,110,99,0.5);">
                <span style="font-family:var(--font-mono); font-size:10px; color:#fef08a;">10:05 AM (الخطوة الحالية)</span>
                <div style="font-size:12px; font-weight:800; color:#fff;">3. مطابقة جدول راكان</div>
              </div>
              <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:8px 12px;">
                <span style="font-family:var(--font-mono); font-size:10px; color:#888;">10:15 AM</span>
                <div style="font-size:12px; font-weight:700; color:#888;">4. وصول راكان للبوابة</div>
              </div>
              <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:8px 12px;">
                <span style="font-family:var(--font-mono); font-size:10px; color:#888;">01:30 PM</span>
                <div style="font-size:12px; font-weight:700; color:#888;">5. عودة إياد + كاشباك</div>
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
              <div style="background:radial-gradient(circle, rgba(17,110,99,0.2) 0%, #0c1a18 70%); border:1px solid rgba(17,110,99,0.4); border-radius:12px; padding:24px; text-align:center;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                  <span style="font-size:12px; font-weight:800; color:var(--fbsu-gold);">موقف #01 - كلية الهندسة</span>
                  <span class="status-pill pill-flex">حجز ذكي مؤكد لراكان</span>
                </div>
                <div style="width:110px; height:150px; margin:10px auto;">
                  <svg viewBox="0 0 100 160" width="100%" height="100%"><rect x="18" y="10" width="64" height="135" rx="24" fill="#0b6d87" stroke="#ffffff" stroke-width="2"/><ellipse cx="50" cy="50" rx="20" ry="12" fill="#072023"/></svg>
                </div>
                <div style="font-weight:800; font-size:16px; color:#fff;">سيارة راكان المطيري (سوناتا)</div>
                <div style="font-size:12px; color:#94a3b8; margin-top:4px;">اللوحة: د ل س 8892 | الكلاس: 10:15 ص</div>
                <div style="display:flex; justify-content:center; gap:16px; margin-top:16px; font-size:12px;">
                  <span style="background:rgba(16,185,129,0.15); color:#10b981; padding:4px 10px; border-radius:6px; font-weight:700;">+100% استغلال السعة</span>
                  <span style="background:rgba(215,162,55,0.15); color:var(--fbsu-gold); padding:4px 10px; border-radius:6px; font-weight:700;">17.25 ر.س كاشباك لإياد</span>
                </div>
              </div>

              <div style="display:flex; flex-direction:column; justify-content:space-between;">
                <div style="background:#0f2420; border:1px solid #1e3d36; border-radius:10px; padding:16px; margin-bottom:16px;">
                  <div style="font-size:13px; font-weight:800; color:var(--fbsu-gold); margin-bottom:6px;">الذكاء الاصطناعي يطابق جدول راكان:</div>
                  <p style="font-size:12.5px; color:#cbd5e1; line-height:1.6;">
                    الذكاء الاصطناعي المرتبط بالبوابة حلل جداول الطلاب واكتشف أن راكان لديه كلاس الساعة 10:15 ص في كلية الحاسب. أرسل النظام فوراً إشعاراً لهاتفه: "تم حجز موقف رقم #01 لك حتى 01:00 م بتعرفة ذكية مخفضة 5.75 ر.س/ساعة"!
                  </p>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
                  <div style="background:#0a1614; border:1px solid #1a302c; border-radius:8px; padding:12px;">
                    <div style="font-weight:700; font-size:13px; color:#fff;">إياد الحربي (هندسة)</div>
                    <div style="font-size:11px; color:#888;">الحالة: في بريك (3.5 ساعات)</div>
                    <div style="font-size:11px; color:var(--fbsu-gold); margin-top:2px;">يكسب: 17.25 ر.س بالمحفظة</div>
                  </div>
                  <div style="background:#0a1614; border:1px solid var(--fbsu-teal); border-radius:8px; padding:12px;">
                    <div style="font-weight:700; font-size:13px; color:#fff;">راكان المطيري (حاسب)</div>
                    <div style="font-size:11px; color:#888;">الحالة: تم توجيهه لموقف #01</div>
                    <div style="font-size:11px; color:#10b981; margin-top:2px;">وقت البحث: 0 ثانية</div>
                  </div>
                </div>
                <div style="display:flex; gap:10px;">
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
            <!-- Timeline Light -->
            <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:8px; margin-bottom:20px;">
              <div style="background:#e8f4f2; border:1.5px solid var(--fbsu-teal); border-radius:8px; padding:8px 12px;">
                <span style="font-family:var(--font-mono); font-size:10px; color:#b45309; font-weight:800;">09:45 AM</span>
                <div style="font-size:12px; font-weight:700; color:#0d554c;">1. إياد بالمحاضرة</div>
              </div>
              <div style="background:#e8f4f2; border:1.5px solid var(--fbsu-teal); border-radius:8px; padding:8px 12px;">
                <span style="font-family:var(--font-mono); font-size:10px; color:#b45309; font-weight:800;">10:00 AM</span>
                <div style="font-size:12px; font-weight:700; color:#0d554c;">2. خروج إياد في بريك</div>
              </div>
              <div style="background:var(--fbsu-teal); border-radius:8px; padding:8px 12px; box-shadow:0 4px 12px rgba(17,110,99,0.3);">
                <span style="font-family:var(--font-mono); font-size:10px; color:#fef08a; font-weight:800;">10:05 AM (الخطوة الحالية)</span>
                <div style="font-size:12px; font-weight:800; color:#fff;">3. مطابقة جدول راكان</div>
              </div>
              <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:8px 12px;">
                <span style="font-family:var(--font-mono); font-size:10px; color:#64748b;">10:15 AM</span>
                <div style="font-size:12px; font-weight:700; color:#64748b;">4. وصول راكان للبوابة</div>
              </div>
              <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:8px 12px;">
                <span style="font-family:var(--font-mono); font-size:10px; color:#64748b;">01:30 PM</span>
                <div style="font-size:12px; font-weight:700; color:#64748b;">5. عودة إياد + كاشباك</div>
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
              <div style="background:#ffffff; border:1.5px solid rgba(17,110,99,0.25); border-radius:12px; padding:24px; text-align:center; box-shadow:0 8px 24px rgba(17,110,99,0.06);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                  <span style="font-size:12px; font-weight:800; color:#b45309;">موقف #01 - كلية الهندسة</span>
                  <span class="status-pill pill-flex">حجز ذكي مؤكد لراكان</span>
                </div>
                <div style="width:110px; height:150px; margin:10px auto;">
                  <svg viewBox="0 0 100 160" width="100%" height="100%"><rect x="18" y="10" width="64" height="135" rx="24" fill="#0b6d87" stroke="#ffffff" stroke-width="2"/><ellipse cx="50" cy="50" rx="20" ry="12" fill="#072023"/></svg>
                </div>
                <div style="font-weight:800; font-size:16px; color:#0f172a;">سيارة راكان المطيري (سوناتا)</div>
                <div style="font-size:12px; color:#64748b; margin-top:4px;">اللوحة: د ل س 8892 | الكلاس: 10:15 ص</div>
                <div style="display:flex; justify-content:center; gap:16px; margin-top:16px; font-size:12px;">
                  <span style="background:rgba(16,185,129,0.12); color:#059669; padding:4px 10px; border-radius:6px; font-weight:800;">+100% استغلال السعة</span>
                  <span style="background:rgba(215,162,55,0.15); color:#a16207; padding:4px 10px; border-radius:6px; font-weight:800;">17.25 ر.س كاشباك لإياد</span>
                </div>
              </div>

              <div style="display:flex; flex-direction:column; justify-content:space-between;">
                <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:16px; margin-bottom:16px; box-shadow:0 4px 12px rgba(0,0,0,0.03);">
                  <div style="font-size:13px; font-weight:800; color:#b45309; margin-bottom:6px;">الذكاء الاصطناعي يطابق جدول راكان:</div>
                  <p style="font-size:12.5px; color:#334155; line-height:1.6;">
                    الذكاء الاصطناعي المرتبط بالبوابة حلل جداول الطلاب واكتشف أن راكان لديه كلاس الساعة 10:15 ص في كلية الحاسب. أرسل النظام فوراً إشعاراً لهاتفه: "تم حجز موقف رقم #01 لك حتى 01:00 م بتعرفة ذكية مخفضة 5.75 ر.س/ساعة"!
                  </p>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
                  <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">
                    <div style="font-weight:700; font-size:13px; color:#0f172a;">إياد الحربي (هندسة)</div>
                    <div style="font-size:11px; color:#64748b;">الحالة: في بريك (3.5 ساعات)</div>
                    <div style="font-size:11px; color:#b45309; font-weight:700; margin-top:2px;">يكسب: 17.25 ر.س بالمحفظة</div>
                  </div>
                  <div style="background:#f8fafc; border:1.5px solid var(--fbsu-teal); border-radius:8px; padding:12px;">
                    <div style="font-weight:700; font-size:13px; color:#0f172a;">راكان المطيري (حاسب)</div>
                    <div style="font-size:11px; color:#64748b;">الحالة: تم توجيهه لموقف #01</div>
                    <div style="font-size:11px; color:#059669; font-weight:700; margin-top:2px;">وقت البحث: 0 ثانية</div>
                  </div>
                </div>
                <div style="display:flex; gap:10px;">
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
    """)

    # ====================================================================
    # SECTION 06: ALPR SMART GATE VISION & NEURAL RECOGNITION (DUAL THEME)
    # ====================================================================
    html.append("""
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
            <div style="display:grid; grid-template-columns:1.1fr 0.9fr; gap:24px;">
              <div style="background:#000; border:2px solid #222; border-radius:12px; position:relative; overflow:hidden; min-height:290px; display:flex; flex-direction:column; justify-content:space-between; padding:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; font-family:var(--font-mono); font-size:11px;">
                  <span style="color:#ff3344; display:flex; align-items:center; gap:6px;">
                    <span style="width:8px; height:8px; background:#ff3344; border-radius:50%; box-shadow:0 0 8px #ff3344;"></span>
                    <span>LIVE: CAM-01 (MAIN_NORTH_GATE_FBSU)</span>
                  </span>
                  <span style="color:#888;">60 FPS | 4K HDR | AI CONFIDENCE: 99.8%</span>
                </div>
                <div style="border:2px dashed #0d99ff; border-radius:8px; width:260px; height:90px; margin:0 auto; display:flex; align-items:center; justify-content:center; position:relative; box-shadow:0 0 25px rgba(13,153,255,0.3);">
                  <div style="position:absolute; top:0; left:0; right:0; height:2px; background:#0d99ff; box-shadow:0 0 10px #0d99ff;"></div>
                  <span class="saudi-plate" style="transform:scale(1.15);">
                    <div class="plate-letters-section"><span class="plate-ar">د ل س</span><span class="plate-en">D L S</span></div>
                    <div class="plate-digits-section"><span class="plate-ar">٨ ٨ ٩ ٢</span><span class="plate-en">8 8 9 2</span></div>
                    <div class="plate-emblem"><span>KSA</span><span>🇸🇦</span></div>
                  </span>
                </div>
                <div style="display:flex; align-items:center; gap:16px; background:rgba(255,255,255,0.05); padding:10px 14px; border-radius:8px;">
                  <div style="width:16px; height:32px; background:#444; border-radius:4px; display:flex; align-items:center; justify-content:center;">
                    <span style="width:8px; height:8px; border-radius:50%; background:#10b981; box-shadow:0 0 10px #10b981;"></span>
                  </div>
                  <div style="height:6px; flex:1; background:repeating-linear-gradient(45deg, #ef4444, #ef4444 10px, #ffffff 10px, #ffffff 20px); border-radius:3px;"></div>
                  <span style="color:#10b981; font-weight:800; font-size:12px;">البوابة مفتوحة (90°) - تفضل بالدخول</span>
                </div>
              </div>

              <div style="display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <h4 style="font-size:14px; font-weight:800; color:#fff; margin-bottom:12px;">فحص مطابقة السيارات المصرحة:</h4>
                  <div style="display:flex; flex-direction:column; gap:8px;">
                    <div style="background:#0f2420; border:1px solid #1a3c34; border-radius:8px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
                      <div>
                        <div style="font-weight:700; font-size:12.5px; color:#fff;">سيارة إياد الحربي (كامري)</div>
                        <div style="font-size:11px; color:#888;">لوحة: ب ط ك 1234 - موقف #01</div>
                      </div>
                      <span class="status-pill pill-available">مصرّح</span>
                    </div>
                    <div style="background:#0f2420; border:1px solid var(--fbsu-gold); border-radius:8px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
                      <div>
                        <div style="font-weight:700; font-size:12.5px; color:#fff;">سيارة راكان المطيري (سوناتا)</div>
                        <div style="font-size:11px; color:var(--fbsu-gold);">لوحة: د ل س 8892 - حجز تبادل ذكي</div>
                      </div>
                      <span class="status-pill pill-flex">تبادل نشط</span>
                    </div>
                    <div style="background:#0f2420; border:1px solid #1a3c34; border-radius:8px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
                      <div>
                        <div style="font-weight:700; font-size:12.5px; color:#fff;">سيارة د. عبد الله الغامدي (جينيسيس)</div>
                        <div style="font-size:11px; color:#888;">لوحة: أ ح م 5501 - موقف #19 (دكاترة)</div>
                      </div>
                      <span class="status-pill pill-faculty">VIP كادر</span>
                    </div>
                  </div>
                </div>
                <div style="display:flex; gap:10px; margin-top:14px;">
                  <button class="btn btn-teal-primary" style="flex:1;">إعادة المسح الضوئي (Re-scan)</button>
                  <button class="btn btn-ghost-outline-dark">فتح الطوارئ اليدوي</button>
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
            <div style="display:grid; grid-template-columns:1.1fr 0.9fr; gap:24px;">
              <div style="background:#1e293b; border:2px solid #cbd5e1; border-radius:12px; position:relative; overflow:hidden; min-height:290px; display:flex; flex-direction:column; justify-content:space-between; padding:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; font-family:var(--font-mono); font-size:11px;">
                  <span style="color:#f87171; display:flex; align-items:center; gap:6px; font-weight:800;">
                    <span style="width:8px; height:8px; background:#ef4444; border-radius:50%;"></span>
                    <span>LIVE: CAM-01 (MAIN_NORTH_GATE_FBSU)</span>
                  </span>
                  <span style="color:#cbd5e1;">60 FPS | 4K HDR | CONFIDENCE: 99.8%</span>
                </div>
                <div style="border:2px dashed #38bdf8; border-radius:8px; width:260px; height:90px; margin:0 auto; display:flex; align-items:center; justify-content:center; position:relative; box-shadow:0 0 20px rgba(56,189,248,0.25);">
                  <div style="position:absolute; top:0; left:0; right:0; height:2px; background:#38bdf8;"></div>
                  <span class="saudi-plate" style="transform:scale(1.15);">
                    <div class="plate-letters-section"><span class="plate-ar">د ل س</span><span class="plate-en">D L S</span></div>
                    <div class="plate-digits-section"><span class="plate-ar">٨ ٨ ٩ ٢</span><span class="plate-en">8 8 9 2</span></div>
                    <div class="plate-emblem"><span>KSA</span><span>🇸🇦</span></div>
                  </span>
                </div>
                <div style="display:flex; align-items:center; gap:16px; background:#ffffff; padding:10px 14px; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
                  <div style="width:16px; height:32px; background:#334155; border-radius:4px; display:flex; align-items:center; justify-content:center;">
                    <span style="width:8px; height:8px; border-radius:50%; background:#10b981;"></span>
                  </div>
                  <div style="height:6px; flex:1; background:repeating-linear-gradient(45deg, #ef4444, #ef4444 10px, #ffffff 10px, #ffffff 20px); border-radius:3px;"></div>
                  <span style="color:#059669; font-weight:800; font-size:12px;">البوابة مفتوحة (90°) - تفضل بالدخول</span>
                </div>
              </div>

              <div style="display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <h4 style="font-size:14px; font-weight:800; color:#0f172a; margin-bottom:12px;">فحص مطابقة السيارات المصرحة:</h4>
                  <div style="display:flex; flex-direction:column; gap:8px;">
                    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
                      <div>
                        <div style="font-weight:700; font-size:12.5px; color:#0f172a;">سيارة إياد الحربي (كامري)</div>
                        <div style="font-size:11px; color:#64748b;">لوحة: ب ط ك 1234 - موقف #01</div>
                      </div>
                      <span class="status-pill pill-available">مصرّح</span>
                    </div>
                    <div style="background:#ffffff; border:1.5px solid rgba(215,162,55,0.6); border-radius:8px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
                      <div>
                        <div style="font-weight:700; font-size:12.5px; color:#0f172a;">سيارة راكان المطيري (سوناتا)</div>
                        <div style="font-size:11px; color:#b45309; font-weight:700;">لوحة: د ل س 8892 - حجز تبادل ذكي</div>
                      </div>
                      <span class="status-pill pill-flex">تبادل نشط</span>
                    </div>
                    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
                      <div>
                        <div style="font-weight:700; font-size:12.5px; color:#0f172a;">سيارة د. عبد الله الغامدي (جينيسيس)</div>
                        <div style="font-size:11px; color:#64748b;">لوحة: أ ح م 5501 - موقف #19 (دكاترة)</div>
                      </div>
                      <span class="status-pill pill-faculty">VIP كادر</span>
                    </div>
                  </div>
                </div>
                <div style="display:flex; gap:10px; margin-top:14px;">
                  <button class="btn btn-teal-primary" style="flex:1;">إعادة المسح الضوئي (Re-scan)</button>
                  <button class="btn btn-ghost-outline-light">فتح الطوارئ اليدوي</button>
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
    """)

    # Let's save progress
    print("Sections 05 and 06 added.")
    return "".join(html)

if __name__ == '__main__':
    print("Generator part 1 ready.")
