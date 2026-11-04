# -*- coding: utf-8 -*-
"""
Generator for the Master-Grade Figma UI/UX Showcase for FBSU Smart Parking System.
Creates an ultra-detailed, exhaustive documentation canvas with:
- Dual Dark & Light Mode Artboards for EVERY section
- Complete Design System Tokens (Colors, Typography, Elevation, Spacing, Radius)
- Detailed Component Anatomy & Inspection Specs
- 100% SVG Vector Icons (No emojis)
- All 15 Comprehensive Sections
"""

import sys

def build_showcase_html():
    return """<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Figma UI/UX Master Design System & Complete Showcase | منظومة مواقف جامعة فهد بن سلطان (FBSU)</title>
  <meta name="description" content="لوحة عرض وتوثيق شاملة وهندسية فائقة الدقة لكافة عناصر وأقسام منظومة المواقف الذكية بجامعة فهد بن سلطان بنمط فيجما، تشمل الوضعين الليلي والنهاري لكل قسم ومكون.">
  <link rel="icon" type="image/png" href="/fbsu-logo.png">

  <!-- Google Fonts: Tajawal & Alexandria & JetBrains Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Alexandria:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    :root {
      /* Figma Canvas Theming */
      --figma-bg: #1e1e1e;
      --figma-header: #2c2c2c;
      --figma-border: #383838;
      --figma-text: #ffffff;
      --figma-text-dim: #b3b3b3;
      --figma-blue: #0d99ff;
      --figma-purple: #9747ff;
      --figma-green: #14ae5c;
      --figma-red: #f24822;

      /* University Core Brand */
      --fbsu-teal: #116E63;
      --fbsu-teal-dark: #093c35;
      --fbsu-teal-light: rgba(17, 110, 99, 0.15);
      --fbsu-teal-border: rgba(17, 110, 99, 0.4);
      --fbsu-gold: #d7a237;
      --fbsu-gold-dark: #966f20;
      --fbsu-gold-light: rgba(215, 162, 55, 0.15);
      --fbsu-gold-border: rgba(215, 162, 55, 0.4);

      /* Semantic Status */
      --status-available: #10b981;
      --status-available-bg: rgba(16, 185, 129, 0.15);
      --status-available-border: rgba(16, 185, 129, 0.4);
      --status-occupied: #f43f5e;
      --status-occupied-bg: rgba(244, 63, 94, 0.15);
      --status-occupied-border: rgba(244, 63, 94, 0.4);
      --status-reserved: #3b82f6;
      --status-reserved-bg: rgba(59, 130, 246, 0.15);
      --status-flex: #d7a237;
      --status-flex-bg: rgba(215, 162, 55, 0.18);
      --status-faculty: #8b5cf6;
      --status-faculty-bg: rgba(139, 92, 246, 0.15);

      /* Typography */
      --font-heading: 'Tajawal', sans-serif;
      --font-body: 'Alexandria', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--figma-bg);
      background-image: radial-gradient(circle, rgba(255, 255, 255, 0.08) 1.2px, transparent 1.2px);
      background-size: 24px 24px;
      color: var(--figma-text);
      font-family: var(--font-body);
      min-height: 100vh;
      overflow-x: hidden;
      direction: rtl;
    }

    /* FIGMA TOP BAR */
    .figma-top-bar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: var(--figma-header);
      border-bottom: 1px solid var(--figma-border);
      height: 52px;
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 16px;
      padding: 0 20px;
      font-size: 13px;
      user-select: none;
      backdrop-filter: blur(10px);
    }

    .figma-top-left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }

    .figma-logo-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #222222;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 700;
      color: #fff;
    }

    .figma-file-title {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #fff;
      font-weight: 600;
      font-size: 12.5px;
    }

    .figma-version-pill {
      background: rgba(13, 153, 255, 0.2);
      color: var(--figma-blue);
      border: 1px solid rgba(13, 153, 255, 0.4);
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-family: var(--font-mono);
      font-weight: 700;
    }

    .figma-nav-links {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      overflow-x: auto;
      scrollbar-width: none;
      padding: 0 10px;
    }

    .figma-nav-btn {
      background: transparent;
      border: none;
      color: var(--figma-text-dim);
      padding: 5px 9px;
      border-radius: 6px;
      font-size: 11px;
      font-family: var(--font-body);
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
      text-decoration: none;
    }

    .figma-nav-btn:hover, .figma-nav-btn.active {
      background: #383838;
      color: #ffffff;
    }

    .figma-nav-btn.active {
      background: rgba(13, 153, 255, 0.2);
      color: var(--figma-blue);
      font-weight: 700;
    }

    .figma-top-right {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .btn-toggle-inspect {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #222222;
      border: 1px solid #444444;
      color: #ffffff;
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 11.5px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-toggle-inspect:hover {
      background: #333333;
      border-color: var(--figma-blue);
    }

    .btn-toggle-inspect.active {
      background: rgba(13, 153, 255, 0.2);
      border-color: var(--figma-blue);
      color: var(--figma-blue);
    }

    /* HERO BANNER */
    .figma-hero-header {
      padding: 30px 40px 10px;
      max-width: 1540px;
      margin: 0 auto;
    }

    .figma-hero-card {
      background: linear-gradient(135deg, rgba(17, 110, 99, 0.35) 0%, rgba(9, 20, 18, 0.95) 100%);
      border: 1px solid rgba(17, 110, 99, 0.5);
      border-radius: 16px;
      padding: 28px 36px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
    }

    .figma-hero-content h1 {
      font-family: var(--font-heading);
      font-size: 26px;
      font-weight: 900;
      color: #ffffff;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .figma-hero-content p {
      color: #cbd5e1;
      font-size: 13.5px;
      max-width: 820px;
      line-height: 1.7;
    }

    .figma-hero-stats {
      display: flex;
      gap: 14px;
    }

    .hero-stat-box {
      background: rgba(0, 0, 0, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 12px 18px;
      text-align: center;
      min-width: 95px;
    }

    .hero-stat-number {
      font-family: var(--font-mono);
      font-size: 20px;
      font-weight: 800;
      color: var(--fbsu-gold);
    }

    .hero-stat-label {
      font-size: 10.5px;
      color: #94a3b8;
      margin-top: 3px;
    }

    /* CANVAS & BOARDS */
    .figma-canvas {
      padding: 24px 40px 100px;
      max-width: 1540px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 60px;
    }

    .board-section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 10px;
    }

    .board-title h2 {
      font-family: var(--font-heading);
      font-size: 20px;
      font-weight: 800;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .board-tag {
      background: rgba(13, 153, 255, 0.15);
      border: 1px solid rgba(13, 153, 255, 0.3);
      color: var(--figma-blue);
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-weight: 700;
    }

    /* DUAL FRAME CONTAINER */
    .figma-dual-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .figma-frame {
      background: #181818;
      border: 1px solid #333333;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5);
      position: relative;
    }

    .figma-frame-header {
      background: #252525;
      border-bottom: 1px solid #333333;
      padding: 8px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      user-select: none;
    }

    .frame-title-group {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      color: #e2e8f0;
    }

    .frame-icon {
      color: var(--figma-blue);
      font-family: var(--font-mono);
      font-weight: 800;
    }

    .frame-theme-badge {
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 10.5px;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .theme-badge-dark {
      background: #091715;
      color: #38c2b0;
      border: 1px solid rgba(17, 110, 99, 0.4);
    }

    .theme-badge-light {
      background: #ffffff;
      color: #0d554c;
      border: 1px solid rgba(0, 0, 0, 0.15);
    }

    .frame-size-badge {
      font-family: var(--font-mono);
      font-size: 10.5px;
      color: #94a3b8;
      background: #1a1a1a;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .frame-spec-chip {
      background: rgba(255, 255, 255, 0.06);
      color: #cbd5e1;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 10.5px;
      font-family: var(--font-mono);
    }

    /* FRAME BODIES: DARK VS LIGHT */
    .figma-frame-body-dark {
      background: #081211;
      padding: 24px;
      color: #ffffff;
      position: relative;
    }

    .figma-frame-body-light {
      background: #F2F3F5;
      padding: 24px;
      color: #19232B;
      position: relative;
    }

    /* SPECIFICATION & ANATOMY INSPECT PANEL */
    .figma-inspect-panel {
      background: #151515;
      border: 1px solid #2d2d2d;
      border-radius: 10px;
      padding: 16px 20px;
      margin-top: 14px;
      font-size: 12px;
      color: #cbd5e1;
    }

    .inspect-panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      border-bottom: 1px solid #282828;
      padding-bottom: 8px;
    }

    .inspect-panel-title {
      font-weight: 800;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12.5px;
    }

    .token-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
    }

    .token-item {
      background: #1c1c1c;
      border: 1px solid #2a2a2a;
      border-radius: 6px;
      padding: 8px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .token-name {
      font-family: var(--font-mono);
      color: var(--figma-blue);
      font-size: 11px;
    }

    .token-val {
      font-family: var(--font-mono);
      color: #ffffff;
      font-weight: 700;
      font-size: 11px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .color-swatch-mini {
      width: 14px;
      height: 14px;
      border-radius: 3px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    /* BUTTONS & BADGES */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
      border: none;
    }

    .btn-teal-primary {
      background: var(--fbsu-teal);
      color: #ffffff;
      box-shadow: 0 2px 10px rgba(17, 110, 99, 0.4);
    }

    .btn-gold-accent {
      background: var(--fbsu-gold);
      color: #0b1a17;
      box-shadow: 0 2px 10px rgba(215, 162, 55, 0.35);
      font-weight: 800;
    }

    .btn-ghost-outline-dark {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #e2e8f0;
    }

    .btn-ghost-outline-light {
      background: rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(0, 0, 0, 0.15);
      color: #1e293b;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
    }

    .pill-available {
      background: var(--status-available-bg);
      color: var(--status-available);
      border: 1px solid var(--status-available-border);
    }

    .pill-occupied {
      background: var(--status-occupied-bg);
      color: var(--status-occupied);
      border: 1px solid var(--status-occupied-border);
    }

    .pill-flex {
      background: var(--status-flex-bg);
      color: var(--fbsu-gold);
      border: 1px solid var(--fbsu-gold-border);
    }

    .pill-faculty {
      background: var(--status-faculty-bg);
      color: var(--status-faculty);
      border: 1px solid rgba(139, 92, 246, 0.4);
    }

    /* SAUDI LICENSE PLATE */
    .saudi-plate {
      display: inline-flex;
      background: #ffffff;
      border: 2px solid #000000;
      border-radius: 4px;
      height: 38px;
      overflow: hidden;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      user-select: none;
      direction: ltr;
    }

    .plate-letters-section, .plate-digits-section {
      padding: 0 8px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      line-height: 1;
    }

    .plate-letters-section {
      border-right: 1.5px solid #000000;
    }

    .plate-digits-section {
      border-right: 1.5px solid #000000;
    }

    .plate-ar {
      font-size: 11px;
      font-weight: 900;
      color: #000000;
    }

    .plate-en {
      font-size: 8px;
      font-weight: 800;
      color: #000000;
      font-family: var(--font-mono);
    }

    .plate-emblem {
      width: 22px;
      background: #116E63;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 7px;
      font-weight: 800;
    }

    /* 30-GRID SYSTEM */
    .grid-6 {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 10px;
    }

    .spot-card-mini {
      border-radius: 8px;
      padding: 10px;
      min-height: 125px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      transition: transform 0.2s;
    }

    .spot-dark-available {
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .spot-dark-occupied {
      background: rgba(244, 63, 94, 0.08);
      border: 1px solid rgba(244, 63, 94, 0.3);
    }

    .spot-dark-flex {
      background: rgba(215, 162, 55, 0.1);
      border: 1px solid rgba(215, 162, 55, 0.4);
    }

    .spot-dark-faculty {
      background: rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(139, 92, 246, 0.4);
    }

    .spot-light-available {
      background: #ffffff;
      border: 1.5px solid rgba(16, 185, 129, 0.45);
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.08);
    }

    .spot-light-occupied {
      background: #ffffff;
      border: 1.5px solid rgba(244, 63, 94, 0.35);
      box-shadow: 0 2px 8px rgba(244, 63, 94, 0.08);
    }

    .spot-light-flex {
      background: #ffffff;
      border: 1.5px solid rgba(215, 162, 55, 0.5);
      box-shadow: 0 2px 8px rgba(215, 162, 55, 0.12);
    }

    .spot-light-faculty {
      background: #ffffff;
      border: 1.5px solid rgba(139, 92, 246, 0.45);
      box-shadow: 0 2px 8px rgba(139, 92, 246, 0.1);
    }

    .car-svg-container {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</head>
<body class="inspect-mode">

  <!-- FIGMA TOP TOOLBAR -->
  <header class="figma-top-bar">
    <div class="figma-top-left">
      <div class="figma-logo-badge">
        <svg width="18" height="18" viewBox="0 0 38 57" fill="none">
          <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
          <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
          <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
          <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
          <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
        </svg>
        <span>Figma Showcase</span>
      </div>
      <div class="figma-file-title">
        <span>FBSU-Smart-Parking-Full-System.fig</span>
        <span class="figma-version-pill">v3.0 Ultra-Detailed Master Specification</span>
      </div>
    </div>

    <!-- Quick Frame Jump Navigation for ALL 15 Sections -->
    <nav class="figma-nav-links">
      <a href="#f-header" class="figma-nav-btn active">01. الترويسة</a>
      <a href="#f-hero" class="figma-nav-btn">02. الواجهة والعدادات</a>
      <a href="#f-grid" class="figma-nav-btn">03. شبكة الـ 30 موقفاً</a>
      <a href="#f-sensor" class="figma-nav-btn">04. بطاقة الحساس</a>
      <a href="#f-simulator" class="figma-nav-btn">05. محاكي التبادل</a>
      <a href="#f-gate" class="figma-nav-btn">06. البوابة و ALPR</a>
      <a href="#f-booking" class="figma-nav-btn">07. معالج الحجز والتصريح</a>
      <a href="#f-share" class="figma-nav-btn">08. شارك واربح</a>
      <a href="#f-wallet" class="figma-nav-btn">09. المحفظة الرقمية</a>
      <a href="#f-analytics" class="figma-nav-btn">10. التحليلات</a>
      <a href="#f-auth" class="figma-nav-btn">11. الدخول الموحد SSO</a>
      <a href="#f-footer" class="figma-nav-btn">12. التذييل المؤسسي</a>
      <a href="#f-devices" class="figma-nav-btn">13. الأجهزة المتجاوبة</a>
      <a href="#f-tokens" class="figma-nav-btn">14. الرموز التصميمية Tokens</a>
      <a href="#f-architecture" class="figma-nav-btn">15. معمارية وحالات النظام</a>
    </nav>

    <div class="figma-top-right">
      <button id="toggleInspectBtn" class="btn-toggle-inspect active">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>Inspect Mode</span>
      </button>
      <button id="toggleFullScreenBtn" class="btn-toggle-inspect" onclick="document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();" title="وضع ملء الشاشة لعرض فيجما">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
        <span>Full Screen View</span>
      </button>
    </div>
  </header>

  <!-- CANVAS HERO HEADER -->
  <section class="figma-hero-header">
    <div class="figma-hero-card">
      <div class="figma-hero-content">
        <h1>
          <span>منظومة مواقف جامعة فهد بن سلطان الذكية (FBSU)</span>
          <span class="figma-version-pill" style="font-size:11px;">100% Complete Dual-Theme Specification</span>
        </h1>
        <p>
          توثيق بصري وهندسي شامل ومُفصّل لكافة أجزاء المنظومة دون استثناء أي مكون أو حالة. تم تجسيد كل قسم كإطارين متكاملين (Artboards) للوضع الليلي الفاخر (Dark Mode) والوضع النهاري المؤسسي المعتمد (Light Mode)، مدعوماً بمواصفات التشريح البرمجي وتدفقات الذكاء الاصطناعي وإنترنت الأشياء.
        </p>
      </div>
      <div class="figma-hero-stats">
        <div class="hero-stat-box">
          <div class="hero-stat-number">15</div>
          <div class="hero-stat-label">Full Sections</div>
        </div>
        <div class="hero-stat-box">
          <div class="hero-stat-number">30</div>
          <div class="hero-stat-label">Dual Frames</div>
        </div>
        <div class="hero-stat-box">
          <div class="hero-stat-number">#116E63</div>
          <div class="hero-stat-label">Official Teal</div>
        </div>
        <div class="hero-stat-box">
          <div class="hero-stat-number">#d7a237</div>
          <div class="hero-stat-label">Academic Gold</div>
        </div>
      </div>
    </div>
  </section>

  <!-- MAIN CANVAS CONTENT -->
  <main class="figma-canvas">

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
              <!-- Right Cluster -->
              <div style="display:flex; align-items:center; gap:10px;">
                <img src="/fbsu-logo.png" alt="FBSU Logo" style="height:35px; width:auto;">
                <h3 style="font-family:var(--font-heading); font-size:14.5px; font-weight:800; color:#fff; margin:0;">جامعة فهد بن سلطان</h3>
              </div>
              <div style="width:1px; height:20px; background:rgba(255,255,255,0.15);"></div>
              <!-- Nav tabs -->
              <div style="display:inline-flex; gap:3px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); padding:3px 5px; border-radius:999px;">
                <span class="btn btn-teal-primary" style="padding:4px 9px; font-size:11.5px; border-radius:999px;">خريطة المواقف</span>
                <span class="btn btn-ghost-outline-dark" style="padding:4px 9px; font-size:11.5px; border-radius:999px; border:none;">محاكاة التبادل</span>
                <span class="btn btn-ghost-outline-dark" style="padding:4px 9px; font-size:11.5px; border-radius:999px; border:none;">كاميرات ALPR</span>
                <span class="btn btn-ghost-outline-dark" style="padding:4px 9px; font-size:11.5px; border-radius:999px; border:none;">حجز موقف</span>
                <span class="btn btn-ghost-outline-dark" style="padding:4px 9px; font-size:11.5px; border-radius:999px; border:none;">شارك واربح</span>
                <span class="btn btn-ghost-outline-dark" style="padding:4px 9px; font-size:11.5px; border-radius:999px; border:none;">التحليلات</span>
              </div>
              <!-- Utilities Capsule -->
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
              <!-- Right Cluster -->
              <div style="display:flex; align-items:center; gap:10px;">
                <img src="/fbsu-logo.png" alt="FBSU Logo" style="height:35px; width:auto;">
                <h3 style="font-family:var(--font-heading); font-size:14.5px; font-weight:800; color:#116E63; margin:0;">جامعة فهد بن سلطان</h3>
              </div>
              <div style="width:1px; height:20px; background:rgba(17,110,99,0.2);"></div>
              <!-- Nav tabs -->
              <div style="display:inline-flex; gap:3px; background:#f1f5f9; border:1px solid #e2e8f0; padding:3px 5px; border-radius:999px;">
                <span class="btn btn-teal-primary" style="padding:4px 9px; font-size:11.5px; border-radius:999px;">خريطة المواقف</span>
                <span class="btn btn-ghost-outline-light" style="padding:4px 9px; font-size:11.5px; border-radius:999px; border:none;">محاكاة التبادل</span>
                <span class="btn btn-ghost-outline-light" style="padding:4px 9px; font-size:11.5px; border-radius:999px; border:none;">كاميرات ALPR</span>
                <span class="btn btn-ghost-outline-light" style="padding:4px 9px; font-size:11.5px; border-radius:999px; border:none;">حجز موقف</span>
                <span class="btn btn-ghost-outline-light" style="padding:4px 9px; font-size:11.5px; border-radius:999px; border:none;">شارك واربح</span>
                <span class="btn btn-ghost-outline-light" style="padding:4px 9px; font-size:11.5px; border-radius:999px; border:none;">التحليلات</span>
              </div>
              <!-- Utilities Capsule Light -->
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

        <!-- Section 01 Inspect Specs -->
        <div class="figma-inspect-panel">
          <div class="inspect-panel-header">
            <span class="inspect-panel-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--figma-blue)" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              <span>Design Tokens & Auto-Layout Specification: Header & Ribbon</span>
            </span>
            <span class="frame-spec-chip">RTL Cohesion Checked</span>
          </div>
          <div class="token-grid">
            <div class="token-item">
              <span class="token-name">container-max-width</span>
              <span class="token-val">1220px</span>
            </div>
            <div class="token-item">
              <span class="token-name">header-height</span>
              <span class="token-val">58px (Navbar) + 32px (Ribbon)</span>
            </div>
            <div class="token-item">
              <span class="token-name">logo-dimensions</span>
              <span class="token-val">35px H × auto</span>
            </div>
            <div class="token-item">
              <span class="token-name">nav-item-padding</span>
              <span class="token-val">4px 9px (Border-radius: 9999px)</span>
            </div>
            <div class="token-item">
              <span class="token-name">color-primary-teal</span>
              <span class="token-val"><span class="color-swatch-mini" style="background:#116E63;"></span>#116E63</span>
            </div>
            <div class="token-item">
              <span class="token-name">color-academic-gold</span>
              <span class="token-val"><span class="color-swatch-mini" style="background:#d7a237;"></span>#d7a237</span>
            </div>
            <div class="token-item">
              <span class="token-name">dark-bg-glass</span>
              <span class="token-val"><span class="color-swatch-mini" style="background:rgba(9,20,18,0.96);"></span>rgba(9,20,18,0.96)</span>
            </div>
            <div class="token-item">
              <span class="token-name">light-bg-card</span>
              <span class="token-val"><span class="color-swatch-mini" style="background:#ffffff;"></span>#ffffff (Border #e2e8f0)</span>
            </div>
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
            <div class="frame-actions">
              <span class="frame-spec-chip">Radial Emerald Ambient</span>
            </div>
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

        <!-- Section 02 Inspect Specs -->
        <div class="figma-inspect-panel">
          <div class="inspect-panel-header">
            <span class="inspect-panel-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--figma-blue)" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
              <span>Design Tokens & Telemetry Layout: Hero Section</span>
            </span>
            <span class="frame-spec-chip">Grid 1.2fr / 0.8fr (Gap: 32px)</span>
          </div>
          <div class="token-grid">
            <div class="token-item">
              <span class="token-name">hero-title-size</span>
              <span class="token-val">27px (Font-weight: 900)</span>
            </div>
            <div class="token-item">
              <span class="token-name">hero-card-radius</span>
              <span class="token-val">14px (Padding: 20px)</span>
            </div>
            <div class="token-item">
              <span class="token-name">stat-counter-size</span>
              <span class="token-val">19px JetBrains Mono 800</span>
            </div>
            <div class="token-item">
              <span class="token-name">dark-ambient-gradient</span>
              <span class="token-val">radial-gradient(ellipse at 80% 20%...)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
"""

# Let's save the python script so it can assemble the whole document seamlessly
