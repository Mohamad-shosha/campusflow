# -*- coding: utf-8 -*-
import os

def get_header_code():
    return """
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
              <span class="frame-spec-chip">Auto Layout Horizontal</span>
              <span class="frame-spec-chip">Max-Width: 1220px</span>
            </div>
          </div>
          <div class="figma-frame-body-dark" style="padding:0;">
            <!-- Ribbon Dark -->
            <div style="background:linear-gradient(90deg, #091715 0%, #113833 50%, #091715 100%); border-bottom:1px solid rgba(17,110,99,0.3); padding:6px 24px; display:flex; justify-content:space-between; font-size:11px; color:#e2e8f0; max-width:1220px; margin:0 auto;">
              <div style="display:flex; gap:16px; align-items:center;">
                <span style="color:#10b981; font-weight:700; display:flex; align-items:center; gap:5px;">
                  <span style="width:6px; height:6px; background:#10b981; border-radius:50%; box-shadow:0 0 6px #10b981;"></span>
                  <span>جامعة فهد بن سلطان - تبوك</span>
                </span>
                <span>بوابة المواقف الذكية المعتمدة</span>
                <span style="color:var(--fbsu-gold);">التبادل الذكي نشط: 2 مواقف متاحة للتبادل</span>
              </div>
              <div style="display:flex; gap:16px; align-items:center;">
                <span style="color:var(--fbsu-gold);">الفصل الدراسي الأول 1448 هـ</span>
                <span style="font-family:var(--font-mono); color:#cbd5e1;">09:41:22 ص</span>
              </div>
            </div>

            <!-- Header Bar Dark -->
            <div style="padding:12px 24px; display:flex; align-items:center; justify-content:flex-start; gap:14px; border-bottom:1px solid rgba(255,255,255,0.08); max-width:1220px; margin:0 auto;">
              <div style="display:flex; align-items:center; gap:10px;">
                <img src="/fbsu-logo.png" alt="FBSU Logo" style="height:35px; width:auto;">
                <h3 style="font-family:var(--font-heading); font-size:14.5px; font-weight:800; color:#fff; margin:0;">جامعة فهد بن سلطان</h3>
              </div>
              <div style="width:1px; height:20px; background:rgba(255,255,255,0.15);"></div>
              <div style="display:inline-flex; gap:3px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); padding:3px 5px; border-radius:999px;">
                <span class="btn btn-teal-primary" style="padding:4px 9px; font-size:11.5px; border-radius:999px;">خريطة المواقف</span>
                <span class="btn btn-ghost-outline-dark" style="padding:4px 9px; font-size:11.5px; border-radius:999px; border:none;">محاكاة التبادل</span>
                <span class="btn btn-ghost-outline-dark" style="padding:4px 9px; font-size:11.5px; border-radius:999px; border:none;">كاميرات ALPR</span>
                <span class="btn btn-ghost-outline-dark" style="padding:4px 9px; font-size:11.5px; border-radius:999px; border:none;">حجز موقف</span>
                <span class="btn btn-ghost-outline-dark" style="padding:4px 9px; font-size:11.5px; border-radius:999px; border:none;">شارك واربح</span>
                <span class="btn btn-ghost-outline-dark" style="padding:4px 9px; font-size:11.5px; border-radius:999px; border:none;">التحليلات</span>
              </div>
              <div style="display:inline-flex; align-items:center; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:999px; padding:2px 6px; gap:6px;">
                <span style="color:#38c2b0; font-size:11px; font-weight:700; display:inline-flex; align-items:center; gap:3px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                  <span>صوت</span>
                </span>
                <span style="width:1px; height:12px; background:rgba(255,255,255,0.12);"></span>
                <span style="color:#cbd5e1; font-size:11px; font-weight:700; display:inline-flex; align-items:center; gap:3px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  <span>EN</span>
                </span>
                <span style="width:1px; height:12px; background:rgba(255,255,255,0.12);"></span>
                <span style="color:#cbd5e1; font-size:11px; font-weight:700; display:inline-flex; align-items:center; gap:3px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                  <span>ليلي</span>
                </span>
              </div>
              <div style="width:1px; height:18px; background:rgba(255,255,255,0.12);"></div>
              <span style="background:rgba(215,162,55,0.15); border:1px solid rgba(215,162,55,0.4); color:var(--fbsu-gold); padding:4px 9px; border-radius:999px; font-size:11px; font-weight:800; font-family:var(--font-mono);">72.50 ر.س</span>
              <span style="background:var(--fbsu-teal); color:#fff; padding:4px 9px; border-radius:999px; font-size:11px; font-weight:700;">إياد (طالب)</span>
              <span style="background:rgba(215,162,55,0.18); border:1px solid rgba(215,162,55,0.45); color:var(--fbsu-gold); font-size:11px; font-weight:700; padding:4px 9px; border-radius:999px;">فيجما UI/UX</span>
            </div>
          </div>
        </div>

        <!-- Frame 01-B: Light Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 01-Header-Light / Global Navigation Bar</span>
              <span class="frame-theme-badge theme-badge-light">☀️ Light Theme #F2F3F5</span>
              <span class="frame-size-badge">1440 × 106</span>
            </div>
            <div class="frame-actions">
              <span class="frame-spec-chip">High Contrast Institutional</span>
              <span class="frame-spec-chip">WCAG 2.1 AAA (7.8:1)</span>
            </div>
          </div>
          <div class="figma-frame-body-light" style="padding:0;">
            <!-- Ribbon Light -->
            <div style="background:#e8f4f2; border-bottom:1px solid rgba(17,110,99,0.15); padding:6px 24px; display:flex; justify-content:space-between; font-size:11px; color:#0d554c; max-width:1220px; margin:0 auto;">
              <div style="display:flex; gap:16px; align-items:center;">
                <span style="color:#059669; font-weight:700; display:flex; align-items:center; gap:5px;">
                  <span style="width:6px; height:6px; background:#059669; border-radius:50%;"></span>
                  <span>جامعة فهد بن سلطان - تبوك</span>
                </span>
                <span>بوابة المواقف الذكية المعتمدة</span>
                <span style="color:#b45309; font-weight:700;">التبادل الذكي نشط: 2 مواقف متاحة للتبادل</span>
              </div>
              <div style="display:flex; gap:16px; align-items:center;">
                <span style="color:#b45309; font-weight:700;">الفصل الدراسي الأول 1448 هـ</span>
                <span style="font-family:var(--font-mono); color:#475569;">09:41:22 ص</span>
              </div>
            </div>

            <!-- Header Bar Light -->
            <div style="background:#ffffff; padding:12px 24px; display:flex; align-items:center; justify-content:flex-start; gap:14px; border-bottom:1px solid rgba(17,110,99,0.12); max-width:1220px; margin:0 auto; box-shadow:0 2px 10px rgba(17,110,99,0.04);">
              <div style="display:flex; align-items:center; gap:10px;">
                <img src="/fbsu-logo.png" alt="FBSU Logo" style="height:35px; width:auto;">
                <h3 style="font-family:var(--font-heading); font-size:14.5px; font-weight:800; color:#116E63; margin:0;">جامعة فهد بن سلطان</h3>
              </div>
              <div style="width:1px; height:20px; background:rgba(17,110,99,0.2);"></div>
              <div style="display:inline-flex; gap:3px; background:#f1f5f9; border:1px solid #e2e8f0; padding:3px 5px; border-radius:999px;">
                <span class="btn btn-teal-primary" style="padding:4px 9px; font-size:11.5px; border-radius:999px;">خريطة المواقف</span>
                <span class="btn btn-ghost-outline-light" style="padding:4px 9px; font-size:11.5px; border-radius:999px; border:none;">محاكاة التبادل</span>
                <span class="btn btn-ghost-outline-light" style="padding:4px 9px; font-size:11.5px; border-radius:999px; border:none;">كاميرات ALPR</span>
                <span class="btn btn-ghost-outline-light" style="padding:4px 9px; font-size:11.5px; border-radius:999px; border:none;">حجز موقف</span>
                <span class="btn btn-ghost-outline-light" style="padding:4px 9px; font-size:11.5px; border-radius:999px; border:none;">شارك واربح</span>
                <span class="btn btn-ghost-outline-light" style="padding:4px 9px; font-size:11.5px; border-radius:999px; border:none;">التحليلات</span>
              </div>
              <div style="display:inline-flex; align-items:center; background:#ffffff; border:1px solid #cbd5e1; border-radius:999px; padding:2px 6px; gap:6px; box-shadow:0 1px 3px rgba(0,0,0,0.06);">
                <span style="color:#0d9488; font-size:11px; font-weight:700; display:inline-flex; align-items:center; gap:3px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                  <span>صوت</span>
                </span>
                <span style="width:1px; height:12px; background:#e2e8f0;"></span>
                <span style="color:#334155; font-size:11px; font-weight:700; display:inline-flex; align-items:center; gap:3px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  <span>EN</span>
                </span>
                <span style="width:1px; height:12px; background:#e2e8f0;"></span>
                <span style="color:#334155; font-size:11px; font-weight:700; display:inline-flex; align-items:center; gap:3px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                  <span>نهاري</span>
                </span>
              </div>
              <div style="width:1px; height:18px; background:rgba(17,110,99,0.2);"></div>
              <span style="background:rgba(215,162,55,0.12); border:1px solid rgba(215,162,55,0.6); color:#a16207; padding:4px 9px; border-radius:999px; font-size:11px; font-weight:800; font-family:var(--font-mono);">72.50 ر.س</span>
              <span style="background:var(--fbsu-teal); color:#fff; padding:4px 9px; border-radius:999px; font-size:11px; font-weight:700;">إياد (طالب)</span>
              <span style="background:rgba(215,162,55,0.15); border:1px solid rgba(215,162,55,0.5); color:#a16207; font-size:11px; font-weight:700; padding:4px 9px; border-radius:999px;">فيجما UI/UX</span>
            </div>
          </div>
        </div>

        <!-- Specs Panel -->
        <div class="figma-inspect-panel">
          <div class="inspect-panel-header">
            <span class="inspect-panel-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--figma-blue)" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              <span>Design Tokens & Auto-Layout Specification: Header & Ribbon</span>
            </span>
            <span class="frame-spec-chip">RTL Cohesion Checked</span>
          </div>
          <div class="token-grid">
            <div class="token-item"><span class="token-name">container-max-width</span><span class="token-val">1220px</span></div>
            <div class="token-item"><span class="token-name">header-height</span><span class="token-val">58px (Navbar) + 32px (Ribbon)</span></div>
            <div class="token-item"><span class="token-name">logo-dimensions</span><span class="token-val">35px H × auto</span></div>
            <div class="token-item"><span class="token-name">nav-item-padding</span><span class="token-val">4px 9px (Radius: 9999px)</span></div>
            <div class="token-item"><span class="token-name">color-primary-teal</span><span class="token-val"><span class="color-swatch-mini" style="background:#116E63;"></span>#116E63</span></div>
            <div class="token-item"><span class="token-name">color-academic-gold</span><span class="token-val"><span class="color-swatch-mini" style="background:#d7a237;"></span>#d7a237</span></div>
            <div class="token-item"><span class="token-name">dark-bg-glass</span><span class="token-val"><span class="color-swatch-mini" style="background:rgba(9,20,18,0.96);"></span>rgba(9,20,18,0.96)</span></div>
            <div class="token-item"><span class="token-name">light-bg-card</span><span class="token-val"><span class="color-swatch-mini" style="background:#ffffff;"></span>#ffffff (Border #e2e8f0)</span></div>
          </div>
        </div>
      </div>
    </section>
    """

print("Writing generator...")
