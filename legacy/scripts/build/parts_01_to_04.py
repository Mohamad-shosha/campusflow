# -*- coding: utf-8 -*-
"""
Sections 01 to 04 for Master Figma UI/UX Showcase (Ultra-Responsive Mobile & Desktop)
- Section 01: Institutional Ribbon & Navigation Header (Dark & Light)
- Section 02: Hero Section & Realtime HUD Telemetry (Dark & Light)
- Section 03: 30-Bay Interactive Parking Grid (Dark & Light)
- Section 04: Spot Details Modal & In-Ground IoT Sensor (Dark & Light)
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
        {"id": 7, "type": "avail", "title": "موقف #07", "badge": "متاح", "driver": "احجز الآن"},
        {"id": 8, "type": "occ", "title": "موقف #08", "badge": "مشغول", "driver": "فيصل الشمري", "car_color": "#d7a237"},
        {"id": 9, "type": "avail", "title": "موقف #09", "badge": "متاح", "driver": "احجز الآن"},
        {"id": 10, "type": "avail", "title": "موقف #10", "badge": "متاح", "driver": "احجز الآن"},
        {"id": 11, "type": "occ", "title": "موقف #11", "badge": "مشغول", "driver": "عمر السالم", "car_color": "#475569"},
        {"id": 12, "type": "avail", "title": "موقف #12", "badge": "متاح", "driver": "احجز الآن"},
        {"id": 13, "type": "avail", "title": "موقف #13", "badge": "متاح", "driver": "احجز الآن"},
        {"id": 14, "type": "flex", "title": "موقف #14", "badge": "تبادل ذكي", "driver": "بريك متعب (2.0 س)", "icon": "flex"},
        {"id": 15, "type": "avail", "title": "موقف #15", "badge": "متاح", "driver": "احجز الآن"},
        {"id": 16, "type": "occ", "title": "موقف #16", "badge": "مشغول", "driver": "تركي العنزي", "car_color": "#0284c7"},
        {"id": 17, "type": "avail", "title": "موقف #17", "badge": "متاح", "driver": "احجز الآن"},
        {"id": 18, "type": "avail", "title": "موقف #18", "badge": "متاح", "driver": "احجز الآن"},
        {"id": 19, "type": "fac", "title": "موقف #19", "badge": "دكاترة VIP", "driver": "د. عبد الله الغامدي", "car_color": "#8b5cf6"},
        {"id": 20, "type": "fac", "title": "موقف #20", "badge": "دكاترة VIP", "driver": "د. سارة التميمي", "car_color": "#8b5cf6"},
        {"id": 21, "type": "fac", "title": "موقف #21", "badge": "دكاترة VIP", "driver": "عميد كلية الهندسة", "car_color": "#8b5cf6"},
        {"id": 22, "type": "fac", "title": "موقف #22", "badge": "دكاترة VIP", "driver": "وكيل الجامعة", "car_color": "#8b5cf6"},
        {"id": 23, "type": "avail", "title": "موقف #23", "badge": "متاح (EV)", "driver": "شحن كهربائي سريع"},
        {"id": 24, "type": "avail", "title": "موقف #24", "badge": "متاح (EV)", "driver": "شحن كهربائي سريع"},
        {"id": 25, "type": "occ", "title": "موقف #25", "badge": "مشغول", "driver": "أحمد الحويطي", "car_color": "#0d9488"},
        {"id": 26, "type": "avail", "title": "موقف #26", "badge": "متاح (همم)", "driver": "ذوو الإعاقة"},
        {"id": 27, "type": "avail", "title": "موقف #27", "badge": "متاح (همم)", "driver": "ذوو الإعاقة"},
        {"id": 28, "type": "occ", "title": "موقف #28", "badge": "مشغول", "driver": "خالد الصالح", "car_color": "#334155"},
        {"id": 29, "type": "avail", "title": "موقف #29", "badge": "متاح", "driver": "احجز الآن"},
        {"id": 30, "type": "occ", "title": "موقف #30", "badge": "مشغول", "driver": "ياسر الحربي", "car_color": "#b45309"}
    ]

    cards_html = []
    for s in spots_data:
        st = s["type"]
        if st == "avail":
            cls = card_cls_avail
            badge_cls = "pill-available"
            icon_svg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>'
            sub_color = "#10b981"
        elif st == "occ":
            cls = card_cls_occ
            badge_cls = "pill-occupied"
            c_color = s.get("car_color", "#0b6d87")
            icon_svg = f'<svg viewBox="0 0 60 90" width="34" height="50"><rect x="8" y="5" width="44" height="80" rx="14" fill="{c_color}" stroke="{text_white}" stroke-width="1.5"/><ellipse cx="30" cy="28" rx="14" ry="8" fill="#000" opacity="0.4"/></svg>'
            sub_color = text_muted
        elif st == "flex":
            cls = card_cls_flex
            badge_cls = "pill-flex"
            icon_svg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d7a237" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>'
            sub_color = "#d7a237" if is_dark else "#b45309"
        else: # fac
            cls = card_cls_fac
            badge_cls = "pill-faculty"
            icon_svg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'
            sub_color = "#8b5cf6"

        card = f"""
        <div class="spot-card-mini {cls}">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <span style="font-family:var(--font-mono); font-weight:800; font-size:11.5px; color:{text_white};">{s["title"]}</span>
            <span class="status-pill {badge_cls}" style="font-size:9px; padding:2px 5px;">{s["badge"]}</span>
          </div>
          <div class="car-svg-container" style="display:flex; align-items:center; justify-content:center; min-height:50px;">
            {icon_svg}
          </div>
          <div>
            <div style="font-size:10px; font-weight:700; color:{sub_color}; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">{s["driver"]}</div>
            <div style="font-size:8.5px; color:{text_muted}; display:flex; justify-content:space-between; margin-top:2px;">
              <span>IoT Active</span>
              <span>2.4GHz</span>
            </div>
          </div>
        </div>
        """
        cards_html.append(card)

    return f'<div class="grid-6 responsive-parking-grid">{"".join(cards_html)}</div>'

def get_sections_01_to_04():
    return f"""
    <!-- ====================================================================
         SECTION 01: INSTITUTIONAL RIBBON & NAVIGATION HEADER (DUAL THEME)
         ==================================================================== -->
    <section id="f-header">
      <div class="board-section-header">
        <div class="board-title">
          <h2>01. الشريط المؤسسي والترويسة الموحدة (Institutional Ribbon & Header)</h2>
          <span class="board-tag">Dual-Theme Global Navigation</span>
        </div>
      </div>

      <div class="figma-dual-container">
        <!-- Frame 01-A: Dark Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 01-Header-Dark / Global Navigation Bar</span>
              <span class="frame-theme-badge theme-badge-dark">🌙 Dark Theme #081211</span>
              <span class="frame-size-badge">1440 × 106</span>
            </div>
            <div class="frame-actions">
              <span class="frame-spec-chip">Auto Layout</span>
              <span class="frame-spec-chip">Max-Width: 1220px</span>
            </div>
          </div>
          <div class="figma-frame-body-dark" style="padding:0;">
            <!-- Ribbon Dark -->
            <div class="header-ribbon-dark">
              <div class="ribbon-inner">
                <div class="ribbon-cluster-left">
                  <span style="color:#10b981; font-weight:700; display:flex; align-items:center; gap:5px;">
                    <span style="width:6px; height:6px; background:#10b981; border-radius:50%; box-shadow:0 0 6px #10b981;"></span>
                    <span>جامعة فهد بن سلطان - تبوك</span>
                  </span>
                  <span>بوابة المواقف الذكية</span>
                  <span style="color:var(--fbsu-gold);">التبادل الذكي: 2 مواقف متاحة</span>
                </div>
                <div class="ribbon-cluster-right">
                  <span style="color:var(--fbsu-gold);">الفصل الأول 1448 هـ</span>
                  <span style="font-family:var(--font-mono); color:#cbd5e1;">09:41:22 ص</span>
                </div>
              </div>
            </div>

            <!-- Header Bar Dark -->
            <div class="header-bar-dark">
              <div class="header-logo-row">
                <img src="./assets/branding/fbsu-logo.png" alt="FBSU Logo" style="height:32px; width:auto;">
                <h3 style="font-family:var(--font-heading); font-size:14px; font-weight:800; color:#fff; margin:0;">جامعة فهد بن سلطان</h3>
              </div>
              
              <div class="nav-pills-scroll-wrapper">
                <div class="nav-pills-cluster">
                  <span class="btn btn-teal-primary" style="padding:4px 10px; font-size:11px; border-radius:999px; display:inline-flex; align-items:center; gap:4px;">
                    <span>المواقف الذكية</span>
                    <span style="font-size:9px;">▾</span>
                  </span>
                  <span class="btn btn-ghost-outline-dark" style="padding:4px 10px; font-size:11px; border-radius:999px; border:none; display:inline-flex; align-items:center; gap:4px; color:var(--fbsu-gold);">
                    <span>الحرم والأنشطة</span>
                    <span style="width:5px; height:5px; border-radius:50%; background:var(--fbsu-gold);"></span>
                    <span style="font-size:9px;">▾</span>
                  </span>
                  <span class="btn btn-ghost-outline-dark" style="padding:4px 8px; font-size:11px; border-radius:999px; border:none;">التحليلات</span>
                </div>
              </div>

              <div class="header-utilities-cluster">
                <span class="btn btn-ghost-outline-dark" style="padding:3px 6px; font-size:10px;">🔊 صوت</span>
                <span class="btn btn-ghost-outline-dark" style="padding:3px 6px; font-size:10px;">🌐 EN</span>
                <span class="btn btn-ghost-outline-dark" style="padding:3px 6px; font-size:10px;">🌙 ليلي</span>
                <span style="background:rgba(215,162,55,0.12); border:1px solid rgba(215,162,55,0.4); color:var(--fbsu-gold); padding:2px 7px; border-radius:999px; font-size:10.5px; font-weight:800;">🔔 3</span>
                <span style="background:rgba(215,162,55,0.15); border:1px solid rgba(215,162,55,0.4); color:var(--fbsu-gold); padding:3px 8px; border-radius:999px; font-size:11px; font-weight:700;">720.00 ر.س</span>
                <div style="display:flex; align-items:center; gap:5px; background:rgba(255,255,255,0.05); padding:2px 7px; border-radius:999px;">
                  <span style="width:20px; height:20px; border-radius:50%; background:var(--fbsu-teal); display:inline-flex; align-items:center; justify-content:center; font-size:9.5px; font-weight:800; color:#fff;">إ</span>
                  <span style="font-size:11px; color:#fff; font-weight:600;">إياد (طالب)</span>
                </div>
              </div>
            </div>

            <!-- Category Subnav Ribbon Dark -->
            <div style="background:rgba(11,26,24,0.9); border-top:1px solid rgba(255,255,255,0.06); padding:6px 16px; display:flex; gap:8px; justify-content:center; font-size:10.5px;">
              <span style="color:#10b981; font-weight:700;">خريطة المواقف الحية</span>
              <span style="color:#64748b;">•</span>
              <span style="color:#cbd5e1;">حجز موقف وتصريح</span>
              <span style="color:#64748b;">•</span>
              <span style="color:#cbd5e1;">محاكاة التبادل</span>
              <span style="color:#64748b;">•</span>
              <span style="color:#cbd5e1;">كاميرات ALPR</span>
              <span style="color:#64748b;">•</span>
              <span style="color:#cbd5e1;">شارك واربح</span>
            </div>
          </div>
        </div>

        <!-- Frame 01-B: Light Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 01-Header-Light / Global Navigation Bar</span>
              <span class="frame-theme-badge theme-badge-light">☀️ Light Theme #F8FAFC</span>
              <span class="frame-size-badge">1440 × 106</span>
            </div>
            <div class="frame-actions">
              <span class="frame-spec-chip">High-Contrast Institutional</span>
              <span class="frame-spec-chip">Max-Width: 1220px</span>
            </div>
          </div>
          <div class="figma-frame-body-light" style="padding:0;">
            <!-- Ribbon Light -->
            <div class="header-ribbon-light">
              <div class="ribbon-inner">
                <div class="ribbon-cluster-left">
                  <span style="color:#a7f3d0; font-weight:700; display:flex; align-items:center; gap:5px;">
                    <span style="width:6px; height:6px; background:#a7f3d0; border-radius:50%;"></span>
                    <span>جامعة فهد بن سلطان - تبوك</span>
                  </span>
                  <span>بوابة المواقف والحرم الذكي</span>
                  <span style="color:#fef08a;">التبادل الذكي: 2 مواقف متاحة</span>
                </div>
                <div class="ribbon-cluster-right">
                  <span style="color:#fef08a;">الفصل الأول 1448 هـ</span>
                  <span style="font-family:var(--font-mono); color:#ffffff;">09:41:22 ص</span>
                </div>
              </div>
            </div>

            <!-- Header Bar Light -->
            <div class="header-bar-light">
              <div class="header-logo-row">
                <img src="./assets/branding/fbsu-logo.png" alt="FBSU Logo" style="height:32px; width:auto;">
                <h3 style="font-family:var(--font-heading); font-size:14px; font-weight:800; color:#0f172a; margin:0;">جامعة فهد بن سلطان</h3>
              </div>
              
              <div class="nav-pills-scroll-wrapper">
                <div class="nav-pills-cluster-light">
                  <span class="btn btn-teal-primary" style="padding:4px 10px; font-size:11px; border-radius:999px; display:inline-flex; align-items:center; gap:4px;">
                    <span>المواقف الذكية</span>
                    <span style="font-size:9px;">▾</span>
                  </span>
                  <span class="btn btn-ghost-outline-light" style="padding:4px 10px; font-size:11px; border-radius:999px; border:none; display:inline-flex; align-items:center; gap:4px; color:#b45309;">
                    <span>الحرم والأنشطة</span>
                    <span style="width:5px; height:5px; border-radius:50%; background:#d7a237;"></span>
                    <span style="font-size:9px;">▾</span>
                  </span>
                  <span class="btn btn-ghost-outline-light" style="padding:4px 8px; font-size:11px; border-radius:999px; border:none;">التحليلات</span>
                </div>
              </div>

              <div class="header-utilities-cluster">
                <span class="btn btn-ghost-outline-light" style="padding:3px 6px; font-size:10px;">🔊 صوت</span>
                <span class="btn btn-ghost-outline-light" style="padding:3px 6px; font-size:10px;">🌐 EN</span>
                <span class="btn btn-ghost-outline-light" style="padding:3px 6px; font-size:10px;">☀️ نهاري</span>
                <span style="background:rgba(215,162,55,0.12); border:1px solid rgba(215,162,55,0.4); color:#b45309; padding:2px 7px; border-radius:999px; font-size:10.5px; font-weight:800;">🔔 3</span>
                <span style="background:rgba(215,162,55,0.15); border:1px solid rgba(215,162,55,0.5); color:#a16207; padding:3px 8px; border-radius:999px; font-size:11px; font-weight:800;">720.00 ر.س</span>
                <div style="display:flex; align-items:center; gap:5px; background:#f8fafc; border:1px solid #e2e8f0; padding:2px 7px; border-radius:999px;">
                  <span style="width:20px; height:20px; border-radius:50%; background:var(--fbsu-teal); display:inline-flex; align-items:center; justify-content:center; font-size:9.5px; font-weight:800; color:#fff;">إ</span>
                  <span style="font-size:11px; color:#0f172a; font-weight:700;">إياد (طالب)</span>
                </div>
              </div>
            </div>

            <!-- Category Subnav Ribbon Light -->
            <div style="background:#f1f5f9; border-top:1px solid #e2e8f0; padding:6px 16px; display:flex; gap:8px; justify-content:center; font-size:10.5px;">
              <span style="color:#116E63; font-weight:700;">خريطة المواقف الحية</span>
              <span style="color:#94a3b8;">•</span>
              <span style="color:#475569;">حجز موقف وتصريح</span>
              <span style="color:#94a3b8;">•</span>
              <span style="color:#475569;">محاكاة التبادل</span>
              <span style="color:#94a3b8;">•</span>
              <span style="color:#475569;">كاميرات ALPR</span>
              <span style="color:#94a3b8;">•</span>
              <span style="color:#475569;">شارك واربح</span>
            </div>
          </div>
        </div>

        <!-- Section 01 Inspect Specs -->
        <div class="figma-inspect-panel">
          <div class="inspect-panel-header">
            <span class="inspect-panel-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--figma-blue)" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              <span>Design Tokens & Layout Specifications: Header Component</span>
            </span>
            <span class="frame-spec-chip">Auto Layout (Direction: RTL)</span>
          </div>
          <div class="token-grid">
            <div class="token-item"><span class="token-name">container-width</span><span class="token-val">1220px Centered (margin: 0 auto)</span></div>
            <div class="token-item"><span class="token-name">ribbon-bg-dark</span><span class="token-val">linear-gradient(90deg, #091715, #113833, #091715)</span></div>
            <div class="token-item"><span class="token-name">ribbon-bg-light</span><span class="token-val">linear-gradient(90deg, #116E63, #0d554c)</span></div>
            <div class="token-item"><span class="token-name">nav-capsule-radius</span><span class="token-val">999px (Pill shape)</span></div>
            <div class="token-item"><span class="token-name">brand-font-heading</span><span class="token-val">'Tajawal', sans-serif (800 Bold)</span></div>
            <div class="token-item"><span class="token-name">wallet-pill-token</span><span class="token-val">72.50 SAR (Academic Gold #d7a237)</span></div>
          </div>
        </div>
      </div>
    </section>

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
            <div class="responsive-split-2col">
              <div>
                <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(17,110,99,0.25); border:1px solid var(--fbsu-teal); color:#38c2b0; padding:4px 10px; border-radius:999px; font-size:11px; font-weight:700; margin-bottom:12px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span>مبادرة التحول الرقمي بالذكاء الاصطناعي - جامعة فهد بن سلطان</span>
                </div>
                <h1 style="font-family:var(--font-heading); font-size:clamp(20px, 4vw, 27px); font-weight:900; color:#fff; line-height:1.3; margin-bottom:12px;">
                  مواقف ذكية بتبادل مرن تلقائي <span style="color:var(--fbsu-gold);">دون إهدار لأي موقف</span>
                </h1>
                <p style="font-size:12.5px; color:#cbd5e1; line-height:1.6; margin-bottom:16px;">
                  حل هندسي متكامل ينهي أزمة مواقف الجامعة: عندما يغادر الطالب في أوقات البريك (2-4 ساعات)، يتعرف النظام تلقائياً على خروجه عبر كاميرات قراءة اللوحات (ALPR) ويفتح الموقف لزميله القادم للمحاضرة، مع كسب رصيد مكافأة وحجز متوافق مع جداول الكليات!
                </p>
                <div class="btn-cluster-wrap">
                  <button class="btn btn-teal-primary">عرض خريطة المواقف الـ 30</button>
                  <button class="btn btn-gold-accent">تجربة سيناريو التبادل</button>
                  <button class="btn btn-ghost-outline-dark">محاكاة قارئ اللوحات</button>
                </div>
              </div>

              <!-- Flex Card Dark -->
              <div style="background:rgba(15,36,32,0.85); border:1px solid rgba(17,110,99,0.45); border-radius:14px; padding:16px; box-shadow:0 12px 30px rgba(0,0,0,0.5);">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:8px; margin-bottom:12px;">
                  <div style="font-weight:800; font-size:13px; color:#fff;">مبدأ التبادل الذكي (Flex Share)</div>
                  <span class="status-pill pill-flex">نشط الآن</span>
                </div>
                <div style="display:flex; flex-direction:column; gap:8px;">
                  <div style="display:flex; gap:8px; align-items:flex-start; background:rgba(0,0,0,0.35); padding:8px 10px; border-radius:8px;">
                    <span style="background:var(--fbsu-teal); color:#fff; width:20px; height:20px; min-width:20px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:800;">1</span>
                    <div style="font-size:11px; line-height:1.4;"><strong>رصد خروج إياد:</strong> كاميرا البوابة تقرأ لوحة (ب ط ك 1234) وترصد خروجه في بريك.</div>
                  </div>
                  <div style="display:flex; gap:8px; align-items:flex-start; background:rgba(0,0,0,0.35); padding:8px 10px; border-radius:8px;">
                    <span style="background:var(--fbsu-gold); color:#000; width:20px; height:20px; min-width:20px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:800;">2</span>
                    <div style="font-size:11px; line-height:1.4;"><strong>تحويل الموقف #01:</strong> يُفتح الموقف فوراً لمن لديه كلاس بنفس التوقيت.</div>
                  </div>
                  <div style="display:flex; gap:8px; align-items:flex-start; background:rgba(0,0,0,0.35); padding:8px 10px; border-radius:8px;">
                    <span style="background:var(--fbsu-teal); color:#fff; width:20px; height:20px; min-width:20px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:800;">3</span>
                    <div style="font-size:11px; line-height:1.4;"><strong>توجيه راكان:</strong> يركن راكان فوراً، ويكسب إياد 17.25 ر.س كاشباك بالمحفظة!</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 4-Stat Telemetry Banner Dark -->
            <div class="responsive-stats-grid">
              <div class="stat-card-widget" style="background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.08);">
                <div style="width:32px; height:32px; min-width:32px; border-radius:8px; background:rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; color:#94a3b8;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
                </div>
                <div>
                  <div style="font-family:var(--font-mono); font-size:18px; font-weight:800; color:#fff;">30</div>
                  <div style="font-size:10.5px; color:#94a3b8;">إجمالي المواقف</div>
                </div>
              </div>
              <div class="stat-card-widget" style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3);">
                <div style="width:32px; height:32px; min-width:32px; border-radius:8px; background:rgba(16,185,129,0.2); display:flex; align-items:center; justify-content:center; color:#10b981;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div>
                  <div style="font-family:var(--font-mono); font-size:18px; font-weight:800; color:#10b981;">16</div>
                  <div style="font-size:10.5px; color:#94a3b8;">شاغرة الآن</div>
                </div>
              </div>
              <div class="stat-card-widget" style="background:rgba(215,162,55,0.1); border:1px solid rgba(215,162,55,0.3);">
                <div style="width:32px; height:32px; min-width:32px; border-radius:8px; background:rgba(215,162,55,0.2); display:flex; align-items:center; justify-content:center; color:var(--fbsu-gold);">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                </div>
                <div>
                  <div style="font-family:var(--font-mono); font-size:18px; font-weight:800; color:var(--fbsu-gold);">2</div>
                  <div style="font-size:10.5px; color:#94a3b8;">بالتبادل الذكي</div>
                </div>
              </div>
              <div class="stat-card-widget" style="background:rgba(17,110,99,0.15); border:1px solid rgba(17,110,99,0.3);">
                <div style="width:32px; height:32px; min-width:32px; border-radius:8px; background:rgba(17,110,99,0.25); display:flex; align-items:center; justify-content:center; color:#38c2b0;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                </div>
                <div>
                  <div style="font-family:var(--font-mono); font-size:18px; font-weight:800; color:#38c2b0;">99.4%</div>
                  <div style="font-size:10.5px; color:#94a3b8;">دقة قارئ ALPR</div>
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
            <div class="frame-actions"><span class="frame-spec-chip">Pure Campus Palette</span></div>
          </div>
          <div class="figma-frame-body-light" style="background:linear-gradient(135deg, #f0fdf4 0%, #e2e8f0 100%);">
            <div class="responsive-split-2col">
              <div>
                <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(17,110,99,0.12); border:1px solid rgba(17,110,99,0.4); color:#0d554c; padding:4px 10px; border-radius:999px; font-size:11px; font-weight:800; margin-bottom:12px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span>مبادرة التحول الرقمي بالذكاء الاصطناعي - جامعة فهد بن سلطان</span>
                </div>
                <h1 style="font-family:var(--font-heading); font-size:clamp(20px, 4vw, 27px); font-weight:900; color:#0f172a; line-height:1.3; margin-bottom:12px;">
                  مواقف ذكية بتبادل مرن تلقائي <span style="color:#b45309;">دون إهدار لأي موقف</span>
                </h1>
                <p style="font-size:12.5px; color:#334155; line-height:1.6; margin-bottom:16px;">
                  حل هندسي متكامل ينهي أزمة مواقف الجامعة: عندما يغادر الطالب في أوقات البريك (2-4 ساعات)، يتعرف النظام تلقائياً على خروجه عبر كاميرات قراءة اللوحات (ALPR) ويفتح الموقف لزميله القادم للمحاضرة، مع كسب رصيد مكافأة وحجز متوافق مع جداول الكليات!
                </p>
                <div class="btn-cluster-wrap">
                  <button class="btn btn-teal-primary">عرض خريطة المواقف الـ 30</button>
                  <button class="btn btn-gold-accent">تجربة سيناريو التبادل</button>
                  <button class="btn btn-ghost-outline-light">محاكاة قارئ اللوحات</button>
                </div>
              </div>

              <!-- Flex Card Light -->
              <div style="background:#ffffff; border:1.5px solid rgba(17,110,99,0.3); border-radius:14px; padding:16px; box-shadow:0 10px 25px rgba(0,0,0,0.06);">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:8px; margin-bottom:12px;">
                  <div style="font-weight:800; font-size:13px; color:#0f172a;">مبدأ التبادل الذكي (Flex Share)</div>
                  <span class="status-pill pill-flex">نشط الآن</span>
                </div>
                <div style="display:flex; flex-direction:column; gap:8px;">
                  <div style="display:flex; gap:8px; align-items:flex-start; background:#f8fafc; padding:8px 10px; border-radius:8px; border:1px solid #e2e8f0;">
                    <span style="background:var(--fbsu-teal); color:#fff; width:20px; height:20px; min-width:20px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:800;">1</span>
                    <div style="font-size:11px; color:#1e293b; line-height:1.4;"><strong>رصد خروج إياد:</strong> كاميرا البوابة تقرأ لوحة (ب ط ك 1234) وترصد خروجه في بريك.</div>
                  </div>
                  <div style="display:flex; gap:8px; align-items:flex-start; background:#f8fafc; padding:8px 10px; border-radius:8px; border:1px solid #e2e8f0;">
                    <span style="background:var(--fbsu-gold); color:#000; width:20px; height:20px; min-width:20px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:800;">2</span>
                    <div style="font-size:11px; color:#1e293b; line-height:1.4;"><strong>تحويل الموقف #01:</strong> يُفتح الموقف فوراً لمن لديه كلاس بنفس التوقيت.</div>
                  </div>
                  <div style="display:flex; gap:8px; align-items:flex-start; background:#f8fafc; padding:8px 10px; border-radius:8px; border:1px solid #e2e8f0;">
                    <span style="background:var(--fbsu-teal); color:#fff; width:20px; height:20px; min-width:20px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:800;">3</span>
                    <div style="font-size:11px; color:#1e293b; line-height:1.4;"><strong>توجيه راكان:</strong> يركن راكان فوراً، ويكسب إياد 17.25 ر.س كاشباك بالمحفظة!</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 4-Stat Telemetry Banner Light -->
            <div class="responsive-stats-grid">
              <div class="stat-card-widget" style="background:#ffffff; border:1px solid #cbd5e1; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                <div style="width:32px; height:32px; min-width:32px; border-radius:8px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; color:#475569;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
                </div>
                <div>
                  <div style="font-family:var(--font-mono); font-size:18px; font-weight:800; color:#0f172a;">30</div>
                  <div style="font-size:10.5px; color:#64748b;">إجمالي المواقف</div>
                </div>
              </div>
              <div class="stat-card-widget" style="background:#ffffff; border:1.5px solid rgba(16,185,129,0.3); box-shadow:0 2px 8px rgba(16,185,129,0.06);">
                <div style="width:32px; height:32px; min-width:32px; border-radius:8px; background:rgba(16,185,129,0.12); display:flex; align-items:center; justify-content:center; color:#059669;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div>
                  <div style="font-family:var(--font-mono); font-size:18px; font-weight:800; color:#059669;">16</div>
                  <div style="font-size:10.5px; color:#64748b;">شاغرة الآن</div>
                </div>
              </div>
              <div class="stat-card-widget" style="background:#ffffff; border:1.5px solid rgba(215,162,55,0.4); box-shadow:0 2px 8px rgba(215,162,55,0.08);">
                <div style="width:32px; height:32px; min-width:32px; border-radius:8px; background:rgba(215,162,55,0.12); display:flex; align-items:center; justify-content:center; color:#d97706;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                </div>
                <div>
                  <div style="font-family:var(--font-mono); font-size:18px; font-weight:800; color:#b45309;">2</div>
                  <div style="font-size:10.5px; color:#64748b;">بالتبادل الذكي</div>
                </div>
              </div>
              <div class="stat-card-widget" style="background:#ffffff; border:1.5px solid rgba(17,110,99,0.3); box-shadow:0 2px 8px rgba(17,110,99,0.06);">
                <div style="width:32px; height:32px; min-width:32px; border-radius:8px; background:rgba(17,110,99,0.12); display:flex; align-items:center; justify-content:center; color:#0f766e;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                </div>
                <div>
                  <div style="font-family:var(--font-mono); font-size:18px; font-weight:800; color:#0f766e;">99.4%</div>
                  <div style="font-size:10.5px; color:#64748b;">دقة قارئ ALPR</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 02 Inspect Specs -->
        <div class="figma-inspect-panel">
          <div class="inspect-panel-header">
            <span class="inspect-panel-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--figma-blue)" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
              <span>Design Tokens & Telemetry Layout: Hero Section</span>
            </span>
            <span class="frame-spec-chip">Responsive Grid Auto Layout</span>
          </div>
          <div class="token-grid">
            <div class="token-item"><span class="token-name">hero-title-size</span><span class="token-val">clamp(20px, 4vw, 27px)</span></div>
            <div class="token-item"><span class="token-name">hero-card-radius</span><span class="token-val">14px (Padding: 16px)</span></div>
            <div class="token-item"><span class="token-name">stat-counter-size</span><span class="token-val">18px JetBrains Mono 800</span></div>
            <div class="token-item"><span class="token-name">dark-ambient-gradient</span><span class="token-val">radial-gradient(ellipse at 80% 20%...)</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====================================================================
         SECTION 03: 30-BAY INTERACTIVE PARKING GRID (DUAL THEME)
         ==================================================================== -->
    <section id="f-grid">
      <div class="board-section-header">
        <div class="board-title">
          <h2>03. خريطة وشبكة الـ 30 موقفاً التفاعلية (30-Bay Interactive Parking Grid)</h2>
          <span class="board-tag">Dual-Theme Campus Spatial Matrix</span>
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
            <div class="frame-actions"><span class="frame-spec-chip">Grid 6-Columns Auto Layout</span></div>
          </div>
          <div class="figma-frame-body-dark" style="background:#081211;">
            <!-- Filter Tabs & Legend Dark -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:10px;">
              <div class="filter-scroll-container">
                <span class="btn btn-teal-primary" style="padding:4px 8px; font-size:11px; white-space:nowrap;">جميع المواقف (30)</span>
                <span class="btn btn-ghost-outline-dark" style="padding:4px 8px; font-size:11px; white-space:nowrap;">قطاع A - الحاسب والهندسة</span>
                <span class="btn btn-ghost-outline-dark" style="padding:4px 8px; font-size:11px; white-space:nowrap;">قطاع B - الأعمال والطب</span>
                <span class="btn btn-ghost-outline-dark" style="padding:4px 8px; font-size:11px; white-space:nowrap;">قطاع C - كادر التدريس</span>
                <span class="btn btn-ghost-outline-dark" style="padding:4px 8px; font-size:11px; white-space:nowrap;">قطاع D - شحن EV وهمم</span>
              </div>
              <div style="display:flex; gap:10px; font-size:10.5px; color:#cbd5e1; flex-wrap:wrap;">
                <span style="display:flex; align-items:center; gap:4px;"><span style="width:7px; height:7px; border-radius:50%; background:#10b981;"></span> متاح (16)</span>
                <span style="display:flex; align-items:center; gap:4px;"><span style="width:7px; height:7px; border-radius:50%; background:#f43f5e;"></span> مشغول (8)</span>
                <span style="display:flex; align-items:center; gap:4px;"><span style="width:7px; height:7px; border-radius:50%; background:#d7a237;"></span> تبادل (2)</span>
                <span style="display:flex; align-items:center; gap:4px;"><span style="width:7px; height:7px; border-radius:50%; background:#8b5cf6;"></span> دكاترة (4)</span>
              </div>
            </div>

            <!-- Wayfinding Bar -->
            <div class="wayfinding-strip-dark">
              <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg> طريق الملك خالد (البوابة الشمالية)</span>
              <span style="color:var(--fbsu-gold); font-weight:700;">📡 مزامنة MQTT نشطة</span>
              <span>كلية الهندسة والحاسب <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg></span>
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
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:10px;">
              <div class="filter-scroll-container">
                <span class="btn btn-teal-primary" style="padding:4px 8px; font-size:11px; white-space:nowrap;">جميع المواقف (30)</span>
                <span class="btn btn-ghost-outline-light" style="padding:4px 8px; font-size:11px; white-space:nowrap;">قطاع A - الحاسب والهندسة</span>
                <span class="btn btn-ghost-outline-light" style="padding:4px 8px; font-size:11px; white-space:nowrap;">قطاع B - الأعمال والطب</span>
                <span class="btn btn-ghost-outline-light" style="padding:4px 8px; font-size:11px; white-space:nowrap;">قطاع C - كادر التدريس</span>
                <span class="btn btn-ghost-outline-light" style="padding:4px 8px; font-size:11px; white-space:nowrap;">قطاع D - شحن EV وهمم</span>
              </div>
              <div style="display:flex; gap:10px; font-size:10.5px; color:#475569; font-weight:700; flex-wrap:wrap;">
                <span style="display:flex; align-items:center; gap:4px;"><span style="width:7px; height:7px; border-radius:50%; background:#10b981;"></span> متاح (16)</span>
                <span style="display:flex; align-items:center; gap:4px;"><span style="width:7px; height:7px; border-radius:50%; background:#f43f5e;"></span> مشغول (8)</span>
                <span style="display:flex; align-items:center; gap:4px;"><span style="width:7px; height:7px; border-radius:50%; background:#d7a237;"></span> تبادل (2)</span>
                <span style="display:flex; align-items:center; gap:4px;"><span style="width:7px; height:7px; border-radius:50%; background:#8b5cf6;"></span> دكاترة (4)</span>
              </div>
            </div>

            <!-- Wayfinding Bar Light -->
            <div class="wayfinding-strip-light">
              <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg> طريق الملك خالد (البوابة الشمالية)</span>
              <span style="color:#b45309; font-weight:800;">📡 مزامنة MQTT نشطة</span>
              <span>كلية الهندسة والحاسب <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg></span>
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
            <span class="frame-spec-chip">Responsive Grid (6 col desktop / 2 col mobile)</span>
          </div>
          <div class="token-grid">
            <div class="token-item"><span class="token-name">grid-breakpoints</span><span class="token-val">Desktop: 6 Cols | Tablet: 3 Cols | Mobile: 2 Cols</span></div>
            <div class="token-item"><span class="token-name">bay-card-radius</span><span class="token-val">8px (Min-height: 120px)</span></div>
            <div class="token-item"><span class="token-name">status-available</span><span class="token-val"><span class="color-swatch-mini" style="background:#10b981;"></span>#10b981 (16 Bays)</span></div>
            <div class="token-item"><span class="token-name">status-occupied</span><span class="token-val"><span class="color-swatch-mini" style="background:#f43f5e;"></span>#f43f5e (8 Bays)</span></div>
            <div class="token-item"><span class="token-name">status-flex-share</span><span class="token-val"><span class="color-swatch-mini" style="background:#d7a237;"></span>#d7a237 (2 Bays)</span></div>
            <div class="token-item"><span class="token-name">status-faculty-vip</span><span class="token-val"><span class="color-swatch-mini" style="background:#8b5cf6;"></span>#8b5cf6 (4 Bays)</span></div>
          </div>
        </div>
      </div>
    </section>

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
          <div class="figma-frame-body-dark" style="display:flex; justify-content:center; padding:16px;">
            <div style="background:#0c1a18; border:1px solid rgba(17,110,99,0.5); border-radius:14px; padding:18px; width:100%; max-width:540px; box-shadow:0 16px 40px rgba(0,0,0,0.6);">
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:10px; margin-bottom:14px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-family:var(--font-mono); font-size:20px; font-weight:900; color:#fff;">موقف #01</span>
                  <span class="status-pill pill-flex">متاح للتبادل</span>
                </div>
                <span style="font-size:11px; color:#94a3b8;">قطاع A - الحاسب والهندسة</span>
              </div>

              <!-- Ultrasonic Sensor Gauge -->
              <div style="background:#0f2420; border:1px solid #1c3b35; border-radius:10px; padding:14px; margin-bottom:14px;">
                <div style="font-size:11.5px; font-weight:700; color:var(--fbsu-gold); margin-bottom:8px; display:flex; justify-content:space-between;">
                  <span>المستشعر الأرضي (40kHz):</span>
                  <span style="color:#10b981; font-weight:800;">متصل 100%</span>
                </div>
                <div class="responsive-sensor-grid">
                  <div style="background:rgba(0,0,0,0.3); padding:6px; border-radius:6px; text-align:center;">
                    <div style="font-size:9.5px; color:#888;">المسافة</div>
                    <div style="font-family:var(--font-mono); font-weight:800; color:#fff; font-size:12.5px;">25.4 سم</div>
                  </div>
                  <div style="background:rgba(0,0,0,0.3); padding:6px; border-radius:6px; text-align:center;">
                    <div style="font-size:9.5px; color:#888;">البطارية</div>
                    <div style="font-family:var(--font-mono); font-weight:800; color:#10b981; font-size:12.5px;">98%</div>
                  </div>
                  <div style="background:rgba(0,0,0,0.3); padding:6px; border-radius:6px; text-align:center;">
                    <div style="font-size:9.5px; color:#888;">الإشارة</div>
                    <div style="font-family:var(--font-mono); font-weight:800; color:var(--figma-blue); font-size:12.5px;">-42 dBm</div>
                  </div>
                  <div style="background:rgba(0,0,0,0.3); padding:6px; border-radius:6px; text-align:center;">
                    <div style="font-size:9.5px; color:#888;">الحرارة</div>
                    <div style="font-family:var(--font-mono); font-weight:800; color:#f59e0b; font-size:12.5px;">26.8°C</div>
                  </div>
                </div>
              </div>

              <!-- Driver details -->
              <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:10px 14px; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
                <div>
                  <div style="font-size:11px; color:#888;">الطالب الأساسي:</div>
                  <div style="font-weight:700; color:#fff; font-size:12.5px;">إياد الحربي (غادر في بريك)</div>
                  <div style="font-size:10.5px; color:var(--fbsu-gold); margin-top:2px;">النافذة الشاغرة: 10:00 ص - 01:30 م</div>
                </div>
                <span class="saudi-plate" style="height:34px;">
                  <div class="plate-letters-section"><span class="plate-ar" style="font-size:10px;">ب ط ك</span></div>
                  <div class="plate-digits-section"><span class="plate-ar" style="font-size:10px;">١ ٢ ٣ ٤</span></div>
                  <div class="plate-emblem" style="font-size:6px;">🇸🇦</div>
                </span>
              </div>

              <div class="btn-cluster-wrap">
                <button class="btn btn-gold-accent" style="flex:1;">حجز هذا الموقف (5.75 ر.س/س)</button>
                <button class="btn btn-ghost-outline-dark" style="flex:1;">توجيه GPS</button>
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
          <div class="figma-frame-body-light" style="display:flex; justify-content:center; padding:16px; background:#f1f5f9;">
            <div style="background:#ffffff; border:1.5px solid rgba(17,110,99,0.3); border-radius:14px; padding:18px; width:100%; max-width:540px; box-shadow:0 12px 35px rgba(0,0,0,0.08);">
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:10px; margin-bottom:14px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-family:var(--font-mono); font-size:20px; font-weight:900; color:#0f172a;">موقف #01</span>
                  <span class="status-pill pill-flex">متاح للتبادل</span>
                </div>
                <span style="font-size:11px; color:#64748b; font-weight:700;">قطاع A - الحاسب والهندسة</span>
              </div>

              <!-- Ultrasonic Sensor Gauge -->
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:14px; margin-bottom:14px;">
                <div style="font-size:11.5px; font-weight:800; color:#b45309; margin-bottom:8px; display:flex; justify-content:space-between;">
                  <span>المستشعر الأرضي (40kHz):</span>
                  <span style="color:#059669; font-weight:800;">متصل 100%</span>
                </div>
                <div class="responsive-sensor-grid">
                  <div style="background:#ffffff; border:1px solid #cbd5e1; padding:6px; border-radius:6px; text-align:center;">
                    <div style="font-size:9.5px; color:#64748b;">المسافة</div>
                    <div style="font-family:var(--font-mono); font-weight:800; color:#0f172a; font-size:12.5px;">25.4 سم</div>
                  </div>
                  <div style="background:#ffffff; border:1px solid #cbd5e1; padding:6px; border-radius:6px; text-align:center;">
                    <div style="font-size:9.5px; color:#64748b;">البطارية</div>
                    <div style="font-family:var(--font-mono); font-weight:800; color:#059669; font-size:12.5px;">98%</div>
                  </div>
                  <div style="background:#ffffff; border:1px solid #cbd5e1; padding:6px; border-radius:6px; text-align:center;">
                    <div style="font-size:9.5px; color:#64748b;">الإشارة</div>
                    <div style="font-family:var(--font-mono); font-weight:800; color:#0284c7; font-size:12.5px;">-42 dBm</div>
                  </div>
                  <div style="background:#ffffff; border:1px solid #cbd5e1; padding:6px; border-radius:6px; text-align:center;">
                    <div style="font-size:9.5px; color:#64748b;">الحرارة</div>
                    <div style="font-family:var(--font-mono); font-weight:800; color:#d97706; font-size:12.5px;">26.8°C</div>
                  </div>
                </div>
              </div>

              <!-- Driver details -->
              <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 14px; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
                <div>
                  <div style="font-size:11px; color:#64748b;">الطالب الأساسي:</div>
                  <div style="font-weight:800; color:#0f172a; font-size:12.5px;">إياد الحربي (غادر في بريك)</div>
                  <div style="font-size:10.5px; color:#b45309; font-weight:700; margin-top:2px;">النافذة الشاغرة: 10:00 ص - 01:30 م</div>
                </div>
                <span class="saudi-plate" style="height:34px;">
                  <div class="plate-letters-section"><span class="plate-ar" style="font-size:10px;">ب ط ك</span></div>
                  <div class="plate-digits-section"><span class="plate-ar" style="font-size:10px;">١ ٢ ٣ ٤</span></div>
                  <div class="plate-emblem" style="font-size:6px;">🇸🇦</div>
                </span>
              </div>

              <div class="btn-cluster-wrap">
                <button class="btn btn-gold-accent" style="flex:1;">حجز هذا الموقف (5.75 ر.س/س)</button>
                <button class="btn btn-ghost-outline-light" style="flex:1;">توجيه GPS</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Specs Panel -->
        <div class="figma-inspect-panel">
          <div class="inspect-panel-header">
            <span class="inspect-panel-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--figma-blue)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>IoT Ultrasonic Sensor Hardware Specifications</span>
            </span>
            <span class="frame-spec-chip">IP68 Waterproof In-Ground Capsule</span>
          </div>
          <div class="token-grid">
            <div class="token-item"><span class="token-name">sensor-frequency</span><span class="token-val">40 kHz Ultrasonic Dual Transducer</span></div>
            <div class="token-item"><span class="token-name">detection-range</span><span class="token-val">10 cm to 350 cm (±1 cm precision)</span></div>
            <div class="token-item"><span class="token-name">wireless-protocol</span><span class="token-val">LoRaWAN AS923 / MQTT Keepalive: 30s</span></div>
            <div class="token-item"><span class="token-name">battery-life</span><span class="token-val">5+ Years (Built-in Li-SOCl2 8500mAh)</span></div>
          </div>
        </div>
      </div>
    </section>
    """
