# -*- coding: utf-8 -*-
"""
Helper file containing all 15 master sections for the Figma UI/UX Showcase.
"""

def get_hero_code():
    return """
    <!-- ====================================================================
         SECTION 02: HERO SECTION & REALTIME HUD TELEMETRY (DUAL THEME)
         ==================================================================== -->
    <section id="f-hero">
      <div class="board-section-header">
        <div class="board-title">
          <h2>02. الواجهة الرئيسية والعدادات الذكية (Hero Section & Telemetry HUD)</h2>
          <span class="board-tag">Dual-Theme Value Proposition</span>
        </div>
      </div>

      <div class="figma-dual-container">
        <!-- Frame 02-A: Dark Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 02-Hero-Dark / Main Landing Hero & 4-Stat Telemetry Banner</span>
              <span class="frame-theme-badge theme-badge-dark">🌙 Dark Theme</span>
              <span class="frame-size-badge">1440 × 440</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">Radial Emerald Ambient</span></div>
          </div>
          <div class="figma-frame-body-dark" style="background:radial-gradient(ellipse at 80% 20%, rgba(17,110,99,0.35) 0%, #081211 70%);">
            <div style="display:grid; grid-template-columns:1.2fr 0.8fr; gap:32px; align-items:center;">
              <div>
                <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(17,110,99,0.25); border:1px solid var(--fbsu-teal); color:#38c2b0; padding:4px 10px; border-radius:999px; font-size:11.5px; font-weight:700; margin-bottom:12px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span>مبادرة التحول الرقمي بالذكاء الاصطناعي - جامعة فهد بن سلطان</span>
                </div>
                <h1 style="font-family:var(--font-heading); font-size:27px; font-weight:900; color:#fff; line-height:1.3; margin-bottom:12px;">
                  مواقف ذكية بتبادل مرن تلقائي <span style="color:var(--fbsu-gold);">دون إهدار لأي موقف</span>
                </h1>
                <p style="font-size:13px; color:#cbd5e1; line-height:1.6; margin-bottom:20px;">
                  حل هندسي متكامل ينهي أزمة مواقف الجامعة: عندما يغادر الطالب في أوقات البريك (2-4 ساعات)، يتعرف النظام تلقائياً على خروجه عبر كاميرات قراءة اللوحات (ALPR) ويفتح الموقف لزميله القادم للمحاضرة، مع كسب رصيد مكافأة وحجز متوافق مع جداول الكليات!
                </p>
                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                  <button class="btn btn-teal-primary">عرض خريطة المواقف الـ 30</button>
                  <button class="btn btn-gold-accent">تجربة سيناريو التبادل (إياد وراكان)</button>
                  <button class="btn btn-ghost-outline-dark">محاكاة قارئ اللوحات</button>
                </div>
              </div>

              <!-- Flex Card Dark -->
              <div style="background:rgba(15,36,32,0.85); border:1px solid rgba(17,110,99,0.45); border-radius:14px; padding:20px; box-shadow:0 12px 30px rgba(0,0,0,0.5);">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:10px; margin-bottom:14px;">
                  <div style="font-weight:800; font-size:13.5px; color:#fff;">مبدأ التبادل الذكي (Flex Share)</div>
                  <span class="status-pill pill-flex">نشط الآن</span>
                </div>
                <div style="display:flex; flex-direction:column; gap:9px;">
                  <div style="display:flex; gap:10px; align-items:center; background:rgba(0,0,0,0.35); padding:8px 12px; border-radius:8px;">
                    <span style="background:var(--fbsu-teal); color:#fff; width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800;">1</span>
                    <div style="font-size:11.5px;"><strong>رصد خروج إياد:</strong> كاميرا البوابة تقرأ لوحة (ب ط ك 1234) وترصد خروجه في بريك.</div>
                  </div>
                  <div style="display:flex; gap:10px; align-items:center; background:rgba(0,0,0,0.35); padding:8px 12px; border-radius:8px;">
                    <span style="background:var(--fbsu-gold); color:#000; width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800;">2</span>
                    <div style="font-size:11.5px;"><strong>تحويل الموقف #01:</strong> يُفتح الموقف فوراً لمن لديه كلاس بنفس التوقيت.</div>
                  </div>
                  <div style="display:flex; gap:10px; align-items:center; background:rgba(0,0,0,0.35); padding:8px 12px; border-radius:8px;">
                    <span style="background:var(--fbsu-teal); color:#fff; width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800;">3</span>
                    <div style="font-size:11.5px;"><strong>توجيه راكان:</strong> يركن راكان فوراً، ويكسب إياد 17.25 ر.س كاشباك بالمحفظة!</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 4-Stat Telemetry Banner Dark -->
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:14px; margin-top:24px; padding-top:18px; border-top:1px solid rgba(255,255,255,0.08);">
              <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:12px 16px; display:flex; align-items:center; gap:12px;">
                <div style="width:36px; height:36px; border-radius:8px; background:rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; color:#94a3b8;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
                </div>
                <div>
                  <div style="font-family:var(--font-mono); font-size:19px; font-weight:800; color:#fff;">30</div>
                  <div style="font-size:11px; color:#94a3b8;">إجمالي مواقف القطاع</div>
                </div>
              </div>
              <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(16,185,129,0.3); border-radius:10px; padding:12px 16px; display:flex; align-items:center; gap:12px;">
                <div style="width:36px; height:36px; border-radius:8px; background:rgba(16,185,129,0.15); display:flex; align-items:center; justify-content:center; color:#10b981;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div>
                  <div style="font-family:var(--font-mono); font-size:19px; font-weight:800; color:#10b981;">16</div>
                  <div style="font-size:11px; color:#94a3b8;">مواقف شاغرة الآن</div>
                </div>
              </div>
              <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(215,162,55,0.3); border-radius:10px; padding:12px 16px; display:flex; align-items:center; gap:12px;">
                <div style="width:36px; height:36px; border-radius:8px; background:rgba(215,162,55,0.15); display:flex; align-items:center; justify-content:center; color:var(--fbsu-gold);">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                </div>
                <div>
                  <div style="font-family:var(--font-mono); font-size:19px; font-weight:800; color:var(--fbsu-gold);">2</div>
                  <div style="font-size:11px; color:#94a3b8;">مواقف بالتبادل الذكي</div>
                </div>
              </div>
              <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(17,110,99,0.35); border-radius:10px; padding:12px 16px; display:flex; align-items:center; gap:12px;">
                <div style="width:36px; height:36px; border-radius:8px; background:rgba(17,110,99,0.2); display:flex; align-items:center; justify-content:center; color:#38c2b0;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                </div>
                <div>
                  <div style="font-family:var(--font-mono); font-size:19px; font-weight:800; color:#38c2b0;">99.4%</div>
                  <div style="font-size:11px; color:#94a3b8;">دقة قارئ اللوحات ALPR</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Frame 02-B: Light Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 02-Hero-Light / Main Landing Hero & 4-Stat Telemetry Banner</span>
              <span class="frame-theme-badge theme-badge-light">☀️ Light Theme</span>
              <span class="frame-size-badge">1440 × 440</span>
            </div>
            <div class="frame-actions">
              <span class="frame-spec-chip">Elevated White Surfaces</span>
              <span class="frame-spec-chip">Spruce Contrast</span>
            </div>
          </div>
          <div class="figma-frame-body-light" style="background:#F2F3F5;">
            <div style="display:grid; grid-template-columns:1.2fr 0.8fr; gap:32px; align-items:center;">
              <div>
                <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(17,110,99,0.1); border:1px solid rgba(17,110,99,0.3); color:#116E63; padding:4px 10px; border-radius:999px; font-size:11.5px; font-weight:800; margin-bottom:12px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span>مبادرة التحول الرقمي بالذكاء الاصطناعي - جامعة فهد بن سلطان</span>
                </div>
                <h1 style="font-family:var(--font-heading); font-size:27px; font-weight:900; color:#116E63; line-height:1.3; margin-bottom:12px;">
                  مواقف ذكية بتبادل مرن تلقائي <span style="color:#b45309;">دون إهدار لأي موقف</span>
                </h1>
                <p style="font-size:13px; color:#334155; line-height:1.6; margin-bottom:20px;">
                  حل هندسي متكامل ينهي أزمة مواقف الجامعة: عندما يغادر الطالب في أوقات البريك (2-4 ساعات)، يتعرف النظام تلقائياً على خروجه عبر كاميرات قراءة اللوحات (ALPR) ويفتح الموقف لزميله القادم للمحاضرة، مع كسب رصيد مكافأة وحجز متوافق مع جداول الكليات!
                </p>
                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                  <button class="btn btn-teal-primary">عرض خريطة المواقف الـ 30</button>
                  <button class="btn btn-gold-accent">تجربة سيناريو التبادل (إياد وراكان)</button>
                  <button class="btn btn-ghost-outline-light">محاكاة قارئ اللوحات</button>
                </div>
              </div>

              <!-- Flex Card Light -->
              <div style="background:#ffffff; border:1px solid rgba(17,110,99,0.2); border-radius:14px; padding:20px; box-shadow:0 8px 24px rgba(17,110,99,0.08);">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; padding-bottom:10px; margin-bottom:14px;">
                  <div style="font-weight:800; font-size:13.5px; color:#0f172a;">مبدأ التبادل الذكي (Flex Share)</div>
                  <span class="status-pill pill-flex">نشط الآن</span>
                </div>
                <div style="display:flex; flex-direction:column; gap:9px;">
                  <div style="display:flex; gap:10px; align-items:center; background:#f8fafc; border:1px solid #e2e8f0; padding:8px 12px; border-radius:8px;">
                    <span style="background:var(--fbsu-teal); color:#fff; width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800;">1</span>
                    <div style="font-size:11.5px; color:#1e293b;"><strong>رصد خروج إياد:</strong> كاميرا البوابة تقرأ لوحة (ب ط ك 1234) وترصد خروجه في بريك.</div>
                  </div>
                  <div style="display:flex; gap:10px; align-items:center; background:#f8fafc; border:1px solid #e2e8f0; padding:8px 12px; border-radius:8px;">
                    <span style="background:#d97706; color:#fff; width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800;">2</span>
                    <div style="font-size:11.5px; color:#1e293b;"><strong>تحويل الموقف #01:</strong> يُفتح الموقف فوراً لمن لديه كلاس بنفس التوقيت.</div>
                  </div>
                  <div style="display:flex; gap:10px; align-items:center; background:#f8fafc; border:1px solid #e2e8f0; padding:8px 12px; border-radius:8px;">
                    <span style="background:var(--fbsu-teal); color:#fff; width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800;">3</span>
                    <div style="font-size:11.5px; color:#1e293b;"><strong>توجيه راكان:</strong> يركن راكان فوراً، ويكسب إياد 17.25 ر.س كاشباك بالمحفظة!</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 4-Stat Telemetry Banner Light -->
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:14px; margin-top:24px; padding-top:18px; border-top:1px solid #e2e8f0;">
              <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:12px 16px; display:flex; align-items:center; gap:12px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                <div style="width:36px; height:36px; border-radius:8px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; color:#475569;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
                </div>
                <div>
                  <div style="font-family:var(--font-mono); font-size:19px; font-weight:800; color:#0f172a;">30</div>
                  <div style="font-size:11px; color:#64748b;">إجمالي مواقف القطاع</div>
                </div>
              </div>
              <div style="background:#ffffff; border:1.5px solid rgba(16,185,129,0.3); border-radius:10px; padding:12px 16px; display:flex; align-items:center; gap:12px; box-shadow:0 2px 8px rgba(16,185,129,0.06);">
                <div style="width:36px; height:36px; border-radius:8px; background:rgba(16,185,129,0.12); display:flex; align-items:center; justify-content:center; color:#059669;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div>
                  <div style="font-family:var(--font-mono); font-size:19px; font-weight:800; color:#059669;">16</div>
                  <div style="font-size:11px; color:#64748b;">مواقف شاغرة الآن</div>
                </div>
              </div>
              <div style="background:#ffffff; border:1.5px solid rgba(215,162,55,0.4); border-radius:10px; padding:12px 16px; display:flex; align-items:center; gap:12px; box-shadow:0 2px 8px rgba(215,162,55,0.08);">
                <div style="width:36px; height:36px; border-radius:8px; background:rgba(215,162,55,0.12); display:flex; align-items:center; justify-content:center; color:#d97706;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                </div>
                <div>
                  <div style="font-family:var(--font-mono); font-size:19px; font-weight:800; color:#b45309;">2</div>
                  <div style="font-size:11px; color:#64748b;">مواقف بالتبادل الذكي</div>
                </div>
              </div>
              <div style="background:#ffffff; border:1.5px solid rgba(17,110,99,0.3); border-radius:10px; padding:12px 16px; display:flex; align-items:center; gap:12px; box-shadow:0 2px 8px rgba(17,110,99,0.06);">
                <div style="width:36px; height:36px; border-radius:8px; background:rgba(17,110,99,0.12); display:flex; align-items:center; justify-content:center; color:#0f766e;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                </div>
                <div>
                  <div style="font-family:var(--font-mono); font-size:19px; font-weight:800; color:#0f766e;">99.4%</div>
                  <div style="font-size:11px; color:#64748b;">دقة قارئ اللوحات ALPR</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Specs Panel -->
        <div class="figma-inspect-panel">
          <div class="inspect-panel-header">
            <span class="inspect-panel-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--figma-blue)" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
              <span>Design Tokens & Telemetry Layout: Hero Section</span>
            </span>
            <span class="frame-spec-chip">Grid 1.2fr / 0.8fr (Gap: 32px)</span>
          </div>
          <div class="token-grid">
            <div class="token-item"><span class="token-name">hero-title-size</span><span class="token-val">27px (Weight: 900)</span></div>
            <div class="token-item"><span class="token-name">hero-card-radius</span><span class="token-val">14px (Padding: 20px)</span></div>
            <div class="token-item"><span class="token-name">stat-counter-size</span><span class="token-val">19px JetBrains Mono 800</span></div>
            <div class="token-item"><span class="token-name">dark-ambient-gradient</span><span class="token-val">radial-gradient(ellipse at 80% 20%...)</span></div>
          </div>
        </div>
      </div>
    </section>
    """

