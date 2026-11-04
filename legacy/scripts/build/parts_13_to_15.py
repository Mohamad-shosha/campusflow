# -*- coding: utf-8 -*-
"""
Sections 13 to 15 for Master Figma UI/UX Showcase (Ultra-Responsive Mobile & Desktop)
- Section 13: Responsive Multi-Device Canvas (1920p, 1440p, 768p, 375p)
- Section 14: Design System Tokens & Complete SVG Icon Library
- Section 15: System Architecture & Lifecycle State Machine
"""

def get_sections_13_to_15():
    return """
    <!-- ====================================================================
         SECTION 13: RESPONSIVE MULTI-DEVICE CANVAS (DUAL THEME / MULTI-DEVICE)
         ==================================================================== -->
    <section id="f-devices">
      <div class="board-section-header">
        <div class="board-title">
          <h2>13. مصفوفة الأجهزة المتجاوبة (Responsive Multi-Device Artboards)</h2>
          <span class="board-tag">Cross-Platform Responsive Matrix</span>
        </div>
      </div>

      <div class="figma-dual-container">
        <!-- Frame 13: Multi-Device Artboard Set -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 13-Responsive / 4 Viewports (Desktop 1920p, Laptop 1440p, Tablet 768p, Mobile 375p)</span>
              <span class="frame-size-badge">Auto Layout Responsive</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">Zero Breakpoint Drift</span></div>
          </div>
          <div class="figma-frame-body-dark" style="padding:18px;">
            <div class="responsive-devices-grid">
              <!-- 1. Desktop 1920p -->
              <div style="background:#0c1a18; border:1px solid rgba(17,110,99,0.4); border-radius:10px; padding:12px; font-size:11px;">
                <div style="display:flex; justify-content:space-between; color:var(--fbsu-gold); font-weight:800; margin-bottom:6px; border-bottom:1px solid #1c3b35; padding-bottom:4px;">
                  <span>Desktop (1920 × 1080)</span>
                  <span style="font-family:var(--font-mono);">1920p</span>
                </div>
                <div style="min-height:90px; background:#081211; border-radius:6px; border:1px dashed #1e3d36; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:8px;">
                  <span style="color:#10b981; font-weight:700;">Full 6-Column 30-Bay Grid</span>
                  <span style="color:#888; font-size:9.5px; margin-top:3px;">شاشة قيادة وتحكم متكاملة تعرض خريطة المواقف وحساسات إنترنت الأشياء والتحليلات</span>
                </div>
              </div>

              <!-- 2. Laptop 1440p -->
              <div style="background:#0c1a18; border:1px solid rgba(17,110,99,0.4); border-radius:10px; padding:12px; font-size:11px;">
                <div style="display:flex; justify-content:space-between; color:var(--fbsu-gold); font-weight:800; margin-bottom:6px; border-bottom:1px solid #1c3b35; padding-bottom:4px;">
                  <span>Laptop (1440 × 900)</span>
                  <span style="font-family:var(--font-mono);">1440p</span>
                </div>
                <div style="min-height:90px; background:#081211; border-radius:6px; border:1px dashed #1e3d36; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:8px;">
                  <span style="color:#38c2b0; font-weight:700;">Standard Student Portal</span>
                  <span style="color:#888; font-size:9.5px; margin-top:3px;">لوحة طالب متجاوبة مع الحجز الأكاديمي، كاشباك التبادل، ومحفظة مدى الرقمية</span>
                </div>
              </div>

              <!-- 3. Tablet 768p -->
              <div style="background:#0c1a18; border:1px solid rgba(17,110,99,0.4); border-radius:10px; padding:12px; font-size:11px;">
                <div style="display:flex; justify-content:space-between; color:var(--fbsu-gold); font-weight:800; margin-bottom:6px; border-bottom:1px solid #1c3b35; padding-bottom:4px;">
                  <span>Tablet (768 × 1024)</span>
                  <span style="font-family:var(--font-mono);">768p</span>
                </div>
                <div style="min-height:90px; background:#081211; border-radius:6px; border:1px dashed #1e3d36; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:8px;">
                  <span style="color:var(--fbsu-gold); font-weight:700;">In-Car Navigation HUD</span>
                  <span style="color:#888; font-size:9.5px; margin-top:3px;">شاشة توجيه لمسي أثناء قيادة السيارة لدخول الحرم الجامعي</span>
                </div>
              </div>

              <!-- 4. Mobile 375p -->
              <div style="background:#0c1a18; border:1px solid rgba(17,110,99,0.4); border-radius:10px; padding:12px; font-size:11px;">
                <div style="display:flex; justify-content:space-between; color:var(--fbsu-gold); font-weight:800; margin-bottom:6px; border-bottom:1px solid #1c3b35; padding-bottom:4px;">
                  <span>Mobile (375 × 812)</span>
                  <span style="font-family:var(--font-mono);">375p</span>
                </div>
                <div style="min-height:90px; background:#081211; border-radius:6px; border:1px dashed #1e3d36; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:8px;">
                  <span style="color:#f43f5e; font-weight:700;">Pocket QR Pass & Pay</span>
                  <span style="color:#888; font-size:9.5px; margin-top:3px;">بطاقة صعود رقمية ومسح الباركود على بوابات الدخول السريع</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Specs Panel -->
        <div class="figma-inspect-panel">
          <div class="inspect-panel-header">
            <span class="inspect-panel-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--figma-blue)" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              <span>Responsive Breakpoints & Touch Target Guidelines</span>
            </span>
            <span class="frame-spec-chip">Fluid Typography Clamp</span>
          </div>
          <div class="token-grid">
            <div class="token-item"><span class="token-name">mobile-breakpoint</span><span class="token-val">375px - 767px (Single column flow, bottom action sheets)</span></div>
            <div class="token-item"><span class="token-name">tablet-breakpoint</span><span class="token-val">768px - 1023px (2-column grid, 48px minimum touch target)</span></div>
            <div class="token-item"><span class="token-name">laptop-breakpoint</span><span class="token-val">1024px - 1439px (Adaptive multi-panel layout)</span></div>
            <div class="token-item"><span class="token-name">desktop-ultrawide</span><span class="token-val">1440px+ (Max container constraint: 1220px centered)</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====================================================================
         SECTION 14: DESIGN SYSTEM TOKENS & ICON LIBRARY (COMPREHENSIVE)
         ==================================================================== -->
    <section id="f-tokens">
      <div class="board-section-header">
        <div class="board-title">
          <h2>14. الرموز التصميمية ومكتبة الأيقونات (Design System Tokens & Complete Iconography)</h2>
          <span class="board-tag">Design System Specification</span>
        </div>
      </div>

      <div class="figma-dual-container">
        <!-- Frame 14: Tokens & Specs Matrix -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 14-DesignTokens / Color Matrix, Typography Scale, Radius, Shadows & 24 SVG Icons</span>
              <span class="frame-size-badge">1440 × 680</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">Figma Variables Library</span></div>
          </div>
          <div class="figma-frame-body-dark" style="padding:18px;">
            <!-- Color Palettes -->
            <div style="margin-bottom:20px;">
              <h4 style="font-size:12.5px; font-weight:800; color:var(--fbsu-gold); margin-bottom:10px;">1. لوحة الألوان الرسمية للمنظومة (FBSU Color Token Swatches):</h4>
              <div class="responsive-swatches-grid">
                <div style="background:#116E63; border-radius:8px; padding:10px; color:#fff; text-align:center;">
                  <div style="font-weight:800; font-size:11.5px;">Spruce Teal</div>
                  <div style="font-family:var(--font-mono); font-size:10.5px; opacity:0.9;">#116E63</div>
                  <div style="font-size:9.5px; margin-top:2px;">Primary Brand</div>
                </div>
                <div style="background:#d7a237; border-radius:8px; padding:10px; color:#0b1a17; text-align:center;">
                  <div style="font-weight:800; font-size:11.5px;">Academic Gold</div>
                  <div style="font-family:var(--font-mono); font-size:10.5px; font-weight:800;">#d7a237</div>
                  <div style="font-size:9.5px; margin-top:2px;">Secondary / Flex</div>
                </div>
                <div style="background:#10b981; border-radius:8px; padding:10px; color:#fff; text-align:center;">
                  <div style="font-weight:800; font-size:11.5px;">Available Emerald</div>
                  <div style="font-family:var(--font-mono); font-size:10.5px; opacity:0.9;">#10b981</div>
                  <div style="font-size:9.5px; margin-top:2px;">Vacant Bay</div>
                </div>
                <div style="background:#f43f5e; border-radius:8px; padding:10px; color:#fff; text-align:center;">
                  <div style="font-weight:800; font-size:11.5px;">Occupied Rose</div>
                  <div style="font-family:var(--font-mono); font-size:10.5px; opacity:0.9;">#f43f5e</div>
                  <div style="font-size:9.5px; margin-top:2px;">Parked Vehicle</div>
                </div>
                <div style="background:#8b5cf6; border-radius:8px; padding:10px; color:#fff; text-align:center;">
                  <div style="font-weight:800; font-size:11.5px;">Faculty Violet</div>
                  <div style="font-family:var(--font-mono); font-size:10.5px; opacity:0.9;">#8b5cf6</div>
                  <div style="font-size:9.5px; margin-top:2px;">VIP Staff</div>
                </div>
                <div style="background:#081211; border:1px solid #1e3d36; border-radius:8px; padding:10px; color:#cbd5e1; text-align:center;">
                  <div style="font-weight:800; font-size:11.5px;">Midnight Forest</div>
                  <div style="font-family:var(--font-mono); font-size:10.5px; color:#10b981;">#081211</div>
                  <div style="font-size:9.5px; margin-top:2px;">Dark Canvas</div>
                </div>
              </div>
            </div>

            <!-- Typography & Elevation -->
            <div class="responsive-split-2col" style="margin-bottom:20px;">
              <div style="background:#0c1a18; border:1px solid #1c3b35; border-radius:10px; padding:14px;">
                <h5 style="font-size:12px; font-weight:800; color:var(--fbsu-gold); margin-bottom:8px;">2. مقياس الخطوط الطباعية (Typography Scale):</h5>
                <div style="display:flex; flex-direction:column; gap:6px; font-size:11px;">
                  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #18302b; padding-bottom:4px;">
                    <span style="font-family:var(--font-heading); font-size:15px; font-weight:900; color:#fff;">Display (Tajawal 900)</span>
                    <span style="font-family:var(--font-mono); color:#888;">27px</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #18302b; padding-bottom:4px;">
                    <span style="font-family:var(--font-heading); font-size:13.5px; font-weight:800; color:#fff;">Heading (Tajawal 800)</span>
                    <span style="font-family:var(--font-mono); color:#888;">20px</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #18302b; padding-bottom:4px;">
                    <span style="font-family:var(--font-body); font-size:12px; color:#cbd5e1;">Body (Alexandria 400)</span>
                    <span style="font-family:var(--font-mono); color:#888;">13px</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-family:var(--font-mono); font-size:11px; color:var(--fbsu-gold);">Mono (JetBrains Mono 700)</span>
                    <span style="font-family:var(--font-mono); color:#888;">11px</span>
                  </div>
                </div>
              </div>

              <div style="background:#0c1a18; border:1px solid #1c3b35; border-radius:10px; padding:14px;">
                <h5 style="font-size:12px; font-weight:800; color:var(--fbsu-gold); margin-bottom:8px;">3. نظام الحواف (Radius System):</h5>
                <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; text-align:center;">
                  <div style="background:#081211; border:1px solid #1e3d36; border-radius:4px; padding:6px;">
                    <div style="font-family:var(--font-mono); font-size:11px; color:#fff;">sm</div>
                    <div style="font-size:9.5px; color:#888;">4px</div>
                  </div>
                  <div style="background:#081211; border:1px solid #1e3d36; border-radius:8px; padding:6px;">
                    <div style="font-family:var(--font-mono); font-size:11px; color:#fff;">md</div>
                    <div style="font-size:9.5px; color:#888;">8px</div>
                  </div>
                  <div style="background:#081211; border:1px solid #1e3d36; border-radius:14px; padding:6px;">
                    <div style="font-family:var(--font-mono); font-size:11px; color:#fff;">lg</div>
                    <div style="font-size:9.5px; color:#888;">14px</div>
                  </div>
                  <div style="background:#081211; border:1px solid #1e3d36; border-radius:999px; padding:6px;">
                    <div style="font-family:var(--font-mono); font-size:11px; color:#fff;">full</div>
                    <div style="font-size:9.5px; color:#888;">999px</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Complete SVG Iconography Gallery (No emojis) -->
            <div>
              <h4 style="font-size:12.5px; font-weight:800; color:var(--fbsu-gold); margin-bottom:10px;">4. مكتبة الأيقونات المتجهية SVG (100% Native SVG Vectors):</h4>
              <div class="responsive-icons-grid">
                <div style="background:#081211; border:1px solid #1e3d36; border-radius:8px; padding:8px; text-align:center;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--fbsu-teal)" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                  <div style="font-size:9.5px; color:#cbd5e1; margin-top:3px;">flex-swap</div>
                </div>
                <div style="background:#081211; border:1px solid #1e3d36; border-radius:8px; padding:8px; text-align:center;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
                  <div style="font-size:9.5px; color:#cbd5e1; margin-top:3px;">schedule</div>
                </div>
                <div style="background:#081211; border:1px solid #1e3d36; border-radius:8px; padding:8px; text-align:center;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--fbsu-gold)" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                  <div style="font-size:9.5px; color:#cbd5e1; margin-top:3px;">wallet</div>
                </div>
                <div style="background:#081211; border:1px solid #1e3d36; border-radius:8px; padding:8px; text-align:center;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d99ff" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  <div style="font-size:9.5px; color:#cbd5e1; margin-top:3px;">alpr-cam</div>
                </div>
                <div style="background:#081211; border:1px solid #1e3d36; border-radius:8px; padding:8px; text-align:center;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <div style="font-size:9.5px; color:#cbd5e1; margin-top:3px;">vip-faculty</div>
                </div>
                <div style="background:#081211; border:1px solid #1e3d36; border-radius:8px; padding:8px; text-align:center;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  <div style="font-size:9.5px; color:#cbd5e1; margin-top:3px;">occupied</div>
                </div>
                <div style="background:#081211; border:1px solid #1e3d36; border-radius:8px; padding:8px; text-align:center;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <div style="font-size:9.5px; color:#cbd5e1; margin-top:3px;">verified</div>
                </div>
                <div style="background:#081211; border:1px solid #1e3d36; border-radius:8px; padding:8px; text-align:center;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38c2b0" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  <div style="font-size:9.5px; color:#cbd5e1; margin-top:3px;">ev-fast</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====================================================================
         SECTION 15: SYSTEM ARCHITECTURE & STATE MACHINE (BLUEPRINTS)
         ==================================================================== -->
    <section id="f-architecture">
      <div class="board-section-header">
        <div class="board-title">
          <h2>15. معمارية وحالات النظام (System Architecture & State Machine Lifecycle)</h2>
          <span class="board-tag">Engineering Blueprints & Flowcharts</span>
        </div>
      </div>

      <div class="figma-dual-container">
        <!-- Frame 15: Blueprints Artboard -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 15-Architecture / 4-Layer Microservices Topology & 6-State Lifecycle Machine</span>
              <span class="frame-size-badge">1440 × 580</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">MQTT / Edge Compute</span></div>
          </div>
          <div class="figma-frame-body-dark" style="padding:18px;">
            <!-- 4-Layer Architecture Diagram -->
            <div style="margin-bottom:20px;">
              <h4 style="font-size:12.5px; font-weight:800; color:var(--fbsu-gold); margin-bottom:10px;">معمارية تدفق البيانات بين الطبقات (End-to-End System Topology):</h4>
              <div class="responsive-topology-grid">
                <div style="background:#081211; border:1px solid rgba(17,110,99,0.5); border-radius:8px; padding:12px;">
                  <div style="font-size:11px; font-weight:800; color:var(--fbsu-gold); margin-bottom:5px;">1. Client / Portal Layer</div>
                  <ul style="list-style:none; padding:0; margin:0; font-size:10px; color:#cbd5e1; display:flex; flex-direction:column; gap:3px;">
                    <li>• PWA Responsive Web App</li>
                    <li>• Apple / Google Wallet Passes</li>
                    <li>• Native Gate QR Kiosk</li>
                  </ul>
                </div>
                <div style="background:#081211; border:1px solid rgba(17,110,99,0.5); border-radius:8px; padding:12px;">
                  <div style="font-size:11px; font-weight:800; color:#38c2b0; margin-bottom:5px;">2. Edge & IoT Layer</div>
                  <ul style="list-style:none; padding:0; margin:0; font-size:10px; color:#cbd5e1; display:flex; flex-direction:column; gap:3px;">
                    <li>• 30 In-Ground Ultrasonic Nodes</li>
                    <li>• 4K Hikvision ALPR Cameras</li>
                    <li>• Barrier Motor Controller (CAN-bus)</li>
                  </ul>
                </div>
                <div style="background:#081211; border:1px solid rgba(17,110,99,0.5); border-radius:8px; padding:12px;">
                  <div style="font-size:11px; font-weight:800; color:#10b981; margin-bottom:5px;">3. AI & Swapping Engine</div>
                  <ul style="list-style:none; padding:0; margin:0; font-size:10px; color:#cbd5e1; display:flex; flex-direction:column; gap:3px;">
                    <li>• YOLOv8 Optical OCR Pipeline</li>
                    <li>• SIS Class Schedule Matcher</li>
                    <li>• Dynamic Cashback Calculator</li>
                  </ul>
                </div>
                <div style="background:#081211; border:1px solid rgba(17,110,99,0.5); border-radius:8px; padding:12px;">
                  <div style="font-size:11px; font-weight:800; color:#d7a237; margin-bottom:5px;">4. Enterprise SIS & Bank</div>
                  <ul style="list-style:none; padding:0; margin:0; font-size:10px; color:#cbd5e1; display:flex; flex-direction:column; gap:3px;">
                    <li>• Banner Student Information API</li>
                    <li>• SAMA Mada Payment Vault</li>
                    <li>• University Campus Security DB</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- State Machine Flow -->
            <div>
              <h4 style="font-size:12.5px; font-weight:800; color:var(--fbsu-gold); margin-bottom:10px;">دورة حياة الموقف وحالات التبادل (Vehicle State Lifecycle Machine):</h4>
              <div class="state-machine-scroll-wrapper">
                <div style="background:#081211; border:1px solid #1e3d36; border-radius:6px; padding:8px 10px; min-width:130px; text-align:center; flex:0 0 auto;">
                  <div style="font-size:9.5px; color:#888;">State 1</div>
                  <div style="font-weight:700; font-size:11px; color:#fff;">اقتراب السيارة</div>
                  <div style="font-size:9px; color:#0d99ff;">ALPR Target Lock</div>
                </div>
                <span style="color:#888; flex:0 0 auto;">➔</span>
                <div style="background:#081211; border:1px solid #1e3d36; border-radius:6px; padding:8px 10px; min-width:130px; text-align:center; flex:0 0 auto;">
                  <div style="font-size:9.5px; color:#888;">State 2</div>
                  <div style="font-weight:700; font-size:11px; color:#10b981;">رفع الحاجز</div>
                  <div style="font-size:9px; color:#10b981;">Barrier Open 90°</div>
                </div>
                <span style="color:#888; flex:0 0 auto;">➔</span>
                <div style="background:#081211; border:1px solid #1e3d36; border-radius:6px; padding:8px 10px; min-width:130px; text-align:center; flex:0 0 auto;">
                  <div style="font-size:9.5px; color:#888;">State 3</div>
                  <div style="font-weight:700; font-size:11px; color:#f43f5e;">اصطفاف الطالب</div>
                  <div style="font-size:9px; color:#f43f5e;">Sensor Tripped</div>
                </div>
                <span style="color:#888; flex:0 0 auto;">➔</span>
                <div style="background:#081211; border:1.5px solid var(--fbsu-gold); border-radius:6px; padding:8px 10px; min-width:130px; text-align:center; flex:0 0 auto;">
                  <div style="font-size:9.5px; color:var(--fbsu-gold);">State 4 (Flex)</div>
                  <div style="font-weight:800; font-size:11px; color:#fff;">خروج بالبريك</div>
                  <div style="font-size:9px; color:var(--fbsu-gold);">Offered to Rakan</div>
                </div>
                <span style="color:#888; flex:0 0 auto;">➔</span>
                <div style="background:#081211; border:1px solid #1e3d36; border-radius:6px; padding:8px 10px; min-width:130px; text-align:center; flex:0 0 auto;">
                  <div style="font-size:9.5px; color:#888;">State 5</div>
                  <div style="font-weight:700; font-size:11px; color:#10b981;">إيداع الكاشباك</div>
                  <div style="font-size:9px; color:#10b981;">+17.25 SAR to Eyad</div>
                </div>
                <span style="color:#888; flex:0 0 auto;">➔</span>
                <div style="background:#081211; border:1px solid #1e3d36; border-radius:6px; padding:8px 10px; min-width:130px; text-align:center; flex:0 0 auto;">
                  <div style="font-size:9.5px; color:#888;">State 6</div>
                  <div style="font-weight:700; font-size:11px; color:#38c2b0;">عودة مضمونة</div>
                  <div style="font-size:9px; color:#38c2b0;">Guaranteed Spot</div>
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
              <span>System Telemetry Broker & MQTT Topics Tree</span>
            </span>
            <span class="frame-spec-chip">Mosquitto / HiveMQ Broker</span>
          </div>
          <div class="token-grid">
            <div class="token-item"><span class="token-name">mqtt-topic-telemetry</span><span class="token-val">fbsu/parking/bay/{id}/sensor (Payload: JSON)</span></div>
            <div class="token-item"><span class="token-name">mqtt-topic-alpr</span><span class="token-val">fbsu/gates/{gate_id}/plate_event (QoS: 2)</span></div>
            <div class="token-item"><span class="token-name">end-to-end-latency</span><span class="token-val">&lt; 180 ms from ultrasonic bounce to UI refresh</span></div>
            <div class="token-item"><span class="token-name">system-uptime-sla</span><span class="token-val">99.98% High Availability Cluster on Campus Premise</span></div>
          </div>
        </div>
      </div>
    </section>
    """
