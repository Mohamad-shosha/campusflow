# -*- coding: utf-8 -*-
"""
Full System Generator for Master Figma Showcase
Assembles Sections 04 through 15 and stitches the complete HTML file.
"""

def get_sensor_code():
    return """
    <!-- ====================================================================
         SECTION 04: SPOT DETAILS MODAL & IOT SENSOR (DUAL THEME)
         ==================================================================== -->
    <section id="f-sensor">
      <div class="board-section-header">
        <div class="board-title">
          <h2>04. بطاقة وحساس الموقف الأرضي (Spot Detail & IoT Sensor Telemetry)</h2>
          <span class="board-tag">Dual-Theme IoT Diagnostic</span>
        </div>
      </div>

      <div class="figma-dual-container">
        <!-- Frame 04-A: Dark Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 04-Spot-Modal-Dark / In-Ground IoT Sensor Inspection & Occupancy Telemetry</span>
              <span class="frame-theme-badge theme-badge-dark">🌙 Dark Theme</span>
              <span class="frame-size-badge">560 × 540</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">MQTT Live Stream (2.4 GHz)</span></div>
          </div>
          <div class="figma-frame-body-dark" style="display:flex; justify-content:center; padding:30px;">
            <div style="background:#0c1a18; border:1px solid rgba(17,110,99,0.5); border-radius:14px; padding:24px; width:100%; max-width:540px; box-shadow:0 16px 40px rgba(0,0,0,0.6);">
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:12px; margin-bottom:16px;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <span style="font-family:var(--font-mono); font-size:22px; font-weight:900; color:#fff;">موقف #01</span>
                  <span class="status-pill pill-flex">متاح للتبادل الذكي</span>
                </div>
                <span style="font-size:12px; color:#94a3b8;">القطاع: A - الحاسب والهندسة</span>
              </div>

              <!-- Ultrasonic Sensor Gauge -->
              <div style="background:#0f2420; border:1px solid #1c3b35; border-radius:10px; padding:16px; margin-bottom:16px;">
                <div style="font-size:12px; font-weight:700; color:var(--fbsu-gold); margin-bottom:10px; display:flex; justify-content:space-between;">
                  <span>قراءات المستشعر الأرضي بالموجات فوق الصوتية (40kHz):</span>
                  <span style="color:#10b981; font-weight:800;">متصل 100%</span>
                </div>
                <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:10px; text-align:center;">
                  <div style="background:rgba(0,0,0,0.3); padding:8px; border-radius:6px;">
                    <div style="font-size:10px; color:#888;">المسافة</div>
                    <div style="font-family:var(--font-mono); font-weight:800; color:#fff; font-size:13px;">25.4 سم</div>
                  </div>
                  <div style="background:rgba(0,0,0,0.3); padding:8px; border-radius:6px;">
                    <div style="font-size:10px; color:#888;">البطارية</div>
                    <div style="font-family:var(--font-mono); font-weight:800; color:#10b981; font-size:13px;">98%</div>
                  </div>
                  <div style="background:rgba(0,0,0,0.3); padding:8px; border-radius:6px;">
                    <div style="font-size:10px; color:#888;">الإشارة</div>
                    <div style="font-family:var(--font-mono); font-weight:800; color:var(--figma-blue); font-size:13px;">-42 dBm</div>
                  </div>
                  <div style="background:rgba(0,0,0,0.3); padding:8px; border-radius:6px;">
                    <div style="font-size:10px; color:#888;">الحرارة</div>
                    <div style="font-family:var(--font-mono); font-weight:800; color:#f59e0b; font-size:13px;">26.8°C</div>
                  </div>
                </div>
              </div>

              <!-- Driver details -->
              <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:12px 16px; margin-bottom:16px;">
                <div>
                  <div style="font-size:12px; color:#888;">الطالب الأساسي:</div>
                  <div style="font-weight:700; color:#fff; font-size:13px;">إياد الحربي (غادر في بريك)</div>
                  <div style="font-size:11px; color:var(--fbsu-gold); margin-top:2px;">النافذة الشاغرة: 10:00 ص - 01:30 م</div>
                </div>
                <span class="saudi-plate" style="height:36px;">
                  <div class="plate-letters-section"><span class="plate-ar" style="font-size:11px;">ب ط ك</span></div>
                  <div class="plate-digits-section"><span class="plate-ar" style="font-size:11px;">١ ٢ ٣ ٤</span></div>
                  <div class="plate-emblem" style="font-size:7px;">🇸🇦</div>
                </span>
              </div>

              <div style="display:flex; gap:10px;">
                <button class="btn btn-gold-accent" style="flex:1;">حجز هذا الموقف الشاغر (5.75 ر.س/س)</button>
                <button class="btn btn-ghost-outline-dark" style="flex:1;">تشغيل التوجيه الملاحي GPS</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Frame 04-B: Light Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 04-Spot-Modal-Light / In-Ground IoT Sensor Inspection & Occupancy Telemetry</span>
              <span class="frame-theme-badge theme-badge-light">☀️ Light Theme</span>
              <span class="frame-size-badge">560 × 540</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">High-Contrast Diagnostic</span></div>
          </div>
          <div class="figma-frame-body-light" style="display:flex; justify-content:center; padding:30px;">
            <div style="background:#ffffff; border:1.5px solid rgba(17,110,99,0.3); border-radius:14px; padding:24px; width:100%; max-width:540px; box-shadow:0 12px 30px rgba(17,110,99,0.08);">
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; padding-bottom:12px; margin-bottom:16px;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <span style="font-family:var(--font-mono); font-size:22px; font-weight:900; color:#116E63;">موقف #01</span>
                  <span class="status-pill pill-flex">متاح للتبادل الذكي</span>
                </div>
                <span style="font-size:12px; color:#64748b; font-weight:700;">القطاع: A - الحاسب والهندسة</span>
              </div>

              <!-- Ultrasonic Sensor Gauge Light -->
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:16px; margin-bottom:16px;">
                <div style="font-size:12px; font-weight:800; color:#b45309; margin-bottom:10px; display:flex; justify-content:space-between;">
                  <span>قراءات المستشعر الأرضي بالموجات فوق الصوتية (40kHz):</span>
                  <span style="color:#059669; font-weight:800;">متصل 100%</span>
                </div>
                <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:10px; text-align:center;">
                  <div style="background:#ffffff; border:1px solid #e2e8f0; padding:8px; border-radius:6px;">
                    <div style="font-size:10px; color:#64748b;">المسافة</div>
                    <div style="font-family:var(--font-mono); font-weight:800; color:#0f172a; font-size:13px;">25.4 سم</div>
                  </div>
                  <div style="background:#ffffff; border:1px solid #e2e8f0; padding:8px; border-radius:6px;">
                    <div style="font-size:10px; color:#64748b;">البطارية</div>
                    <div style="font-family:var(--font-mono); font-weight:800; color:#059669; font-size:13px;">98%</div>
                  </div>
                  <div style="background:#ffffff; border:1px solid #e2e8f0; padding:8px; border-radius:6px;">
                    <div style="font-size:10px; color:#64748b;">الإشارة</div>
                    <div style="font-family:var(--font-mono); font-weight:800; color:#0284c7; font-size:13px;">-42 dBm</div>
                  </div>
                  <div style="background:#ffffff; border:1px solid #e2e8f0; padding:8px; border-radius:6px;">
                    <div style="font-size:10px; color:#64748b;">الحرارة</div>
                    <div style="font-family:var(--font-mono); font-weight:800; color:#d97706; font-size:13px;">26.8°C</div>
                  </div>
                </div>
              </div>

              <!-- Driver details Light -->
              <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px 16px; margin-bottom:16px;">
                <div>
                  <div style="font-size:12px; color:#64748b;">الطالب الأساسي:</div>
                  <div style="font-weight:700; color:#0f172a; font-size:13px;">إياد الحربي (غادر في بريك)</div>
                  <div style="font-size:11px; color:#b45309; font-weight:700; margin-top:2px;">النافذة الشاغرة: 10:00 ص - 01:30 م</div>
                </div>
                <span class="saudi-plate" style="height:36px;">
                  <div class="plate-letters-section"><span class="plate-ar" style="font-size:11px;">ب ط ك</span></div>
                  <div class="plate-digits-section"><span class="plate-ar" style="font-size:11px;">١ ٢ ٣ ٤</span></div>
                  <div class="plate-emblem" style="font-size:7px;">🇸🇦</div>
                </span>
              </div>

              <div style="display:flex; gap:10px;">
                <button class="btn btn-gold-accent" style="flex:1;">حجز هذا الموقف الشاغر (5.75 ر.س/س)</button>
                <button class="btn btn-ghost-outline-light" style="flex:1;">تشغيل التوجيه الملاحي GPS</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Specs Panel -->
        <div class="figma-inspect-panel">
          <div class="inspect-panel-header">
            <span class="inspect-panel-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--figma-blue)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              <span>IoT Hardware Specification & Protocol</span>
            </span>
            <span class="frame-spec-chip">LoRaWAN + MQTT Telemetry</span>
          </div>
          <div class="token-grid">
            <div class="token-item"><span class="token-name">sensor-frequency</span><span class="token-val">40 kHz Ultrasonic Dual-Transducer</span></div>
            <div class="token-item"><span class="token-name">detection-range</span><span class="token-val">10 cm - 300 cm (±1 cm precision)</span></div>
            <div class="token-item"><span class="token-name">battery-life</span><span class="token-val">5+ Years (Li-SOCl2 3.6V Battery)</span></div>
            <div class="token-item"><span class="token-name">housing-rating</span><span class="token-val">IP68 Waterproof / 5-Ton Impact Resistant</span></div>
          </div>
        </div>
      </div>
    </section>
    """

print("Section 04 defined.")