def get_30_grid_html(mode="dark"):
    is_dark = (mode == "dark")
    card_cls_avail = "spot-dark-available" if is_dark else "spot-light-available"
    card_cls_occ = "spot-dark-occupied" if is_dark else "spot-light-occupied"
    card_cls_flex = "spot-dark-flex" if is_dark else "spot-light-flex"
    card_cls_fac = "spot-dark-faculty" if is_dark else "spot-light-faculty"
    text_white = "#ffffff" if is_dark else "#0f172a"
    text_muted = "#94a3b8" if is_dark else "#64748b"

    # Define 30 spots with names and statuses
    spots_data = [
        {"id": 1, "type": "flex", "title": "موقف #01", "badge": "تبادل ذكي", "driver": "بريك إياد (3.5 س)", "icon": "flex"},
        {"id": 2, "type": "occ", "title": "موقف #02", "badge": "مشغول", "driver": "راكان المطيري", "car_color": "#0b6d87"},
        {"id": 3, "type": "avail", "title": "موقف #03", "badge": "متاح", "driver": "احجز الآن"},
        {"id": 4, "type": "avail", "title": "موقف #04", "badge": "متاح", "driver": "احجز الآن"},
        {"id": 5, "type": "occ", "title": "موقف #05", "badge": "مشغول", "driver": "سعد القحطاني", "car_color": "#116E63"},
        {"id": 6, "type": "avail", "title": "موقف #06", "badge": "متاح", "driver": "احجز الآن"},
        {"id": 7, "type": "avail", "title": "موقف #07", "badge": "متاح", "driver": "إدارة الأعمال"},
        {"id": 8, "type": "occ", "title": "موقف #08", "badge": "مشغول", "driver": "فهد العتيبي", "car_color": "#3b82f6"},
        {"id": 9, "type": "avail", "title": "موقف #09", "badge": "متاح", "driver": "احجز الآن"},
        {"id": 10, "type": "flex", "title": "موقف #10", "badge": "تبادل ذكي", "driver": "شاغر مؤقت", "icon": "flex"},
        {"id": 11, "type": "occ", "title": "موقف #11", "badge": "مشغول", "driver": "عمر الحربي", "car_color": "#e11d48"},
        {"id": 12, "type": "avail", "title": "موقف #12", "badge": "متاح", "driver": "احجز الآن"},
        {"id": 13, "type": "avail", "title": "موقف #13", "badge": "متاح", "driver": "كلية الطب"},
        {"id": 14, "type": "occ", "title": "موقف #14", "badge": "مشغول", "driver": "أحمد العنزي", "car_color": "#475569"},
        {"id": 15, "type": "avail", "title": "موقف #15", "badge": "متاح", "driver": "احجز الآن"},
        {"id": 16, "type": "avail", "title": "موقف #16", "badge": "متاح", "driver": "احجز الآن"},
        {"id": 17, "type": "flex", "title": "موقف #17", "badge": "تبادل ذكي", "driver": "شاغر مؤقت", "icon": "flex"},
        {"id": 18, "type": "avail", "title": "موقف #18", "badge": "متاح", "driver": "احجز الآن"},
        {"id": 19, "type": "fac", "title": "موقف #19", "badge": "كادر التدريس", "driver": "د. عبد الله الغامدي", "car_color": "#8b5cf6"},
        {"id": 20, "type": "fac", "title": "موقف #20", "badge": "كادر التدريس", "driver": "د. سمير كمال", "car_color": "#8b5cf6"},
        {"id": 21, "type": "avail", "title": "موقف #21", "badge": "متاح كادر", "driver": "متاح للدكاترة"},
        {"id": 22, "type": "fac", "title": "موقف #22", "badge": "كادر التدريس", "driver": "د. ريم العمراني", "car_color": "#8b5cf6"},
        {"id": 23, "type": "avail", "title": "موقف #23", "badge": "متاح كادر", "driver": "متاح للدكاترة"},
        {"id": 24, "type": "fac", "title": "موقف #24", "badge": "كادر التدريس", "driver": "د. طارق السعيد", "car_color": "#8b5cf6"},
        {"id": 25, "type": "avail", "title": "موقف #25", "badge": "شاحن EV", "driver": "سريع 50kW"},
        {"id": 26, "type": "occ", "title": "موقف #26", "badge": "EV يشحن", "driver": "Lucid Air (84%)", "car_color": "#0284c7"},
        {"id": 27, "type": "avail", "title": "موقف #27", "badge": "شاحن EV", "driver": "سريع 50kW"},
        {"id": 28, "type": "avail", "title": "موقف #28", "badge": "ذوي الإعاقة", "driver": "منحدر مباشر 10م"},
        {"id": 29, "type": "occ", "title": "موقف #29", "badge": "مشغول", "driver": "طالب ذوي همم", "car_color": "#15803d"},
        {"id": 30, "type": "avail", "title": "موقف #30", "badge": "شاحن EV", "driver": "سريع 50kW"}
    ]

    cards_html = []
    for s in spots_data:
        st = s["type"]
        if st == "avail":
            cls = card_cls_avail
            badge_color = "#10b981"
            center_art = f'<div style="height:54px; display:flex; align-items:center; justify-content:center; color:{badge_color}; font-size:18px; font-weight:800; font-family:var(--font-mono);">P</div>'
        elif st == "occ":
            cls = card_cls_occ
            badge_color = "#f43f5e"
            c = s.get("car_color", "#0b6d87")
            center_art = f'<div class="car-svg-container"><svg viewBox="0 0 100 160" width="100%" height="100%"><rect x="20" y="10" width="60" height="135" rx="20" fill="{c}" stroke="#ffffff" stroke-width="2"/><ellipse cx="50" cy="50" rx="18" ry="12" fill="#072023"/></svg></div>'
        elif st == "flex":
            cls = card_cls_flex
            badge_color = "#d7a237"
            center_art = f'<div class="car-svg-container" style="color:var(--fbsu-gold);"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg></div>'
        else: # fac
            cls = card_cls_fac
            badge_color = "#8b5cf6"
            c = s.get("car_color", "#8b5cf6")
            center_art = f'<div class="car-svg-container"><svg viewBox="0 0 100 160" width="100%" height="100%"><rect x="20" y="10" width="60" height="135" rx="20" fill="{c}" stroke="#ffffff" stroke-width="2"/><circle cx="50" cy="50" r="14" fill="#072023"/></svg></div>'

        card = f"""
        <div class="spot-card-mini {cls}">
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; font-weight:800;">
            <span style="color:{text_white}; font-family:var(--font-mono);">{s['title']}</span>
            <span style="color:{badge_color}; font-size:9.5px;">{s['badge']}</span>
          </div>
          {center_art}
          <div style="font-size:10px; color:{text_muted}; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{s['driver']}</div>
        </div>
        """
        cards_html.append(card)

    return f'<div class="grid-6">{"".join(cards_html)}</div>'

