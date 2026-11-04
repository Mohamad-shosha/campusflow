# -*- coding: utf-8 -*-
"""
Master Assembler for FBSU Smart Parking Figma Showcase
Ultra-Responsive Mobile & Desktop Design System
"""

import os
import re
from parts_01_to_04 import get_sections_01_to_04
from parts_05_to_08 import get_sections_05_to_08
from parts_09_to_12 import get_sections_09_to_12
from parts_13_to_15 import get_sections_13_to_15
from parts_16_to_18 import get_sections_16_to_18
from specs_data import render_uiux_breakdown_html

def assemble_master_showcase():
    css_and_head = """<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Figma UI/UX Master Design System & Complete Showcase | منظومة مواقف جامعة فهد بن سلطان (FBSU)</title>
  <meta name="description" content="لوحة عرض وتوثيق شاملة وهندسية فائقة الدقة لكافة عناصر وأقسام منظومة المواقف الذكية بجامعة فهد بن سلطان بنمط فيجما، تشمل الوضعين الليلي والنهاري لكل قسم ومكون دون استثناء.">
  <link rel="icon" type="image/png" href="./assets/branding/fbsu-logo.png">

  <!-- Google Fonts: Tajawal & Alexandria & JetBrains Mono & Plus Jakarta Sans -->
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
      -webkit-tap-highlight-color: transparent;
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
      min-height: 52px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 8px 16px;
      font-size: 13px;
    }

    .figma-top-left {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .figma-logo-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 6px;
      font-weight: 700;
      font-size: 12px;
    }

    .figma-file-title {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--figma-text);
      font-weight: 600;
      font-size: 12px;
    }

    .figma-version-pill {
      background: rgba(13, 153, 255, 0.15);
      color: var(--figma-blue);
      border: 1px solid rgba(13, 153, 255, 0.3);
      padding: 2px 7px;
      border-radius: 999px;
      font-size: 10.5px;
      font-family: var(--font-mono);
      font-weight: 700;
      white-space: nowrap;
    }

    .figma-nav-links {
      display: flex;
      align-items: center;
      gap: 4px;
      overflow-x: auto;
      white-space: nowrap;
      padding: 4px 0;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
      flex: 1;
    }
    .figma-nav-links::-webkit-scrollbar { display: none; }

    .figma-nav-btn {
      color: var(--figma-text-dim);
      text-decoration: none;
      padding: 5px 9px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .figma-nav-btn:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.08);
    }
    .figma-nav-btn.active {
      color: #ffffff;
      background: var(--figma-blue);
    }

    .figma-top-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-toggle-inspect {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid var(--figma-border);
      color: var(--figma-text);
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .btn-toggle-inspect:hover {
      background: rgba(255, 255, 255, 0.15);
    }
    .btn-toggle-inspect.active {
      background: rgba(13, 153, 255, 0.2);
      border-color: var(--figma-blue);
      color: var(--figma-blue);
    }

    /* CANVAS HERO HEADER */
    .figma-hero-header {
      padding: 24px 24px 12px;
      max-width: 1540px;
      margin: 0 auto;
    }

    .figma-hero-card {
      background: linear-gradient(135deg, rgba(17, 110, 99, 0.2) 0%, rgba(215, 162, 55, 0.1) 100%), #141414;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 20px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }

    .figma-hero-content h1 {
      font-family: var(--font-heading);
      font-size: clamp(18px, 3.5vw, 24px);
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }

    .figma-hero-content p {
      color: var(--figma-text-dim);
      font-size: 12.5px;
      line-height: 1.5;
      max-width: 820px;
    }

    .figma-hero-stats {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .hero-stat-box {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 8px 14px;
      text-align: center;
      min-width: 75px;
    }

    .hero-stat-number {
      font-family: var(--font-mono);
      font-size: 18px;
      font-weight: 800;
      color: var(--fbsu-gold);
    }

    .hero-stat-label {
      font-size: 10px;
      color: var(--figma-text-dim);
      margin-top: 1px;
    }

    /* MAIN CANVAS CONTENT */
    .figma-canvas {
      padding: 12px 24px 64px;
      max-width: 1540px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 36px;
    }

    /* SECTION HEADER */
    .board-section-header {
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 6px;
      flex-wrap: wrap;
      gap: 8px;
    }

    .board-title {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .board-title h2 {
      font-family: var(--font-heading);
      font-size: clamp(14px, 2.5vw, 17px);
      font-weight: 800;
      color: #ffffff;
    }

    .board-tag {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: var(--fbsu-gold);
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 10px;
      font-family: var(--font-mono);
      font-weight: 700;
    }

    /* DUAL FRAME CONTAINER */
    .figma-dual-container {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    /* FIGMA FRAME COMPONENT */
    .figma-frame {
      background: #141414;
      border: 1px solid var(--figma-border);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .figma-frame:hover {
      border-color: rgba(13, 153, 255, 0.4);
    }

    .figma-frame-header {
      background: #222222;
      border-bottom: 1px solid var(--figma-border);
      padding: 6px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      flex-wrap: wrap;
      gap: 6px;
    }

    .frame-title-group {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #ffffff;
      font-weight: 700;
      flex-wrap: wrap;
    }

    .frame-icon {
      color: var(--figma-purple);
      font-family: var(--font-mono);
      font-weight: 800;
    }

    .frame-theme-badge {
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      font-family: var(--font-mono);
    }

    .theme-badge-dark {
      background: #081211;
      color: #38c2b0;
      border: 1px solid var(--fbsu-teal);
    }

    .theme-badge-light {
      background: #f8fafc;
      color: #0f172a;
      border: 1px solid #cbd5e1;
    }

    .frame-size-badge {
      color: var(--figma-text-dim);
      font-family: var(--font-mono);
      font-size: 10.5px;
    }

    .frame-actions {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .frame-spec-chip {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--figma-text-dim);
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 9.5px;
      font-family: var(--font-mono);
    }

    /* FRAME BODIES */
    .figma-frame-body-dark {
      background: #081211;
      color: #ffffff;
      padding: 20px;
      position: relative;
    }

    .figma-frame-body-light {
      background: #F8FAFC;
      color: #0F172A;
      padding: 20px;
      position: relative;
    }

    /* INSPECT SPECS PANEL */
    .figma-inspect-panel {
      background: #252525;
      border: 1px solid #333;
      border-radius: 8px;
      padding: 10px 14px;
      margin-top: 8px;
      font-size: 10.5px;
      transition: all 0.3s;
    }

    body:not(.inspect-mode) .figma-inspect-panel {
      display: none;
    }

    .inspect-panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--figma-text-dim);
      font-weight: 700;
      margin-bottom: 6px;
      padding-bottom: 4px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      flex-wrap: wrap;
      gap: 4px;
    }

    .inspect-panel-title {
      display: flex;
      align-items: center;
      gap: 5px;
      color: var(--figma-blue);
      font-weight: 700;
    }

    .token-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 6px 12px;
    }

    .token-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: var(--font-mono);
      font-size: 10px;
      gap: 6px;
    }

    .token-name {
      color: var(--figma-text-dim);
      white-space: nowrap;
    }

    .token-val {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.06);
      padding: 1px 5px;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* BUTTONS & UI */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      padding: 7px 12px;
      border-radius: 7px;
      font-size: 11.5px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.15s;
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

    .btn-cluster-wrap {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 7px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 700;
      white-space: nowrap;
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
      height: 36px;
      overflow: hidden;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      user-select: none;
      direction: ltr;
      flex-shrink: 0;
    }

    .plate-letters-section, .plate-digits-section {
      padding: 0 6px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      line-height: 1;
    }

    .plate-letters-section { border-right: 1.5px solid #000000; }
    .plate-digits-section { border-right: 1.5px solid #000000; }

    .plate-ar { font-size: 10px; font-weight: 900; color: #000000; }
    .plate-en { font-size: 7.5px; font-weight: 800; color: #000000; font-family: var(--font-mono); }

    .plate-emblem {
      width: 20px;
      background: #116E63;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 6.5px;
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
      padding: 8px;
      min-height: 120px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      transition: transform 0.2s;
    }

    .spot-dark-available { background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); }
    .spot-dark-occupied { background: rgba(244, 63, 94, 0.08); border: 1px solid rgba(244, 63, 94, 0.3); }
    .spot-dark-flex { background: rgba(215, 162, 55, 0.1); border: 1px solid rgba(215, 162, 55, 0.4); }
    .spot-dark-faculty { background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.4); }

    .spot-light-available { background: #ffffff; border: 1.5px solid rgba(16, 185, 129, 0.45); box-shadow: 0 2px 8px rgba(16, 185, 129, 0.08); }
    .spot-light-occupied { background: #ffffff; border: 1.5px solid rgba(244, 63, 94, 0.35); box-shadow: 0 2px 8px rgba(244, 63, 94, 0.08); }
    .spot-light-flex { background: #ffffff; border: 1.5px solid rgba(215, 162, 55, 0.5); box-shadow: 0 2px 8px rgba(215, 162, 55, 0.12); }
    .spot-light-faculty { background: #ffffff; border: 1.5px solid rgba(139, 92, 246, 0.45); box-shadow: 0 2px 8px rgba(139, 92, 246, 0.1); }

    .car-svg-container {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .color-swatch-mini {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 2px;
      vertical-align: middle;
      margin-left: 4px;
    }

    /* RESPONSIVE LAYOUT CLASSES */
    .responsive-split-2col {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 20px;
      align-items: center;
    }

    .responsive-stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 18px;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .stat-card-widget {
      border-radius: 10px;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .responsive-sensor-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }

    .timeline-scroll-wrapper {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
    }

    .timeline-step-item {
      border-radius: 8px;
      padding: 8px 10px;
    }

    .responsive-2col-gap {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .responsive-3col-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .responsive-footer-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr;
      gap: 24px;
    }

    .responsive-devices-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr 0.8fr 0.6fr;
      gap: 12px;
      align-items: flex-start;
    }

    .responsive-swatches-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 10px;
    }

    .responsive-icons-grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 8px;
    }

    .responsive-topology-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }

    .state-machine-scroll-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 6px;
      scrollbar-width: none;
    }
    .state-machine-scroll-wrapper::-webkit-scrollbar { display: none; }

    .filter-scroll-container {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      padding-bottom: 2px;
      max-width: 100%;
    }
    .filter-scroll-container::-webkit-scrollbar { display: none; }

    .table-scroll-container {
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
    }

    .wayfinding-strip-dark {
      background: #050c0b;
      border: 1px solid #1c302b;
      border-radius: 8px;
      padding: 6px 14px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      font-size: 10.5px;
      color: #94a3b8;
      flex-wrap: wrap;
      gap: 6px;
    }

    .wayfinding-strip-light {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 6px 14px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      font-size: 10.5px;
      color: #334155;
      font-weight: 700;
      flex-wrap: wrap;
      gap: 6px;
    }

    /* HEADER RIBBON & BAR */
    .header-ribbon-dark {
      background: linear-gradient(90deg, #091715 0%, #113833 50%, #091715 100%);
      border-bottom: 1px solid rgba(17,110,99,0.3);
      padding: 6px 20px;
    }

    .header-ribbon-light {
      background: linear-gradient(90deg, #116E63 0%, #0d554c 100%);
      padding: 6px 20px;
    }

    .ribbon-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10.5px;
      color: #e2e8f0;
      max-width: 1220px;
      margin: 0 auto;
      flex-wrap: wrap;
      gap: 6px;
    }

    .header-bar-dark {
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 12px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      max-width: 1220px;
      margin: 0 auto;
      flex-wrap: wrap;
    }

    .header-bar-light {
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 12px;
      border-bottom: 1px solid #e2e8f0;
      background: #ffffff;
      max-width: 1220px;
      margin: 0 auto;
      flex-wrap: wrap;
    }

    .header-logo-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-pills-scroll-wrapper {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .nav-pills-scroll-wrapper::-webkit-scrollbar { display: none; }

    .nav-pills-cluster {
      display: inline-flex;
      gap: 3px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      padding: 3px;
      border-radius: 999px;
      white-space: nowrap;
    }

    .nav-pills-cluster-light {
      display: inline-flex;
      gap: 3px;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      padding: 3px;
      border-radius: 999px;
      white-space: nowrap;
    }

    .header-utilities-cluster {
      display: flex;
      align-items: center;
      gap: 5px;
      flex-wrap: wrap;
    }

    /* ==========================================================================
       MEDIA QUERIES FOR ULTRA-RESPONSIVE MOBILE & TABLET PERFECTION
       ========================================================================== */

    @media (max-width: 1024px) {
      .responsive-parking-grid {
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 8px !important;
      }
      .responsive-devices-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
      .responsive-topology-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
      .responsive-icons-grid {
        grid-template-columns: repeat(4, 1fr) !important;
      }
    }

    @media (max-width: 768px) {
      /* TOP BAR */
      .figma-top-bar {
        flex-direction: column;
        align-items: stretch;
        padding: 6px 12px;
        gap: 6px;
      }
      .figma-top-left {
        justify-content: space-between;
        width: 100%;
      }
      .figma-top-right {
        display: none; /* Can be toggled on desktop or via drawer */
      }
      .figma-nav-links {
        width: 100%;
        padding: 2px 0 4px;
      }

      /* CANVAS */
      .figma-hero-header {
        padding: 12px 12px 6px;
      }
      .figma-hero-card {
        flex-direction: column;
        align-items: stretch;
        padding: 16px 14px;
        gap: 14px;
      }
      .figma-hero-stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        width: 100%;
      }
      .hero-stat-box {
        padding: 8px 10px;
      }

      .figma-canvas {
        padding: 8px 10px 48px;
        gap: 24px;
      }

      .figma-frame-body-dark,
      .figma-frame-body-light {
        padding: 14px 10px !important;
      }

      /* GRIDS */
      .responsive-split-2col {
        grid-template-columns: 1fr !important;
        gap: 16px !important;
      }

      .responsive-stats-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 8px !important;
      }

      .responsive-parking-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 6px !important;
      }

      .spot-card-mini {
        min-height: 110px !important;
        padding: 6px !important;
      }

      .timeline-scroll-wrapper {
        display: flex !important;
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch !important;
        scrollbar-width: none !important;
        padding-bottom: 6px !important;
      }
      .timeline-scroll-wrapper::-webkit-scrollbar { display: none; }
      .timeline-step-item {
        flex: 0 0 135px !important;
        min-width: 135px !important;
      }

      .responsive-sensor-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 6px !important;
      }

      .responsive-3col-grid {
        grid-template-columns: 1fr !important;
        gap: 6px !important;
      }

      .responsive-2col-gap {
        grid-template-columns: 1fr !important;
        gap: 6px !important;
      }

      .responsive-footer-grid {
        grid-template-columns: 1fr !important;
        gap: 16px !important;
      }

      .responsive-swatches-grid {
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 6px !important;
      }

      .header-bar-dark, .header-bar-light {
        padding: 8px 10px;
        gap: 8px;
      }

      .btn-cluster-wrap {
        flex-direction: column;
      }
      .btn-cluster-wrap .btn {
        width: 100%;
        min-height: 38px;
      }
    }

    @media (max-width: 480px) {
      .responsive-swatches-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
      .responsive-icons-grid {
        grid-template-columns: repeat(3, 1fr) !important;
      }
      .token-grid {
        grid-template-columns: 1fr !important;
      }
    }

    /* ==========================================================================
       FIGMA UI/UX DETAILED ENGINEERING BREAKDOWN CARDS
       ========================================================================== */
    .figma-uiux-breakdown {
      background: #141c1a;
      border: 1.5px solid #116e6366;
      border-radius: 12px;
      margin-top: 14px;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.45);
      position: relative;
    }

    .breakdown-header {
      background: linear-gradient(90deg, #0d2521 0%, #164039 50%, #0d2521 100%);
      border-bottom: 1px solid #116e6366;
      padding: 10px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }

    .breakdown-title-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .breakdown-badge {
      background: rgba(215, 162, 55, 0.15);
      border: 1px solid #d7a237;
      color: #ffd166;
      font-size: 11px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 6px;
      font-family: var(--font-mono);
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .breakdown-title {
      color: #ffffff;
      font-family: var(--font-heading);
      font-size: 13.5px;
      font-weight: 800;
      margin: 0;
    }

    .breakdown-chips {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .breakdown-chip {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #94a3b8;
      font-size: 10px;
      font-family: var(--font-mono);
      padding: 2px 7px;
      border-radius: 4px;
    }

    .breakdown-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      padding: 14px 18px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      background: #0d1514;
    }

    .breakdown-col {
      background: rgba(255, 255, 255, 0.025);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 8px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .breakdown-col-header {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--fbsu-gold);
      font-size: 11px;
      font-weight: 800;
      font-family: var(--font-heading);
      margin-bottom: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      padding-bottom: 4px;
    }

    .breakdown-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10.5px;
      padding: 3px 0;
      gap: 6px;
      border-bottom: 1px dotted rgba(255, 255, 255, 0.04);
    }
    .breakdown-item:last-child {
      border-bottom: none;
    }

    .breakdown-item-key {
      color: #94a3b8;
      font-family: var(--font-body);
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .breakdown-item-val {
      color: #ffffff;
      font-family: var(--font-mono);
      font-weight: 700;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 9.5px;
      text-align: left;
      direction: ltr;
    }

    .breakdown-ux-box {
      padding: 14px 18px;
      background: linear-gradient(180deg, #112521 0%, #0c1a17 100%);
      display: flex;
      gap: 12px;
      align-items: flex-start;
      border-top: 1px solid #116e6333;
    }

    .breakdown-ux-icon {
      background: rgba(17, 110, 99, 0.35);
      border: 1px solid #116e63;
      color: #38c2b0;
      width: 34px;
      height: 34px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .breakdown-ux-content h4 {
      font-family: var(--font-heading);
      color: #ffd166;
      font-size: 13px;
      font-weight: 800;
      margin-bottom: 5px;
    }

    .breakdown-ux-content p {
      color: #cbd5e1;
      font-size: 11.5px;
      line-height: 1.65;
      font-family: var(--font-body);
    }

    @media (max-width: 1024px) {
      .breakdown-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 10px !important;
      }
    }

    @media (max-width: 640px) {
      .breakdown-grid {
        grid-template-columns: 1fr !important;
        gap: 8px !important;
        padding: 10px 12px !important;
      }
      .breakdown-header {
        padding: 8px 12px !important;
      }
      .breakdown-ux-box {
        flex-direction: column !important;
        padding: 12px !important;
      }
    }
  </style>
</head>
<body class="inspect-mode">

  <!-- FIGMA TOP TOOLBAR -->
  <header class="figma-top-bar">
    <div class="figma-top-left">
      <div class="figma-logo-badge">
        <svg width="16" height="16" viewBox="0 0 38 57" fill="none">
          <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
          <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
          <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
          <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
          <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
        </svg>
        <span>Figma Showcase</span>
      </div>
      <div class="figma-file-title">
        <span>FBSU-Smart-Parking.fig</span>
        <span class="figma-version-pill">v3.0 Ultra-Responsive</span>
      </div>
    </div>

    <!-- Quick Frame Jump Navigation for ALL 18 Sections -->
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
      <a href="#f-tutoring" class="figma-nav-btn" style="color:var(--fbsu-gold);">16. النشاط والتدريس الطلابي</a>
      <a href="#f-office-hours" class="figma-nav-btn" style="color:#38c2b0;">17. الساعات المكتبية للعمداء</a>
      <a href="#f-rooms" class="figma-nav-btn" style="color:#60a5fa;">18. حجز القاعات والمعامل</a>
    </nav>

    <div class="figma-top-right">
      <button id="toggleInspectBtn" class="btn-toggle-inspect active">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>Inspect Mode</span>
      </button>
      <button id="toggleFullScreenBtn" class="btn-toggle-inspect" onclick="document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();" title="ملء الشاشة">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
        <span>Full Screen</span>
      </button>
    </div>
  </header>

  <!-- CANVAS HERO HEADER -->
  <section class="figma-hero-header">
    <div class="figma-hero-card">
      <div class="figma-hero-content">
        <h1>
          <span>منظومة مواقف جامعة فهد بن سلطان الذكية (FBSU)</span>
          <span class="figma-version-pill" style="font-size:10.5px;">100% Complete Dual-Theme & Mobile-Optimized</span>
        </h1>
        <p>
          توثيق بصري وهندسي شامل ومُفصّل لكافة أجزاء المنظومة دون استثناء أي مكون أو حالة. تم تجسيد كل قسم كإطارين متكاملين (Artboards) للوضع الليلي الفاخر (Dark Mode) والوضع النهاري المؤسسي المعتمد (Light Mode)، بتوافق تام مع شاشات الجوال والحواسب.
        </p>
      </div>
      <div class="figma-hero-stats">
        <div class="hero-stat-box">
          <div class="hero-stat-number">18</div>
          <div class="hero-stat-label">Full Sections</div>
        </div>
        <div class="hero-stat-box">
          <div class="hero-stat-number">36</div>
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
"""

    footer_and_js = """
  </main>

  <script>
    // Inspect Mode Toggle
    const inspectBtn = document.getElementById('toggleInspectBtn');
    if (inspectBtn) {
      inspectBtn.addEventListener('click', () => {
        document.body.classList.toggle('inspect-mode');
        inspectBtn.classList.toggle('active');
      });
    }

    // Nav active link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.figma-nav-btn');

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 100) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  </script>
</body>
</html>
"""

    sections_html = "\n".join([
        get_sections_01_to_04(),
        get_sections_05_to_08(),
        get_sections_09_to_12(),
        get_sections_13_to_15(),
        get_sections_16_to_18()
    ])

    # Inject UI/UX Detailed Engineering Breakdown Cards for all 18 sections
    id_to_num = {
        'f-header': 1,
        'f-hero': 2,
        'f-grid': 3,
        'f-sensor': 4,
        'f-simulator': 5,
        'f-gate': 6,
        'f-booking': 7,
        'f-share': 8,
        'f-wallet': 9,
        'f-analytics': 10,
        'f-auth': 11,
        'f-footer': 12,
        'f-devices': 13,
        'f-tokens': 14,
        'f-architecture': 15,
        'f-tutoring': 16,
        'f-office-hours': 17,
        'f-rooms': 18
    }

    for sec_id, num in id_to_num.items():
        card_html = render_uiux_breakdown_html(num)
        pattern = rf'(<section id="{sec_id}".*?)(</section>)'
        sections_html = re.sub(pattern, rf'\1{card_html}\n    \2', sections_html, count=1, flags=re.DOTALL)

    combined = "\n".join([css_and_head, sections_html, footer_and_js])
    
    # Write to root index.html
    script_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(os.path.dirname(script_dir))
    output_path = os.path.join(root_dir, "showcase.html")

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(combined)
    
    print(f"Master Showcase Successfully Written to {output_path}! Size: {len(combined)} bytes")

if __name__ == '__main__':
    assemble_master_showcase()
