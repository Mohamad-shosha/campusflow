# -*- coding: utf-8 -*-
"""
Sections 09 to 12 for Master Figma UI/UX Showcase (Ultra-Responsive Mobile & Desktop)
- Section 09: Campus Digital Wallet & Transaction History (Dark & Light)
- Section 10: Analytics & Occupancy Forecasting (Dark & Light)
- Section 11: Unified SSO Portal & Vehicle Verification (Dark & Light)
- Section 12: Institutional Footer & Campus Governance (Dark & Light)
"""

def get_sections_09_to_12():
    return """
    <!-- ====================================================================
         SECTION 09: CAMPUS DIGITAL WALLET & TRANSACTION HISTORY (DUAL THEME)
         ==================================================================== -->
    <section id="f-wallet">
      <div class="board-section-header">
        <div class="board-title">
          <h2>09. المحفظة الرقمية وسجل العمليات المالية (Campus Digital Wallet & Ledger)</h2>
          <span class="board-tag">Dual-Theme Financial Ledger</span>
        </div>
      </div>

      <div class="figma-dual-container">
        <!-- Frame 09-A: Dark Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 09-Wallet-Dark / Virtual Smart Card & 5-Row Financial Ledger</span>
              <span class="frame-theme-badge theme-badge-dark">🌙 Dark Theme</span>
              <span class="frame-size-badge">1440 × 440</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">Encrypted Balance Ledger</span></div>
          </div>
          <div class="figma-frame-body-dark">
            <div class="responsive-split-2col">
              <!-- Virtual Card Dark -->
              <div style="background:linear-gradient(135deg, #116E63 0%, #082d27 100%); border:1px solid rgba(215,162,55,0.4); border-radius:16px; padding:20px; color:#fff; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 12px 30px rgba(0,0,0,0.5); min-height:180px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:12.5px; font-weight:800;">محفظة جامعة فهد بن سلطان</span>
                  <span style="font-size:10.5px; background:rgba(215,162,55,0.3); color:var(--fbsu-gold); padding:2px 7px; border-radius:4px; font-weight:700;">مدى / Apple Pay</span>
                </div>
                <div style="margin:16px 0;">
                  <div style="font-size:10.5px; opacity:0.8;">الرصيد المتاح بالمحفظة:</div>
                  <div style="font-family:var(--font-mono); font-size:28px; font-weight:900; color:var(--fbsu-gold);">72.50 ر.س</div>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:10.5px; opacity:0.8;">
                  <span>إياد الحربي (طالب)</span>
                  <span style="font-family:var(--font-mono);">ID: 202100842</span>
                </div>
              </div>

              <!-- Transaction Ledger Dark -->
              <div style="background:#0f2420; border:1px solid #1e3d36; border-radius:12px; padding:14px;">
                <h4 style="font-size:12.5px; font-weight:800; color:#fff; margin-bottom:10px;">سجل العمليات المالية الأخيرة:</h4>
                <div class="table-scroll-container">
                  <table style="width:100%; border-collapse:collapse; font-size:11px; min-width:320px;">
                    <thead>
                      <tr style="border-bottom:1px solid #204038; color:#888; text-align:right;">
                        <th style="padding:6px 0;">نوع العملية</th>
                        <th style="padding:6px 0;">التاريخ / الوقت</th>
                        <th style="padding:6px 0;">الموقف</th>
                        <th style="padding:6px 0;">المبلغ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style="border-bottom:1px solid #162824;">
                        <td style="padding:7px 0; color:#10b981; font-weight:700;">+ إيداع كاشباك تبادل ذكي</td>
                        <td style="color:#888;">اليوم 01:30 م</td>
                        <td>#01</td>
                        <td style="color:#10b981; font-weight:800; font-family:var(--font-mono);">+17.25 ر.س</td>
                      </tr>
                      <tr style="border-bottom:1px solid #162824;">
                        <td style="padding:7px 0; color:#f43f5e; font-weight:700;">- خصم حجز موقف بالساعة</td>
                        <td style="color:#888;">أمس 10:15 ص</td>
                        <td>#01</td>
                        <td style="color:#f43f5e; font-weight:800; font-family:var(--font-mono);">-12.94 ر.س</td>
                      </tr>
                      <tr style="border-bottom:1px solid #162824;">
                        <td style="padding:7px 0; color:#10b981; font-weight:700;">+ شحن محفظة (مدى)</td>
                        <td style="color:#888;">24 سبتمبر</td>
                        <td>-</td>
                        <td style="color:#10b981; font-weight:800; font-family:var(--font-mono);">+50.00 ر.س</td>
                      </tr>
                      <tr style="border-bottom:1px solid #162824;">
                        <td style="padding:7px 0; color:#10b981; font-weight:700;">+ كاشباك تبادل ساعتين</td>
                        <td style="color:#888;">22 سبتمبر</td>
                        <td>#04</td>
                        <td style="color:#10b981; font-weight:800; font-family:var(--font-mono);">+11.50 ر.س</td>
                      </tr>
                      <tr>
                        <td style="padding:7px 0; color:#f43f5e; font-weight:700;">- سقف الحجز اليومي</td>
                        <td style="color:#888;">20 سبتمبر</td>
                        <td>#07</td>
                        <td style="color:#f43f5e; font-weight:800; font-family:var(--font-mono);">-15.00 ر.س</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Frame 09-B: Light Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 09-Wallet-Light / Virtual Smart Card & 5-Row Financial Ledger</span>
              <span class="frame-theme-badge theme-badge-light">☀️ Light Theme</span>
              <span class="frame-size-badge">1440 × 440</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">Commercial Banking View</span></div>
          </div>
          <div class="figma-frame-body-light">
            <div class="responsive-split-2col">
              <!-- Virtual Card Light -->
              <div style="background:linear-gradient(135deg, #0d554c 0%, #116E63 100%); border:1px solid #cbd5e1; border-radius:16px; padding:20px; color:#fff; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 10px 25px rgba(17,110,99,0.25); min-height:180px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:12.5px; font-weight:800;">محفظة جامعة فهد بن سلطان</span>
                  <span style="font-size:10.5px; background:#fef08a; color:#854d0e; padding:2px 7px; border-radius:4px; font-weight:800;">مدى / Apple Pay</span>
                </div>
                <div style="margin:16px 0;">
                  <div style="font-size:10.5px; opacity:0.9;">الرصيد المتاح بالمحفظة:</div>
                  <div style="font-family:var(--font-mono); font-size:28px; font-weight:900; color:#fef08a;">72.50 ر.س</div>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:10.5px; opacity:0.9;">
                  <span>إياد الحربي (طالب)</span>
                  <span style="font-family:var(--font-mono);">ID: 202100842</span>
                </div>
              </div>

              <!-- Transaction Ledger Light -->
              <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:14px; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
                <h4 style="font-size:12.5px; font-weight:800; color:#0f172a; margin-bottom:10px;">سجل العمليات المالية الأخيرة:</h4>
                <div class="table-scroll-container">
                  <table style="width:100%; border-collapse:collapse; font-size:11px; min-width:320px;">
                    <thead>
                      <tr style="border-bottom:1px solid #e2e8f0; color:#64748b; text-align:right;">
                        <th style="padding:6px 0;">نوع العملية</th>
                        <th style="padding:6px 0;">التاريخ / الوقت</th>
                        <th style="padding:6px 0;">الموقف</th>
                        <th style="padding:6px 0;">المبلغ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style="border-bottom:1px solid #f1f5f9;">
                        <td style="padding:7px 0; color:#059669; font-weight:800;">+ إيداع كاشباك تبادل ذكي</td>
                        <td style="color:#64748b;">اليوم 01:30 م</td>
                        <td>#01</td>
                        <td style="color:#059669; font-weight:800; font-family:var(--font-mono);">+17.25 ر.س</td>
                      </tr>
                      <tr style="border-bottom:1px solid #f1f5f9;">
                        <td style="padding:7px 0; color:#e11d48; font-weight:800;">- خصم حجز موقف بالساعة</td>
                        <td style="color:#64748b;">أمس 10:15 ص</td>
                        <td>#01</td>
                        <td style="color:#e11d48; font-weight:800; font-family:var(--font-mono);">-12.94 ر.س</td>
                      </tr>
                      <tr style="border-bottom:1px solid #f1f5f9;">
                        <td style="padding:7px 0; color:#059669; font-weight:800;">+ شحن محفظة (مدى)</td>
                        <td style="color:#64748b;">24 سبتمبر</td>
                        <td>-</td>
                        <td style="color:#059669; font-weight:800; font-family:var(--font-mono);">+50.00 ر.س</td>
                      </tr>
                      <tr style="border-bottom:1px solid #f1f5f9;">
                        <td style="padding:7px 0; color:#059669; font-weight:800;">+ كاشباك تبادل ساعتين</td>
                        <td style="color:#64748b;">22 سبتمبر</td>
                        <td>#04</td>
                        <td style="color:#059669; font-weight:800; font-family:var(--font-mono);">+11.50 ر.س</td>
                      </tr>
                      <tr>
                        <td style="padding:7px 0; color:#e11d48; font-weight:800;">- سقف الحجز اليومي</td>
                        <td style="color:#64748b;">20 سبتمبر</td>
                        <td>#07</td>
                        <td style="color:#e11d48; font-weight:800; font-family:var(--font-mono);">-15.00 ر.س</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Specs Panel -->
        <div class="figma-inspect-panel">
          <div class="inspect-panel-header">
            <span class="inspect-panel-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--figma-blue)" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              <span>Financial Ledger & Mada Payment Gateway Tokenization</span>
            </span>
            <span class="frame-spec-chip">PCI-DSS Compliant</span>
          </div>
          <div class="token-grid">
            <div class="token-item"><span class="token-name">virtual-card-radius</span><span class="token-val">16px (Card aspect: 1.58:1)</span></div>
            <div class="token-item"><span class="token-name">mada-tokenization</span><span class="token-val">Saudi Central Bank (SAMA) Approved Gateway</span></div>
            <div class="token-item"><span class="token-name">instant-reconciliation</span><span class="token-val">Realtime ledger balance synchronization</span></div>
            <div class="token-item"><span class="token-name">cashback-yield-avg</span><span class="token-val">78.50 SAR / student per month</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====================================================================
         SECTION 10: ANALYTICS & OCCUPANCY FORECASTING (DUAL THEME)
         ==================================================================== -->
    <section id="f-analytics">
      <div class="board-section-header">
        <div class="board-title">
          <h2>10. التحليلات والتنبؤ بالإشغال بالذكاء الاصطناعي (Analytics & Occupancy Forecasting)</h2>
          <span class="board-tag">Dual-Theme Predictive Intelligence</span>
        </div>
      </div>

      <div class="figma-dual-container">
        <!-- Frame 10-A: Dark Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 10-Analytics-Dark / Hourly Occupancy Curve & College Distribution Bars</span>
              <span class="frame-theme-badge theme-badge-dark">🌙 Dark Theme</span>
              <span class="frame-size-badge">1440 × 440</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">LSTM Model (MAE: 3.2%)</span></div>
          </div>
          <div class="figma-frame-body-dark">
            <div class="responsive-split-2col">
              <!-- Occupancy Curve Dark -->
              <div style="background:#0f2420; border:1px solid #1e3d36; border-radius:12px; padding:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:6px;">
                  <h4 style="font-size:12px; font-weight:800; color:#fff;">منحنى الإشغال الزمني (08:00 ص - 04:00 م):</h4>
                  <span style="font-size:10.5px; color:#10b981; font-weight:700;">الذروة: 10:00 ص (96%)</span>
                </div>
                <div style="display:flex; align-items:flex-end; gap:8px; height:120px; padding:8px 0; border-bottom:1px solid #204038;">
                  <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:4px;">
                    <span style="font-size:9.5px; font-family:var(--font-mono); color:#cbd5e1;">65%</span>
                    <div style="width:100%; height:70px; background:var(--fbsu-teal); border-radius:4px 4px 0 0;"></div>
                    <span style="font-size:9.5px; color:#888;">08:00ص</span>
                  </div>
                  <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:4px;">
                    <span style="font-size:9.5px; font-family:var(--font-mono); color:#f43f5e; font-weight:800;">96%</span>
                    <div style="width:100%; height:110px; background:#f43f5e; border-radius:4px 4px 0 0; box-shadow:0 0 10px rgba(244,63,94,0.4);"></div>
                    <span style="font-size:9.5px; color:#f43f5e; font-weight:700;">10:00ص</span>
                  </div>
                  <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:4px;">
                    <span style="font-size:9.5px; font-family:var(--font-mono); color:var(--fbsu-gold); font-weight:800;">72%</span>
                    <div style="width:100%; height:80px; background:var(--fbsu-gold); border-radius:4px 4px 0 0;"></div>
                    <span style="font-size:9.5px; color:#888;">11:30ص</span>
                  </div>
                  <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:4px;">
                    <span style="font-size:9.5px; font-family:var(--font-mono); color:#cbd5e1;">88%</span>
                    <div style="width:100%; height:98px; background:var(--fbsu-teal); border-radius:4px 4px 0 0;"></div>
                    <span style="font-size:9.5px; color:#888;">01:00م</span>
                  </div>
                  <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:4px;">
                    <span style="font-size:9.5px; font-family:var(--font-mono); color:#cbd5e1;">45%</span>
                    <div style="width:100%; height:50px; background:var(--fbsu-teal); border-radius:4px 4px 0 0; opacity:0.6;"></div>
                    <span style="font-size:9.5px; color:#888;">03:00م</span>
                  </div>
                </div>
                <div style="margin-top:10px; font-size:11px; color:#10b981; line-height:1.4;">
                  💡 خوارزمية التبادل قللت نسبة المواقف المحجوزة غير المستخدمة بنسبة 83% خلال فترة الذروة!
                </div>
              </div>

              <!-- College Distribution Dark -->
              <div style="background:#0f2420; border:1px solid #1e3d36; border-radius:12px; padding:16px;">
                <h4 style="font-size:12px; font-weight:800; color:#fff; margin-bottom:12px;">إشغال المواقف حسب كليات الجامعة:</h4>
                <div style="display:flex; flex-direction:column; gap:10px;">
                  <div>
                    <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:3px;">
                      <span style="color:#fff;">كلية الهندسة والحاسب</span>
                      <span style="font-family:var(--font-mono); color:var(--fbsu-gold); font-weight:700;">92% (14 موقف)</span>
                    </div>
                    <div style="height:6px; background:#142824; border-radius:4px; overflow:hidden;"><div style="width:92%; height:100%; background:var(--fbsu-teal);"></div></div>
                  </div>
                  <div>
                    <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:3px;">
                      <span style="color:#fff;">كلية إدارة الأعمال</span>
                      <span style="font-family:var(--font-mono); color:#cbd5e1;">74% (8 مواقف)</span>
                    </div>
                    <div style="height:6px; background:#142824; border-radius:4px; overflow:hidden;"><div style="width:74%; height:100%; background:#0284c7;"></div></div>
                  </div>
                  <div>
                    <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:3px;">
                      <span style="color:#fff;">كادر التدريس والدكاترة</span>
                      <span style="font-family:var(--font-mono); color:#cbd5e1;">68% (4 مواقف)</span>
                    </div>
                    <div style="height:6px; background:#142824; border-radius:4px; overflow:hidden;"><div style="width:68%; height:100%; background:#8b5cf6;"></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Frame 10-B: Light Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 10-Analytics-Light / Hourly Occupancy Curve & College Distribution Bars</span>
              <span class="frame-theme-badge theme-badge-light">☀️ Light Theme</span>
              <span class="frame-size-badge">1440 × 440</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">Management Dashboard</span></div>
          </div>
          <div class="figma-frame-body-light">
            <div class="responsive-split-2col">
              <!-- Occupancy Curve Light -->
              <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:16px; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:6px;">
                  <h4 style="font-size:12px; font-weight:800; color:#0f172a;">منحنى الإشغال الزمني (08:00 ص - 04:00 م):</h4>
                  <span style="font-size:10.5px; color:#059669; font-weight:800;">الذروة: 10:00 ص (96%)</span>
                </div>
                <div style="display:flex; align-items:flex-end; gap:8px; height:120px; padding:8px 0; border-bottom:1px solid #e2e8f0;">
                  <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:4px;">
                    <span style="font-size:9.5px; font-family:var(--font-mono); color:#334155; font-weight:700;">65%</span>
                    <div style="width:100%; height:70px; background:var(--fbsu-teal); border-radius:4px 4px 0 0;"></div>
                    <span style="font-size:9.5px; color:#64748b;">08:00ص</span>
                  </div>
                  <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:4px;">
                    <span style="font-size:9.5px; font-family:var(--font-mono); color:#e11d48; font-weight:800;">96%</span>
                    <div style="width:100%; height:110px; background:#e11d48; border-radius:4px 4px 0 0; box-shadow:0 4px 12px rgba(225,29,72,0.25);"></div>
                    <span style="font-size:9.5px; color:#e11d48; font-weight:800;">10:00ص</span>
                  </div>
                  <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:4px;">
                    <span style="font-size:9.5px; font-family:var(--font-mono); color:#b45309; font-weight:800;">72%</span>
                    <div style="width:100%; height:80px; background:#d97706; border-radius:4px 4px 0 0;"></div>
                    <span style="font-size:9.5px; color:#64748b;">11:30ص</span>
                  </div>
                  <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:4px;">
                    <span style="font-size:9.5px; font-family:var(--font-mono); color:#334155; font-weight:700;">88%</span>
                    <div style="width:100%; height:98px; background:var(--fbsu-teal); border-radius:4px 4px 0 0;"></div>
                    <span style="font-size:9.5px; color:#64748b;">01:00م</span>
                  </div>
                  <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:4px;">
                    <span style="font-size:9.5px; font-family:var(--font-mono); color:#64748b;">45%</span>
                    <div style="width:100%; height:50px; background:var(--fbsu-teal); border-radius:4px 4px 0 0; opacity:0.6;"></div>
                    <span style="font-size:9.5px; color:#64748b;">03:00م</span>
                  </div>
                </div>
                <div style="margin-top:10px; font-size:11px; color:#059669; font-weight:700; line-height:1.4;">
                  💡 خوارزمية التبادل قللت نسبة المواقف المحجوزة غير المستخدمة بنسبة 83% خلال فترة الذروة!
                </div>
              </div>

              <!-- College Distribution Light -->
              <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:16px; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
                <h4 style="font-size:12px; font-weight:800; color:#0f172a; margin-bottom:12px;">إشغال المواقف حسب كليات الجامعة:</h4>
                <div style="display:flex; flex-direction:column; gap:10px;">
                  <div>
                    <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:3px;">
                      <span style="color:#0f172a; font-weight:700;">كلية الهندسة والحاسب</span>
                      <span style="font-family:var(--font-mono); color:#b45309; font-weight:800;">92% (14 موقف)</span>
                    </div>
                    <div style="height:6px; background:#f1f5f9; border-radius:4px; overflow:hidden;"><div style="width:92%; height:100%; background:var(--fbsu-teal);"></div></div>
                  </div>
                  <div>
                    <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:3px;">
                      <span style="color:#0f172a; font-weight:700;">كلية إدارة الأعمال</span>
                      <span style="font-family:var(--font-mono); color:#0284c7; font-weight:700;">74% (8 مواقف)</span>
                    </div>
                    <div style="height:6px; background:#f1f5f9; border-radius:4px; overflow:hidden;"><div style="width:74%; height:100%; background:#0284c7;"></div></div>
                  </div>
                  <div>
                    <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:3px;">
                      <span style="color:#0f172a; font-weight:700;">كادر التدريس والدكاترة</span>
                      <span style="font-family:var(--font-mono); color:#7c3aed; font-weight:700;">68% (4 مواقف)</span>
                    </div>
                    <div style="height:6px; background:#f1f5f9; border-radius:4px; overflow:hidden;"><div style="width:68%; height:100%; background:#8b5cf6;"></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Specs Panel -->
        <div class="figma-inspect-panel">
          <div class="inspect-panel-header">
            <span class="inspect-panel-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--figma-blue)" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              <span>Predictive Analytics & College Load Balancing Engine</span>
            </span>
            <span class="frame-spec-chip">Dynamic Load Balancing</span>
          </div>
          <div class="token-grid">
            <div class="token-item"><span class="token-name">predictive-model</span><span class="token-val">LSTM Neural Network trained on 3 academic semesters</span></div>
            <div class="token-item"><span class="token-name">traffic-spillover</span><span class="token-val">Auto-redirects to Sector B with 20% discount if A > 90%</span></div>
            <div class="token-item"><span class="token-name">sensor-aggregation</span><span class="token-val">Continuous 60-second rollup to Campus Data Lake</span></div>
            <div class="token-item"><span class="token-name">co2-reduction</span><span class="token-val">-2.8 tons CO2/month from eliminated cruising time</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====================================================================
         SECTION 11: UNIFIED SSO PORTAL & PLATE VALIDATION (DUAL THEME)
         ==================================================================== -->
    <section id="f-auth">
      <div class="board-section-header">
        <div class="board-title">
          <h2>11. بوابة الدخول الموحد والتحقق (Unified SSO Portal & Plate Validation)</h2>
          <span class="board-tag">Dual-Theme Authentication & Nafath SSO</span>
        </div>
      </div>

      <div class="figma-dual-container">
        <!-- Frame 11-A: Dark Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 11-SSO-Dark / Role Tabs, Nafath 2FA & Vehicle Plate Validation</span>
              <span class="frame-theme-badge theme-badge-dark">🌙 Dark Theme</span>
              <span class="frame-size-badge">1440 × 440</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">OAuth2 + Nafath SSO</span></div>
          </div>
          <div class="figma-frame-body-dark" style="display:flex; justify-content:center; padding:16px;">
            <div style="background:#0c1a18; border:1px solid rgba(17,110,99,0.5); border-radius:14px; padding:18px; width:100%; max-width:520px; box-shadow:0 16px 40px rgba(0,0,0,0.6);">
              <div style="display:flex; justify-content:center; gap:6px; margin-bottom:16px; background:rgba(255,255,255,0.05); padding:4px; border-radius:8px;">
                <span class="btn btn-teal-primary" style="flex:1; text-align:center; padding:6px; font-size:11.5px;">الطلاب</span>
                <span class="btn btn-ghost-outline-dark" style="flex:1; text-align:center; padding:6px; font-size:11.5px; border:none;">كادر التدريس</span>
                <span class="btn btn-ghost-outline-dark" style="flex:1; text-align:center; padding:6px; font-size:11.5px; border:none;">الزوار</span>
              </div>

              <div style="margin-bottom:12px;">
                <label style="display:block; font-size:11px; color:#cbd5e1; margin-bottom:5px;">الرقم الجامعي أو الهوية الوطنية:</label>
                <div style="background:#081211; border:1px solid #1a3c34; border-radius:8px; padding:9px 12px; color:#fff; font-family:var(--font-mono); font-size:12.5px;">
                  202100842 (إياد بن عبد العزيز الحربي)
                </div>
              </div>

              <div style="margin-bottom:14px;">
                <label style="display:block; font-size:11px; color:#cbd5e1; margin-bottom:5px;">اللوحة المعتمدة المصرحة للبوابات:</label>
                <div style="display:flex; justify-content:space-between; align-items:center; background:#081211; border:1px solid #1a3c34; border-radius:8px; padding:7px 10px; flex-wrap:wrap; gap:6px;">
                  <span style="font-size:11px; color:#10b981; font-weight:700;">✓ موثقة في المرور</span>
                  <span class="saudi-plate" style="height:32px;">
                    <div class="plate-letters-section"><span class="plate-ar" style="font-size:9.5px;">ب ط ك</span></div>
                    <div class="plate-digits-section"><span class="plate-ar" style="font-size:9.5px;">١ ٢ ٣ ٤</span></div>
                    <div class="plate-emblem" style="font-size:6px;">🇸🇦</div>
                  </span>
                </div>
              </div>

              <div style="display:flex; flex-direction:column; gap:8px;">
                <button class="btn btn-teal-primary" style="width:100%; padding:9px;">تسجيل الدخول الموحد (SSO Login)</button>
                <button class="btn btn-ghost-outline-dark" style="width:100%; padding:8px; border-color:#059669; color:#34d399; font-size:11.5px;">
                  الدخول عبر النفاذ الوطني (نفاذ 🇸🇦)
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Frame 11-B: Light Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 11-SSO-Light / Role Tabs, Nafath 2FA & Vehicle Plate Validation</span>
              <span class="frame-theme-badge theme-badge-light">☀️ Light Theme</span>
              <span class="frame-size-badge">1440 × 440</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">Institutional Security</span></div>
          </div>
          <div class="figma-frame-body-light" style="display:flex; justify-content:center; padding:16px; background:#f8fafc;">
            <div style="background:#ffffff; border:1.5px solid rgba(17,110,99,0.3); border-radius:14px; padding:18px; width:100%; max-width:520px; box-shadow:0 10px 30px rgba(0,0,0,0.06);">
              <div style="display:flex; justify-content:center; gap:6px; margin-bottom:16px; background:#f1f5f9; padding:4px; border-radius:8px;">
                <span class="btn btn-teal-primary" style="flex:1; text-align:center; padding:6px; font-size:11.5px;">الطلاب</span>
                <span class="btn btn-ghost-outline-light" style="flex:1; text-align:center; padding:6px; font-size:11.5px; border:none;">كادر التدريس</span>
                <span class="btn btn-ghost-outline-light" style="flex:1; text-align:center; padding:6px; font-size:11.5px; border:none;">الزوار</span>
              </div>

              <div style="margin-bottom:12px;">
                <label style="display:block; font-size:11px; color:#475569; margin-bottom:5px; font-weight:700;">الرقم الجامعي أو الهوية الوطنية:</label>
                <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:9px 12px; color:#0f172a; font-family:var(--font-mono); font-size:12.5px; font-weight:700;">
                  202100842 (إياد بن عبد العزيز الحربي)
                </div>
              </div>

              <div style="margin-bottom:14px;">
                <label style="display:block; font-size:11px; color:#475569; margin-bottom:5px; font-weight:700;">اللوحة المعتمدة المصرحة للبوابات:</label>
                <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:7px 10px; flex-wrap:wrap; gap:6px;">
                  <span style="font-size:11px; color:#059669; font-weight:800;">✓ موثقة في المرور</span>
                  <span class="saudi-plate" style="height:32px;">
                    <div class="plate-letters-section"><span class="plate-ar" style="font-size:9.5px;">ب ط ك</span></div>
                    <div class="plate-digits-section"><span class="plate-ar" style="font-size:9.5px;">١ ٢ ٣ ٤</span></div>
                    <div class="plate-emblem" style="font-size:6px;">🇸🇦</div>
                  </span>
                </div>
              </div>

              <div style="display:flex; flex-direction:column; gap:8px;">
                <button class="btn btn-teal-primary" style="width:100%; padding:9px;">تسجيل الدخول الموحد (SSO Login)</button>
                <button class="btn btn-ghost-outline-light" style="width:100%; padding:8px; border-color:#059669; color:#065f46; font-size:11.5px; font-weight:700;">
                  الدخول عبر النفاذ الوطني (نفاذ 🇸🇦)
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Specs Panel -->
        <div class="figma-inspect-panel">
          <div class="inspect-panel-header">
            <span class="inspect-panel-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--figma-blue)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>Security Protocols & Identity Federation Specifications</span>
            </span>
            <span class="frame-spec-chip">OAuth 2.0 / SAML 2.0</span>
          </div>
          <div class="token-grid">
            <div class="token-item"><span class="token-name">auth-protocol</span><span class="token-val">OpenID Connect + SAML 2.0 (Banner SIS Sync)</span></div>
            <div class="token-item"><span class="token-name">2fa-integration</span><span class="token-val">National Single Sign-On (Nafath App Push Notification)</span></div>
            <div class="token-item"><span class="token-name">vehicle-sync</span><span class="token-val">Tamm Traffic API integration for plate validation</span></div>
            <div class="token-item"><span class="token-name">session-jwt-ttl</span><span class="token-val">12 Hours (Auto-revoked upon campus egress)</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====================================================================
         SECTION 12: INSTITUTIONAL FOOTER & CAMPUS GOVERNANCE (DUAL THEME)
         ==================================================================== -->
    <section id="f-footer">
      <div class="board-section-header">
        <div class="board-title">
          <h2>12. التذييل المؤسسي وحوكمة النظام (Institutional Footer & Campus Governance)</h2>
          <span class="board-tag">Dual-Theme Institutional Governance</span>
        </div>
      </div>

      <div class="figma-dual-container">
        <!-- Frame 12-A: Dark Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 12-Footer-Dark / Campus Coordinates, Vision 2030 & Security Dispatch</span>
              <span class="frame-theme-badge theme-badge-dark">🌙 Dark Theme</span>
              <span class="frame-size-badge">1440 × 280</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">Institutional Footer</span></div>
          </div>
          <div class="figma-frame-body-dark" style="padding:20px;">
            <div class="responsive-footer-grid" style="margin-bottom:16px;">
              <div>
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                  <img src="./assets/branding/fbsu-logo.png" alt="FBSU Logo" style="height:28px; width:auto;">
                  <h4 style="font-size:13px; font-weight:800; color:#fff; margin:0;">جامعة فهد بن سلطان</h4>
                </div>
                <p style="font-size:11px; color:#94a3b8; line-height:1.5;">
                  المشروع الريادي لإدارة الطاقة والمواقف الذكية بالحرم الجامعي. تبوك، المملكة العربية السعودية. متوافق مع رؤية المملكة 2030.
                </p>
                <div style="font-size:10.5px; color:var(--fbsu-gold); margin-top:6px; font-family:var(--font-mono);">
                  28.4344° N, 36.5683° E (بوابة طريق الملك خالد)
                </div>
              </div>

              <div>
                <h5 style="font-size:11.5px; font-weight:800; color:var(--fbsu-gold); margin-bottom:8px;">روابط الدعم:</h5>
                <ul style="list-style:none; padding:0; margin:0; font-size:11px; color:#cbd5e1; display:flex; flex-direction:column; gap:4px;">
                  <li>• لائحة تنظيم واستخدام المواقف</li>
                  <li>• سياسة حماية بيانات اللوحات</li>
                  <li>• شروط استرداد الرصيد والكاشباك</li>
                  <li>• خارطة محطات شحن السيارات (EV)</li>
                </ul>
              </div>

              <div>
                <h5 style="font-size:11.5px; font-weight:800; color:var(--fbsu-gold); margin-bottom:8px;">الطوارئ والسلامة:</h5>
                <div style="background:#061412; border:1px solid #1a3c34; border-radius:8px; padding:8px; font-size:11px;">
                  <div style="color:#fff; font-weight:700;">أمن وسلامة الحرم الجامعي</div>
                  <div style="color:#10b981; font-family:var(--font-mono); margin-top:3px;">الهاتف: 014-427-6666</div>
                  <div style="color:#888; font-size:9.5px; margin-top:2px;">جاهزية 24/7 لفتح البوابات وتوجيه المركبات</div>
                </div>
              </div>
            </div>

            <div style="border-top:1px solid rgba(255,255,255,0.08); padding-top:10px; display:flex; justify-content:space-between; font-size:10px; color:#888; flex-wrap:wrap; gap:6px;">
              <span>© 1448 / 2026 جامعة فهد بن سلطان. جميع الحقوق محفوظة.</span>
              <span style="color:var(--fbsu-gold);">نحو حرم جامعي مستدام 🇸🇦 Vision 2030</span>
            </div>
          </div>
        </div>

        <!-- Frame 12-B: Light Mode -->
        <div class="figma-frame">
          <div class="figma-frame-header">
            <div class="frame-title-group">
              <span class="frame-icon">#</span>
              <span>Frame: 12-Footer-Light / Campus Coordinates, Vision 2030 & Security Dispatch</span>
              <span class="frame-theme-badge theme-badge-light">☀️ Light Theme</span>
              <span class="frame-size-badge">1440 × 280</span>
            </div>
            <div class="frame-actions"><span class="frame-spec-chip">Institutional Footer</span></div>
          </div>
          <div class="figma-frame-body-light" style="padding:20px; background:#f8fafc;">
            <div class="responsive-footer-grid" style="margin-bottom:16px;">
              <div>
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                  <img src="./assets/branding/fbsu-logo.png" alt="FBSU Logo" style="height:28px; width:auto;">
                  <h4 style="font-size:13px; font-weight:800; color:#0f172a; margin:0;">جامعة فهد بن سلطان</h4>
                </div>
                <p style="font-size:11px; color:#475569; line-height:1.5;">
                  المشروع الريادي لإدارة الطاقة والمواقف الذكية بالحرم الجامعي. تبوك، المملكة العربية السعودية. متوافق مع رؤية المملكة 2030.
                </p>
                <div style="font-size:10.5px; color:#b45309; margin-top:6px; font-family:var(--font-mono); font-weight:700;">
                  28.4344° N, 36.5683° E (بوابة طريق الملك خالد)
                </div>
              </div>

              <div>
                <h5 style="font-size:11.5px; font-weight:800; color:#b45309; margin-bottom:8px;">روابط الدعم:</h5>
                <ul style="list-style:none; padding:0; margin:0; font-size:11px; color:#334155; display:flex; flex-direction:column; gap:4px;">
                  <li>• لائحة تنظيم واستخدام المواقف</li>
                  <li>• سياسة حماية بيانات اللوحات</li>
                  <li>• شروط استرداد الرصيد والكاشباك</li>
                  <li>• خارطة محطات شحن السيارات (EV)</li>
                </ul>
              </div>

              <div>
                <h5 style="font-size:11.5px; font-weight:800; color:#b45309; margin-bottom:8px;">الطوارئ والسلامة:</h5>
                <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:8px; font-size:11px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
                  <div style="color:#0f172a; font-weight:800;">أمن وسلامة الحرم الجامعي</div>
                  <div style="color:#059669; font-family:var(--font-mono); margin-top:3px; font-weight:800;">الهاتف: 014-427-6666</div>
                  <div style="color:#64748b; font-size:9.5px; margin-top:2px;">جاهزية 24/7 لفتح البوابات وتوجيه المركبات</div>
                </div>
              </div>
            </div>

            <div style="border-top:1px solid #e2e8f0; padding-top:10px; display:flex; justify-content:space-between; font-size:10px; color:#64748b; flex-wrap:wrap; gap:6px;">
              <span>© 1448 / 2026 جامعة فهد بن سلطان. جميع الحقوق محفوظة.</span>
              <span style="color:#b45309; font-weight:800;">نحو حرم جامعي مستدام 🇸🇦 Vision 2030</span>
            </div>
          </div>
        </div>

        <!-- Specs Panel -->
        <div class="figma-inspect-panel">
          <div class="inspect-panel-header">
            <span class="inspect-panel-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--figma-blue)" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Institutional Metadata & Emergency Response SLA</span>
            </span>
            <span class="frame-spec-chip">Campus Governance</span>
          </div>
          <div class="token-grid">
            <div class="token-item"><span class="token-name">campus-gis-pin</span><span class="token-val">FBSU Tabuk North Gate (Latitude: 28.4344, Longitude: 36.5683)</span></div>
            <div class="token-item"><span class="token-name">emergency-override</span><span class="token-val">Civil Defense manual gate override in &lt; 3.0 seconds</span></div>
            <div class="token-item"><span class="token-name">ev-charging-specs</span><span class="token-val">22 kW Type-2 AC Dual Chargers (Bays #23, #24)</span></div>
            <div class="token-item"><span class="token-name">compliance-tier</span><span class="token-val">National Cybersecurity Authority (NCA) Essential Cybersecurity Controls</span></div>
          </div>
        </div>
      </div>
    </section>
    """