def get_grid_code():
    return f"""
    <!-- ====================================================================
         SECTION 03: INTERACTIVE 30-BAY PARKING GRID (DUAL THEME)
         ==================================================================== -->
    <section id="f-grid">
      <div class="board-section-header">
        <div class="board-title">
          <h2>03. المخطط الرقمي وشبكة الـ 30 موقفاً (Interactive 30-Bay Grid)</h2>
          <span class="board-tag">Dual-Theme Spatial Layout</span>
        </div>
      </div>

      <div class="figma-dual-container">
        <!-- Frame 03-A: Dark Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 03-Grid-Dark / 30 Bays across 4 Academic Zones with IoT Sensor Status</span>
              <span class="frame-theme-badge theme-badge-dark">🌙 Dark Theme</span>
              <span class="frame-size-badge">1440 × 720</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">CSS Grid 6×5</span></div>
          </div>
          <div class="figma-frame-body-dark">
            <!-- Filter Tabs & Legend -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:12px;">
              <div style="display:flex; gap:6px;">
                <span class="btn btn-teal-primary" style="padding:4px 9px; font-size:11.5px;">جميع القطاعات (30)</span>
                <span class="btn btn-ghost-outline-dark" style="padding:4px 9px; font-size:11.5px;">قطاع A - الحاسب والهندسة</span>
                <span class="btn btn-ghost-outline-dark" style="padding:4px 9px; font-size:11.5px;">قطاع B - الأعمال والطب</span>
                <span class="btn btn-ghost-outline-dark" style="padding:4px 9px; font-size:11.5px;">قطاع C - كادر التدريس</span>
                <span class="btn btn-ghost-outline-dark" style="padding:4px 9px; font-size:11.5px;">قطاع D - شحن EV وهمم</span>
              </div>
              <div style="display:flex; gap:12px; font-size:11px; color:#94a3b8;">
                <span style="display:flex; align-items:center; gap:4px;"><span style="width:8px; height:8px; border-radius:50%; background:#10b981;"></span> متاح (16)</span>
                <span style="display:flex; align-items:center; gap:4px;"><span style="width:8px; height:8px; border-radius:50%; background:#f43f5e;"></span> مشغول (8)</span>
                <span style="display:flex; align-items:center; gap:4px;"><span style="width:8px; height:8px; border-radius:50%; background:#d7a237;"></span> تبادل مرن (2)</span>
                <span style="display:flex; align-items:center; gap:4px;"><span style="width:8px; height:8px; border-radius:50%; background:#8b5cf6;"></span> دكاترة (4)</span>
              </div>
            </div>

            <!-- Wayfinding Bar -->
            <div style="background:#050c0b; border:1px solid #1c302b; border-radius:8px; padding:7px 16px; margin-bottom:14px; display:flex; justify-content:space-between; font-size:11px; color:#94a3b8;">
              <span style="display:flex; align-items:center; gap:4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg> طريق الملك خالد - بوابة الحرم الجامعي الشمالية</span>
              <span style="color:var(--fbsu-gold); font-weight:700;">📡 مزامنة إنترنت الأشياء IoT نشطة عبر بروتوكول MQTT</span>
              <span style="display:flex; align-items:center; gap:4px;">مبنى كلية الهندسة وتقنية المعلومات <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg></span>
            </div>

            {get_30_grid_html("dark")}
          </div>
        </div>

        <!-- Frame 03-B: Light Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 03-Grid-Light / 30 Bays across 4 Academic Zones with IoT Sensor Status</span>
              <span class="frame-theme-badge theme-badge-light">☀️ Light Theme</span>
              <span class="frame-size-badge">1440 × 720</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">High-Readability Asphalt Base</span></div>
          </div>
          <div class="figma-frame-body-light" style="background:#E8ECEF;">
            <!-- Filter Tabs & Legend Light -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:12px;">
              <div style="display:flex; gap:6px;">
                <span class="btn btn-teal-primary" style="padding:4px 9px; font-size:11.5px;">جميع القطاعات (30)</span>
                <span class="btn btn-ghost-outline-light" style="padding:4px 9px; font-size:11.5px;">قطاع A - الحاسب والهندسة</span>
                <span class="btn btn-ghost-outline-light" style="padding:4px 9px; font-size:11.5px;">قطاع B - الأعمال والطب</span>
                <span class="btn btn-ghost-outline-light" style="padding:4px 9px; font-size:11.5px;">قطاع C - كادر التدريس</span>
                <span class="btn btn-ghost-outline-light" style="padding:4px 9px; font-size:11.5px;">قطاع D - شحن EV وهمم</span>
              </div>
              <div style="display:flex; gap:12px; font-size:11px; color:#475569; font-weight:700;">
                <span style="display:flex; align-items:center; gap:4px;"><span style="width:8px; height:8px; border-radius:50%; background:#10b981;"></span> متاح (16)</span>
                <span style="display:flex; align-items:center; gap:4px;"><span style="width:8px; height:8px; border-radius:50%; background:#f43f5e;"></span> مشغول (8)</span>
                <span style="display:flex; align-items:center; gap:4px;"><span style="width:8px; height:8px; border-radius:50%; background:#d7a237;"></span> تبادل مرن (2)</span>
                <span style="display:flex; align-items:center; gap:4px;"><span style="width:8px; height:8px; border-radius:50%; background:#8b5cf6;"></span> دكاترة (4)</span>
              </div>
            </div>

            <!-- Wayfinding Bar Light -->
            <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:7px 16px; margin-bottom:14px; display:flex; justify-content:space-between; font-size:11px; color:#334155; font-weight:700;">
              <span style="display:flex; align-items:center; gap:4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg> طريق الملك خالد - بوابة الحرم الجامعي الشمالية</span>
              <span style="color:#b45309; font-weight:800;">📡 مزامنة إنترنت الأشياء IoT نشطة عبر بروتوكول MQTT</span>
              <span style="display:flex; align-items:center; gap:4px;">مبنى كلية الهندسة وتقنية المعلومات <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg></span>
            </div>

            {get_30_grid_html("light")}
          </div>
        </div>

        <!-- Specs Panel -->
        <div class="figma-inspect-panel">
          <div class="inspect-panel-header">
            <span class="inspect-panel-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--figma-blue)" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <span>Design Tokens & Grid Architecture: 30-Bay Interactive Map</span>
            </span>
            <span class="frame-spec-chip">CSS Grid repeat(6, 1fr)</span>
          </div>
          <div class="token-grid">
            <div class="token-item"><span class="token-name">grid-columns</span><span class="token-val">6 Cols × 5 Rows (Gap: 10px)</span></div>
            <div class="token-item"><span class="token-name">bay-card-radius</span><span class="token-val">8px (Min-height: 125px)</span></div>
            <div class="token-item"><span class="token-name">status-available</span><span class="token-val"><span class="color-swatch-mini" style="background:#10b981;"></span>#10b981 (16 Bays)</span></div>
            <div class="token-item"><span class="token-name">status-occupied</span><span class="token-val"><span class="color-swatch-mini" style="background:#f43f5e;"></span>#f43f5e (8 Bays)</span></div>
            <div class="token-item"><span class="token-name">status-flex-share</span><span class="token-val"><span class="color-swatch-mini" style="background:#d7a237;"></span>#d7a237 (2 Bays)</span></div>
            <div class="token-item"><span class="token-name">status-faculty-vip</span><span class="token-val"><span class="color-swatch-mini" style="background:#8b5cf6;"></span>#8b5cf6 (4 Bays)</span></div>
          </div>
        </div>
      </div>
    </section>
    """

print("Section 02 and 03 defined.")
