import React, { useState, useMemo, useEffect, useLayoutEffect, Fragment, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import jsQR from 'jsqr';
import QRCode from 'qrcode';
import { BrowserMultiFormatReader } from '@zxing/browser';
import * as XLSX from 'xlsx';
import UDSLogo from './assets/uds-logo.png';
import {
  Laptop,
  Server,
  Monitor,
  HardDrive,
  Plus,
  Search,
  Edit2,
  Trash2,
  Download,
  Key,
  History,
  ArrowRightLeft,
  X,
  Check,
  Share2,
  ShieldCheck,
  CalendarClock,
  Tag,
  MapPin,
  Sparkles,
  Printer,
  ExternalLink,
  PhoneCall,
  TrendingDown,
  Users,
  Smartphone,
  Navigation,
  Filter,
  BarChart3,
  QrCode,
  Scan,
  Wrench,
  Sun,
  Moon,
  Menu,
  Mail,
  DollarSign,
  ArrowRight,
  Bot,
  Headset,
  Plug,
  Send,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import employeeSheetData from './data/employees.json';
import employeePhotoMap from './data/employeePhotos.json';
import automateMap from './data/automateMap.json';

const DARK_MODE_STYLES = `
  /* CSS Custom Properties for Award-Winning Design */
  :root {
    --spacing-unit: 0.5rem;
    --golden-ratio: 1.618;
    --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-spring: 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
    --shadow-elevation-low: 0 1px 2px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.02);
    --shadow-elevation-medium: 0 4px 16px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
    --shadow-elevation-high: 0 12px 40px rgba(0,0,0,0.12), 0 6px 20px rgba(0,0,0,0.08);
    --shadow-elevation-ultra: 0 24px 80px rgba(0,0,0,0.16), 0 12px 40px rgba(0,0,0,0.12);
  }

  .neon-blue-text {
    color: #38bdf8 !important;
    text-shadow: 0 0 6px rgba(56, 189, 248, 0.65), 0 0 14px rgba(56, 189, 248, 0.35);
  }
  
  html.theme-dark body {
    background:
      radial-gradient(circle at 18% 18%, rgba(100, 240, 255, 0.14), transparent 32%),
      radial-gradient(circle at 82% 12%, rgba(255, 122, 195, 0.12), transparent 30%),
      linear-gradient(160deg, #020510 0%, #060b1c 45%, #0c1634 100%);
    color: #e7edff;
  }
  html.theme-dark .bg-white,
  html.theme-dark .bg-white\\/50,
  html.theme-dark .bg-white\\/60,
  html.theme-dark .bg-white\\/70,
  html.theme-dark .bg-white\\/80,
  html.theme-dark .bg-white\\/90 {
    background: linear-gradient(135deg, #101827 0%, #1a2332 100%) !important;
    border: 1px solid #1d4ed8 !important;
    box-shadow: 0 2px 12px rgba(37, 99, 235, 0.12), 0 0 0 1px rgba(59, 130, 246, 0.08) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base) !important;
  }
  html.theme-dark .bg-white:hover,
  html.theme-dark .rounded-3xl:hover,
  html.theme-dark .glass-card:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.2), 0 0 0 1px rgba(59, 130, 246, 0.15), 0 0 12px rgba(59, 130, 246, 0.1) !important;
  }
  html.theme-dark .bg-slate-50,
  html.theme-dark .bg-slate-50\\/60,
  html.theme-dark .bg-slate-50\\/70,
  html.theme-dark .bg-slate-50\\/80,
  html.theme-dark .bg-slate-50\\/90,
  html.theme-dark .bg-slate-100,
  html.theme-dark .bg-slate-100\\/70,
  html.theme-dark .bg-slate-200 {
    background: linear-gradient(135deg, #0f1831 0%, #1e293b 100%) !important;
    border: 1px solid #0ea5e9 !important;
    box-shadow: 0 2px 10px rgba(14, 165, 233, 0.16), 0 0 0 1px rgba(14, 165, 233, 0.08) !important;
    backdrop-filter: blur(14px) saturate(140%) !important;
    -webkit-backdrop-filter: blur(14px) saturate(140%) !important;
    transition: all var(--transition-base) !important;
  }
  html.theme-dark .bg-blue-50 { 
    background: linear-gradient(135deg, rgba(59,130,246,0.25) 0%, rgba(37,99,235,0.18) 100%) !important; 
    color: #cfe1ff; 
    border: 2px solid #3b82f6 !important;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.25) !important;
  }
  html.theme-dark .border-slate-50,
  html.theme-dark .border-slate-100,
  html.theme-dark .border-slate-200 {
    border-color: #203459 !important;
  }
  html.theme-dark .divide-slate-100,
  html.theme-dark .divide-slate-200 {
    border-color: #203459 !important;
  }
  html.theme-dark .ring-slate-100,
  html.theme-dark .ring-slate-200 {
    --tw-ring-color: #203459 !important;
  }
  html.theme-dark .text-slate-900,
  html.theme-dark .text-slate-800,
  html.theme-dark .text-slate-700 { color: #e9edf7 !important; }
  html.theme-dark .text-slate-600 { color: #cfd8e7 !important; }
  html.theme-dark .text-slate-500 { color: #a5b4cf !important; }
  html.theme-dark .text-slate-400 { color: #b9c7df !important; }
  html.theme-dark .text-slate-300 { color: #e9edf7 !important; }
  html.theme-dark .shadow-sm { box-shadow: 0 18px 55px rgba(0,0,0,0.5) !important; }
  html.theme-dark .shadow-inner { box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 16px 50px rgba(0,0,0,0.38) !important; }
  html.theme-dark input,
  html.theme-dark select,
  html.theme-dark textarea {
    background-color: #0f172a !important;
    color: #e9edf7 !important;
    border-color: #1f2c46 !important;
  }
  html.theme-dark input::placeholder,
  html.theme-dark textarea::placeholder {
    color: #a5b4cf !important;
  }
  html.theme-dark .hero-shell {
    overflow-x: clip !important;
  }
  html.theme-dark .glass-card {
    background: linear-gradient(145deg, rgba(12, 16, 32, 0.96), rgba(11, 18, 36, 0.9)) !important;
    box-shadow:
      0 16px 40px rgba(0, 0, 0, 0.45),
      0 4px 18px rgba(37, 99, 235, 0.15),
      0 0 0 1px rgba(92, 224, 255, 0.12) !important;
    border: 1px solid rgba(37, 99, 235, 0.35) !important;
    backdrop-filter: blur(24px) saturate(200%) !important;
    -webkit-backdrop-filter: blur(24px) saturate(200%) !important;
    transition: all var(--transition-base) !important;
    will-change: transform, box-shadow !important;
  }
  
  /* Stagger Animation for Cards */
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  html.theme-dark .rounded-3xl,
  html.theme-dark .glass-card {
    animation: slideInUp var(--transition-spring) backwards !important;
  }
  
  html.theme-dark .rounded-3xl:nth-child(1),
  html.theme-dark .glass-card:nth-child(1) { animation-delay: 0ms !important; }
  html.theme-dark .rounded-3xl:nth-child(2),
  html.theme-dark .glass-card:nth-child(2) { animation-delay: 50ms !important; }
  html.theme-dark .rounded-3xl:nth-child(3),
  html.theme-dark .glass-card:nth-child(3) { animation-delay: 100ms !important; }
  html.theme-dark .rounded-3xl:nth-child(4),
  html.theme-dark .glass-card:nth-child(4) { animation-delay: 150ms !important; }
  html.theme-dark .rounded-3xl:nth-child(5),
  html.theme-dark .glass-card:nth-child(5) { animation-delay: 200ms !important; }
  html.theme-dark .rounded-3xl:nth-child(6),
  html.theme-dark .glass-card:nth-child(6) { animation-delay: 250ms !important; }
  html.theme-dark .rounded-3xl:nth-child(n+7),
  html.theme-dark .glass-card:nth-child(n+7) { animation-delay: 300ms !important; }
  
  /* Button Micro-interactions */
  html.theme-dark button,
  html.theme-dark .button,
  html.theme-dark [role="button"] {
    transition: all var(--transition-fast) !important;
    position: relative !important;
    overflow: hidden !important;
  }
  
  html.theme-dark button:hover,
  html.theme-dark .button:hover,
  html.theme-dark [role="button"]:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3) !important;
  }
  
  html.theme-dark button:active,
  html.theme-dark .button:active,
  html.theme-dark [role="button"]:active {
    transform: translateY(0) scale(0.98) !important;
    transition: all var(--transition-fast) !important;
  }
  
  /* Ripple effect */
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  /* Neon Border & Title Color Variants - Dark Mode */
  html.theme-dark .rounded-3xl:nth-child(6n+1),
  html.theme-dark .glass-card:nth-child(6n+1) {
    border: 1px solid #38bdf8 !important;
    box-shadow: 0 0 8px rgba(56, 189, 248, 0.25), 0 3px 8px rgba(56, 189, 248, 0.15) !important;
    transition: all var(--transition-base) !important;
  }
  html.theme-dark .rounded-3xl:nth-child(6n+1):hover,
  html.theme-dark .glass-card:nth-child(6n+1):hover {
    border-color: #7dd3fc !important;
    box-shadow: 0 0 12px rgba(56, 189, 248, 0.22), 0 4px 10px rgba(56, 189, 248, 0.12), 0 0 16px rgba(125, 211, 252, 0.08) !important;
  }
  html.theme-dark .rounded-3xl:nth-child(6n+1) .text-sm.font-bold,
  html.theme-dark .rounded-3xl:nth-child(6n+1) .text-sm.font-semibold,
  html.theme-dark .rounded-3xl:nth-child(6n+1) .text-base.font-bold,
  html.theme-dark .rounded-3xl:nth-child(6n+1) .text-base.font-semibold,
  html.theme-dark .rounded-3xl:nth-child(6n+1) .text-lg.font-bold,
  html.theme-dark .rounded-3xl:nth-child(6n+1) .text-lg.font-semibold,
  html.theme-dark .rounded-3xl:nth-child(6n+1) .software-metric-value,
  html.theme-dark .glass-card:nth-child(6n+1) .text-sm.font-bold,
  html.theme-dark .glass-card:nth-child(6n+1) .text-sm.font-semibold,
  html.theme-dark .glass-card:nth-child(6n+1) .text-base.font-bold,
  html.theme-dark .glass-card:nth-child(6n+1) .text-base.font-semibold,
  html.theme-dark .glass-card:nth-child(6n+1) .text-lg.font-bold,
  html.theme-dark .glass-card:nth-child(6n+1) .text-lg.font-semibold,
  html.theme-dark .glass-card:nth-child(6n+1) .software-metric-value {
    color: #7dd3fc !important;
    text-shadow: 0 0 8px rgba(56, 189, 248, 0.25), 0 2px 6px rgba(125, 211, 252, 0.13), 0 0 12px rgba(56, 189, 248, 0.08) !important;
    font-weight: 800 !important;
  }
  
  html.theme-dark .rounded-3xl:nth-child(6n+2),
  html.theme-dark .glass-card:nth-child(6n+2) {
    border: 1px solid #4ade80 !important;
    box-shadow: 0 0 8px rgba(74, 222, 128, 0.25), 0 3px 8px rgba(74, 222, 128, 0.15) !important;
    transition: all var(--transition-base) !important;
  }
  html.theme-dark .rounded-3xl:nth-child(6n+2):hover,
  html.theme-dark .glass-card:nth-child(6n+2):hover {
    border-color: #86efac !important;
    box-shadow: 0 0 16px rgba(74, 222, 128, 0.3), 0 6px 16px rgba(74, 222, 128, 0.2) !important;
  }
  html.theme-dark .rounded-3xl:nth-child(6n+2) .text-sm.font-bold,
  html.theme-dark .rounded-3xl:nth-child(6n+2) .text-sm.font-semibold,
  html.theme-dark .rounded-3xl:nth-child(6n+2) .text-base.font-bold,
  html.theme-dark .rounded-3xl:nth-child(6n+2) .text-base.font-semibold,
  html.theme-dark .rounded-3xl:nth-child(6n+2) .text-lg.font-bold,
  html.theme-dark .rounded-3xl:nth-child(6n+2) .text-lg.font-semibold,
  html.theme-dark .rounded-3xl:nth-child(6n+2) .software-metric-value,
  html.theme-dark .glass-card:nth-child(6n+2) .text-sm.font-bold,
  html.theme-dark .glass-card:nth-child(6n+2) .text-sm.font-semibold,
  html.theme-dark .glass-card:nth-child(6n+2) .text-base.font-bold,
  html.theme-dark .glass-card:nth-child(6n+2) .text-base.font-semibold,
  html.theme-dark .glass-card:nth-child(6n+2) .text-lg.font-bold,
  html.theme-dark .glass-card:nth-child(6n+2) .text-lg.font-semibold,
  html.theme-dark .glass-card:nth-child(6n+2) .software-metric-value {
    color: #86efac !important;
    text-shadow: 0 0 8px rgba(74, 222, 128, 0.35), 0 2px 6px rgba(134, 239, 172, 0.25), 0 0 14px rgba(74, 222, 128, 0.15) !important;
    font-weight: 800 !important;
  }
  
  html.theme-dark .rounded-3xl:nth-child(6n+3),
  html.theme-dark .glass-card:nth-child(6n+3) {
    border: 1px solid #c084fc !important;
    box-shadow: 0 0 8px rgba(192, 132, 252, 0.25), 0 3px 8px rgba(192, 132, 252, 0.15) !important;
    transition: all var(--transition-base) !important;
  }
  html.theme-dark .rounded-3xl:nth-child(6n+3):hover,
  html.theme-dark .glass-card:nth-child(6n+3):hover {
    border-color: #d8b4fe !important;
    box-shadow: 0 0 16px rgba(192, 132, 252, 0.3), 0 6px 16px rgba(192, 132, 252, 0.2) !important;
  }
  html.theme-dark .rounded-3xl:nth-child(6n+3) .text-sm.font-bold,
  html.theme-dark .rounded-3xl:nth-child(6n+3) .text-sm.font-semibold,
  html.theme-dark .rounded-3xl:nth-child(6n+3) .text-base.font-bold,
  html.theme-dark .rounded-3xl:nth-child(6n+3) .text-base.font-semibold,
  html.theme-dark .rounded-3xl:nth-child(6n+3) .text-lg.font-bold,
  html.theme-dark .rounded-3xl:nth-child(6n+3) .text-lg.font-semibold,
  html.theme-dark .rounded-3xl:nth-child(6n+3) .software-metric-value,
  html.theme-dark .glass-card:nth-child(6n+3) .text-sm.font-bold,
  html.theme-dark .glass-card:nth-child(6n+3) .text-sm.font-semibold,
  html.theme-dark .glass-card:nth-child(6n+3) .text-base.font-bold,
  html.theme-dark .glass-card:nth-child(6n+3) .text-base.font-semibold,
  html.theme-dark .glass-card:nth-child(6n+3) .text-lg.font-bold,
  html.theme-dark .glass-card:nth-child(6n+3) .text-lg.font-semibold,
  html.theme-dark .glass-card:nth-child(6n+3) .software-metric-value {
    color: #d8b4fe !important;
    text-shadow: 0 0 8px rgba(192, 132, 252, 0.35), 0 2px 6px rgba(216, 180, 254, 0.25), 0 0 14px rgba(192, 132, 252, 0.15) !important;
    font-weight: 800 !important;
  }
  
  html.theme-dark .rounded-3xl:nth-child(6n+4),
  html.theme-dark .glass-card:nth-child(6n+4) {
    border: 1px solid #f472b6 !important;
    box-shadow: 0 0 8px rgba(244, 114, 182, 0.25), 0 3px 8px rgba(244, 114, 182, 0.15) !important;
    transition: all var(--transition-base) !important;
  }
  html.theme-dark .rounded-3xl:nth-child(6n+4):hover,
  html.theme-dark .glass-card:nth-child(6n+4):hover {
    border-color: #f9a8d4 !important;
    box-shadow: 0 0 16px rgba(244, 114, 182, 0.3), 0 6px 16px rgba(244, 114, 182, 0.2) !important;
  }
  html.theme-dark .rounded-3xl:nth-child(6n+4) .text-sm.font-bold,
  html.theme-dark .rounded-3xl:nth-child(6n+4) .text-sm.font-semibold,
  html.theme-dark .rounded-3xl:nth-child(6n+4) .text-base.font-bold,
  html.theme-dark .rounded-3xl:nth-child(6n+4) .text-base.font-semibold,
  html.theme-dark .rounded-3xl:nth-child(6n+4) .text-lg.font-bold,
  html.theme-dark .rounded-3xl:nth-child(6n+4) .text-lg.font-semibold,
  html.theme-dark .rounded-3xl:nth-child(6n+4) .software-metric-value,
  html.theme-dark .glass-card:nth-child(6n+4) .text-sm.font-bold,
  html.theme-dark .glass-card:nth-child(6n+4) .text-sm.font-semibold,
  html.theme-dark .glass-card:nth-child(6n+4) .text-base.font-bold,
  html.theme-dark .glass-card:nth-child(6n+4) .text-base.font-semibold,
  html.theme-dark .glass-card:nth-child(6n+4) .text-lg.font-bold,
  html.theme-dark .glass-card:nth-child(6n+4) .text-lg.font-semibold,
  html.theme-dark .glass-card:nth-child(6n+4) .software-metric-value {
    color: #f9a8d4 !important;
    text-shadow: 0 0 8px rgba(244, 114, 182, 0.35), 0 2px 6px rgba(249, 168, 212, 0.25), 0 0 14px rgba(244, 114, 182, 0.15) !important;
    font-weight: 800 !important;
  }
  
  html.theme-dark .rounded-3xl:nth-child(6n+5),
  html.theme-dark .glass-card:nth-child(6n+5) {
    border: 1px solid #fb7185 !important;
    box-shadow: 0 0 8px rgba(251, 113, 133, 0.25), 0 3px 8px rgba(251, 113, 133, 0.15) !important;
    transition: all var(--transition-base) !important;
  }
  html.theme-dark .rounded-3xl:nth-child(6n+5):hover,
  html.theme-dark .glass-card:nth-child(6n+5):hover {
    border-color: #fda4af !important;
    box-shadow: 0 0 16px rgba(251, 113, 133, 0.3), 0 6px 16px rgba(251, 113, 133, 0.2) !important;
  }
  html.theme-dark .rounded-3xl:nth-child(6n+5) .text-sm.font-bold,
  html.theme-dark .rounded-3xl:nth-child(6n+5) .text-sm.font-semibold,
  html.theme-dark .rounded-3xl:nth-child(6n+5) .text-base.font-bold,
  html.theme-dark .rounded-3xl:nth-child(6n+5) .text-base.font-semibold,
  html.theme-dark .rounded-3xl:nth-child(6n+5) .text-lg.font-bold,
  html.theme-dark .rounded-3xl:nth-child(6n+5) .text-lg.font-semibold,
  html.theme-dark .rounded-3xl:nth-child(6n+5) .software-metric-value,
  html.theme-dark .glass-card:nth-child(6n+5) .text-sm.font-bold,
  html.theme-dark .glass-card:nth-child(6n+5) .text-sm.font-semibold,
  html.theme-dark .glass-card:nth-child(6n+5) .text-base.font-bold,
  html.theme-dark .glass-card:nth-child(6n+5) .text-base.font-semibold,
  html.theme-dark .glass-card:nth-child(6n+5) .text-lg.font-bold,
  html.theme-dark .glass-card:nth-child(6n+5) .text-lg.font-semibold,
  html.theme-dark .glass-card:nth-child(6n+5) .software-metric-value {
    color: #fda4af !important;
    text-shadow: 0 0 8px rgba(251, 113, 133, 0.35), 0 2px 6px rgba(253, 164, 175, 0.25), 0 0 14px rgba(251, 113, 133, 0.15) !important;
    font-weight: 800 !important;
  }
  
  html.theme-dark .rounded-3xl:nth-child(6n),
  html.theme-dark .glass-card:nth-child(6n) {
    border: 1px solid #fb923c !important;
    box-shadow: 0 0 8px rgba(251, 146, 60, 0.25), 0 3px 8px rgba(251, 146, 60, 0.15) !important;
    transition: all var(--transition-base) !important;
  }
  html.theme-dark .rounded-3xl:nth-child(6n):hover,
  html.theme-dark .glass-card:nth-child(6n):hover {
    border-color: #fdba74 !important;
    box-shadow: 0 0 16px rgba(251, 146, 60, 0.3), 0 6px 16px rgba(251, 146, 60, 0.2) !important;
  }
  html.theme-dark .rounded-3xl:nth-child(6n) .text-sm.font-bold,
  html.theme-dark .rounded-3xl:nth-child(6n) .text-sm.font-semibold,
  html.theme-dark .rounded-3xl:nth-child(6n) .text-base.font-bold,
  html.theme-dark .rounded-3xl:nth-child(6n) .text-base.font-semibold,
  html.theme-dark .rounded-3xl:nth-child(6n) .text-lg.font-bold,
  html.theme-dark .rounded-3xl:nth-child(6n) .text-lg.font-semibold,
  html.theme-dark .rounded-3xl:nth-child(6n) .software-metric-value,
  html.theme-dark .glass-card:nth-child(6n) .text-sm.font-bold,
  html.theme-dark .glass-card:nth-child(6n) .text-sm.font-semibold,
  html.theme-dark .glass-card:nth-child(6n) .text-base.font-bold,
  html.theme-dark .glass-card:nth-child(6n) .text-base.font-semibold,
  html.theme-dark .glass-card:nth-child(6n) .text-lg.font-bold,
  html.theme-dark .glass-card:nth-child(6n) .text-lg.font-semibold,
  html.theme-dark .glass-card:nth-child(6n) .software-metric-value {
    color: #fdba74 !important;
    text-shadow: 0 0 8px rgba(251, 146, 60, 0.35), 0 2px 6px rgba(253, 186, 116, 0.25), 0 0 14px rgba(251, 146, 60, 0.15) !important;
    font-weight: 800 !important;
  }
  
  /* Enhanced Card Titles - Dark Mode */
  html.theme-dark .text-2xl.font-bold {
    font-size: 2.75rem !important;
    background: linear-gradient(135deg, #60a5fa 0%, #38bdf8 100%) !important;
    -webkit-background-clip: text !important;
    background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    filter: drop-shadow(0 2px 12px rgba(96, 165, 250, 0.55)) drop-shadow(0 0 18px rgba(56, 189, 248, 0.35)) !important;
    font-weight: 900 !important;
    letter-spacing: -0.03em !important;
  }
  html.theme-dark .text-xl.font-bold,
  html.theme-dark .text-xl.font-semibold {
    font-size: 1.875rem !important;
    color: #60a5fa !important;
    text-shadow: 0 3px 12px rgba(96, 165, 250, 0.4), 0 0 18px rgba(96, 165, 250, 0.28) !important;
    font-weight: 800 !important;
    letter-spacing: -0.02em !important;
  }
  html.theme-dark .text-lg.font-bold,
  html.theme-dark .text-lg.font-semibold {
    font-size: 1.625rem !important;
    color: #7dd3fc !important;
    text-shadow: 0 2px 8px rgba(125, 211, 252, 0.4), 0 0 16px rgba(147, 197, 253, 0.28) !important;
    font-weight: 800 !important;
    letter-spacing: -0.015em !important;
  }
  html.theme-dark .text-base.font-bold,
  html.theme-dark .text-base.font-semibold {
    font-size: 1.375rem !important;
    color: #93c5fd !important;
    text-shadow: 0 2px 6px rgba(147, 197, 253, 0.35), 0 0 12px rgba(191, 219, 254, 0.2) !important;
    font-weight: 800 !important;
  }
  html.theme-dark .text-sm.font-bold,
  html.theme-dark .text-sm.font-semibold {
    font-size: 1.125rem !important;
    color: #bfdbfe !important;
    text-shadow: 0 2px 5px rgba(191, 219, 254, 0.3), 0 0 10px rgba(219, 234, 254, 0.2) !important;
    font-weight: 800 !important;
  }
  html.theme-dark .text-sm.font-bold.text-slate-900,
  html.theme-dark .text-sm.font-semibold.text-slate-900,
  html.theme-dark .text-base.font-semibold.text-slate-900,
  html.theme-dark .text-lg.font-semibold.text-slate-900,
  html.theme-dark .text-lg.font-bold.text-slate-900 {
    color: #bfdbfe !important;
    text-shadow: 0 3px 14px rgba(96, 165, 250, 0.5), 0 0 25px rgba(147, 197, 253, 0.4) !important;
    font-weight: 800 !important;
  }
`;

const LIGHT_MODE_STYLES = `
  html.theme-light body {
    background:
      radial-gradient(circle at 14% 18%, rgba(105, 170, 255, 0.15), transparent 32%),
      radial-gradient(circle at 86% 14%, rgba(255, 190, 210, 0.14), transparent 28%),
      radial-gradient(circle at 18% 86%, rgba(132, 225, 249, 0.12), transparent 30%),
      linear-gradient(180deg, #f8fbff 0%, #f2f6fd 44%, #eef2f6 100%);
    color: #0c1222;
    line-height: 1.6;
    text-rendering: optimizeLegibility;
  }
  html.theme-light .ambient-layer .ambient-orb.blue { background: radial-gradient(circle, rgba(90, 160, 255, 0.18) 0%, rgba(90, 160, 255, 0) 55%); }
  html.theme-light .ambient-layer .ambient-orb.pink { background: radial-gradient(circle, rgba(255, 176, 204, 0.16) 0%, rgba(255, 176, 204, 0) 55%); }
  html.theme-light .ambient-layer .ambient-orb.gold { background: radial-gradient(circle, rgba(255, 220, 170, 0.14) 0%, rgba(255, 220, 170, 0) 55%); }
  html.theme-light .grid-overlay { background-image: linear-gradient(rgba(15, 23, 42, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.05) 1px, transparent 1px); opacity: 0.45; }
  html.theme-light .bg-white,
  html.theme-light .bg-white/50,
  html.theme-light .bg-white/60,
  html.theme-light .bg-white/70,
  html.theme-light .bg-white/80,
  html.theme-light .bg-white/90,
  html.theme-light .bg-slate-50,
  html.theme-light .bg-slate-100 {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(247, 250, 255, 0.98) 55%, rgba(238, 243, 255, 0.96) 100%) !important;
    box-shadow: 0 18px 60px rgba(15, 23, 42, 0.08), 0 4px 16px rgba(59, 130, 246, 0.12), 0 0 0 1px rgba(59, 130, 246, 0.08) !important;
    border: 2px solid #3b82f6 !important;
  }
  html.theme-light .bg-slate-200 {
    background: linear-gradient(135deg, #f7f9fc 0%, #eef3ff 100%) !important;
    border: 2px solid #8b5cf6 !important;
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.15), 0 0 0 1px rgba(139, 92, 246, 0.1) !important;
  }
  html.theme-light .bg-blue-50 { 
    background: linear-gradient(135deg, rgba(219, 234, 254, 0.92) 0%, rgba(239, 246, 255, 0.96) 100%) !important; 
    border: 2px solid #60a5fa !important;
    box-shadow: 0 4px 16px rgba(96, 165, 250, 0.2) !important;
  }
  html.theme-light .bg-rose-50 { 
    background: linear-gradient(135deg, rgba(255, 241, 242, 0.92) 0%, rgba(255, 247, 248, 0.96) 100%) !important; 
    border: 2px solid #fb7185 !important;
    box-shadow: 0 4px 16px rgba(251, 113, 133, 0.2) !important;
  }
  html.theme-light .bg-amber-50 { 
    background: linear-gradient(135deg, rgba(255, 251, 235, 0.92) 0%, rgba(255, 253, 240, 0.96) 100%) !important; 
    border: 2px solid #fbbf24 !important;
    box-shadow: 0 4px 16px rgba(251, 191, 36, 0.2) !important;
  }
  html.theme-light .bg-emerald-50 { 
    background: linear-gradient(135deg, rgba(236, 253, 245, 0.92) 0%, rgba(240, 253, 249, 0.96) 100%) !important; 
    border: 2px solid #10b981 !important;
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.2) !important;
  }
  html.theme-light .bg-indigo-50 { 
    background: linear-gradient(135deg, rgba(238, 242, 255, 0.92) 0%, rgba(245, 247, 255, 0.96) 100%) !important; 
    border: 2px solid #6366f1 !important;
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2) !important;
  }
  html.theme-light .bg-sky-50 { 
    background: linear-gradient(135deg, rgba(240, 249, 255, 0.92) 0%, rgba(244, 251, 255, 0.96) 100%) !important; 
    border: 2px solid #0ea5e9 !important;
    box-shadow: 0 4px 16px rgba(14, 165, 233, 0.2) !important;
  }
  html.theme-light .bg-teal-50 { 
    background: linear-gradient(135deg, rgba(240, 253, 250, 0.92) 0%, rgba(243, 253, 251, 0.96) 100%) !important; 
    border: 2px solid #14b8a6 !important;
    box-shadow: 0 4px 16px rgba(20, 184, 166, 0.2) !important;
  }
  html.theme-light .bg-yellow-50 { 
    background: linear-gradient(135deg, rgba(254, 252, 232, 0.92) 0%, rgba(255, 253, 240, 0.96) 100%) !important; 
    border: 2px solid #eab308 !important;
    box-shadow: 0 4px 16px rgba(234, 179, 8, 0.2) !important;
  }
  html.theme-light .bg-orange-50 { 
    background: linear-gradient(135deg, rgba(255, 247, 237, 0.92) 0%, rgba(255, 249, 240, 0.96) 100%) !important; 
    border: 2px solid #f97316 !important;
    box-shadow: 0 4px 16px rgba(249, 115, 22, 0.2) !important;
  }
  html.theme-light section:nth-of-type(3n+1) .rounded-3xl,
  html.theme-light section:nth-of-type(3n+1) .glass-card {
    background: linear-gradient(135deg, rgba(235, 244, 255, 0.98) 0%, rgba(221, 236, 255, 0.96) 100%) !important;
    border: 2px solid #60a5fa !important;
    box-shadow: 0 8px 32px rgba(96, 165, 250, 0.2), 0 0 0 1px rgba(96, 165, 250, 0.1) !important;
  }
  html.theme-light section:nth-of-type(3n+2) .rounded-3xl,
  html.theme-light section:nth-of-type(3n+2) .glass-card {
    background: linear-gradient(135deg, rgba(255, 246, 240, 0.98) 0%, rgba(255, 236, 229, 0.96) 100%) !important;
    border: 2px solid #fb923c !important;
    box-shadow: 0 8px 32px rgba(251, 146, 60, 0.2), 0 0 0 1px rgba(251, 146, 60, 0.1) !important;
  }
  html.theme-light section:nth-of-type(3n) .rounded-3xl,
  html.theme-light section:nth-of-type(3n) .glass-card {
    background: linear-gradient(135deg, rgba(241, 252, 247, 0.98) 0%, rgba(228, 249, 241, 0.96) 100%) !important;
    border: 2px solid #34d399 !important;
    box-shadow: 0 8px 32px rgba(52, 211, 153, 0.2), 0 0 0 1px rgba(52, 211, 153, 0.1) !important;
  }
  html.theme-light .border-slate-50,
  html.theme-light .border-slate-100,
  html.theme-light .border-slate-200 {
    border-color: #e3e9f5 !important;
  }
  html.theme-light .shadow-sm,
  html.theme-light .shadow,
  html.theme-light .shadow-lg {
    box-shadow: 0 12px 36px rgba(15, 23, 42, 0.08) !important;
  }
  html.theme-light .hero-shell { color: #0b1324 !important; overflow-x: clip !important; }
  html.theme-light .hero-shell [class*="text-white"] { color: #0b1324 !important; }
  html.theme-light .hero-shell [class*="text-white/"] { color: #111827 !important; }
  html.theme-light .hero-shell [class*="bg-white/"] {
    background-color: rgba(255, 255, 255, 0.9) !important;
    color: #0b1324 !important;
    border-color: #d8e1f0 !important;
  }
  html.theme-light .hero-shell .chip-muted {
    background-color: rgba(255, 255, 255, 0.75) !important;
    color: #0f172a !important;
    border-color: #d8e1f0 !important;
  }
  html.theme-light .shadow-inner {
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 14px 40px rgba(15, 23, 42, 0.08) !important;
  }
  html.theme-light input,
  html.theme-light select,
  html.theme-light textarea {
    background-color: #ffffff !important;
    color: #0b1324 !important;
    border-color: #d0d8e7 !important;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.04);
  }
  html.theme-light input::placeholder,
  html.theme-light textarea::placeholder {
    color: #6b7280 !important;
  }
  html.theme-light .glass-card {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(245, 249, 255, 0.96)) !important;
    border: 2px solid rgba(59, 130, 246, 0.4) !important;
    box-shadow: 0 18px 56px rgba(15, 23, 42, 0.14), 0 4px 16px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    transition: all var(--transition-base) !important;
  }
  
  /* Light Mode Card Hover Effects */
  html.theme-light .rounded-3xl:hover,
  html.theme-light .glass-card:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 24px 80px rgba(15, 23, 42, 0.18), 0 8px 32px rgba(59, 130, 246, 0.2) !important;
  }
  
  /* Stagger Animations - Light Mode */
  html.theme-light .rounded-3xl,
  html.theme-light .glass-card {
    animation: slideInUp var(--transition-spring) backwards !important;
  }
  
  html.theme-light .rounded-3xl:nth-child(1),
  html.theme-light .glass-card:nth-child(1) { animation-delay: 0ms !important; }
  html.theme-light .rounded-3xl:nth-child(2),
  html.theme-light .glass-card:nth-child(2) { animation-delay: 50ms !important; }
  html.theme-light .rounded-3xl:nth-child(3),
  html.theme-light .glass-card:nth-child(3) { animation-delay: 100ms !important; }
  html.theme-light .rounded-3xl:nth-child(4),
  html.theme-light .glass-card:nth-child(4) { animation-delay: 150ms !important; }
  html.theme-light .rounded-3xl:nth-child(5),
  html.theme-light .glass-card:nth-child(5) { animation-delay: 200ms !important; }
  html.theme-light .rounded-3xl:nth-child(6),
  html.theme-light .glass-card:nth-child(6) { animation-delay: 250ms !important; }
  html.theme-light .rounded-3xl:nth-child(n+7),
  html.theme-light .glass-card:nth-child(n+7) { animation-delay: 300ms !important; }
  
  /* Button Micro-interactions - Light Mode */
  html.theme-light button:hover,
  html.theme-light .button:hover,
  html.theme-light [role="button"]:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.25) !important;
  }
  
  html.theme-light button:active,
  html.theme-light .button:active,
  html.theme-light [role="button"]:active {
    transform: translateY(0) scale(0.98) !important;
  }
  
  /* Neon Border & Title Color Variants - Light Mode */
  html.theme-light .rounded-3xl:nth-child(6n+1),
  html.theme-light .glass-card:nth-child(6n+1) {
    border: 2px solid #0ea5e9 !important;
    box-shadow: 0 0 12px rgba(14, 165, 233, 0.25), 0 4px 12px rgba(14, 165, 233, 0.15) !important;
    transition: all var(--transition-base) !important;
  }
  html.theme-light .rounded-3xl:nth-child(6n+1):hover,
  html.theme-light .glass-card:nth-child(6n+1):hover {
    border-color: #38bdf8 !important;
    box-shadow: 0 0 24px rgba(14, 165, 233, 0.4), 0 8px 20px rgba(14, 165, 233, 0.25), 0 0 40px rgba(56, 189, 248, 0.15) !important;
  }
  html.theme-light .rounded-3xl:nth-child(6n+1) .text-sm.font-bold,
  html.theme-light .rounded-3xl:nth-child(6n+1) .text-sm.font-semibold,
  html.theme-light .rounded-3xl:nth-child(6n+1) .text-base.font-bold,
  html.theme-light .rounded-3xl:nth-child(6n+1) .text-base.font-semibold,
  html.theme-light .rounded-3xl:nth-child(6n+1) .text-lg.font-bold,
  html.theme-light .rounded-3xl:nth-child(6n+1) .text-lg.font-semibold,
  html.theme-light .rounded-3xl:nth-child(6n+1) .software-metric-value,
  html.theme-light .glass-card:nth-child(6n+1) .text-sm.font-bold,
  html.theme-light .glass-card:nth-child(6n+1) .text-sm.font-semibold,
  html.theme-light .glass-card:nth-child(6n+1) .text-base.font-bold,
  html.theme-light .glass-card:nth-child(6n+1) .text-base.font-semibold,
  html.theme-light .glass-card:nth-child(6n+1) .text-lg.font-bold,
  html.theme-light .glass-card:nth-child(6n+1) .text-lg.font-semibold,
  html.theme-light .glass-card:nth-child(6n+1) .software-metric-value {
    color: #0369a1 !important;
    text-shadow: 0 0 8px rgba(14, 165, 233, 0.3), 0 2px 4px rgba(3, 105, 161, 0.2) !important;
  }
  
  html.theme-light .rounded-3xl:nth-child(6n+2),
  html.theme-light .glass-card:nth-child(6n+2) {
    border: 2px solid #10b981 !important;
    box-shadow: 0 0 12px rgba(16, 185, 129, 0.25), 0 4px 12px rgba(16, 185, 129, 0.15) !important;
    transition: all var(--transition-base) !important;
  }
  html.theme-light .rounded-3xl:nth-child(6n+2):hover,
  html.theme-light .glass-card:nth-child(6n+2):hover {
    border-color: #34d399 !important;
    box-shadow: 0 0 24px rgba(16, 185, 129, 0.4), 0 8px 20px rgba(16, 185, 129, 0.25), 0 0 40px rgba(52, 211, 153, 0.15) !important;
  }
  html.theme-light .rounded-3xl:nth-child(6n+2) .text-sm.font-bold,
  html.theme-light .rounded-3xl:nth-child(6n+2) .text-sm.font-semibold,
  html.theme-light .rounded-3xl:nth-child(6n+2) .text-base.font-bold,
  html.theme-light .rounded-3xl:nth-child(6n+2) .text-base.font-semibold,
  html.theme-light .rounded-3xl:nth-child(6n+2) .text-lg.font-bold,
  html.theme-light .rounded-3xl:nth-child(6n+2) .text-lg.font-semibold,
  html.theme-light .rounded-3xl:nth-child(6n+2) .software-metric-value,
  html.theme-light .glass-card:nth-child(6n+2) .text-sm.font-bold,
  html.theme-light .glass-card:nth-child(6n+2) .text-sm.font-semibold,
  html.theme-light .glass-card:nth-child(6n+2) .text-base.font-bold,
  html.theme-light .glass-card:nth-child(6n+2) .text-base.font-semibold,
  html.theme-light .glass-card:nth-child(6n+2) .text-lg.font-bold,
  html.theme-light .glass-card:nth-child(6n+2) .text-lg.font-semibold,
  html.theme-light .glass-card:nth-child(6n+2) .software-metric-value {
    color: #047857 !important;
    text-shadow: 0 0 8px rgba(16, 185, 129, 0.3), 0 2px 4px rgba(4, 120, 87, 0.2) !important;
  }
  
  html.theme-light .rounded-3xl:nth-child(6n+3),
  html.theme-light .glass-card:nth-child(6n+3) {
    border: 2px solid #8b5cf6 !important;
    box-shadow: 0 0 12px rgba(139, 92, 246, 0.25), 0 4px 12px rgba(139, 92, 246, 0.15) !important;
    transition: all var(--transition-base) !important;
  }
  html.theme-light .rounded-3xl:nth-child(6n+3):hover,
  html.theme-light .glass-card:nth-child(6n+3):hover {
    border-color: #a78bfa !important;
    box-shadow: 0 0 24px rgba(139, 92, 246, 0.4), 0 8px 20px rgba(139, 92, 246, 0.25), 0 0 40px rgba(167, 139, 250, 0.15) !important;
  }
  html.theme-light .rounded-3xl:nth-child(6n+3) .text-sm.font-bold,
  html.theme-light .rounded-3xl:nth-child(6n+3) .text-sm.font-semibold,
  html.theme-light .rounded-3xl:nth-child(6n+3) .text-base.font-bold,
  html.theme-light .rounded-3xl:nth-child(6n+3) .text-base.font-semibold,
  html.theme-light .rounded-3xl:nth-child(6n+3) .text-lg.font-bold,
  html.theme-light .rounded-3xl:nth-child(6n+3) .text-lg.font-semibold,
  html.theme-light .rounded-3xl:nth-child(6n+3) .software-metric-value,
  html.theme-light .glass-card:nth-child(6n+3) .text-sm.font-bold,
  html.theme-light .glass-card:nth-child(6n+3) .text-sm.font-semibold,
  html.theme-light .glass-card:nth-child(6n+3) .text-base.font-bold,
  html.theme-light .glass-card:nth-child(6n+3) .text-base.font-semibold,
  html.theme-light .glass-card:nth-child(6n+3) .text-lg.font-bold,
  html.theme-light .glass-card:nth-child(6n+3) .text-lg.font-semibold,
  html.theme-light .glass-card:nth-child(6n+3) .software-metric-value {
    color: #6d28d9 !important;
    text-shadow: 0 0 8px rgba(139, 92, 246, 0.3), 0 2px 4px rgba(109, 40, 217, 0.2) !important;
  }
  
  html.theme-light .rounded-3xl:nth-child(6n+4),
  html.theme-light .glass-card:nth-child(6n+4) {
    border: 2px solid #ec4899 !important;
    box-shadow: 0 0 12px rgba(236, 72, 153, 0.25), 0 4px 12px rgba(236, 72, 153, 0.15) !important;
    transition: all var(--transition-base) !important;
  }
  html.theme-light .rounded-3xl:nth-child(6n+4):hover,
  html.theme-light .glass-card:nth-child(6n+4):hover {
    border-color: #f472b6 !important;
    box-shadow: 0 0 24px rgba(236, 72, 153, 0.4), 0 8px 20px rgba(236, 72, 153, 0.25), 0 0 40px rgba(244, 114, 182, 0.15) !important;
  }
  html.theme-light .rounded-3xl:nth-child(6n+4) .text-sm.font-bold,
  html.theme-light .rounded-3xl:nth-child(6n+4) .text-sm.font-semibold,
  html.theme-light .rounded-3xl:nth-child(6n+4) .text-base.font-bold,
  html.theme-light .rounded-3xl:nth-child(6n+4) .text-base.font-semibold,
  html.theme-light .rounded-3xl:nth-child(6n+4) .text-lg.font-bold,
  html.theme-light .rounded-3xl:nth-child(6n+4) .text-lg.font-semibold,
  html.theme-light .rounded-3xl:nth-child(6n+4) .software-metric-value,
  html.theme-light .glass-card:nth-child(6n+4) .text-sm.font-bold,
  html.theme-light .glass-card:nth-child(6n+4) .text-sm.font-semibold,
  html.theme-light .glass-card:nth-child(6n+4) .text-base.font-bold,
  html.theme-light .glass-card:nth-child(6n+4) .text-base.font-semibold,
  html.theme-light .glass-card:nth-child(6n+4) .text-lg.font-bold,
  html.theme-light .glass-card:nth-child(6n+4) .text-lg.font-semibold,
  html.theme-light .glass-card:nth-child(6n+4) .software-metric-value {
    color: #be185d !important;
    text-shadow: 0 0 8px rgba(236, 72, 153, 0.3), 0 2px 4px rgba(190, 24, 93, 0.2) !important;
  }
  
  html.theme-light .rounded-3xl:nth-child(6n+5),
  html.theme-light .glass-card:nth-child(6n+5) {
    border: 2px solid #ef4444 !important;
    box-shadow: 0 0 12px rgba(239, 68, 68, 0.25), 0 4px 12px rgba(239, 68, 68, 0.15) !important;
    transition: all var(--transition-base) !important;
  }
  html.theme-light .rounded-3xl:nth-child(6n+5):hover,
  html.theme-light .glass-card:nth-child(6n+5):hover {
    border-color: #f87171 !important;
    box-shadow: 0 0 24px rgba(239, 68, 68, 0.4), 0 8px 20px rgba(239, 68, 68, 0.25), 0 0 40px rgba(248, 113, 113, 0.15) !important;
  }
  html.theme-light .rounded-3xl:nth-child(6n+5) .text-sm.font-bold,
  html.theme-light .rounded-3xl:nth-child(6n+5) .text-sm.font-semibold,
  html.theme-light .rounded-3xl:nth-child(6n+5) .text-base.font-bold,
  html.theme-light .rounded-3xl:nth-child(6n+5) .text-base.font-semibold,
  html.theme-light .rounded-3xl:nth-child(6n+5) .text-lg.font-bold,
  html.theme-light .rounded-3xl:nth-child(6n+5) .text-lg.font-semibold,
  html.theme-light .rounded-3xl:nth-child(6n+5) .software-metric-value,
  html.theme-light .glass-card:nth-child(6n+5) .text-sm.font-bold,
  html.theme-light .glass-card:nth-child(6n+5) .text-sm.font-semibold,
  html.theme-light .glass-card:nth-child(6n+5) .text-base.font-bold,
  html.theme-light .glass-card:nth-child(6n+5) .text-base.font-semibold,
  html.theme-light .glass-card:nth-child(6n+5) .text-lg.font-bold,
  html.theme-light .glass-card:nth-child(6n+5) .text-lg.font-semibold,
  html.theme-light .glass-card:nth-child(6n+5) .software-metric-value {
    color: #b91c1c !important;
    text-shadow: 0 0 8px rgba(239, 68, 68, 0.3), 0 2px 4px rgba(185, 28, 28, 0.2) !important;
  }
  
  html.theme-light .rounded-3xl:nth-child(6n),
  html.theme-light .glass-card:nth-child(6n) {
    border: 2px solid #f97316 !important;
    box-shadow: 0 0 12px rgba(249, 115, 22, 0.25), 0 4px 12px rgba(249, 115, 22, 0.15) !important;
    transition: all var(--transition-base) !important;
  }
  html.theme-light .rounded-3xl:nth-child(6n):hover,
  html.theme-light .glass-card:nth-child(6n):hover {
    border-color: #fb923c !important;
    box-shadow: 0 0 24px rgba(249, 115, 22, 0.4), 0 8px 20px rgba(249, 115, 22, 0.25), 0 0 40px rgba(251, 146, 60, 0.15) !important;
  }
  html.theme-light .rounded-3xl:nth-child(6n) .text-sm.font-bold,
  html.theme-light .rounded-3xl:nth-child(6n) .text-sm.font-semibold,
  html.theme-light .rounded-3xl:nth-child(6n) .text-base.font-bold,
  html.theme-light .rounded-3xl:nth-child(6n) .text-base.font-semibold,
  html.theme-light .rounded-3xl:nth-child(6n) .text-lg.font-bold,
  html.theme-light .rounded-3xl:nth-child(6n) .text-lg.font-semibold,
  html.theme-light .rounded-3xl:nth-child(6n) .software-metric-value,
  html.theme-light .glass-card:nth-child(6n) .text-sm.font-bold,
  html.theme-light .glass-card:nth-child(6n) .text-sm.font-semibold,
  html.theme-light .glass-card:nth-child(6n) .text-base.font-bold,
  html.theme-light .glass-card:nth-child(6n) .text-base.font-semibold,
  html.theme-light .glass-card:nth-child(6n) .text-lg.font-bold,
  html.theme-light .glass-card:nth-child(6n) .text-lg.font-semibold,
  html.theme-light .glass-card:nth-child(6n) .software-metric-value {
    color: #c2410c !important;
    text-shadow: 0 0 8px rgba(249, 115, 22, 0.3), 0 2px 4px rgba(194, 65, 12, 0.2) !important;
  }
  
  /* Enhanced Card Titles - Light Mode */
  html.theme-light .text-2xl.font-bold {
    font-size: 2.25rem !important;
    background: linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%) !important;
    -webkit-background-clip: text !important;
    background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    filter: drop-shadow(0 2px 8px rgba(37, 99, 235, 0.3)) !important;
    font-weight: 800 !important;
    letter-spacing: -0.03em !important;
  }
  html.theme-light .text-xl.font-bold,
  html.theme-light .text-xl.font-semibold {
    font-size: 1.5rem !important;
    color: #1e40af !important;
    text-shadow: 0 2px 6px rgba(30, 64, 175, 0.2) !important;
    font-weight: 700 !important;
    letter-spacing: -0.02em !important;
  }
  html.theme-light .text-lg.font-bold,
  html.theme-light .text-lg.font-semibold {
    font-size: 1.375rem !important;
    color: #1e3a8a !important;
    text-shadow: 0 2px 5px rgba(30, 58, 138, 0.15) !important;
    font-weight: 700 !important;
    letter-spacing: -0.015em !important;
  }
  html.theme-light .text-base.font-bold,
  html.theme-light .text-base.font-semibold {
    font-size: 1.125rem !important;
    color: #1e3a8a !important;
    text-shadow: 0 1px 4px rgba(30, 58, 138, 0.12) !important;
    font-weight: 700 !important;
  }
  html.theme-light .text-sm.font-bold,
  html.theme-light .text-sm.font-semibold {
    font-size: 1rem !important;
    color: #1e40af !important;
    text-shadow: 0 1px 3px rgba(30, 64, 175, 0.1) !important;
    font-weight: 700 !important;
  }
  html.theme-light .text-sm.font-bold.text-slate-900,
  html.theme-light .text-sm.font-semibold.text-slate-900,
  html.theme-light .text-base.font-semibold.text-slate-900,
  html.theme-light .text-lg.font-semibold.text-slate-900,
  html.theme-light .text-lg.font-bold.text-slate-900 {
    color: #1e3a8a !important;
    text-shadow: 0 2px 5px rgba(30, 58, 138, 0.15) !important;
  }
  html.theme-light .bg-white,
  html.theme-light .bg-slate-50,
  html.theme-light .bg-slate-100 {
    color: #0b1324 !important;
  }
  html.theme-light .text-slate-500 { color: #4b5563 !important; }
  html.theme-light .text-slate-600 { color: #374151 !important; }
  html.theme-light .text-slate-700 { color: #1f2937 !important; }
  html.theme-light .text-slate-800 { color: #111827 !important; }
  html.theme-light .border-slate-200 { border-color: #cbd5e1 !important; }
  html.theme-light .border-slate-100 { border-color: #e2e8f0 !important; }
  html.theme-light .shadow-sm,
  html.theme-light .shadow {
    box-shadow: 0 14px 40px rgba(15, 23, 42, 0.08) !important;
  }
`;

const PAGE_ACCENTS = {
  Overview: { from: '#dbeafe', to: '#bfdbfe' },
  Hardware: { from: '#ecfdf3', to: '#bbf7d0' },
  Repairs: { from: '#fff7ed', to: '#fed7aa' },
  Employees: { from: '#fef3c7', to: '#fde68a' },
  Reports: { from: '#f3e8ff', to: '#e9d5ff' },
  Vendors: { from: '#e0f2fe', to: '#bae6fd' },
  Software: { from: '#ede9fe', to: '#c7d2fe' },
  default: { from: '#e2e8f0', to: '#e5e7eb' },
};

const BARCODE_DETECTOR_FORMATS = [
  'aztec',
  'code_128',
  'code_39',
  'code_93',
  'codabar',
  'data_matrix',
  'ean_13',
  'ean_8',
  'itf',
  'pdf417',
  'qr_code',
  'upc_a',
  'upc_e',
];

const STORAGE_KEYS = {
  assets: 'uds_assets',
  licenses: 'uds_licenses',
  maintenance: 'uds_maintenance',
  history: 'uds_history',
  employees: 'uds_employees',
  laptopRepairs: 'uds_laptop_repairs',
  clearedWarrantyAlerts: 'uds_cleared_warranty_alerts',
  clearedMaintenanceAlerts: 'uds_cleared_maintenance_alerts',
  helpdeskRequests: 'uds-helpdesk-requests',
  helpdeskChat: 'uds-helpdesk-chat',
};
const STORAGE_VERSION_KEY = 'uds_storage_version';
const STORAGE_VERSION = '2025-11-20-zoom-refresh';

// HelpDesk Portal Constants
const HELP_DESK_EMAIL = 'ITHelpDesk@udservices.org';
const BOT_GREETING = "Hi! I'm the UDS Tech Guide. Tell me what you need-password help, VPN issues, or hardware requests.";

const getDefaultChatMessages = () => [
  {
    role: 'bot',
    text: BOT_GREETING,
  },
];




const starterMessages = [
  'Reset my Windows password',
  'VPN keeps disconnecting at home',
  'I need a laptop and dock for a new hire',
  'Teams can\'t find my microphone',
];

const initialRequests = [
  { id: 'REQ-4221', type: 'Request', name: 'Jessie Rivera', topic: 'New laptop for onboarding', status: 'Pending', timestamp: 'Today 9:12a' },
  { id: 'REQ-4219', type: 'Issue', name: 'Pat Miles', topic: 'VPN drops every 20 minutes', status: 'In Review', timestamp: 'Yesterday' },
  { id: 'REQ-4215', type: 'Request', name: 'Claire V.', topic: 'Add to Finance shared drive', status: 'Closed', timestamp: 'Mon' },
];


const buildHelpDeskEmailBody = ({ name, email, department, urgency, topic, details }) => {
  const rows = [
    `Name: ${name || 'N/A'}`,
    `Email: ${email || 'N/A'}`,
    `Department/Location: ${department || 'N/A'}`,
    `Urgency: ${urgency || 'Normal'}`,
    `Topic: ${topic || 'N/A'}`,
    '',
    `Details:`,
    details || 'N/A',
  ];
  return rows.join('\n');
};

const sendHelpDeskEmail = (payload, options = {}) => {
  if (typeof window === 'undefined') return;
  let subject = options.subject;
  if (!subject) {
    if (payload.details && payload.details.trim()) {
      const summary = payload.details.trim().split('\n')[0];
      subject = summary.length > 60 ? `${summary.substring(0, 57)}...` : summary;
    } else if (payload.topic) {
      subject = payload.topic;
    } else {
      subject = `IT Help Request from ${payload.name || 'UDS employee'}`;
    }
  }
  const body = options.body || buildHelpDeskEmailBody(payload);
  const href = `mailto:${HELP_DESK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = href;
};

const copyTicketToClipboard = async (text) => {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.warn('Clipboard access failed', error);
    return false;
  }
};

const loadStoredRequests = () => {
  if (typeof window === 'undefined') return initialRequests;
  try {
    const cached = window.localStorage.getItem(STORAGE_KEYS.helpdeskRequests);
    const parsed = cached ? JSON.parse(cached) : [];
    return Array.isArray(parsed) && parsed.length ? [...parsed, ...initialRequests] : initialRequests;
  } catch (error) {
    console.warn('Unable to read stored requests', error);
    return initialRequests;
  }
};

const loadStoredChatMessages = () => {
  const fallback = getDefaultChatMessages();
  if (typeof window === 'undefined') return fallback;
  try {
    const cached = window.localStorage.getItem(STORAGE_KEYS.helpdeskChat);
    const parsed = cached ? JSON.parse(cached) : [];
    return Array.isArray(parsed) && parsed.length ? parsed : fallback;
  } catch (error) {
    console.warn('Unable to read stored chat messages', error);
    return fallback;
  }
};
const resolveApiBaseUrl = () => {
  const envBase = process.env.REACT_APP_API_BASE_URL;
  const fromEnvOrOrigin =
    (envBase && envBase.trim()) || (typeof window !== 'undefined' ? window.location.origin : '');
  if (!fromEnvOrOrigin) {
    return '';
  }
  const normalized = fromEnvOrOrigin.replace(/\/$/, '');
  return normalized.endsWith('/api') ? normalized : `${normalized}/api`;
};
const API_STORAGE_BASE = resolveApiBaseUrl();
const shouldIncludeCredentials = () => {
  if (typeof window === 'undefined' || !API_STORAGE_BASE) {
    return true;
  }
  try {
    const apiUrl = new URL(API_STORAGE_BASE);
    return apiUrl.origin === window.location.origin;
  } catch {
    return false;
  }
};
const remoteStorageState = { enabled: true, warned: false };
const LOANER_PAGE_SIZE = 6;
const FILTERS_STORAGE_KEY = 'uds_asset_filters';

const assetTypeIcons = {
  Laptop,
  Desktop: Monitor,
  Server,
  Storage: HardDrive,
  Computer: Laptop,
  Monitor,
  Printer,
  Phone: Smartphone,
  Tablet: Smartphone,
  ipad: Smartphone,
  Dock: HardDrive,
  'Key Fob': Key,
};

const AUTOMATE_BASE_URL = 'https://manage.keynettech.com/automate';
const getAutomateLink = (asset) => {
  if (!asset) return AUTOMATE_BASE_URL;
  if (asset.automateUrl) return asset.automateUrl;
  const normalizeKey = (value = '') =>
    value
      .toString()
      .trim()
      .toUpperCase();
  const candidates = [
    asset.sheetId,
    asset.deviceName,
    asset.assetName,
    asset.serialNumber,
    asset.id,
  ]
    .filter(Boolean)
    .map(normalizeKey);
  const match = candidates.find((key) => automateMap[key]);
  return (match && automateMap[match]) || AUTOMATE_BASE_URL;
};

const generateQrDataUrl = async (text, size = 400) => {
  const input = (text || '').toString().trim();
  if (!input) return '';
  return QRCode.toDataURL(input, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: size,
    color: { dark: '#000000', light: '#ffffff' },
  });
};

const normalizeScanValue = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).trim().toLowerCase();
};

const safeLower = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).toLowerCase();
};

const assetMatchesScanValue = (asset, normalizedValue) => {
  if (!asset || !normalizedValue) return false;
  const candidates = [asset.qrCode, asset.sheetId, asset.assetId, asset.id];
  return candidates.some((candidate) => normalizeScanValue(candidate) === normalizedValue);
};

const isComputerAsset = (asset = {}) => {
  const type = (asset.type || '').toLowerCase();
  if (['computer', 'laptop', 'desktop', 'server'].includes(type)) {
    return true;
  }
  const fingerprint = `${asset.assetName || ''} ${asset.deviceName || ''} ${asset.model || ''}`.toLowerCase();
  return fingerprint.includes('computer') || fingerprint.includes('laptop') || fingerprint.includes('desktop');
};

const defaultAsset = {
  id: null,
  assetName: '',
  type: 'Laptop',
  brand: '',
  model: '',
  serialNumber: '',
  assignedTo: '',
  department: '',
  location: '',
  status: 'Available',
  purchaseDate: '',
  warrantyExpiry: '',
  retiredDate: '',
  cost: '',
  checkedOut: false,
  checkOutDate: '',
  qrCode: '',
  approvalStatus: 'Approved',
  ownerNotes: '',
  repairNotes: '',
};
const defaultSoftwareSuite = {
  id: null,
  software: '',
  vendor: '',
  owner: '',
  category: '',
  licenseKey: '',
  seats: 0,
  used: 0,
  expiryDate: '',
  cost: '',
  description: '',
  deployment: 'Cloud',
  criticality: 'Medium',
  stack: [],
  logo: '',
  accent: { from: '#0f172a', to: '#1d4ed8' },
};
const defaultEmployeeProfile = {
  id: null,
  name: '',
  title: '',
  department: 'UDS',
  location: 'Onsite',
  email: '',
  supervisor: '',
  supervisorEmail: '',
  phone: '',
  startDate: '',
  avatar: '',
  lookupKey: '',
  computer: '',
  printer: '',
  monitor: '',
  dock: '',
  keyFob: '',
};

const NAV_ITEMS = [
  { key: 'Overview', label: 'Overview', icon: Sparkles, tagline: 'Mission control' },
  { key: 'Hardware', label: 'Hardware', icon: Monitor, tagline: 'Fleet health' },
  { key: 'Repairs', label: 'Repairs', icon: Wrench, tagline: 'Service desk' },
  { key: 'Employees', label: 'Employees', icon: Users, tagline: 'People ops' },
  { key: 'Reports', label: 'Reports', icon: BarChart3, tagline: 'Insights' },
  { key: 'Software', label: 'Software', icon: Plug, tagline: 'Licenses' },
  { key: 'Vendors', label: 'Vendors', icon: PhoneCall, tagline: 'Partners' },
  { key: 'HelpDesk', label: 'HelpDesk', icon: Headset, tagline: 'Support hub' },
];

const PUBLIC_URL = process.env.PUBLIC_URL || '';
const ZOOM_WEBHOOK_URL = process.env.REACT_APP_ZOOM_WEBHOOK_URL || '';
const ZOOM_WEBHOOK_TOKEN = process.env.REACT_APP_ZOOM_WEBHOOK_TOKEN || '';
const ZOOM_ALERT_ENDPOINT = API_STORAGE_BASE ? `${API_STORAGE_BASE}/zoom-alert` : '';
const MEDIA = {
  hero: `${PUBLIC_URL}/assets/hero.png`,
  logo: `${PUBLIC_URL}/assets/uds-logo.png`,
  devices: {
    computer: `${PUBLIC_URL}/assets/devices/dell-latitude-5450.jpg`,
    monitor: `${PUBLIC_URL}/assets/devices/dell-monitor-p2419h.jpg`,
    printer: `${PUBLIC_URL}/assets/devices/brother-mfc-l2900dw.jpg`,
    dock: `${PUBLIC_URL}/assets/devices/dell-dock-wd25.jpg`,
    phone: `${PUBLIC_URL}/assets/devices/iphone-16e.png`,
    keyfob: `${PUBLIC_URL}/assets/devices/key-fobs.webp`,
  },
};
const VENDOR_IMAGES = {
  brother: `${PUBLIC_URL}/assets/vendors/Brother.jpg`,
  canon: `${PUBLIC_URL}/assets/vendors/Canon-PRINT-Logo.png`,
  dell: `${PUBLIC_URL}/assets/vendors/Dell.jpg`,
  verizon: `${PUBLIC_URL}/assets/vendors/Verizon_Wireless_Logo.webp`,
};
const EMPLOYEE_PHOTO_UPLOAD_URL = process.env.REACT_APP_EMPLOYEE_PHOTO_UPLOAD_URL || '';
const EMPLOYEE_PHOTO_CDN = (process.env.REACT_APP_EMPLOYEE_PHOTO_CDN || '').replace(/\/$/, '');
const softwareLogo = (file) =>
  EMPLOYEE_PHOTO_CDN ? `${EMPLOYEE_PHOTO_CDN}/${file}` : `${PUBLIC_URL}/assets/software/${file}`;
const SOFTWARE_LOGOS = {
  'apple-bm': softwareLogo('abm.png'),
  m365: softwareLogo('microsoft-365.png'),
  adobe: softwareLogo('adobe.png'),
  automate: softwareLogo('automate.png'),
  autocad: softwareLogo('autocad.png'),
  citrix: softwareLogo('citrix.png'),
  zoom: softwareLogo('zoom.jpg'),
  cisco: softwareLogo('cisco-secure.png'),
  barracuda: softwareLogo('barracuda.png'),
  dragon: softwareLogo('dragon.webp'),
  duo: softwareLogo('duo-security.png'),
  keeper: softwareLogo('keeper.jpg'),
  eset: softwareLogo('eset.jpeg'),
  hrms: softwareLogo('hrms.png'),
  sage: softwareLogo('sage.webp'),
  itglue: softwareLogo('it-glue.png'),
  maas360: softwareLogo('maas360.png'),
  knox: softwareLogo('samsung-knox.jpg'),
};
const SOFTWARE_LOGO_KEYS = {
  abm: 'apple-bm',
  'apple-business-manager': 'apple-bm',
  'apple-bm': 'apple-bm',
  'apple-business': 'apple-bm',
  'adobe-cc': 'adobe',
  automate: 'automate',
  'connectwise-automate': 'automate',
  'cw-automate': 'automate',
  'cisco-secure': 'cisco',
  'duo-security': 'duo',
  'eset-endpoint': 'eset',
  'eset-encryption': 'eset',
  'it-glue': 'itglue',
  itglue: 'itglue',
  maas360: 'maas360',
  'ibm-maas360': 'maas360',
  'samsung-knox': 'knox',
  knox: 'knox',
};
const SOFTWARE_ADMIN_PORTALS = {
  m365: 'https://admin.microsoft.com/',
  'adobe-cc': 'https://adminconsole.adobe.com/',
  autocad: 'https://manage.autodesk.com/',
  'cisco-secure': 'https://dashboard.umbrella.com/',
  'duo-security': 'https://admin.duosecurity.com/',
  barracuda: 'https://login.barracudanetworks.com/',
  keeper: 'https://keepersecurity.com/en_US/console/#login',
  citrix: 'https://citrix.cloud.com/',
  dragon: 'https://login.nuance.com/',
  'eset-endpoint': 'https://protect.eset.com/',
  'eset-encryption': 'https://protect.eset.com/',
  hrms: 'https://access.paylocity.com/',
  sage: 'https://signin.intacct.com/',
  zoom: 'https://zoom.us/account',
  automate: AUTOMATE_BASE_URL,
  'connectwise-automate': AUTOMATE_BASE_URL,
  'cw-automate': AUTOMATE_BASE_URL,
  'it-glue': 'https://app.itglue.com/',
  itglue: 'https://app.itglue.com/',
  maas360: 'https://portal.maas360.com/',
  'ibm-maas360': 'https://portal.maas360.com/',
  'samsung-knox': 'https://www.samsungknox.com/console',
  knox: 'https://www.samsungknox.com/console',
  'apple-bm': 'https://business.apple.com/',
  'apple-business-manager': 'https://business.apple.com/',
};
const DEFAULT_SUITE_IDS = [
  'adobe-cc',
  'barracuda',
  'cisco-secure',
  'automate',
  'duo-security',
  'eset-endpoint',
  'eset-encryption',
  'm365',
  'zoom-workplace-business',
  'zoom-workplace-business-plus',
  'zoom-meetings-basic',
];
const DEFAULT_SUITE_SET = new Set(DEFAULT_SUITE_IDS);
const EXCEL_EXPORTS = {
  assets: `${PUBLIC_URL}/tables/${encodeURIComponent('IT Computers 12-23-25.xlsx')}`,
  employees: `${PUBLIC_URL}/tables/${encodeURIComponent('Employee Information Hub.xlsx')}`,
};
const PRINTER_VENDOR_DIRECTORY = {
  colony: {
    id: 'colony',
    name: 'Colony Products',
    description: 'Canon copier fleet service and toner logistics.',
    badge: 'tone-chip tone-alert',
    brands: ['Canon'],
    contact: {
      label: 'Submit service request',
      href: 'https://www.colonyproducts.com/contact/service-request/',
      external: true,
    },
  },
  weaver: {
    id: 'weaver',
    name: 'Weaver Associates',
    description: 'Weaver handles HP, Lexmark, and Epson toner & maintenance.',
    badge: 'tone-chip tone-success',
    brands: ['HP', 'Lexmark', 'Epson'],
    contact: {
      label: 'Submit repair ticket',
      href: 'https://weaverassociatesinc.com/resources/send-a-message.html',
      external: true,
    },
  },
};
const RAW_NETWORK_PRINTER_ROWS = [
  { deviceType: 'Canon Copier', location: 'Administration Area', model: 'iR-ADV C5550', serial: 'XUG08932', ip: '10.0.0.27', colonyId: '14952', toner: 'Canon GPR-55' },
  { deviceType: 'Canon Copier', location: '1st Floor HM Area', model: 'iR-ADV C5535', serial: 'XLN05423', ip: '10.0.0.30', colonyId: '14851', toner: 'Canon GPR-55' },
  { deviceType: 'Canon Copier', location: 'AE Elm Ave', model: 'iR-ADV C257', serial: '3CE06826', ip: '192.168.3.7', colonyId: '15416', toner: 'Canon GPR-53' },
  { deviceType: 'Canon Copier', location: 'ASB/SC/Main Remote Fax', model: 'iR-ADV C3525 III', serial: '2GH10339', ip: '10.0.0.32', colonyId: '15134', toner: 'Canon GPR-53' },
  { deviceType: 'Canon Copier', location: 'Garden Level', model: 'iR-ADV C3525', serial: 'XTK01222', ip: '10.0.0.12', colonyId: '14824', toner: 'Canon GPR-53' },
  { deviceType: 'Canon Copier', location: 'ILS Elm Ave', model: 'iR-ADV C3525', serial: 'XTK10374', ip: '192.168.3.9', colonyId: '14945', toner: 'Canon GPR-53' },
  { deviceType: 'Canon Copier', location: 'KOP', model: 'iR-ADV C3525 III', serial: '2GH09996', ip: '10.165.5.20', colonyId: '15189', toner: 'Canon GPR-53' },
  { deviceType: 'Canon Copier', location: 'Resource Center', model: 'iR-ADV 4535', serial: 'UMU00616', ip: '10.0.0.34', colonyId: '11376', toner: 'Canon GPR-53' },
  { deviceType: 'Canon Copier', location: 'SC Office at 2260', model: 'iR-ADV C5550', serial: 'XLG05808', ip: '10.0.0.31', colonyId: '14800', toner: 'Canon GPR-55' },
  { deviceType: 'Canon Copier', location: 'West Side Copy Room', model: 'iR-ADV C3525', serial: 'XTK02577', ip: '10.0.0.25', colonyId: '', toner: 'Canon GPR-53' },
  { deviceType: 'Canon Copier', location: 'Chestnut St', model: 'iR1435', serial: 'RZJ27457', ip: '192.168.7.222', colonyId: '14739', toner: 'Canon GPR-18' },
  { deviceType: 'Epson Printer', location: 'Home Mods', model: 'WF-C579R', serial: '', ip: '10.0.0.74', toner: 'Epson R12' },
  { deviceType: 'Epson Printer', location: 'SC 1st Floor', model: 'WF-PRO C579R', serial: '', ip: '10.0.0.40', toner: 'Epson R12' },
  { deviceType: 'Epson Printer', location: 'KOP ASB', model: 'WF-PRO C579R', serial: '', ip: '10.165.5.21', toner: 'Epson R12' },
  { deviceType: 'Epson Printer', location: 'Receptionist', model: 'WF-PRO 529R', serial: 'X57G000296', ip: '10.0.0.29', toner: 'Epson R12' },
  { deviceType: 'Epson Printer', location: 'HR Office', model: 'WF-PRO 529R', serial: 'X57G000291', ip: '10.0.0.5', toner: 'Epson R12' },
  { deviceType: 'HP Printer', location: 'HME Office', model: 'P4014', serial: 'CNDX206508', ip: '10.0.0.8', toner: 'HP 64X' },
  { deviceType: 'HP Printer', location: 'Warehouse', model: 'LaserJet P3015', serial: 'VND3F75923', ip: '10.165.1.201', toner: 'HP 55X' },
  { deviceType: 'HP Printer', location: 'Resource Center', model: 'LaserJet P3015', serial: 'VND3F25632', ip: '10.0.0.34', toner: 'HP 55X' },
  { deviceType: 'HP Printer', location: 'ILS Office', model: 'LaserJet 9050', serial: 'JPRC9DW07R', ip: '192.168.3.8', toner: 'HP 43X' },
  { deviceType: 'HP Printer', location: 'Finance Department', model: 'LaserJet 9050', serial: 'JPRCB4403H', ip: '10.0.0.13', toner: 'HP 43X' },
  { deviceType: 'HP Printer', location: 'Fiscal', model: 'LaserJet 4200', serial: 'USGNP05083', ip: '10.0.0.26', toner: 'HP 38A' },
  { deviceType: 'HP Printer', location: 'Executive', model: 'Color LaserJet M651', serial: 'NPI06BF0C', ip: '10.0.0.14', toner: 'HP 653X' },
  { deviceType: 'HP Printer', location: 'Vocational Services Chestnut', model: 'Color LaserJet M451', serial: 'CNDF234516', ip: '192.168.7.3', toner: 'HP 305X' },
  { deviceType: 'Lexmark Printer', location: 'SC Office Erin Court', model: 'M3150', serial: '45147PHH3R9W2', ip: '10.0.0.16', toner: 'Lexmark 50F1H00' },
];
const NETWORK_PRINTERS = RAW_NETWORK_PRINTER_ROWS.map((row) => {
  const vendorId = (row.deviceType || '').toLowerCase().includes('canon') ? 'colony' : 'weaver';
  const vendorInfo = PRINTER_VENDOR_DIRECTORY[vendorId];
  return {
    ...row,
    vendor: vendorId,
    vendorName: vendorInfo?.name || 'Vendor',
    vendorBadge: vendorInfo?.badge || 'tone-chip tone-neutral',
  };
});
const NETWORK_PRINTER_BRAND_TOTALS = NETWORK_PRINTERS.reduce((acc, printer) => {
  const brand = (printer.deviceType || '').split(' ')[0]?.trim();
  if (!brand) {
    return acc;
  }
  acc[brand] = (acc[brand] || 0) + 1;
  return acc;
}, {});
const EMPLOYEE_PHOTO_FALLBACKS = {
  2937: `${PUBLIC_URL}/assets/employees/adrian-pope.png`,
  3622: `${PUBLIC_URL}/assets/employees/aimsley-shoffstall.jpg`,
  3633: `${PUBLIC_URL}/assets/employees/aracelis-alamo.jpg`,
  2956: `${PUBLIC_URL}/assets/employees/ashley-poff.png`,
  3440: `${PUBLIC_URL}/assets/employees/courtney-hudson.jpg`,
  1778: `${PUBLIC_URL}/assets/employees/denise-jones.png`,
  2165: `${PUBLIC_URL}/assets/employees/fernanda-gordillo-rivera.png`,
};
const formatPersonName = (value = '') =>
  value
    .split(' ')
    .map((segment) =>
      segment
        .split('-')
        .map((piece) => (piece ? piece[0].toUpperCase() + piece.slice(1).toLowerCase() : ''))
        .join('-'),
    )
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

const formatRosterName = (value = '') => {
  if (!value) {
    return 'Unassigned';
  }
  if (value.includes(',')) {
    const [last, first] = value.split(',').map((segment) => segment.trim());
    return `${formatPersonName(first)} ${formatPersonName(last)}`.trim();
  }
  return formatPersonName(value);
};

const getInitials = (value = '') =>
  value
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'UDS';

const normalizeLocationLabel = (value = '') => {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  const lower = trimmed.toLowerCase();
  if (lower === 'remote' || lower === 'field' || lower === 'remote/field' || lower === 'field/remote') {
    return 'Remote';
  }
  return trimmed;
};

const DEVICE_COST_BY_TYPE = {
  Phone: 650,
  Computer: 1450,
  Monitor: 280,
  Printer: 520,
  Dock: 180,
  Tablet: 720,
  'Key Fob': 45,
  ipad: 720,
};

const DEFAULT_DEVICE_COST = 450;

const normalizeModelName = (value = '') =>
  value
    .replace(/\bsamasung\b/gi, 'samsung')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const normalizeBrandName = (value = '') =>
  value
    .trim()
    .toLowerCase();

const TONER_LOOKUP = RAW_NETWORK_PRINTER_ROWS.reduce((acc, row) => {
  const key = normalizeModelName(row.model || '');
  if (key && row.toner) {
    acc[key] = row.toner;
  }
  return acc;
}, {});

const getPrinterToner = (asset = {}) => {
  if ((asset.type || '').toLowerCase() !== 'printer') return '';
  const existing = asset.toner || asset.tonerType || '';
  if (existing) return existing;
  const modelKey = normalizeModelName(asset.model || asset.deviceName || '');
  if (modelKey) {
    if (TONER_LOOKUP[modelKey]) {
      return TONER_LOOKUP[modelKey];
    }
    const fuzzy = Object.entries(TONER_LOOKUP).find(([known]) => modelKey.includes(known) || known.includes(modelKey));
    if (fuzzy) {
      return fuzzy[1];
    }
  }
  const brand = normalizeBrandName(asset.brand || asset.model || asset.deviceName || '');
  if (brand.includes('canon')) return 'Canon GPR series (check model)';
  if (brand.includes('hp')) return 'HP LaserJet toner (check model)';
  if (brand.includes('epson')) return 'Epson Business Ink (check R-series)';
  if (brand.includes('lexmark')) return 'Lexmark toner (check model)';
  return '';
};

const ensureKeyFobModel = (asset) => {
  if (!asset) {
    return asset;
  }
  const type = (asset.type || '').toLowerCase();
  if (type === 'phone') {
    return asset;
  }
  const assetIdentifier = String(asset.assetName || asset.sheetId || asset.id || '').trim();
  const isSevenDigitId = /^[0-9]{7}$/.test(assetIdentifier);
  const hasKeyFobTag = typeof asset.model === 'string' && /key\s*fob/i.test(asset.model);
  if (!isSevenDigitId || hasKeyFobTag) {
    return asset;
  }
  const nextModel = asset.model ? `${asset.model} KeyFob` : 'KeyFob';
  return { ...asset, model: nextModel };
};

const MODEL_PRICE_RULES = [
  { match: ({ model }) => /iphone\s?15\s?pro/.test(model), price: 1099 },
  { match: ({ model }) => /iphone\s?15/.test(model), price: 899 },
  { match: ({ model }) => /iphone\s?14\s?pro/.test(model), price: 999 },
  { match: ({ model }) => /iphone\s?14/.test(model), price: 829 },
  { match: ({ model }) => /iphone\s?13/.test(model), price: 699 },
  { match: ({ model }) => /iphone\s?12/.test(model), price: 599 },
  { match: ({ model }) => /iphone\s?11/.test(model), price: 529 },
  { match: ({ model }) => /iphone\s?8/.test(model), price: 299 },
  { match: ({ model }) => model.includes('iphone se'), price: 429 },
  { match: ({ model }) => /galaxy\s*s24/.test(model), price: 799 },
  { match: ({ model }) => /galaxy\s*s21\s*fe/.test(model), price: 599 },
  { match: ({ model }) => /galaxy\s*s20\s*fe/.test(model), price: 579 },
  { match: ({ model }) => /galaxy\s*s20/.test(model), price: 749 },
  { match: ({ model }) => /galaxy\s*s10/.test(model), price: 499 },
  { match: ({ model }) => /galaxy\s*s8/.test(model), price: 349 },
  { match: ({ model }) => /galaxy\s*a13/.test(model), price: 249 },
  { match: ({ model }) => model.includes('dura xv'), price: 199 },
  { match: ({ model }) => /pro\s?14\s?plus/.test(model), price: 1850 },
  { match: ({ model }) => /pro\s?14\s?pc14250/.test(model), price: 1650 },
  { match: ({ model }) => /latitude\s*(5340|5350|5400|5440|5450)/.test(model), price: 1450 },
  { match: ({ model }) => /latitude\s*(3340|3350|3400|3410|3420|3440|3450|3480)/.test(model), price: 1150 },
  { match: ({ model }) => model.includes('select a computer model'), price: 1200 },
  { match: ({ model }) => /optiplex\s*790/.test(model), price: 750 },
  { match: ({ model }) => /pro\s*mini\s*400/.test(model), price: 950 },
  { match: ({ model }) => /elitedesk/.test(model), price: 900 },
  { match: ({ model }) => /hp\s*8000\s*elite/.test(model), price: 600 },
  { match: ({ model }) => /hp\s*260\s*g2/.test(model), price: 550 },
  { match: ({ model }) => /probook/.test(model), price: 1100 },
  { match: ({ model }) => /elitebook\s*x360/.test(model), price: 1600 },
  { match: ({ model }) => /elitebook/.test(model), price: 1400 },
  { match: ({ model }) => /pro\s*mini/.test(model), price: 900 },
  { match: ({ model }) => /pro\s*dock\s*wd25/.test(model), price: 285 },
  { match: ({ model }) => /wd19/.test(model), price: 280 },
  { match: ({ model }) => /d6000/.test(model), price: 260 },
  { match: ({ model }) => /k20a00[12]/.test(model), price: 240 },
  { match: ({ model }) => /brother\s*mfc/.test(model), price: 360 },
  { match: ({ model }) => /epson\s*wf/.test(model), price: 499 },
  { match: ({ model }) => /office\s*jet\s*250/.test(model), price: 349 },
  { match: ({ model }) => /office\s*jet\s*200/.test(model), price: 299 },
  { match: ({ model }) => /office\s*jet\s*100/.test(model), price: 229 },
  { match: ({ model }) => /p2422h|se2422|s2425|p2419|p2422/.test(model), price: 230 },
  { match: ({ model }) => /p221(1|3|4|5|7|9)/.test(model), price: 175 },
  { match: ({ model }) => /u2412/.test(model), price: 260 },
  { match: ({ model }) => /e2210|e2211|e198/.test(model), price: 140 },
  { match: ({ model }) => /prodisplay\s*p202/.test(model), price: 160 },
  { match: ({ model }) => /prodisplay\s*p232/.test(model), price: 185 },
  { match: ({ model }) => /prodisplay\s*p222/.test(model), price: 175 },
  { match: ({ model }) => /elitedisplay\s*e231/.test(model), price: 210 },
  { match: ({ model }) => /hp\s*e222/.test(model), price: 215 },
  { match: ({ model }) => /hp\s*27ec/.test(model), price: 260 },
  { match: ({ model }) => /nec\s*accusync/.test(model), price: 125 },
  { match: ({ type, brand }) => type === 'phone' && brand.includes('apple'), price: 799 },
  { match: ({ type, brand }) => type === 'phone' && brand.includes('samsung'), price: 699 },
];

const matchPricingRule = (context) => {
  for (const rule of MODEL_PRICE_RULES) {
    if (rule.match(context)) {
      return typeof rule.price === 'function' ? rule.price(context) : rule.price;
    }
  }
  return null;
};

const estimateCost = (type, model = '', brand = '') => {
  const context = {
    type: (type || '').toLowerCase(),
    model: normalizeModelName(model),
    brand: normalizeBrandName(brand || (model ? model.split(' ')[0] : '')),
  };
  const matchedPrice = matchPricingRule(context);
  if (matchedPrice) {
    return matchedPrice;
  }
  return DEVICE_COST_BY_TYPE[type] || DEFAULT_DEVICE_COST;
};

const DEPRECIATION_MONTHS = 36;

const getAssetValueAtDate = (asset, targetDate = new Date()) => {
  const cost = Number(asset?.cost || 0);
  if (!cost) {
    return 0;
  }
  if (!asset?.purchaseDate) {
    return cost;
  }
  const purchase = new Date(asset.purchaseDate);
  if (Number.isNaN(purchase)) {
    return cost;
  }
  const monthsInService =
    (targetDate.getFullYear() - purchase.getFullYear()) * 12 + (targetDate.getMonth() - purchase.getMonth());
  const normalizedMonths = Math.max(0, monthsInService);
  const depreciationRate = Math.min(1, normalizedMonths / DEPRECIATION_MONTHS);
  const remainingValue = cost * (1 - depreciationRate);
  return Math.max(0, remainingValue);
};

const computeDepreciationForecast = (assets, horizonYears = 3) => {
  if (!Array.isArray(assets) || assets.length === 0) {
    return [];
  }
  const now = new Date();
  const totalCapex = assets.reduce((sum, asset) => sum + Number(asset.cost || 0), 0);
  return Array.from({ length: horizonYears }).map((_, index) => {
    const target = new Date(now);
    target.setFullYear(now.getFullYear() + index + 1, 11, 31);
    const remaining = assets.reduce((sum, asset) => sum + getAssetValueAtDate(asset, target), 0);
    const depreciated = Math.max(0, totalCapex - remaining);
    const percentRemaining = totalCapex ? Math.round((remaining / totalCapex) * 100) : 0;
    return {
      year: target.getFullYear(),
      remaining,
      depreciated,
      percentRemaining,
    };
  });
};

const normalizeKey = (value = '') => {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) {
    return value.map((item) => normalizeKey(item)).filter(Boolean).join('');
  }
  const text = typeof value === 'string' ? value : String(value);
  return text.replace(/[^a-z0-9]/gi, '').toLowerCase();
};
const safeLocaleCompare = (a, b) => String(a || '').localeCompare(String(b || ''));

const normalizeStatusLabel = (value = '') => {
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return null;
  }
  if (normalized.includes('retire')) {
    return 'Retired';
  }
  if (normalized.includes('maint') || normalized.includes('repair') || normalized.includes('service')) {
    return 'Maintenance';
  }
  if (normalized.includes('check') && normalized.includes('out')) {
    return 'Checked Out';
  }
  if (
    normalized.includes('avail') ||
    normalized.includes('active') ||
    normalized.includes('inventory') ||
    normalized.includes('stock') ||
    normalized.includes('deploy')
  ) {
    return 'Available';
  }
  if (normalized.includes('in use') || normalized.includes('assigned') || normalized.includes('issued')) {
    return 'Checked Out';
  }
  return null;
};
const sanitizeEmail = (value = '') => {
  const match = String(value || '')
    .trim()
    .match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0].toLowerCase() : '';
};

const normalizeAssetStatus = (asset) => {
  if (!asset) {
    return asset;
  }
  const rawOwner = (asset.assignedTo || '').trim();
  const isUnassignedPlaceholder = normalizeKey(rawOwner) === 'unassigned';
  const owner = isUnassignedPlaceholder ? 'Unassigned' : rawOwner;
  const ownerForStatus = isUnassignedPlaceholder ? '' : owner;
  const statusFromValue = normalizeStatusLabel(asset.status);
  const checkoutFlag = Boolean(asset.checkedOut);
  let status = statusFromValue;

  if (status === 'Retired' || status === 'Maintenance') {
    const hasChanges = owner !== rawOwner || status !== asset.status || checkoutFlag !== false;
    if (!hasChanges) {
      return ensureKeyFobModel(asset);
    }
    return ensureKeyFobModel({ ...asset, assignedTo: owner, status, checkedOut: false });
  }

  if (!status) {
    status = checkoutFlag || ownerForStatus ? 'Checked Out' : 'Available';
  }

  if (status === 'Available' && (checkoutFlag || ownerForStatus)) {
    status = 'Checked Out';
  }

  if (status === 'Checked Out' && !ownerForStatus) {
    status = 'Available';
  }

  const checkedOut = status === 'Checked Out';
  const ownerChanged = rawOwner !== owner;
  const statusChanged = asset.status !== status;
  const checkoutChanged = checkoutFlag !== checkedOut;

  if (!ownerChanged && !statusChanged && !checkoutChanged) {
    return ensureKeyFobModel(asset);
  }

  return ensureKeyFobModel({ ...asset, assignedTo: owner, status, checkedOut });
};

const normalizeSheetDate = (value) => {
  if (value === null || value === undefined) return '';
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    if (value <= 0) return '';
    const excelEpochMs = Math.round((value - 25569) * 86400 * 1000);
    const date = new Date(excelEpochMs);
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString().slice(0, 10);
    }
  }
  const text = String(value || '').trim();
  if (!text || text === '0') return '';
  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return '';
};

const EMPLOYEE_PHOTOS = {
  ...EMPLOYEE_PHOTO_FALLBACKS,
  ...Object.fromEntries(
    Object.entries(employeePhotoMap).map(([key, value]) => {
      const normalizedKey = normalizeKey(String(key));
      const normalizedValue =
        typeof value === 'string' ? `${PUBLIC_URL}${value.startsWith('/') ? value : `/${value}`}` : '';
      return [normalizedKey, normalizedValue];
    }),
  ),
};

const HARDWARE_VENDOR_CATALOG = [
  {
    id: 'brother',
    name: 'Brother / Weaver Associates',
    description: 'Managed fleet of Brother printers with on-demand toner and parts fulfillment.',
    coverage: ['MFC printers', 'Labelers', 'Toner logistics'],
    accent: { from: '#0f172a', to: '#1d4ed8' },
    image: VENDOR_IMAGES.brother,
    contact: {
      name: 'Weaver Associates',
      org: 'Weaver Associates Inc.',
    },
    ctas: [
      {
        label: 'Order toner',
        href: 'https://weaverassociatesinc.infoflopay.com/',
        external: true,
      },
    ],
    match: (asset = {}) => {
      const text = `${asset.brand || ''} ${asset.model || ''}`.toLowerCase();
      return text.includes('brother');
    },
    printerMatch: (printer = {}) => {
      const type = (printer.deviceType || '').toLowerCase();
      return type.includes('hp') || type.includes('epson') || type.includes('lexmark');
    },
  },
  {
    id: 'canon',
    name: 'Canon Copiers / Colony Products',
    description: 'High-volume Canon copier supplies delivered by Colony Products.',
    coverage: ['Canon copiers', 'Toner & drums', 'Site delivery'],
    accent: { from: '#7f1d1d', to: '#be123c' },
    image: VENDOR_IMAGES.canon,
    contact: {
      name: 'Colony Products',
      url: 'https://www.colonyproducts.com/contact/order-supplies/',
    },
    ctas: [
      {
        label: 'Order from Colony',
        href: 'https://www.colonyproducts.com/contact/order-supplies/',
        external: true,
      },
    ],
    match: (asset = {}) => {
      const text = `${asset.brand || ''} ${asset.model || ''}`.toLowerCase();
      return text.includes('canon');
    },
    printerMatch: (printer = {}) => (printer.deviceType || '').toLowerCase().includes('canon'),
  },
  {
    id: 'dell',
    name: 'Dell Technologies',
    description: 'Premier sourcing for Latitude laptops, UltraSharp monitors, and WD docks.',
    coverage: ['Latitude laptops', 'P/U-series monitors', 'WD docks'],
    accent: { from: '#0f172a', to: '#0ea5e9' },
    image: VENDOR_IMAGES.dell,
    contact: {
      name: 'Dell Premier',
      url: 'https://www.dell.com/premier',
    },
    ctas: [
      {
        label: 'Open Dell Premier',
        href: 'https://www.dell.com/premier',
        external: true,
      },
    ],
    match: (asset = {}) => {
      const text = `${asset.brand || ''} ${asset.model || ''}`.toLowerCase();
      return text.includes('dell');
    },
  },
  {
    id: 'verizon',
    name: 'Verizon Wireless',
    description: 'Carrier services for iPhone and Galaxy hardware plus SIM management.',
    coverage: ['Line activations', 'Device swaps', 'SIM logistics'],
    accent: { from: '#111827', to: '#b91c1c' },
    image: VENDOR_IMAGES.verizon,
    contact: {
      name: 'Verizon Business Support',
      url: 'https://www.verizon.com/business/support/',
    },
    ctas: [
      {
        label: 'Open Verizon support',
        href: 'https://www.verizon.com/business/support/',
        external: true,
      },
    ],
    match: (asset = {}) => (asset.type || '').toLowerCase() === 'phone',
  },
];

const SOFTWARE_PORTFOLIO = [
  {
    id: 'm365',
    software: 'Microsoft 365 E3',
    vendor: 'Microsoft',
    owner: 'IT Operations',
    category: 'Productivity & Collaboration',
    seats: 305,
    used: 305,
    costPerSeat: 4.5,
    renewal: '2026-12-31',
    portal: 'https://admin.microsoft.com/',
    logo: SOFTWARE_LOGOS.m365,
    accent: { from: '#0ea5e9', to: '#2563eb' },
    description: 'Email, collaboration, Teams telephony, and Intune device management for the entire workforce.',
    stack: ['Exchange', 'Teams', 'OneDrive', 'Intune'],
    deployment: 'Cloud',
    criticality: 'High',
  },
  {
    id: 'adobe-cc',
    software: 'Adobe Creative Cloud',
    vendor: 'Adobe',
    owner: 'Creative Services',
    category: 'Creative Suite',
    seats: 305,
    used: 305,
    costPerSeat: 20,
    renewal: '2026-09-01',
    portal: 'https://adminconsole.adobe.com/',
    logo: SOFTWARE_LOGOS.adobe,
    accent: { from: '#fb7185', to: '#a21caf' },
    description: 'Full Photoshop, Illustrator, and Premiere access for marketing deliverables.',
    stack: ['Photoshop', 'Illustrator', 'Premiere Pro', 'Acrobat'],
    deployment: 'Cloud',
    criticality: 'Medium',
  },
  {
    id: 'autocad',
    software: 'AutoCAD',
    vendor: 'Autodesk',
    owner: 'Facilities & Engineering',
    category: 'Design & CAD',
    seats: 12,
    used: 11,
    costPerSeat: 210,
    renewal: '2026-04-15',
    portal: 'https://manage.autodesk.com/',
    logo: SOFTWARE_LOGOS.autocad,
    accent: { from: '#ef4444', to: '#991b1b' },
    description: 'Drafting, survey, and permit packages for capital projects.',
    stack: ['AutoCAD', 'Civil 3D'],
    deployment: 'Desktop',
    criticality: 'High',
  },
  {
    id: 'cisco-secure',
    software: 'Cisco Secure Client (AnyConnect + Umbrella)',
    vendor: 'Cisco',
    owner: 'Infrastructure',
    category: 'Network & VPN',
    seats: 305,
    used: 305,
    costPerSeat: 5,
    renewal: '2026-07-01',
    portal: 'https://dashboard.umbrella.com/',
    logo: SOFTWARE_LOGOS.cisco,
    accent: { from: '#0f766e', to: '#0ea5e9' },
    description: 'Unified VPN, Secure Client, and Umbrella protection for remote staff.',
    stack: ['AnyConnect', 'Secure Client', 'Umbrella DNS', 'Secure Endpoint'],
    deployment: 'Hybrid',
    criticality: 'High',
  },
  {
    id: 'duo-security',
    software: 'Duo Security MFA',
    vendor: 'Cisco',
    owner: 'Security Operations',
    category: 'Identity & MFA',
    seats: 305,
    used: 305,
    costPerSeat: 1.5,
    renewal: '2026-10-01',
    portal: 'https://admin.duosecurity.com/',
    logo: SOFTWARE_LOGOS.duo,
    accent: { from: '#115e59', to: '#22c55e' },
    description: 'MFA enforcement, device trust, and SSO guardrails for privileged and staff access.',
    stack: ['Push MFA', 'SSO', 'Device Trust'],
    deployment: 'Cloud',
    criticality: 'High',
  },
  {
    id: 'barracuda',
    software: 'Barracuda Email Protection',
    vendor: 'Barracuda Networks',
    owner: 'Security Operations',
    category: 'Security',
    seats: 305,
    used: 305,
    costPerSeat: 3,
    renewal: '2026-05-30',
    portal: 'https://login.barracudanetworks.com/',
    logo: SOFTWARE_LOGOS.barracuda,
    accent: { from: '#0284c7', to: '#0c4a6e' },
    description: 'Inbound filtering, archiving, and continuity for Microsoft 365 mailboxes.',
    stack: ['Impersonation Protect', 'Backup', 'Sentinel'],
    deployment: 'Cloud',
    criticality: 'High',
  },
  {
    id: 'keeper',
    software: 'Keeper Password Manager',
    vendor: 'Keeper Security',
    owner: 'Security Operations',
    category: 'Password Management',
    seats: 320,
    used: 265,
    costPerSeat: 6,
    renewal: '2026-08-15',
    portal: 'https://keepersecurity.com/en_US/console/#login',
    logo: SOFTWARE_LOGOS.keeper,
    accent: { from: '#f59e0b', to: '#b45309' },
    description: 'Enterprise vaults, shared folders, and breach monitoring for staff credentials.',
    stack: ['Vaults', 'Shared Folders', 'BreachWatch'],
    deployment: 'Cloud',
    criticality: 'High',
  },
  {
    id: 'citrix',
    software: 'Citrix Virtual Apps & Desktops',
    vendor: 'Citrix',
    owner: 'Applications',
    category: 'Virtual Workspace',
    seats: 90,
    used: 82,
    costPerSeat: 40,
    renewal: '2026-03-20',
    portal: 'https://citrix.cloud.com/',
    logo: SOFTWARE_LOGOS.citrix,
    accent: { from: '#312e81', to: '#7c3aed' },
    description: 'Secure delivery of EMR, scheduling, and legacy apps to remote clinicians.',
    stack: ['Virtual Apps', 'Gateway', 'Session Recording'],
    deployment: 'Hybrid',
    criticality: 'High',
  },
  {
    id: 'dragon',
    software: 'Dragon Professional',
    vendor: 'Nuance',
    owner: 'Compliance & QA',
    category: 'Dictation',
    seats: 40,
    used: 35,
    costPerSeat: 25,
    renewal: '2026-08-10',
    portal: 'https://login.nuance.com/',
    logo: SOFTWARE_LOGOS.dragon,
    accent: { from: '#e11d48', to: '#fb923c' },
    description: 'Secure speech-to-text documentation for service coordinators.',
    stack: ['Dragon Professional', 'PowerMic'],
    deployment: 'Desktop',
    criticality: 'Medium',
  },
  {
    id: 'eset-endpoint',
    software: 'ESET Endpoint Antivirus',
    vendor: 'ESET',
    owner: 'Infrastructure',
    category: 'Endpoint Protection',
    seats: 305,
    used: 305,
    costPerSeat: 3,
    renewal: '2026-11-30',
    portal: 'https://protect.eset.com/',
    logo: SOFTWARE_LOGOS.eset,
    accent: { from: '#0ea5e9', to: '#0369a1' },
    description: 'Malware defense, device control, and remote remediation for the Windows fleet.',
    stack: ['Endpoint AV', 'Device Control', 'ESET PROTECT'],
    deployment: 'Hybrid',
    criticality: 'High',
  },
  {
    id: 'eset-encryption',
    software: 'ESET Full Disk Encryption',
    vendor: 'ESET',
    owner: 'Infrastructure',
    category: 'Endpoint Protection',
    seats: 305,
    used: 305,
    costPerSeat: 4,
    renewal: '2026-11-30',
    portal: 'https://protect.eset.com/',
    logo: SOFTWARE_LOGOS.eset,
    accent: { from: '#0f172a', to: '#22d3ee' },
    description: 'BitLocker policy enforcement and recovery key escrow for laptops and desktops.',
    stack: ['FDE', 'BitLocker Policies', 'Recovery Keys'],
    deployment: 'Hybrid',
    criticality: 'High',
  },
  {
    id: 'hrms',
    software: 'HRMS (Paylocity)',
    vendor: 'Paylocity',
    owner: 'People Operations',
    category: 'HR & Payroll',
    seats: 150,
    used: 154,
    costPerSeat: 28,
    renewal: '2026-06-01',
    portal: 'https://access.paylocity.com/',
    logo: SOFTWARE_LOGOS.hrms,
    accent: { from: '#9333ea', to: '#2563eb' },
    description: 'Payroll, benefits enrollment, and onboarding workflows.',
    stack: ['Onboarding', 'Talent', 'Benefits'],
    deployment: 'Cloud',
    criticality: 'High',
  },
  {
    id: 'apple-bm',
    software: 'Apple Business Manager',
    vendor: 'Apple',
    owner: 'IT Operations',
    category: 'Identity & Device Enrollment',
    seats: 120,
    used: 104,
    costPerSeat: 5,
    renewal: '2026-12-15',
    portal: SOFTWARE_ADMIN_PORTALS['apple-bm'],
    logo: SOFTWARE_LOGOS['apple-bm'],
    accent: { from: '#0f172a', to: '#111827' },
    description: 'Automated DEP enrollment, VPP app assignment, and managed Apple IDs.',
    stack: ['DEP', 'VPP', 'Managed Apple IDs'],
    deployment: 'Cloud',
    criticality: 'High',
  },
  {
    id: 'automate',
    software: 'ConnectWise Automate',
    vendor: 'ConnectWise',
    owner: 'Infrastructure',
    category: 'RMM & Automation',
    seats: 305,
    used: 305,
    costPerSeat: 4,
    renewal: '2026-11-15',
    portal: SOFTWARE_ADMIN_PORTALS.automate,
    logo: SOFTWARE_LOGOS.automate,
    accent: { from: '#0f766e', to: '#14b8a6' },
    description: 'Patch automation, agent health, and remote remediation for endpoints.',
    stack: ['Agent Health', 'Patching', 'Remote Tools'],
    deployment: 'Hybrid',
    criticality: 'High',
  },
  {
    id: 'it-glue',
    software: 'IT Glue',
    vendor: 'Kaseya',
    owner: 'IT Operations',
    category: 'Documentation',
    seats: 80,
    used: 67,
    costPerSeat: 21,
    renewal: '2026-12-05',
    portal: SOFTWARE_ADMIN_PORTALS['it-glue'],
    logo: SOFTWARE_LOGOS.itglue,
    accent: { from: '#6d28d9', to: '#7c3aed' },
    description: 'Runbooks, passwords, and asset documentation for service delivery.',
    stack: ['Runbooks', 'Password Vault', 'Configurations'],
    deployment: 'Cloud',
    criticality: 'High',
  },
  {
    id: 'maas360',
    software: 'IBM MaaS360',
    vendor: 'IBM',
    owner: 'Security Operations',
    category: 'Mobile Device Management',
    seats: 260,
    used: 214,
    costPerSeat: 6,
    renewal: '2026-08-25',
    portal: SOFTWARE_ADMIN_PORTALS.maas360,
    logo: SOFTWARE_LOGOS.maas360,
    accent: { from: '#0ea5e9', to: '#075985' },
    description: 'MDM for iOS/Android with compliance policies and secure mail.',
    stack: ['MDM', 'Compliance', 'Secure Mail'],
    deployment: 'Cloud',
    criticality: 'High',
  },
  {
    id: 'samsung-knox',
    software: 'Samsung Knox Suite',
    vendor: 'Samsung',
    owner: 'Security Operations',
    category: 'Mobile Security',
    seats: 140,
    used: 118,
    costPerSeat: 5,
    renewal: '2026-07-20',
    portal: SOFTWARE_ADMIN_PORTALS['samsung-knox'],
    logo: SOFTWARE_LOGOS.knox,
    accent: { from: '#0f172a', to: '#1e293b' },
    description: 'Device security, remote wipe, and containerization for Samsung fleet.',
    stack: ['Knox Manage', 'Secure Folder', 'Remote Wipe'],
    deployment: 'Cloud',
    criticality: 'Medium',
  },
  {
    id: 'sage',
    software: 'Sage Intacct',
    vendor: 'Sage',
    owner: 'Finance',
    category: 'Finance & ERP',
    seats: 25,
    used: 23,
    costPerSeat: 110,
    renewal: '2026-02-28',
    portal: 'https://signin.intacct.com/',
    logo: SOFTWARE_LOGOS.sage,
    accent: { from: '#16a34a', to: '#15803d' },
    description: 'Accounting, grants, and fixed-asset workflows.',
    stack: ['General Ledger', 'Purchasing', 'Fixed Assets'],
    deployment: 'Cloud',
    criticality: 'High',
  },
  {
    id: 'zoom-workplace-business',
    software: 'Zoom Workplace Business',
    vendor: 'Zoom',
    owner: 'IT Operations',
    category: 'Meetings & UC',
    seats: 12,
    used: 7,
    costPerSeat: 7,
    renewal: '2027-07-21',
    portal: SOFTWARE_ADMIN_PORTALS.zoom,
    logo: SOFTWARE_LOGOS.zoom,
    accent: { from: '#2563eb', to: '#60a5fa' },
    description: 'Core Zoom Workplace licenses for standard collaboration.',
    stack: ['Meetings', 'Rooms', 'Webinars'],
    deployment: 'Cloud',
    criticality: 'Medium',
  },
  {
    id: 'zoom-workplace-business-plus',
    software: 'Zoom Workplace Business Plus (US/CA Unlimited)',
    vendor: 'Zoom',
    owner: 'IT Operations',
    category: 'Meetings & UC',
    seats: 148,
    used: 140,
    costPerSeat: 7,
    renewal: '2027-07-21',
    portal: SOFTWARE_ADMIN_PORTALS.zoom,
    logo: SOFTWARE_LOGOS.zoom,
    accent: { from: '#1d4ed8', to: '#60a5fa' },
    description: 'Business Plus with US/CA unlimited calling and advanced workloads.',
    stack: ['Meetings', 'Rooms', 'Webinars', 'Phone'],
    deployment: 'Cloud',
    criticality: 'High',
  },
  {
    id: 'zoom-meetings-basic',
    software: 'Zoom Meetings Basic',
    vendor: 'Zoom',
    owner: 'IT Operations',
    category: 'Meetings & UC',
    seats: 33,
    used: 4,
    costPerSeat: 0,
    renewal: '2027-07-21',
    portal: SOFTWARE_ADMIN_PORTALS.zoom,
    logo: SOFTWARE_LOGOS.zoom,
    accent: { from: '#38bdf8', to: '#60a5fa' },
    description: 'Free basic meeting accounts for light-use collaborators.',
    stack: ['Meetings'],
    deployment: 'Cloud',
    criticality: 'Low',
  },
];

const getLicenseHealth = (seats = 0, used = 0) => {
  const delta = seats - used;
  const buffer = Math.max(3, Math.round(seats * 0.05));
  if (delta < 0) {
    return { delta, status: 'Overused' };
  }
  if (delta <= buffer) {
    return { delta, status: 'At capacity' };
  }
  return { delta, status: 'Healthy' };
};

const buildEmployeeDirectory = (rows = employeeSheetData) =>
  (rows || []).reduce((directory, row) => {
    const fullName = `${formatPersonName(row['First Name'])} ${formatPersonName(row['Last Name'] || '')}`.trim();
    if (!fullName) {
      return directory;
    }

    directory[fullName] = {
      id: row['Employee ID'],
      department: row['Department'] || row['Company'] || 'UDS',
      location: normalizeLocationLabel(row['Location'] || row['Company'] || 'Remote'),
      title: row['Job Title'] || '',
      email: row['E-mail Address'] || '',
      phone: row['Mobile Phone'] || '',
      startDate: row['Start Date'] || '',
    };
    return directory;
  }, {});

const determineAssetStatus = (row, hasAssignee = false) => {
  const explicitStatus = [row.Status, row['Device Status'], row['Asset Status']].find(
    (value) => typeof value === 'string' && value.trim(),
  );
  if (explicitStatus) {
    const normalized = normalizeStatusLabel(explicitStatus);
    if (normalized) {
      if (normalized === 'Checked Out' && !hasAssignee) {
        return 'Available';
      }
      return normalized;
    }
  }

  const now = new Date();
  const retiredDate = row['Retired Date'] ? new Date(row['Retired Date']) : null;
  if (retiredDate && !Number.isNaN(retiredDate.getTime()) && retiredDate <= now) {
    return 'Retired';
  }

  const warrantyDate = row['Warranty End Date'] ? new Date(row['Warranty End Date']) : null;
  if (warrantyDate && !Number.isNaN(warrantyDate.getTime()) && warrantyDate < now) {
    return 'Maintenance';
  }

  if (hasAssignee) {
    return 'Checked Out';
  }

  return 'Available';
};

const mapNormalizedAssetRow = (row = {}, index = 0, employeeDirectory = {}) => {
  const assignedName = formatRosterName(
    row.assignedTo || row.owner || row.contact || row.employee || row.user || row.contactId,
  );
  const hasAssignee = Boolean(assignedName) || normalizeKey(assignedName) === 'unassigned';
  const person = employeeDirectory[assignedName] || null;
  const type = row.type || row.deviceType || 'Hardware';
  const assetIdentifier = row.sheetId || row.assetName || row.deviceName || row.serialNumber || `Asset-${index + 1}`;
  const inferredBrand = row.brand || (row.model ? row.model.split(' ')[0] : type);
  const estimatedCost = estimateCost(type, row.model, inferredBrand);
  const parsedCost = Number(row.cost);
  const cost = Number.isFinite(parsedCost) && parsedCost > 0 ? parsedCost : estimatedCost;
  const purchaseDate = normalizeSheetDate(row.purchaseDate || row.checkOutDate || '');
  const warrantyExpiry = normalizeSheetDate(row.warrantyExpiry || row.warrantyEndDate || '');
  const retiredDate = normalizeSheetDate(row.retiredDate || '');

  const baseAsset = {
    id: Number(row.id) || index + 1,
    sheetId: row.sheetId || assetIdentifier,
    deviceName: row.deviceName || row.assetName || row.serialNumber || assetIdentifier,
    type,
    assetName: row.assetName || assetIdentifier,
    brand: inferredBrand,
    model: row.model || row.deviceType || 'Device',
    serialNumber: row.serialNumber || assetIdentifier,
    assignedTo: hasAssignee ? assignedName : '',
    department: row.department || person?.department || 'UDS',
    location: normalizeLocationLabel(row.location || person?.location || 'Remote'),
    status: row.status || (hasAssignee ? 'Checked Out' : 'Available'),
    purchaseDate,
    warrantyExpiry,
    retiredDate,
    cost,
    checkedOut: row.checkedOut ?? hasAssignee,
    checkOutDate: row.checkOutDate || (hasAssignee ? purchaseDate || '' : ''),
    qrCode: row.qrCode || (row.serialNumber ? `QR-${row.serialNumber}` : assetIdentifier),
    approvalStatus: row.approvalStatus || 'Approved',
  };

  return normalizeAssetStatus(baseAsset);
};

const buildAssetsFromSheet = (assetRows = [], employeeRows = employeeSheetData) => {
  const employeeDirectory = buildEmployeeDirectory(employeeRows);
  return (assetRows || [])
    .filter((row) => {
      if (!row) return false;
      const hasRawColumns =
        row['Device Name'] ||
        row['Serial Num'] ||
        row['Product Num'] ||
        row['Computer Name'] ||
        row['Friendly Name'];
      const hasNormalizedColumns = row.assetName || row.serialNumber || row.deviceName || row.sheetId;
      return hasRawColumns || hasNormalizedColumns;
    })
    .map((row, index) => {
      if (row.assetName || row.serialNumber || row.deviceName || row.sheetId) {
        return mapNormalizedAssetRow(row, index, employeeDirectory);
      }
      if (row['Computer Name'] || row['Friendly Name']) {
        const computerName = row['Computer Name'] || row['ComputerName'] || `Computer-${index + 1}`;
        const friendlyName = row['Friendly Name'] || row['FriendlyName'] || '';
        const assignedName = friendlyName.includes(' - ')
          ? formatRosterName(friendlyName.split(' - ')[0])
          : '';
        const hasAssignee = Boolean(assignedName) || normalizeKey(assignedName) === 'unassigned';
        const person = employeeDirectory[assignedName] || null;
        const type = row.Type || row['Device Type'] || 'Computer';
        const assetIdentifier = computerName;
        const inferredBrand = row.OS ? row.OS.split(' ')[0] : type;
        const baseAsset = {
          id: index + 1,
          sheetId: assetIdentifier,
          deviceName: assetIdentifier,
          type,
          assetName: assetIdentifier,
          brand: inferredBrand,
          model: row.OS || row.Type || 'Computer',
          serialNumber: assetIdentifier,
          assignedTo: hasAssignee ? assignedName : '',
          department: person?.department || 'UDS',
          location: normalizeLocationLabel(row.Site || person?.location || 'Remote'),
          status: determineAssetStatus(row, hasAssignee),
          purchaseDate: normalizeSheetDate(row['Purchase Date'] || row['PurchaseDate'] || ''),
          warrantyExpiry: normalizeSheetDate(row['Warranty End Date'] || row['WarrantyEndDate'] || ''),
          retiredDate: normalizeSheetDate(row['Retired Date'] || row['RetiredDate'] || ''),
          cost: estimateCost(type, row.OS || row.Type, inferredBrand),
          checkedOut: hasAssignee,
          checkOutDate: '',
          qrCode: assetIdentifier,
          approvalStatus: 'Approved',
        };

        return normalizeAssetStatus(baseAsset);
      }
      const assignedName = formatRosterName(row.ContactID);
      const hasAssignee = Boolean(assignedName) || normalizeKey(assignedName) === 'unassigned';
      const person = employeeDirectory[assignedName] || null;
      const type = row['Device Type'] || 'Hardware';
      const purchaseDate = normalizeSheetDate(row['Purchase Date'] || '');
      const warrantyExpiry = normalizeSheetDate(row['Warranty End Date'] || '');
      const retiredDate = normalizeSheetDate(row['Retired Date'] || '');
      const assetIdentifier = row['Device Name'] || row['Serial Num'] || row['Product Num'] || `Asset-${index + 1}`;
      const inferredBrand = row.Model ? row.Model.split(' ')[0] : type;
      const baseAsset = {
        id: index + 1,
        sheetId: row['Device Name'] || assetIdentifier,
        deviceName: row['Device Name'] || assetIdentifier,
        type,
        assetName: assetIdentifier,
        brand: inferredBrand,
        model: row.Model || row['Device Type'] || 'Device',
        serialNumber: row['Serial Num'] || row['Product Num'] || row['Device Name'],
        assignedTo: hasAssignee ? assignedName : '',
        department: person?.department || 'UDS',
        location: normalizeLocationLabel(row.Combo445 || person?.location || 'Remote'),
        status: determineAssetStatus(row, hasAssignee),
        purchaseDate,
        warrantyExpiry,
        retiredDate,
        cost: estimateCost(type, row.Model, inferredBrand),
        checkedOut: hasAssignee,
        checkOutDate: purchaseDate,
        qrCode: row['Serial Num'] ? `QR-${row['Serial Num']}` : row['Device Name'],
      };

      return normalizeAssetStatus(baseAsset);
    });
};

const buildMaintenanceFromAssets = (assets) => {
  const today = new Date();

  return assets
    .filter(
      (asset) =>
        asset.warrantyExpiry &&
        normalizeKey(asset.assetName || asset.deviceName || '') !== 'printer016',
    )
    .sort((a, b) => new Date(a.warrantyExpiry) - new Date(b.warrantyExpiry))
    .slice(0, 8)
    .map((asset, index) => {
      const expiry = new Date(asset.warrantyExpiry);
      const completed = expiry < today;

      return {
        id: index + 1,
        assetId: asset.id,
        date: asset.warrantyExpiry,
        type: completed ? 'Warranty serviced' : 'Warranty alert',
        description: `${asset.assetName} (${asset.serialNumber})`,
        cost: Math.max(50, Math.round(asset.cost * 0.08)),
        technician: asset.assignedTo || 'UDS Ops',
        status: completed ? 'Completed' : 'Scheduled',
      };
    });
};

const buildLicensePools = () =>
  SOFTWARE_PORTFOLIO.map((suite, index) => {
    const cost =
      suite.annualCost !== undefined
        ? suite.annualCost
        : Math.round((suite.costPerSeat || 0) * suite.seats);
    return {
      id: suite.id || index + 1,
      software: suite.software,
      licenseKey:
        suite.licenseKey ||
        (suite.software ? suite.software.replace(/[^a-z0-9]/gi, '').toUpperCase() : `SUITE-${index + 1}`),
      seats: suite.seats,
      used: suite.used,
      expiryDate: suite.renewal || '',
      cost,
      vendor: suite.vendor,
      owner: suite.owner,
      category: suite.category,
      description: suite.description,
      deployment: suite.deployment,
      stack: suite.stack,
      criticality: suite.criticality,
      portal: suite.portal || SOFTWARE_ADMIN_PORTALS[suite.id] || '',
      logo: suite.logo,
      accent: suite.accent,
    };
  });

const BASE_LICENSES = buildLicensePools();

const buildTeamSpotlight = (rows = employeeSheetData, limit = 8) =>
  (rows || [])
    .filter((row) => row['First Name'] || row['Last Name'])
    .slice(0, limit)
    .map((row) => {
      const name = `${formatPersonName(row['First Name'])} ${formatPersonName(row['Last Name'] || '')}`.trim();
      const id = row['Employee ID'];
      const normalizedId = normalizeKey(id || '');
      const normalizedName = normalizeKey(name);
      const avatarKey = EMPLOYEE_PHOTOS[normalizedId] ? normalizedId : normalizedName;

      return {
        id: id || name,
        name,
        title: row['Job Title'] || 'Team member',
        department: row['Department'] || row['Company'] || 'UDS',
        location: normalizeLocationLabel(row['Location'] || row['Company'] || 'Remote'),
        email: row['E-mail Address'] || '',
        supervisor: row['Supervisor'] || row['Manager'] || '',
        supervisorEmail: row["Supervisor's Email"] || row['Supervisor Email'] || row['Manager Email Address'] || row['Manager Email'] || '',
        phone: row['Mobile Phone'] || '',
        startDate: row['Start Date'] || '',
        avatar: EMPLOYEE_PHOTOS[avatarKey],
        lookupKey: avatarKey,
        computer: row['Computer'] || '',
        printer: row['Printer'] || '',
        monitor: row['Monitor'] || '',
        dock: row['Dock'] || '',
        keyFob: row['Key Fob'] || '',
      };
    });

const BASE_ASSETS = buildAssetsFromSheet();
const BASE_HISTORY = [];
const BASE_EMPLOYEE_GALLERY = buildTeamSpotlight(undefined, Number.MAX_SAFE_INTEGER);
const buildCanonicalMap = (assets = []) =>
  assets.reduce((acc, asset) => {
    const canonical = asset.deviceName || asset.sheetId || asset.serialNumber;
    if (!canonical) {
      return acc;
    }
    const keys = [asset.sheetId, asset.deviceName, asset.serialNumber].filter(Boolean);
    keys.forEach((key) => {
      acc[normalizeKey(key)] = canonical;
    });
    return acc;
  }, {});

const getCanonicalAssetName = (asset = {}, canonicalMap = {}) => {
  const keys = [asset.sheetId, asset.deviceName, asset.assetName, asset.serialNumber].filter(Boolean);
  for (const key of keys) {
    const canonical = canonicalMap[normalizeKey(String(key))];
    if (canonical) {
      return canonical;
    }
  }
  return null;
};

const buildVendorProfiles = (assets = []) =>
  HARDWARE_VENDOR_CATALOG.map((vendor) => {
    const devices = assets.filter((asset) => {
      try {
        return vendor.match(asset);
      } catch {
        return false;
      }
    });
    const printerDevices = vendor.printerMatch ? NETWORK_PRINTERS.filter((printer) => vendor.printerMatch(printer)) : [];
    const activeCount = devices.filter((asset) => asset.status !== 'Retired').length + printerDevices.length;
    const maintenanceCount = devices.filter((asset) => asset.status === 'Maintenance').length;
    return {
      ...vendor,
      image: vendor.image || VENDOR_IMAGES[vendor.id],
      accent: vendor.accent || { from: '#0f172a', to: '#475569' },
      assetCount: devices.length + printerDevices.length,
      activeCount,
      maintenanceCount,
      printerDevices,
    };
  });

const computeLifecycleReminders = (assets) => {
  const now = new Date();
  const msInDay = 1000 * 60 * 60 * 24;

  return assets
    .flatMap((asset) => {
      const reminders = [];
      if (asset.warrantyExpiry) {
        const diff = Math.ceil((new Date(asset.warrantyExpiry) - now) / msInDay);
        reminders.push({
          assetId: asset.id,
          assetName: asset.assetName,
          type: 'Warranty',
          description: `Warranty coverage for ${asset.assetName}`,
          daysRemaining: diff,
          overdue: diff < 0,
          warrantyExpiry: asset.warrantyExpiry,
          assignedTo: asset.assignedTo || 'Unassigned',
          location: normalizeLocationLabel(asset.location || 'Remote'),
          model: asset.model || asset.brand || 'Device',
        });
      }
      if (asset.status === 'Maintenance') {
        reminders.push({
          assetId: asset.id,
          assetName: asset.assetName,
          type: 'Service',
          description: `${asset.assetName} awaiting maintenance`,
          daysRemaining: 0,
          overdue: true,
          warrantyExpiry: asset.warrantyExpiry,
          assignedTo: asset.assignedTo || 'Unassigned',
          location: normalizeLocationLabel(asset.location || 'Remote'),
          model: asset.model || asset.brand || 'Device',
        });
      }
      return reminders;
    })
    .filter((item) => item.daysRemaining <= 120)
    .sort((a, b) => {
      if (a.overdue && !b.overdue) {
        return -1;
      }
      if (!a.overdue && b.overdue) {
        return 1;
      }
      return a.daysRemaining - b.daysRemaining;
    });
};

const buildWarrantyAlertKey = (alert = {}) => {
  const assetKey = alert.assetId || alert.assetName || alert.model || 'unknown';
  const expiryKey = alert.warrantyExpiry || 'none';
  return `${assetKey}::${expiryKey}`;
};
const buildMaintenanceAlertKey = (alert = {}) => {
  const assetKey = alert.assetId || alert.assetName || alert.model || 'unknown';
  const dateKey = alert.date || alert.warrantyExpiry || alert.id || 'none';
  return `${assetKey}::${dateKey}`;
};

const buildMaintenanceWorkOrders = (assets, repairTickets = []) => {
  // Convert repair tickets into work orders for the maintenance board
  return repairTickets.map((ticket) => {
    const asset = assets.find((a) => a.id === ticket.assetId || a.assetName === ticket.assetId);
    const resolvedAssetId = asset?.id || ticket.assetId || asset?.sheetId || asset?.assetName;
    return {
      id: ticket.id,
      assetId: resolvedAssetId,
      assetName: (asset?.assetName || ticket.assetId || 'Unknown Asset').toString(),
      model: ticket.model || asset?.model || '',
      status: ticket.status || 'Planned',
      severity: 'Normal',
      vendor: 'Internal IT',
      eta: ticket.estimatedCompletion || 'TBD',
      attachments: 0,
      technician: '',
      notes: ticket.issue || '',
      assignedTo: ticket.assignedTo || asset?.assignedTo || 'Unassigned',
    };
  });
};

const computeSheetInsights = (assets) => {
  const locationCounts = {};
  let remoteAssignments = 0;
  const counts = assets.reduce((acc, asset) => {
    const status = getAssetDisplayStatus(asset);
    if (status === 'Retired') {
      return acc;
    }
    acc[asset.type] = (acc[asset.type] || 0) + 1;
    const key = asset.location || 'Unassigned';
    locationCounts[key] = (locationCounts[key] || 0) + 1;
    if (key.toLowerCase().includes('remote')) {
      remoteAssignments += 1;
    }
    return acc;
  }, {});

  const topLocations = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([location, count]) => ({ location, count }));

  const activeCount = Object.values(counts).reduce((sum, value) => sum + value, 0);
  const remoteShare = activeCount ? Math.round((remoteAssignments / activeCount) * 100) : 0;

  return { counts, topLocations, remoteShare };
};

const ensureStorageVersion = () => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const currentVersion = window.localStorage.getItem(STORAGE_VERSION_KEY);
    if (currentVersion === STORAGE_VERSION) {
      return;
    }
    Object.values(STORAGE_KEYS).forEach((storageKey) => window.localStorage.removeItem(storageKey));
    window.localStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
  } catch {
    // Ignore storage issues (private browsing, quota errors, etc.).
  }
};

const fetchRemoteStorage = async (key) => {
  if (!API_STORAGE_BASE || typeof fetch === 'undefined' || !remoteStorageState.enabled) {
    return null;
  }
  try {
    const credentialsMode = shouldIncludeCredentials() ? 'include' : 'omit';
    const response = await fetch(`${API_STORAGE_BASE}/storage/${encodeURIComponent(key)}`, {
      credentials: credentialsMode,
    });
    const tokenPresent = response.headers?.get('x-blob-token-present');
    if (tokenPresent === 'false' || response.status === 503) {
      if (!remoteStorageState.warned) {
        console.warn('[Sync] Remote storage disabled: blob token missing in environment');
        remoteStorageState.warned = true;
      }
      remoteStorageState.enabled = false;
      return null;
    }
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch {
    return null;
  }
};

const persistRemoteStorage = async (key, value) => {
  if (!API_STORAGE_BASE || typeof fetch === 'undefined' || !remoteStorageState.enabled) {
    return;
  }
  try {
    const credentialsMode = shouldIncludeCredentials() ? 'include' : 'omit';
    const response = await fetch(`${API_STORAGE_BASE}/storage/${encodeURIComponent(key)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: credentialsMode,
      body: JSON.stringify(value),
    });
    const tokenPresent = response.headers?.get('x-blob-token-present');
    if (tokenPresent === 'false' || response.status === 503) {
      if (!remoteStorageState.warned) {
        console.warn('[Sync] Remote storage disabled: blob token missing in environment');
        remoteStorageState.warned = true;
      }
      remoteStorageState.enabled = false;
    }
  } catch {
    // Best-effort; ignore offline/API errors.
  }
};

const safeStringify = (value) => {
  try {
    return JSON.stringify(value);
  } catch {
    return '';
  }
};

const usePersistentState = (key, initialValue, options = {}) => {
  const { remote = true, remoteKey } = options;
  const shouldSyncRemote = remote && Boolean(API_STORAGE_BASE);
  const remoteStorageKey = remoteKey || key;
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      ensureStorageVersion();
      const saved = window.localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (!shouldSyncRemote) {
      return;
    }
    let cancelled = false;
    const hydrateFromApi = async () => {
      const remoteValue = await fetchRemoteStorage(remoteStorageKey);
      if (cancelled || remoteValue === null) {
        return;
      }
      setState((prev) => {
        const hasLocalData = (() => {
          if (Array.isArray(prev)) return prev.length > 0;
          if (prev && typeof prev === 'object') return Object.keys(prev).length > 0;
          return Boolean(prev);
        })();
        if (!hasLocalData) {
          console.log(`[Sync] ${remoteStorageKey}: Using remote data (no local data)`);
          return remoteValue;
        }
        try {
          const localSnapshot = JSON.stringify(prev);
          const remoteSnapshot = JSON.stringify(remoteValue);
          if (localSnapshot === remoteSnapshot) {
            console.log(`[Sync] ${remoteStorageKey}: Local and remote match`);
            return prev;
          }
          console.log(`[Sync] ${remoteStorageKey}: Using remote data (different from local)`);
          return remoteValue;
        } catch {
          console.log(`[Sync] ${remoteStorageKey}: Using remote data (comparison failed)`);
          return remoteValue;
        }
      });
    };
    hydrateFromApi();
    return () => {
      cancelled = true;
    };
  }, [remoteStorageKey, shouldSyncRemote]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      ensureStorageVersion();
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Ignore quota errors so the dashboard still works offline.
    }
    if (!shouldSyncRemote) {
      return;
    }
    console.log(`[Sync] ${remoteStorageKey}: Saving to blob storage...`);
    persistRemoteStorage(remoteStorageKey, state);
  }, [key, state, remoteStorageKey, shouldSyncRemote]);

  return [state, setState];
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value) => {
  if (!value) {
    return 'N/A';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '';
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return 'just now';
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Unable to read file'));
    reader.readAsDataURL(file);
  });

const uploadEmployeePhoto = async (file) => {
  if (!file) {
    return '';
  }
  if (!EMPLOYEE_PHOTO_UPLOAD_URL || typeof fetch !== 'function') {
    return readFileAsDataUrl(file);
  }
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(EMPLOYEE_PHOTO_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Photo upload failed. Please try again.');
  }
  const data = (await response.json().catch(() => ({}))) || {};
  const uploadedUrl = data.url || data.secure_url || data.location || '';
  if (uploadedUrl) {
    return uploadedUrl;
  }
  if (EMPLOYEE_PHOTO_CDN) {
    return `${EMPLOYEE_PHOTO_CDN}/${encodeURIComponent(file.name)}`;
  }
  throw new Error('Photo upload did not return a URL.');
};

const sendZoomAlert = async (title, message) => {
  const payloadText = (message || title ? `${title || 'Asset alert'} - ${message || ''}` : 'Asset alert').trim();

  if (ZOOM_ALERT_ENDPOINT && typeof fetch === 'function') {
    try {
      const response = await fetch(ZOOM_ALERT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message }),
      });
      if (response.ok) {
        return;
      }
      console.warn('Zoom alert proxy failed with status', response.status);
    } catch (error) {
      console.warn('Zoom alert proxy failed', error);
    }
  }

  if (!ZOOM_WEBHOOK_URL || typeof fetch !== 'function') {
    return;
  }
  const targetUrl = `${ZOOM_WEBHOOK_URL}?format=message`;
  const headers = { 'Content-Type': 'application/json' };
  if (ZOOM_WEBHOOK_TOKEN) {
    headers.Authorization = ZOOM_WEBHOOK_TOKEN;
  }
  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: payloadText,
    });
    if (!response.ok) {
      console.error('Zoom alert failed with status', response.status);
    }
  } catch (error) {
    console.error('Zoom alert failed', error);
  }
};

const getAssetQualityIssues = (asset = {}) => {
  const issues = [];
  const status = getAssetDisplayStatus(asset);
  if (status === 'Retired') {
    return issues;
  }
  if (!asset.type) {
    issues.push('Asset type missing');
  }
  const assetIdentifier = asset.assetName || asset.sheetId || asset.id;
  if (!assetIdentifier) {
    issues.push('Asset ID missing');
  }
  if (!asset.serialNumber) {
    issues.push('Serial number missing');
  }
  if (!asset.model) {
    issues.push('Model missing');
  }
  if (!asset.location) {
    issues.push('Location missing');
  }
  const hasAssignee = Boolean(asset.assignedTo) || normalizeKey(asset.assignedTo || '') === 'unassigned';
  if (!hasAssignee) {
    issues.push('Assigned to missing');
  }
  if (!asset.status) {
    issues.push('Status missing');
  }
  return issues;
};

const getAssetQualityScore = (asset = {}) => {
  const hasAssignee = Boolean(asset.assignedTo) || normalizeKey(asset.assignedTo || '') === 'unassigned';
  const fields = [
    asset.type,
    asset.assetName || asset.sheetId || asset.id,
    asset.serialNumber,
    asset.model,
    asset.location,
    hasAssignee,
    asset.status,
  ];
  const total = fields.length;
  const missing = fields.reduce((acc, value) => acc + (value ? 0 : 1), 0);
  return Math.max(0, Math.round(((total - missing) / total) * 100));
};

const isAssetReady = (asset = {}) => {
  const approval = asset.approvalStatus || 'Approved';
  return getAssetQualityIssues(asset).length === 0 && approval === 'Approved';
};

const statusClasses = {
  Available: 'status-chip-available',
  'Checked Out': 'bg-blue-50 status-info',
  Maintenance: 'bg-amber-50 status-warning',
  Retired: 'bg-slate-100 text-slate-500',
};

const getAssetDisplayStatus = (asset) =>
  normalizeStatusLabel(asset?.status) || (asset?.checkedOut ? 'Checked Out' : 'Available');

const getRenewalBadgeTone = (daysUntilRenewal) => {
  if (daysUntilRenewal < 0) {
    return 'tone-alert';
  }
  if (daysUntilRenewal <= 30) {
    return 'tone-warning';
  }
  if (daysUntilRenewal <= 90) {
    return 'tone-info';
  }
  return 'tone-neutral';
};

const YEAR_IN_MS = 1000 * 60 * 60 * 24 * 365;
const LAPTOP_REPAIR_NOTES = [
  'Battery swelling flagged during intake',
  'Keyboard and touchpad ghosting detected',
  'No POST after firmware update',
  'LCD flicker when docked',
  'SSD SMART errors require replacement',
  'Fan noise and thermal throttling observed',
];
const AMAZON_PART_CATEGORIES = [
  { label: 'Replacement screen', query: 'replacement screen' },
  { label: 'Battery', query: 'battery' },
  { label: 'Charger / AC adapter', query: 'USB-C 65W charger' },
  { label: 'Keyboard + palmrest', query: 'keyboard palmrest replacement' },
  { label: 'Webcam module', query: 'laptop webcam replacement' },
  { label: 'SSD upgrade (NVMe/SATA)', query: 'NVMe SSD 1TB kit' },
  { label: 'RAM upgrade (SODIMM)', query: 'ram upgrade sodimm kit' },
];
const DIFFICULT_REPAIR_TOPICS = [
  { label: 'LCD + bezel swap', query: 'screen replacement' },
  { label: 'Keyboard + trackpad', query: 'keyboard replacement' },
  { label: 'Battery + fan service', query: 'battery replacement disassembly' },
  { label: 'SSD upgrade + imaging', query: 'ssd upgrade clone windows' },
  { label: 'Webcam replacement', query: 'laptop webcam replacement tutorial' },
  { label: 'RAM upgrade + timing', query: 'ram upgrade install dual channel' },
];
const buildAmazonSearch = (model, keyword) => `https://www.amazon.com/s?k=${encodeURIComponent(`${model} ${keyword}`)}`;
const buildYoutubeSearch = (model, keyword) => `https://www.youtube.com/results?search_query=${encodeURIComponent(`${model} ${keyword}`)}`;
const normalizeNameCase = (name = '') => {
  const trimmed = name.trim();
  if (!trimmed) return '';
  const hasLower = /[a-z]/.test(trimmed);
  const base = hasLower ? trimmed : trimmed.toLowerCase();
  return base.replace(/\b\w/g, (char) => char.toUpperCase());
};

const extractFirstName = (fullName = '') => {
  const trimmed = fullName.trim();
  if (!trimmed) return '';
  if (trimmed.includes(',')) {
    // Handle "Last, First" formats gracefully.
    const parts = trimmed.split(',').map((part) => part.trim()).filter(Boolean);
    if (parts[1]) {
      const first = normalizeNameCase(parts[1]).split(/\s+/)[0];
      if (first) return first;
    }
  }
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length >= 2 && !/[a-z]/.test(trimmed) && /[A-Z]/.test(trimmed)) {
    // Likely "LAST FIRST" all-caps; treat the second token as the first name.
    return normalizeNameCase(words[1]);
  }
  return normalizeNameCase(words[0] || '');
};
const buildSupervisorMailto = (supervisorEmail, supervisorName, employeeName, assets = []) => {
  if (!supervisorEmail) return '';
  const trimmedEmail = supervisorEmail.trim();
  if (!trimmedEmail) return '';
  const prettySupervisorName = normalizeNameCase(supervisorName || '');
  const subject = encodeURIComponent(`Offboarding ${employeeName || 'team member'}`);
  const assetLines =
    assets.length === 0
      ? ['- No assets found for this employee in the system.']
      : assets.map((asset) => {
          const name = asset.assetName || asset.model || `Asset ${asset.id}`;
          const type = asset.type || 'Device';
          const serial = asset.serialNumber || 'No serial';
          return `- ${name} (${type}, Serial: ${serial})`;
        });
  const supervisorFirstName = extractFirstName(prettySupervisorName || supervisorName || '');
  const body = encodeURIComponent(
    `Hi ${supervisorFirstName || prettySupervisorName || supervisorName || ''},\n\nI hope you're doing well! I wanted to reach out regarding ${
      employeeName || 'this employee'
    }'s offboarding process.\n\nWould you mind helping us coordinate the return of the following assets? Once we have them back, our IT team will take care of wrapping up account access and permissions.\n\nAssets to return:\n${assetLines.join(
      '\n',
    )}\n\nThanks so much for your help with this! Let me know if you have any questions.\n\nBest,`,
  );
  return `mailto:${trimmedEmail}?subject=${subject}&body=${body}`;
};

const hashString = (value = '') => {
  let hash = 0;
  const text = String(value || '');
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
};

const isLaptopAsset = (asset = {}) => {
  const type = (asset.type || '').toLowerCase();
  if (type === 'laptop') {
    return true;
  }
  const fingerprint = `${asset.assetName || ''} ${asset.deviceName || ''} ${asset.model || ''}`.toLowerCase();
  return fingerprint.includes('laptop') || fingerprint.includes('notebook') || fingerprint.includes('loaner');
};

const isLoanerLaptop = (asset = {}) => {
  const fingerprint = `${asset.assetName || ''} ${asset.deviceName || ''} ${asset.sheetId || ''}`.toLowerCase();
  return fingerprint.includes('loaner');
};

const computeLaptopRefreshReport = (assets = [], referenceInput = '') => {
  const referenceDate = (() => {
    const parsed = new Date(referenceInput || Date.now());
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  })();
  const threshold = new Date(referenceDate.getTime() - 5 * YEAR_IN_MS);
  const rows = assets
    .filter((asset) => isLaptopAsset(asset) && !isLoanerLaptop(asset))
    .map((asset) => {
      const purchaseDate = asset.purchaseDate ? new Date(asset.purchaseDate) : null;
      if (!purchaseDate || Number.isNaN(purchaseDate.getTime())) {
        return null;
      }
      const ageYears = (referenceDate.getTime() - purchaseDate.getTime()) / YEAR_IN_MS;
      if (ageYears < 5) {
        return null;
      }
      return {
        id: asset.id,
        assetId: asset.sheetId || asset.assetName || `Asset-${asset.id}`,
        purchaseDate: asset.purchaseDate,
        ageYears,
        assignedTo: asset.assignedTo || 'Unassigned',
        location: normalizeLocationLabel(asset.location || 'Remote'),
        model: asset.model || `${asset.brand || 'Laptop'}`,
        brand: asset.brand || 'Unknown',
        status: getAssetDisplayStatus(asset),
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.ageYears - a.ageYears);
  const avgAgeYears = rows.length ? rows.reduce((sum, row) => sum + row.ageYears, 0) / rows.length : 0;
  return {
    rows,
    total: rows.length,
    avgAgeYears: Number(avgAgeYears.toFixed(1)),
    referenceDate,
    thresholdDate: threshold,
  };
};

const sanitizeSheetName = (value = '', fallback = 'Data') => {
  const text = String(value || '')
    .replace(/[^A-Za-z0-9]/g, ' ')
    .trim();
  return (text || fallback).slice(0, 31);
};

const flattenReportPayload = (value, prefix = '', scalars = [], datasets = []) => {
  if (value === null || value === undefined) {
    if (prefix) {
      scalars.push([prefix, '']);
    }
    return;
  }
  if (Array.isArray(value)) {
    if (value.length > 0) {
      datasets.push({
        name: sanitizeSheetName(prefix || `dataset_${datasets.length + 1}`),
        rows: value,
      });
    }
    return;
  }
  if (value instanceof Date) {
    scalars.push([prefix || 'value', value.toISOString()]);
    return;
  }
  if (typeof value === 'object') {
    Object.entries(value).forEach(([key, nested]) => {
      const nextPrefix = prefix ? `${prefix}_${key}` : key;
      flattenReportPayload(nested, nextPrefix, scalars, datasets);
    });
    return;
  }
  scalars.push([prefix || 'value', value]);
};

const describeLaptopRepairIssue = (asset = {}, order = null) => {
  if (order) {
    const vendor = order.vendor || asset.brand || 'Vendor';
    const eta = order.eta ? ` - ETA ${order.eta}` : '';
    return `${order.status} - ${order.severity || 'Normal'} priority with ${vendor}${eta}`;
  }
  const reference = asset.serialNumber || asset.assetName || asset.deviceName || asset.id;
  const note = LAPTOP_REPAIR_NOTES[hashString(reference) % LAPTOP_REPAIR_NOTES.length];
  const reporter = asset.assignedTo ? `Reported by ${asset.assignedTo}` : `Flagged from ${asset.location || 'Operations'}`;
  return `${note}. ${reporter}.`;
};

const computeLaptopServiceSummary = (assets = [], workOrders = [], manualRepairs = []) => {
  const laptops = assets.filter(isLaptopAsset);
  const orderLookup = workOrders.reduce((acc, order) => {
    acc[order.assetId] = order;
    return acc;
  }, {});
  const now = Date.now();
  const monthMs = 1000 * 60 * 60 * 24 * 30;
  const assetPurchaseLookup = new Map();
  laptops.forEach((asset) => {
    const keys = [asset.id, asset.sheetId, asset.assetName].filter(Boolean).map((k) => String(k).toLowerCase());
    keys.forEach((key) => {
      if (!assetPurchaseLookup.has(key)) {
        assetPurchaseLookup.set(key, asset);
      }
    });
  });
  const getAgeMonthsFromAsset = (identifier) => {
    if (!identifier) return 0;
    const key = String(identifier).toLowerCase();
    const matched = assetPurchaseLookup.get(key);
    if (!matched || !matched.purchaseDate) return 0;
    const purchaseDate = new Date(matched.purchaseDate);
    if (Number.isNaN(purchaseDate.getTime())) return 0;
    return Math.max(0, (now - purchaseDate.getTime()) / monthMs);
  };
  const repairsFull = laptops
    .filter((asset) => getAssetDisplayStatus(asset) === 'Maintenance')
    .map((asset) => {
      const order = orderLookup[asset.id];
      const purchaseDate = asset.purchaseDate ? new Date(asset.purchaseDate) : null;
      const ageMonths =
        purchaseDate && !Number.isNaN(purchaseDate.getTime()) ? Math.max(0, (now - purchaseDate.getTime()) / monthMs) : 0;
      return {
        id: asset.id,
        assetId: asset.sheetId || asset.assetName || `Asset-${asset.id}`,
        model: asset.model || asset.brand || 'Laptop',
        assignedTo: asset.assignedTo || 'Unassigned',
        location: asset.location || 'Operations',
        issue: describeLaptopRepairIssue(asset, order),
        status: order?.status || 'Awaiting intake',
        severity: order?.severity || 'Normal',
        eta: order?.eta || null,
        ageMonths,
        source: 'asset',
      };
    })
    .sort((a, b) => b.ageMonths - a.ageMonths);
  const manualTickets = (manualRepairs || []).map((ticket) => ({
    id: ticket.id || `manual-${Date.now()}`,
    assetId: ticket.assetId || 'Laptop',
    model: ticket.model || 'Laptop',
    assignedTo: ticket.assignedTo || 'Unassigned',
    location: ticket.location || 'Operations',
    issue: ticket.issue || 'No issue provided.',
    status: ticket.status || 'Awaiting intake',
    severity: ticket.severity || 'Normal',
    eta: ticket.eta || null,
    ageMonths: ticket.ageMonths || getAgeMonthsFromAsset(ticket.assetId),
    source: 'manual',
  }));
  const manualAssetIds = new Set(manualTickets.map((item) => item.assetId));
  const mergedRepairs = [...manualTickets, ...repairsFull.filter((item) => !manualAssetIds.has(item.assetId))];
  const loanerPool = laptops.filter(isLoanerLaptop);
  const availableLoanersRaw = loanerPool.filter((asset) => getAssetDisplayStatus(asset) === 'Available');
  const deployedLoanersRaw = loanerPool.filter((asset) => getAssetDisplayStatus(asset) !== 'Available');
  const mapLoaner = (asset) => ({
    id: asset.id,
    assetId: asset.sheetId || asset.assetName || `Asset-${asset.id}`,
    assignedTo: asset.assignedTo || 'Unassigned',
    location: asset.location || 'Operations',
    asset,
  });
const sortLoaners = (collection) =>
  collection.map(mapLoaner).sort((a, b) => safeLocaleCompare(a.assetId, b.assetId));
  const avgRepairAgeMonths = mergedRepairs.length
    ? Math.round(mergedRepairs.reduce((sum, item) => sum + (item.ageMonths || 0), 0) / mergedRepairs.length)
    : 0;
  return {
    repairs: mergedRepairs,
    repairTotal: mergedRepairs.length,
    avgRepairAgeMonths,
    loanersAvailable: sortLoaners(availableLoanersRaw),
    loanerAvailableCount: availableLoanersRaw.length,
    loanersDeployed: sortLoaners(deployedLoanersRaw),
    loanerDeployedCount: deployedLoanersRaw.length,
    loanerTotal: loanerPool.length,
  };
};

const CardShell = ({ title, icon: Icon, action, children }) => (
  <div className="glass-card hover-lift rounded-3xl border border-slate-100 bg-white p-6 shadow-lg transition-all duration-300">
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {Icon && <div className="rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 p-2.5 shadow-inner"><Icon className="h-5 w-5 text-blue-600" /></div>}
        <p className="text-sm font-bold text-slate-900 tracking-tight">{title}</p>
      </div>
      {action}
    </div>
    {children}
  </div>
);

const CommandHeader = ({
  onAdd,
  onAddEmployee,
  onOpenCommandPalette,
  onToggleTheme,
  onOpenMenu,
  isDarkMode,
  activePage,
  onNavigate,
}) => {
  const headerToneClass = isDarkMode
    ? 'border-white/10 bg-slate-950/60 text-white'
    : 'border-blue-100 bg-gradient-to-br from-white via-blue-50 to-blue-100 text-slate-900 ring-1 ring-blue-200/60';

  return (
  <header className={`command-header relative mb-8 rounded-[32px] p-6 shadow-[0_30px_80px_rgba(5,8,25,0.15)] backdrop-blur ${headerToneClass}`}>
    <div className="grid gap-4 lg:grid-cols-[1.6fr,1fr]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border shadow-inner ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-blue-100 bg-white'}`}>
              <img src={UDSLogo} alt="UDS logo" className="h-10 w-10 object-contain" />
            </div>
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.35rem] ${isDarkMode ? 'text-white/60' : 'text-slate-400'}`}>UDS digital</p>
              <p className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Asset Control Studio</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              className={`rounded-2xl border p-2 transition ${isDarkMode ? 'border-white/20 text-white/70 hover:border-white/40 hover:text-white' : 'border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600'}`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={onOpenMenu}
              className={`rounded-2xl border p-2 transition ${isDarkMode ? 'border-white/20 text-white/70 hover:border-white/40 hover:text-white' : 'border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600'}`}
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <button
            onClick={onAdd}
            className={`inline-flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold shadow-sm transition ${
              isDarkMode ? 'border-white/10 bg-white/5 text-white hover:border-white/30' : 'border-slate-200 bg-white text-slate-800 hover:border-blue-200 hover:text-blue-600'
            }`}
            type="button"
          >
            <span>
              <span className={`block text-[11px] font-semibold uppercase tracking-[0.25rem] ${isDarkMode ? 'text-white/60' : 'text-slate-400'}`}>Hardware</span>
              New asset intake
            </span>
            <Monitor className="h-4 w-4" />
          </button>
          <button
            onClick={onAddEmployee}
            className={`inline-flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold shadow-sm transition ${
              isDarkMode ? 'border-white/10 bg-white/5 text-white hover:border-white/30' : 'border-slate-200 bg-white text-slate-800 hover:border-blue-200 hover:text-blue-600'
            }`}
            type="button"
          >
            <span>
              <span className={`block text-[11px] font-semibold uppercase tracking-[0.25rem] ${isDarkMode ? 'text-white/60' : 'text-slate-400'}`}>People</span>
              Add teammate
            </span>
            <Users className="h-4 w-4" />
          </button>
          <button
            onClick={onOpenCommandPalette}
            className={`inline-flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold shadow-sm transition ${
              isDarkMode ? 'border-white/20 bg-white/5 text-white hover:border-white/40' : 'border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 hover:border-blue-300 hover:bg-blue-100'
            }`}
            type="button"
          >
            <span>
              <span className={`block text-[11px] font-semibold uppercase tracking-[0.25rem] ${isDarkMode ? 'text-white/70' : 'text-blue-500'}`}>Command</span>
              Quick search & actions
            </span>
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className={`command-header__nav rounded-2xl border p-4 shadow-inner ${isDarkMode ? 'border-white/15 bg-white/5 text-white' : 'border-slate-100 bg-white/90 text-slate-900'}`}>
        <p className={`text-[11px] font-semibold uppercase tracking-[0.35rem] ${isDarkMode ? 'text-white/60' : 'text-slate-400'}`}>Journeys</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={`header-nav-${key}`}
              onClick={() => onNavigate?.(key)}
              type="button"
              className={`flex items-center justify-between rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                activePage === key
                  ? isDarkMode
                    ? 'border-sky-400/60 bg-white/10 text-white'
                    : 'border-blue-400 bg-blue-50 text-blue-700'
                  : isDarkMode
                    ? 'border-white/10 bg-transparent text-white/70 hover:border-white/30 hover:text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600'
              }`}
              aria-current={activePage === key ? 'page' : undefined}
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {label}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  </header>
  );
};

const DeviceSpotlightCard = ({ title, stats = [], stat, description, image, meta, onStatClick, isDarkMode = false }) => {
  const displayStats = stats.length ? stats : stat ? [{ label: stat }] : [];

  return (
    <div className={`relative overflow-hidden rounded-3xl border shadow-2xl hover-lift transition-all duration-500 ${
      isDarkMode 
        ? 'border-slate-700 bg-slate-900 text-white' 
        : 'border-slate-200 bg-white text-slate-900'
    }`}>
      <div className={`absolute inset-0 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900/95 via-blue-900/80 to-purple-900/70' 
          : 'bg-gradient-to-br from-white/95 via-blue-50/90 to-purple-50/80'
      }`} />
      <div className="relative flex h-full flex-col justify-between p-5">
        <div>
          {meta && <p className={`text-[11px] font-semibold uppercase tracking-[0.35rem] ${
            isDarkMode ? 'text-white/60' : 'text-slate-500'
          }`}>{meta}</p>}
          <p className={`text-3xl font-semibold ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>{title}</p>
          <p className={`mt-1 text-sm ${
            isDarkMode ? 'text-white/70' : 'text-slate-600'
          }`}>{description}</p>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {displayStats.map((item, index) => {
            const key = `${item.type || item.label}-${index}`;
            const isClickable = Boolean(onStatClick && item.type);
            const content = isClickable ? (
              <button
                type="button"
                onClick={() => onStatClick(item.type)}
                className={`text-left text-2xl font-semibold underline underline-offset-4 transition focus-visible:outline-none focus-visible:ring-2 ${
                  isDarkMode 
                    ? 'text-white decoration-white/60 hover:text-blue-100 focus-visible:ring-white/60' 
                    : 'text-slate-900 decoration-slate-400 hover:text-blue-600 focus-visible:ring-blue-300'
                }`}
              >
                {item.label}
              </button>
            ) : (
              <span className={`text-2xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>{item.label}</span>
            );

            return (
              <Fragment key={key}>
                {content}
                {index < displayStats.length - 1 && <span className={`text-2xl font-semibold ${
                  isDarkMode ? 'text-white/50' : 'text-slate-400'
                }`}>/</span>}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const PaginationControls = ({ page, totalPages, onPageChange, align = 'between' }) => {
  const alignment =
    align === 'end' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-between';

  return (
    <div className={`flex flex-wrap items-center gap-3 text-sm text-slate-600 ${alignment}`}>
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="rounded-2xl border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 enabled:hover:border-slate-300 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="rounded-2xl border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 enabled:hover:border-slate-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const VendorCard = ({ vendor }) => {
  const accentFrom = vendor.accent?.from || '#0f172a';
  const accentTo = vendor.accent?.to || '#475569';
  const imageSrc = vendor.image || VENDOR_IMAGES[vendor.id] || MEDIA.devices.computer;

  return (
    <div className="glass-card flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/50 bg-white shadow-2xl ring-1 ring-slate-100 hover-lift transition-all duration-500 hover:ring-2 hover:ring-blue-300/50">
      <div className="relative h-56 w-full overflow-hidden sm:h-48">
        <img src={imageSrc} alt={`${vendor.name} visual`} className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`, opacity: 0.75 }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-slate-900/40 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="rounded-2xl bg-slate-950/65 p-4 text-white shadow-lg shadow-black/30 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-white/80">Vendor partner</p>
            <p className="mt-1 text-2xl font-semibold drop-shadow">{vendor.name}</p>
            <p className="text-xs text-white/85">{vendor.description}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between p-6">
        {vendor.coverage?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {vendor.coverage.map((capability) => (
              <span
                key={capability}
                className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 shadow-inner"
              >
                {capability}
              </span>
            ))}
          </div>
        )}
        <div className="mt-6 grid grid-cols-3 gap-3 text-sm font-semibold text-slate-900">
          <div className="rounded-2xl bg-slate-50/80 p-3 text-center">
            <p className="text-xs uppercase tracking-widest text-slate-400">Devices</p>
            <p className="mt-1 text-xl">{vendor.assetCount}</p>
          </div>
          <div className="tone-panel tone-success p-3 text-center">
            <p className="text-xs uppercase tracking-widest opacity-80">Active</p>
            <p className="mt-1 text-xl">{vendor.activeCount}</p>
          </div>
          <div className="tone-panel tone-warning p-3 text-center">
            <p className="text-xs uppercase tracking-widest opacity-80">Maintenance</p>
            <p className="mt-1 text-xl">{vendor.maintenanceCount}</p>
          </div>
        </div>
        {vendor.contact && (
          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-sm text-slate-600">
            <p className="text-xs font-semibold uppercase tracking-[0.35rem] text-slate-400">Primary contact</p>
            <p className="mt-1 font-semibold text-slate-900">{vendor.contact.name}</p>
            {vendor.contact.org && <p>{vendor.contact.org}</p>}
            {vendor.contact.email && (
              <a href={`mailto:${vendor.contact.email}`} className="text-blue-600 hover:underline">
                {vendor.contact.email}
              </a>
            )}
          </div>
        )}
        {vendor.ctas?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {vendor.ctas.map((cta) => (
              <a
                key={cta.label}
                href={cta.href}
                target={cta.external ? '_blank' : undefined}
                rel={cta.external ? 'noreferrer' : undefined}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
              >
                {cta.label}
                {cta.external && <ExternalLink className="h-3.5 w-3.5" />}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const NetworkPrinterBoard = ({
  printers = [],
  title = 'Network Printers and Copiers',
  subtitle,
  enableSearch = false,
  onAdd,
  onEdit,
  onDelete,
  onTest,
  onReport,
}) => {
  const [search, setSearch] = useState('');
  const PAGE_SIZE = 10;
  const rows = useMemo(() => {
    if (!enableSearch || !search.trim()) return printers;
    const query = search.trim().toLowerCase();
    return printers.filter((printer) => {
      const haystack = [
        printer.deviceType,
        printer.location,
        printer.model,
        printer.serial,
        printer.ip,
        printer.colonyId,
        printer.vendorName,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [enableSearch, printers, search]);
  const [sortConfig, setSortConfig] = useState({ key: 'location', direction: 'asc' });
  const [page, setPage] = useState(1);

  const sortedRows = useMemo(() => {
    const getValue = (printer, key) => {
      switch (key) {
        case 'deviceType':
          return printer.deviceType || '';
        case 'location':
          return printer.location || '';
        case 'model':
          return printer.model || '';
        case 'serial':
          return printer.serial || '';
        case 'ip':
          return printer.ip || '';
        case 'colonyId':
          return printer.colonyId || '';
        case 'vendorName':
          return printer.vendorName || '';
        case 'toner':
          return printer.toner || '';
        default:
          return '';
      }
    };
    const next = [...rows];
    next.sort((a, b) => {
      const aVal = getValue(a, sortConfig.key).toString().toLowerCase();
      const bVal = getValue(b, sortConfig.key).toString().toLowerCase();
      if (aVal === bVal) return 0;
      const dir = sortConfig.direction === 'asc' ? 1 : -1;
      return aVal > bVal ? dir : -dir;
    });
    return next;
  }, [rows, sortConfig.direction, sortConfig.key]);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE)), [sortedRows.length]);
  useEffect(() => {
    setPage(1);
  }, [search, printers, sortConfig.key, sortConfig.direction]);
  const pagedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedRows.slice(start, start + PAGE_SIZE);
  }, [page, sortedRows]);

  const toggleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortIcon = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? '^' : 'v';
  };

  return (
    <div className="min-w-0 max-w-full overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-5">
        <div>
          <p className="text-lg font-semibold text-slate-900">{title}</p>
          <p className="text-sm text-slate-500">{subtitle || 'Live pull from "Network Printer and Copiers".'}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {enableSearch && (
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search printers"
              className="h-9 rounded-2xl border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          )}
          <div className="flex items-center gap-2">
            {onAdd && (
              <button
                type="button"
                onClick={onAdd}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-500"
            >
              <Plus className="h-4 w-4" />
              Add machine
            </button>
          )}
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
            <Printer className="h-5 w-5" />
          </div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full table-auto divide-y divide-slate-100 text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-widest text-slate-500">
            <tr>
              <th className="px-5 py-3">
                <button className="flex items-center gap-1 font-semibold" type="button" onClick={() => toggleSort('deviceType')}>
                  Device <span className="text-[11px]">{sortIcon('deviceType')}</span>
                </button>
              </th>
              <th className="px-5 py-3">
                <button className="flex items-center gap-1 font-semibold" type="button" onClick={() => toggleSort('location')}>
                  Location <span className="text-[11px]">{sortIcon('location')}</span>
                </button>
              </th>
              <th className="px-5 py-3">
                <button className="flex items-center gap-1 font-semibold" type="button" onClick={() => toggleSort('model')}>
                  Model <span className="text-[11px]">{sortIcon('model')}</span>
                </button>
              </th>
              <th className="px-5 py-3">
                <button className="flex items-center gap-1 font-semibold" type="button" onClick={() => toggleSort('serial')}>
                  Serial <span className="text-[11px]">{sortIcon('serial')}</span>
                </button>
              </th>
              <th className="px-5 py-3">
                <button className="flex items-center gap-1 font-semibold" type="button" onClick={() => toggleSort('ip')}>
                  IP <span className="text-[11px]">{sortIcon('ip')}</span>
                </button>
              </th>
              <th className="px-5 py-3">
                <button className="flex items-center gap-1 font-semibold" type="button" onClick={() => toggleSort('toner')}>
                  Toner <span className="text-[11px]">{sortIcon('toner')}</span>
                </button>
              </th>
              <th className="px-5 py-3">
                <button className="flex items-center gap-1 font-semibold" type="button" onClick={() => toggleSort('colonyId')}>
                  Fleet ID <span className="text-[11px]">{sortIcon('colonyId')}</span>
                </button>
              </th>
              <th className="px-5 py-3">
                <button className="flex items-center gap-1 font-semibold" type="button" onClick={() => toggleSort('vendorName')}>
                  Vendor <span className="text-[11px]">{sortIcon('vendorName')}</span>
                </button>
              </th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {pagedRows.map((printer, index) => (
              <tr key={printer.id || `${printer.deviceType}-${printer.location}-${index}`} className="align-top hover:bg-slate-50/60">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 p-2 text-slate-600">
                      <Printer className="h-4 w-4" />
                    </span>
                    <p className="font-semibold text-slate-900">{printer.deviceType}</p>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm">{printer.location}</td>
                <td className="px-5 py-3 text-sm">{printer.model}</td>
                <td className="px-5 py-3 text-sm">{printer.serial || 'N/A'}</td>
                <td className="px-5 py-3 text-sm font-mono">{printer.ip || 'N/A'}</td>
                <td className="px-5 py-3 text-sm">{printer.toner || 'N/A'}</td>
                <td className="px-5 py-3 text-sm">{printer.colonyId || 'N/A'}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${printer.vendorBadge}`}>
                    {printer.vendorName}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(printer)}
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700"
                        title="Edit machine"
                      >
                        Edit
                      </button>
                    )}
                    {onTest && (
                      <button
                        type="button"
                        onClick={() => onTest(printer)}
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-emerald-200 hover:text-emerald-700"
                        title="Test page"
                      >
                        Test
                      </button>
                    )}
                    {onReport && (
                      <button
                        type="button"
                        onClick={() => onReport(printer)}
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-amber-200 hover:text-amber-700"
                        title="Report issue"
                      >
                        Issue
                      </button>
                    )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(printer)}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-rose-200 hover:text-rose-600"
                      title="Delete machine"
                    >
                      Delete
                    </button>
                  )}
                </div>
                {(printer.isTesting || printer.lastTestedAt) && (
                  <p
                    className={`mt-1 text-right text-[11px] font-semibold ${
                      printer.isTesting
                        ? 'text-blue-600'
                        : printer.lastTestStatus === 'success'
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                    }`}
                  >
                    {printer.isTesting
                      ? 'Running test...'
                      : printer.lastTestStatus === 'success'
                        ? `Tested ${formatRelativeTime(printer.lastTestedAt)}`
                        : `Failed ${formatRelativeTime(printer.lastTestedAt)}`}
                  </p>
                )}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

const SoftwareSuiteCard = ({ suite, onEdit, onDelete }) => {
  const { status, delta } = getLicenseHealth(suite.seats, suite.used);
  const badgeStyle =
    status === 'Overused'
      ? 'badge badge-danger'
      : status === 'At capacity'
        ? 'badge badge-warning'
        : 'badge badge-success';
  const spareLabel = delta < 0 ? `${Math.abs(delta)} seats over` : `${delta} seats free`;
  const perSeat = suite.seats ? Math.round((suite.cost || 0) / suite.seats) : 0;
  const accentFrom = suite.accent?.from || '#0f172a';
  const accentTo = suite.accent?.to || '#1d4ed8';
  const vendorKey = normalizeKey(suite.vendor || '');
  const softwareKey = normalizeKey((suite.software || '').replace(/[^a-z0-9]+/gi, ''));
  const suiteLogo =
    suite.logo ||
    SOFTWARE_LOGOS[suite.id] ||
    SOFTWARE_LOGOS[vendorKey] ||
    SOFTWARE_LOGOS[softwareKey] ||
    null;
  const isDefaultSuite = DEFAULT_SUITE_SET.has(suite.id);

  return (
    <div className="glass-card flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/50 bg-white shadow-2xl ring-1 ring-transparent transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl hover:ring-2 hover:ring-blue-400/50">
      <div className="relative h-52 w-full overflow-hidden">
        {suiteLogo ? (
          <>
            <img
              src={suiteLogo}
              alt={`${suite.software} brand`}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div
              className="absolute inset-0"
              style={{ backgroundImage: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`, opacity: 0.78 }}
            />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{ backgroundImage: `linear-gradient(135deg, ${accentFrom}, ${accentTo})` }}
          />
        )}
        {isDefaultSuite && (
          <div className="absolute left-4 top-4 z-20 inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-800 ring-1 ring-blue-200/80 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Default
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-900/30 to-slate-950/70" />
        {onEdit && (
          <div className="absolute right-4 top-4 z-20 flex gap-2">
            <button
              type="button"
              onClick={() => onEdit(suite)}
              className="rounded-full bg-white/25 p-2 text-white shadow hover:bg-white/40"
              title="Edit suite"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(suite.id)}
              className="rounded-full bg-white/25 p-2 text-white shadow hover:bg-white/40"
              title="Delete suite"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="absolute bottom-5 left-5 right-5 z-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-white/70">{suite.category}</p>
          <p className="mt-1 text-2xl font-semibold leading-tight text-white drop-shadow">{suite.software}</p>
          <p className="mt-1 text-xs text-white/80">{suite.owner}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeStyle}`}>{status}</span>
            <p className="text-xs uppercase tracking-[0.35rem] text-slate-400">{suite.deployment}</p>
          </div>

          <p className="mt-4 text-sm text-slate-500">{suite.description}</p>

          <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Seats in use</p>
              <p className="software-metric-value mt-1 text-2xl font-semibold text-slate-900">
                {suite.used} / {suite.seats}
              </p>
              <p className="text-xs text-slate-500">{spareLabel}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Renewal</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{suite.expiryDate || 'Rolling'}</p>
              <p className="text-xs text-slate-500">{suite.vendor}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Annual cost</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{formatCurrency(suite.cost || 0)}</p>
              <p className="text-xs text-slate-500">{perSeat ? `${formatCurrency(perSeat)}/seat` : 'Cost pending'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Criticality</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{suite.criticality}</p>
              <p className="text-xs text-slate-500">{suite.owner}</p>
            </div>
          </div>
        </div>

        {suite.stack?.length > 0 && (
          <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Stack:</span> {suite.stack.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

const SoftwareFormModal = ({ suite, onSubmit, onCancel, suggestionListId }) => {
  const toFormState = (input) => ({
    ...defaultSoftwareSuite,
    ...input,
    seats: input?.seats ?? defaultSoftwareSuite.seats,
    used: input?.used ?? defaultSoftwareSuite.used,
    cost: input?.cost ?? defaultSoftwareSuite.cost,
    stackText: Array.isArray(input?.stack) ? input.stack.join(', ') : input?.stack || '',
    accentFrom: input?.accent?.from || defaultSoftwareSuite.accent.from,
    accentTo: input?.accent?.to || defaultSoftwareSuite.accent.to,
  });

  const [form, setForm] = useState(toFormState(suite || defaultSoftwareSuite));

  useEffect(() => {
    setForm(toFormState(suite || defaultSoftwareSuite));
  }, [suite]);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <ModalShell title={form?.id ? 'Edit software suite' : 'Add software suite'} onClose={onCancel}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Suite name
            <input
              value={form.software}
              onChange={(event) => update('software', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Vendor
            <input
              value={form.vendor}
              onChange={(event) => update('vendor', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Owner
            <input
              value={form.owner}
              onChange={(event) => update('owner', event.target.value)}
              list={suggestionListId}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Category
            <input
              value={form.category}
              onChange={(event) => update('category', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            License key
            <input
              value={form.licenseKey}
              onChange={(event) => update('licenseKey', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Renewal date
            <input
              type="date"
              value={form.expiryDate}
              onChange={(event) => update('expiryDate', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Seats
            <input
              type="number"
              value={form.seats}
              onChange={(event) => update('seats', Number(event.target.value))}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              min="0"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Used
            <input
              type="number"
              value={form.used}
              onChange={(event) => update('used', Number(event.target.value))}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              min="0"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Annual cost
            <div className="relative mt-2">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">$</span>
              <input
                type="number"
                value={form.cost === '' ? '' : form.cost}
                onChange={(event) => {
                  const raw = event.target.value;
                  update('cost', raw === '' ? '' : Number(raw));
                }}
                placeholder="0"
                className="w-full rounded-2xl border border-slate-200 pl-7 pr-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                min="0"
              />
            </div>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Deployment
            <select
              value={form.deployment}
              onChange={(event) => update('deployment', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Cloud">Cloud</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Desktop">Desktop</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Criticality
            <select
              value={form.criticality}
              onChange={(event) => update('criticality', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Stack tags (comma separated)
            <input
              value={form.stackText}
              onChange={(event) => update('stackText', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="OneDrive, Teams, Intune"
            />
          </label>
        </div>
        <label className="text-sm font-medium text-slate-700">
          Description
          <textarea
            rows={3}
            value={form.description}
            onChange={(event) => update('description', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="text-sm font-medium text-slate-700">
            Logo URL
            <input
              value={form.logo}
              onChange={(event) => update('logo', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="https://..."
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Accent from
            <input
              type="color"
              value={form.accentFrom}
              onChange={(event) => update('accentFrom', event.target.value)}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Accent to
            <input
              type="color"
              value={form.accentTo}
              onChange={(event) => update('accentTo', event.target.value)}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-3 py-2"
            />
          </label>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300"
          >
            Cancel
          </button>
          <button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            <Sparkles className="h-4 w-4" />
            {form?.id ? 'Save changes' : 'Add software'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

const AnalyticsInsightsPanel = ({ costData = [], depreciation = [] }) => (
  <div className="rounded-3xl border border-slate-100 bg-white shadow-sm">
    <div className="border-b border-slate-100 px-6 py-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">Analytics</p>
      <p className="text-lg font-semibold text-slate-900">Fleet drilldowns</p>
      <p className="text-sm text-slate-500">Spot high-cost departments and monitor depreciation velocity.</p>
    </div>
    <div className="space-y-10 p-6">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%" minWidth={200}>
          <BarChart data={costData} margin={{ top: 8, right: 8, left: -16, bottom: 24 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              interval={0}
              tick={{ fontSize: 12, fill: '#475569' }}
              tickLine={false}
              tickMargin={10}
              height={48}
            />
            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} tick={{ fill: '#475569' }} tickLine={false} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="mt-3 text-xs uppercase tracking-widest text-slate-400">Spend by department</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%" minWidth={200}>
            <LineChart data={depreciation} margin={{ top: 8, right: 12, left: -4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 12 }} tickLine={false} />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} tick={{ fill: '#475569' }} tickLine={false} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Line type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-3 text-xs uppercase tracking-widest text-slate-400">Depreciation outlook</p>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-4 shadow-inner">
          <p className="text-xs font-semibold uppercase tracking-[0.35rem] text-slate-500">Top spenders</p>
          <div className="mt-4 space-y-3">
            {costData.slice(0, 5).map((dept) => (
              <div key={`dept-pill-${dept.name}`} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                <span>{dept.name}</span>
                <span className="text-slate-500">{formatCurrency(dept.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MaintenanceWorkflowBoard = ({ workOrders = [], isDarkMode = false }) => {
  const columns = [
    { label: 'Planned', key: 'Planned', color: 'from-sky-100 to-white', chip: 'bg-sky-500/10 text-sky-700' },
    { label: 'In Progress', key: 'In Progress', color: 'from-amber-100 to-white', chip: 'bg-amber-500/10 status-warning' },
    { label: 'Awaiting Parts', key: 'Awaiting Parts', color: 'from-indigo-100 to-white', chip: 'bg-indigo-500/10 text-indigo-700' },
    { label: 'Completed', key: 'Completed', color: 'from-emerald-100 to-white', chip: 'bg-emerald-500/10 status-success' },
  ];

  const totals = workOrders.reduce(
    (acc, order) => {
      acc.total += 1;
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    },
    { total: 0 },
  );

  const statusBadge = (severity = 'Normal') => {
    const tone =
      /high/i.test(severity) || /sev\s*1/i.test(severity)
        ? 'tone-chip tone-alert'
        : /medium|sev\s*2/i.test(severity)
          ? 'tone-chip tone-warning'
          : 'tone-chip tone-success';
    return (
      <span className={`${tone} px-3 py-1 text-xs font-semibold`}>{severity}</span>
    );
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">Maintenance</p>
          <p className="text-lg font-semibold text-slate-900">Work order board</p>
          <p className="text-sm text-slate-500">Track vendor SLAs, attachments, ETA, and technician notes.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className={`rounded-full px-3 py-1 shadow-sm ${
            isDarkMode 
              ? 'bg-slate-900 text-white' 
              : 'bg-slate-900 text-white'
          }`}>Total {totals.total}</span>
          {columns.map((col) => (
            <span
              key={col.key}
              className={`rounded-full border border-slate-200 px-3 py-1 text-slate-700 ${col.chip}`}
            >
              {col.label}: {totals[col.key] || 0}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 p-6">
        {columns.map((status) => {
          const items = workOrders.filter((order) => order.status === status.key);
          return (
            <div
              key={status.key}
              className={`relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-4 min-w-[260px]`}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.2rem] text-slate-500">{status.label}</p>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
                  {items.length} open
                </span>
              </div>
              <div className="space-y-2">
                {items.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition hover:border-blue-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{order.assetName || order.id}</p>
                        <p className="text-xs text-slate-500">{order.vendor || 'Vendor'}</p>
                      </div>
                      {statusBadge(order.severity || 'Normal')}
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div className="rounded-xl bg-slate-50 px-2 py-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">ETA</p>
                        <p className="font-semibold text-slate-800">{order.eta || 'TBD'}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 px-2 py-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Attachments</p>
                        <p className="font-semibold text-slate-800">{order.attachments || 0}</p>
                      </div>
                    </div>
                    {order.technician && (
                      <p className="mt-2 text-xs text-slate-500">Tech: {order.technician}</p>
                    )}
                    {order.notes && <p className="mt-2 text-xs text-slate-500">{order.notes}</p>}
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-3 text-xs text-slate-400">
                    No tickets in this lane.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const EmployeeDirectoryGrid = ({
  members = [],
  totalCount = members.length,
  expandedId = null,
  onToggle = () => {},
  getAssignments = () => [],
  getLicenses = () => [],
  onEdit = () => {},
  onDelete = () => {},
  onPhoto = () => {},
  onAssetClick = () => {},
  downloadHref,
  isDarkMode = false,
}) => (
  <div className="rounded-3xl border border-slate-100 bg-white shadow-sm">
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-6 py-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">People ops</p>
        <p className="text-lg font-semibold text-slate-900">Employee directory</p>
        <p className="text-sm text-slate-500">
          Displaying {members.length} of {totalCount} team members with photos and contact info
        </p>
      </div>
      {downloadHref && (
        <a
          href={downloadHref}
          download
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300"
        >
          <Download className="h-4 w-4" />
          Roster
        </a>
      )}
    </div>
    <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 place-items-center">
      {members.map((member) => {
        const memberKey = member.id || normalizeKey(member.name || '');
        const isExpanded = expandedId === memberKey;
        const assignments = getAssignments(member);
        const licenses = getLicenses(member);
        const assignmentCount = assignments.length;
        const licenseCount = licenses.length;
        const supervisorLabel = member.supervisor ? normalizeNameCase(member.supervisor) : 'Not set';
        const cardClasses = [
          'w-full max-w-md rounded-xl border p-4 shadow-sm transition-all duration-200',
          isDarkMode
            ? 'border-slate-700/70 bg-slate-900/70 backdrop-blur-sm hover:border-purple-400/80 hover:shadow-lg'
            : 'border-slate-200 bg-white hover:border-purple-300 hover:shadow-md',
          'cursor-pointer select-none',
          isExpanded ? 'ring-2 ring-purple-400 border-purple-400' : '',
        ].join(' ');
        const handleKeyDown = (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onToggle(memberKey);
          }
        };

        return (
          <div
            key={memberKey}
            id={`employee-card-${memberKey}`}
            className={cardClasses}
            role="button"
            tabIndex={0}
            aria-expanded={isExpanded}
            onClick={() => onToggle(memberKey)}
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-start gap-3">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    loading="lazy"
                    className="h-16 w-16 rounded-xl object-cover cursor-zoom-in flex-shrink-0 border-2 border-purple-200"
                    onClick={(event) => {
                      event.stopPropagation();
                      onPhoto(member);
                    }}
                  />
                ) : (
                  <div className="h-16 w-16 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 text-sm font-bold text-purple-700 flex-shrink-0 border-2 border-purple-200">
                    {getInitials(member.name)}
                  </div>
                )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{member.name}</p>
                <p className="text-xs text-purple-600 font-medium truncate">{member.title}</p>
                {member.phone && (
                  <p className="mt-1 text-[11px]">
                    <a
                      href={`tel:${member.phone}`}
                      onClick={(event) => event.stopPropagation()}
                      className="text-blue-600 hover:text-purple-600 transition-colors"
                    >
                      {member.phone}
                    </a>
                  </p>
                )}
                {member.email ? (
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <a
                      href={`mailto:${member.email}`}
                      onClick={(event) => event.stopPropagation()}
                      className="text-xs text-blue-600 hover:text-purple-600 transition-colors"
                    >
                      {member.email}
                    </a>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        const subject = encodeURIComponent('Please verify your assigned hardware');
                        const auditAssets = (assignments || []).filter(
                          (asset) => (asset.type || '').toLowerCase() !== 'key fob',
                        );
                        const assetChecklist =
                          auditAssets.length > 0
                            ? auditAssets
                                .map((asset) => {
                                  const assetId = asset.sheetId || asset.assetName || `Asset-${asset.id}`;
                                  const model = asset.model || 'Model unknown';
                                  const serial = asset.serialNumber || 'Serial N/A';
                                  return `- [ ] ${assetId} | ${model} | Serial: ${serial}`;
                                })
                                .join('\n')
                            : '- [ ] No assets on file for you. Please list any devices you have.';
                        const body = encodeURIComponent(
                          `Hi ${member.name || ''},

We are running our asset audit and need you to confirm the hardware assigned to you.

Checklist (mark [x] to confirm or edit details):
${assetChecklist}

Add or correct:
- Assets you actually have (add lines as needed):
- Items you returned / don't have:
- Where you keep these assets:
- Notes or issues:

Reply to this email with your updates. Photos are welcome. Thank you!`,
                        );
                        window.location.href = `mailto:${member.email}?subject=${subject}&body=${body}`;
                      }}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      Audit Email
                    </button>
                  </div>
                ) : (
                  <p className="mt-1.5 text-xs text-slate-400">No email on file</p>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[11px] font-medium border border-purple-200">
                    <MapPin className="h-3 w-3" />
                    {member.location}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-medium border border-blue-200">
                    <Users className="h-3 w-3" />
                    {member.department}
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-slate-600">
                  <span className="font-semibold">Supervisor:</span> {supervisorLabel}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit(member);
                  }}
                  className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                  title="Edit employee"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(member);
                  }}
                  className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
                  title="Delete employee"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {isExpanded && (
              <div
                className={`mt-4 rounded-xl border p-4 ${
                  isDarkMode
                    ? 'border-slate-700/70 bg-gradient-to-br from-slate-900/80 via-slate-900/70 to-purple-900/50 shadow-inner'
                    : 'border-purple-100 bg-gradient-to-br from-purple-50/70 via-white to-blue-50/70'
                }`}
              >
                <div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-purple-700">
                  <span>Assigned assets</span>
                  <span className="rounded-full bg-purple-100 px-2 py-0.5">{assignmentCount}</span>
                </div>
                {assignmentCount === 0 ? (
                  <p className="text-xs text-slate-500">No asset assignments.</p>
                ) : (
                  <ul className="space-y-2">
                    {assignments.map((asset, index) => {
                      const deviceLabel = asset.deviceName || asset.assetName || 'Asset';
                      const assetId =
                        asset.sheetId ||
                        asset.assetName ||
                        asset.deviceName ||
                        (asset.id ? `Asset-${asset.id}` : 'Asset');
                      const modelLabel = asset.model || 'Unknown model';
                      const serialLabel = asset.serialNumber || 'N/A';
                      const showDeviceLabel =
                        deviceLabel && deviceLabel.toLowerCase() !== (assetId || '').toLowerCase();
                      const canOpenAsset = Boolean(onAssetClick);
                      const assetLabel = deviceLabel || assetId || 'Asset';
                      const baseAssetClasses = isDarkMode
                        ? 'border-slate-700/70 bg-slate-900/70 shadow-inner'
                        : 'border-blue-100 bg-white/95 shadow-sm';
                      const interactiveClasses = canOpenAsset
                        ? 'cursor-pointer transition hover:border-purple-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-200'
                        : '';
                      const handleAssetOpen = (event) => {
                        if (!canOpenAsset) {
                          return;
                        }
                        event.stopPropagation();
                        onAssetClick(asset);
                      };
                      const handleAssetKeyDown = (event) => {
                        if (!canOpenAsset) {
                          return;
                        }
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          handleAssetOpen(event);
                        }
                      };
                      const interactiveProps = canOpenAsset
                        ? {
                            onClick: handleAssetOpen,
                            onKeyDown: handleAssetKeyDown,
                            role: 'button',
                            tabIndex: 0,
                            'aria-label': `View ${assetLabel} spotlight`,
                          }
                        : {};
                      return (
                        <li
                          key={`${memberKey}-${asset.id || asset.sheetId || asset.assetName || asset.deviceName || index}`}
                          className={`rounded-lg border p-3 ${baseAssetClasses} ${interactiveClasses}`}
                          {...interactiveProps}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900">
                                {assetId}
                                {showDeviceLabel && (
                                  <span className="text-xs font-normal text-slate-600"> - {deviceLabel}</span>
                                )}
                              </p>
                              <p className="text-[11px] text-slate-600">
                                <span className="font-semibold">Model:</span> {modelLabel}
                              </p>
                              <p className="text-[11px] text-slate-600">
                                <span className="font-semibold">Serial:</span> {serialLabel}
                              </p>
                            </div>
                            <span
                              className={`inline-flex flex-shrink-0 items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
                                isDarkMode
                                  ? 'bg-purple-900/50 text-purple-100 border border-purple-500/40'
                                  : 'bg-purple-50 text-purple-700 border border-purple-200'
                              }`}
                            >
                              {asset.type || 'Asset'}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <div className="mt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-purple-700 mb-3">
                  <span>Assigned software</span>
                  <span className="rounded-full bg-purple-100 px-2 py-0.5">{licenseCount}</span>
                </div>
                {licenseCount === 0 ? (
                  <p className="text-xs text-slate-500">No software licenses.</p>
                ) : (
                  <ul className="space-y-2">
                    {licenses.map((suite) => (
                      <li key={`${suite.suiteId || suite.name}-${suite.licenseKey || ''}-${member.id}`} className="rounded-lg border border-emerald-100 bg-white p-3">
                        <p className="text-sm font-semibold text-slate-900">{suite.name}</p>
                        <p className="text-[11px] text-slate-600">
                          <span className="font-semibold">Vendor:</span> {suite.vendor || 'N/A'}
                        </p>
                        {suite.licenseKey && (
                          <p className="text-[11px] text-slate-600">
                            <span className="font-semibold">Key:</span> {suite.licenseKey}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

const EmployeeFilters = ({
  search = '',
  filters = { department: 'all', location: 'all', jobTitle: 'all' },
  departments = [],
  locations = [],
  jobTitles = [],
  onSearchChange = () => {},
  onFilterChange = () => {},
  onReset = () => {},
}) => (
  <div className="rounded-3xl border border-slate-100 bg-white shadow-sm px-6 py-5">
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex-1 min-w-[220px]">
        <label className="text-xs font-semibold uppercase tracking-[0.3rem] text-slate-400">Search</label>
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name, department, or device"
          className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>
      <div className="flex-1 min-w-[180px]">
        <label className="text-xs font-semibold uppercase tracking-[0.3rem] text-slate-400">Department</label>
        <select
          value={filters.department}
          onChange={(event) => onFilterChange('department', event.target.value)}
          className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="all">All departments</option>
          {departments.map((dept) => (
            <option key={`dept-${dept}`} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-[180px]">
        <label className="text-xs font-semibold uppercase tracking-[0.3rem] text-slate-400">Location</label>
        <select
          value={filters.location}
          onChange={(event) => onFilterChange('location', event.target.value)}
          className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="all">All locations</option>
          {locations.map((loc) => (
            <option key={`loc-${loc}`} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-[180px]">
        <label className="text-xs font-semibold uppercase tracking-[0.3rem] text-slate-400">Role</label>
        <select
          value={filters.jobTitle}
          onChange={(event) => onFilterChange('jobTitle', event.target.value)}
          className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="all">All roles</option>
          {jobTitles.map((title) => (
            <option key={`role-${title}`} value={title}>
              {title}
            </option>
          ))}
        </select>
      </div>
      <div className="min-w-[120px]">
        <label className="text-xs font-semibold uppercase tracking-[0.3rem] text-slate-400">Reset</label>
        <button
          type="button"
          onClick={onReset}
          className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Clear filters
        </button>
      </div>
    </div>
  </div>
);

const LaptopRepairCard = ({ data, onLoanerCheckout, onLoanerCheckin, onAddRepair, onEditRepair, isDarkMode = false }) => {
  const {
    repairs = [],
    repairTotal = 0,
    avgRepairAgeMonths = 0,
    loanersAvailable = [],
    loanerAvailableCount = 0,
    loanersDeployed = [],
    loanerDeployedCount = 0,
    loanerTotal = 0,
  } = data || {};
  const [availablePage, setAvailablePage] = useState(1);
  const [deployedPage, setDeployedPage] = useState(1);
  const availableTotalPages = Math.max(1, Math.ceil(loanersAvailable.length / LOANER_PAGE_SIZE));
  const deployedTotalPages = Math.max(1, Math.ceil(loanersDeployed.length / LOANER_PAGE_SIZE));
  useEffect(() => {
    setAvailablePage((prev) => Math.min(prev, availableTotalPages));
  }, [availableTotalPages]);
  useEffect(() => {
    setDeployedPage((prev) => Math.min(prev, deployedTotalPages));
  }, [deployedTotalPages]);
  const pagedLoanersAvailable = loanersAvailable.slice(
    (availablePage - 1) * LOANER_PAGE_SIZE,
    availablePage * LOANER_PAGE_SIZE,
  );
  const pagedLoanersDeployed = loanersDeployed.slice(
    (deployedPage - 1) * LOANER_PAGE_SIZE,
    deployedPage * LOANER_PAGE_SIZE,
  );
  const coveragePercent = loanerTotal ? Math.round((loanerAvailableCount / loanerTotal) * 100) : 0;
  return (
    <div
      className={`rounded-3xl border p-6 shadow-lg ${
        isDarkMode
          ? 'border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white'
          : 'border-amber-100 bg-gradient-to-br from-white via-amber-50/70 to-orange-50 text-slate-900 shadow-[0_16px_45px_rgba(15,23,42,0.12)]'
      }`}
    >
      <div
        className={`flex flex-wrap items-center justify-between gap-3 border-b pb-4 ${
          isDarkMode ? 'border-white/10' : 'border-amber-100'
        }`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <p
              className={`text-[11px] font-semibold uppercase tracking-[0.35rem] ${
                isDarkMode ? 'text-white/70' : 'status-warning opacity-80'
              }`}
            >
              Repair desk
            </p>
            <p className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Laptop service status</p>
          </div>
          {typeof onAddRepair === 'function' && (
            <button
              type="button"
              onClick={onAddRepair}
              className={`inline-flex items-center gap-2 rounded-2xl px-3 py-1.5 text-xs font-semibold transition hover:-translate-y-0.5 ${
                isDarkMode
                  ? 'border border-white/20 bg-white/10 text-white hover:border-white/30 hover:bg-white/15'
                  : 'border border-amber-200 bg-white status-warning shadow-sm hover:border-blue-200 hover:text-blue-700'
              }`}
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          )}
        </div>
        <div className="text-right">
          <p className={`text-xs uppercase tracking-widest ${isDarkMode ? 'text-white/60' : 'status-warning opacity-80'}`}>Avg age in repair</p>
          <p className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{avgRepairAgeMonths || 0} mo</p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr,1fr]">
        <div
          className={`rounded-2xl border p-4 ${
            isDarkMode ? 'border-white/10 bg-white/5 shadow-inner backdrop-blur' : 'border-amber-100 bg-white/90 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-xs font-semibold uppercase tracking-[0.25rem] ${
                  isDarkMode ? 'text-white/70' : 'status-warning opacity-80'
                }`}
              >
                Laptops out for repair
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-white/80' : 'text-slate-700'}`}>{repairTotal} devices</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isDarkMode ? 'bg-amber-900/40 status-warning ring-1 ring-amber-500/30' : 'bg-amber-100 status-warning ring-1 ring-amber-200'
              }`}
            >
              {repairTotal > 0 ? 'In progress' : 'All clear'}
            </span>
          </div>
          {repairs.length === 0 ? (
            <p className={`mt-4 text-sm ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>No laptops currently staged at the depot.</p>
          ) : (
            <ul className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pr-1">
              {repairs.map((item) => (
                <li
                  key={item.id}
                  className={`rounded-2xl border p-3 ${
                    isDarkMode ? 'border-white/10 bg-white/5 shadow-inner backdrop-blur' : 'border-amber-100 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.assetId}</p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          isDarkMode ? 'bg-white/10 text-white ring-1 ring-white/15' : 'bg-white text-slate-700 ring-1 ring-slate-200'
                        }`}
                      >
                        {item.status}
                      </span>
                      {typeof onEditRepair === 'function' && (
                        <button
                          type="button"
                          onClick={() => onEditRepair(item)}
                          className={`rounded-full px-2 py-1 text-[11px] font-semibold transition hover:-translate-y-0.5 ${
                            isDarkMode
                              ? 'border border-white/20 text-white hover:border-blue-300 hover:text-blue-100'
                              : 'border border-slate-200 text-slate-700 hover:border-blue-200 hover:text-blue-700'
                          }`}
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                  <p className={`mt-1 text-xs ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>{item.issue}</p>
                  <p className={`mt-1 text-xs ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>
                    Assigned to <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.assignedTo}</span> - {item.model}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div
          className={`rounded-2xl border p-4 ${
            isDarkMode ? 'border-white/10 bg-white/5 shadow-inner backdrop-blur' : 'border-amber-100 bg-white/90 shadow-sm'
          }`}
        >
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p
                  className={`text-xs font-semibold uppercase tracking-[0.25rem] ${
                    isDarkMode ? 'text-white/70' : 'status-warning opacity-80'
                  }`}
                >
                  Loaner coverage
                </p>
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {loanerAvailableCount}/{loanerTotal} staged
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>Tap a device below to reserve or return it.</p>
              </div>
              <div
                className={`rounded-2xl px-4 py-2 text-center text-xs font-semibold shadow-sm ${
                  isDarkMode ? 'bg-blue-900/30 text-blue-100 ring-1 ring-blue-500/30' : 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                }`}
              >
                {coveragePercent}% ready
                <p className={`text-[10px] font-medium ${isDarkMode ? 'text-blue-200/70' : 'text-blue-600/80'}`}>Loaner health</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-[11px] font-semibold uppercase tracking-wide">
              <div
                className={`rounded-xl border p-2 ${
                  isDarkMode ? 'border-white/10 bg-white/5 text-white' : 'border-emerald-100 bg-white text-slate-800'
                }`}
              >
                <p className="text-lg status-success">{loanerAvailableCount}</p>
                <p className={isDarkMode ? 'text-white/70' : 'text-slate-600'}>Available</p>
              </div>
              <div
                className={`rounded-xl border p-2 ${
                  isDarkMode ? 'border-white/10 bg-white/5 text-white' : 'border-amber-100 bg-white text-slate-800'
                }`}
              >
                <p className="text-lg status-warning">{loanerDeployedCount}</p>
                <p className={isDarkMode ? 'text-white/70' : 'text-slate-600'}>Deployed</p>
              </div>
              <div
                className={`rounded-xl border p-2 ${
                  isDarkMode ? 'border-white/10 bg-white/5 text-white' : 'border-slate-200 bg-white text-slate-800'
                }`}
              >
                <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{loanerTotal}</p>
                <p className={isDarkMode ? 'text-white/70' : 'text-slate-600'}>Total</p>
              </div>
            </div>
          </div>
          <div className="mt-3">
            {loanersAvailable.length === 0 ? (
              <p className={`text-xs ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>No devices ready.</p>
            ) : (
              <ul className="space-y-2">
                {pagedLoanersAvailable.map((loaner) => (
                  <li
                    key={loaner.id}
                    className={`flex items-center justify-between gap-3 rounded-2xl border p-3 ${
                      isDarkMode ? 'border-emerald-900/40 bg-emerald-900/30' : 'border-emerald-100 bg-emerald-50/80'
                    }`}
                  >
                    <div>
                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{loaner.assetId}</p>
                      <p className="text-[11px] status-success">{loaner.location}</p>
                    </div>
                    {typeof onLoanerCheckout === 'function' && (
                      <button
                        type="button"
                        onClick={() => onLoanerCheckout(loaner.asset)}
                        className={`rounded-2xl px-3 py-1 text-xs font-semibold transition hover:-translate-y-0.5 ${
                          isDarkMode
                            ? 'border border-emerald-800 bg-emerald-950 text-emerald-100 hover:border-emerald-700'
                            : 'border border-emerald-200 bg-white status-success shadow-sm hover:border-emerald-300'
                        }`}
                      >
                        Check out
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {loanersAvailable.length > LOANER_PAGE_SIZE && (
              <div className="mt-3">
                <PaginationControls
                  page={availablePage}
                  totalPages={availableTotalPages}
                  onPageChange={setAvailablePage}
                  align="end"
                />
              </div>
            )}
          </div>
          <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800/60">
            <p
              className={`text-xs font-semibold uppercase tracking-[0.25rem] ${
                isDarkMode ? 'text-white/70' : 'status-warning opacity-80'
              }`}
            >
              Currently deployed
            </p>
            {loanersDeployed.length === 0 ? (
              <p className={`mt-2 text-xs ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>No loaners currently checked out.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {pagedLoanersDeployed.map((loaner) => (
                  <li
                    key={loaner.id}
                    className={`flex items-center justify-between gap-3 rounded-2xl border p-3 ${
                      isDarkMode ? 'border-white/10 bg-white/5 shadow-inner backdrop-blur' : 'border-slate-100 bg-white'
                    }`}
                  >
                    <div>
                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{loaner.assetId}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>
                        Assigned to <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{loaner.assignedTo}</span> - {loaner.location}
                      </p>
                    </div>
                    {typeof onLoanerCheckin === 'function' && (
                      <button
                        type="button"
                        onClick={() => onLoanerCheckin(loaner.asset)}
                        className={`rounded-2xl px-3 py-1 text-xs font-semibold transition hover:-translate-y-0.5 ${
                          isDarkMode
                            ? 'border border-blue-900 bg-blue-900/30 text-blue-200 hover:border-blue-700'
                            : 'border border-blue-200 bg-white text-blue-700 shadow-sm hover:border-blue-300'
                        }`}
                      >
                        Check in
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
            {loanersDeployed.length > LOANER_PAGE_SIZE && (
              <div className="mt-3">
                <PaginationControls
                  page={deployedPage}
                  totalPages={deployedTotalPages}
                  onPageChange={setDeployedPage}
                  align="end"
                />
              </div>
            )}
            <p className={`mt-3 text-[11px] ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
              {loanerDeployedCount} out in the field - keep at least 2 staged for emergencies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RepairPartsPanel = ({ models = [], isDarkMode = false }) => {
  const topModels = models.slice(0, 8);
  return (
    <div
      className={`rounded-3xl border p-6 shadow-lg ${
        isDarkMode
          ? 'border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white'
          : 'border-amber-100 bg-gradient-to-br from-white via-amber-50/60 to-orange-50 text-slate-900 shadow-[0_12px_36px_rgba(15,23,42,0.12)]'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p
            className={`text-[11px] font-semibold uppercase tracking-[0.35rem] ${
              isDarkMode ? 'text-white/70' : 'status-warning opacity-80'
            }`}
          >
            Parts ordering
          </p>
          <p className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Amazon quick links by model</p>
          <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            One-click carts for batteries, displays, chargers, keyboards, SSDs, and RAM for your most common laptops.
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
            isDarkMode
              ? 'bg-emerald-900/40 text-emerald-100 ring-emerald-500/30'
              : 'bg-emerald-50 status-success ring-emerald-100'
          }`}
        >
          Replacement parts
        </span>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {topModels.length === 0 ? (
          <div
            className={`rounded-2xl border border-dashed p-4 text-sm ${
              isDarkMode ? 'border-white/20 bg-white/5 text-white/70' : 'border-amber-200/70 bg-white/80 text-slate-700'
            }`}
          >
            No laptop models detected yet. Add a laptop asset to unlock one-click ordering.
          </div>
        ) : (
          topModels.map((entry) => (
            <div
              key={`parts-${entry.model}`}
              className={`rounded-2xl border p-4 ${
                isDarkMode ? 'border-white/10 bg-white/5 shadow-inner backdrop-blur' : 'border-amber-100 bg-white/95 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{entry.model}</p>
                  <p className={`text-[11px] uppercase tracking-widest ${isDarkMode ? 'text-white/60' : 'status-warning opacity-70'}`}>
                    {entry.count} in fleet
                  </p>
                </div>
                <div
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${
                    isDarkMode ? 'bg-white/10 text-white/80 ring-white/15' : 'bg-white text-slate-700 ring-slate-200'
                  }`}
                >
                  Parts bundle
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {AMAZON_PART_CATEGORIES.map((part) => (
                  <a
                    key={`${entry.model}-${part.label}`}
                    href={buildAmazonSearch(entry.model, part.query)}
                    target="_blank"
                    rel="noreferrer"
                    className={`group inline-flex items-center justify-between gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold transition hover:-translate-y-0.5 ${
                      isDarkMode
                        ? 'border-white/10 bg-white/5 text-white hover:border-blue-300 hover:text-blue-100'
                        : 'border-slate-200 bg-white text-slate-700 shadow-sm hover:border-blue-200 hover:text-blue-700'
                    }`}
                  >
                    <span className="truncate">{part.label}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-500" />
                  </a>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      {topModels.length > 0 && (
        <p className={`mt-4 text-xs ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>
          Showing the top {topModels.length} laptop models by inventory count. Links open Amazon searches with the model pre-filled.
        </p>
      )}
    </div>
  );
};

const RepairVideosPanel = ({ models = [], isDarkMode = false }) => {
  const focusModels = models.slice(0, 6);
  return (
    <div
      className={`rounded-3xl border p-6 shadow-lg ${
        isDarkMode
          ? 'border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white'
          : 'border-amber-100 bg-gradient-to-br from-white via-blue-50/60 to-sky-50 text-slate-900 shadow-[0_12px_36px_rgba(15,23,42,0.12)]'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p
            className={`text-[11px] font-semibold uppercase tracking-[0.35rem] ${
              isDarkMode ? 'text-white/70' : 'text-blue-800/80'
            }`}
          >
            Repair playbooks
          </p>
          <p className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>How-to videos for tricky fixes</p>
          <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Pre-filtered YouTube searches for screens, keyboards, thermals, storage, and RAM upgrades.
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
            isDarkMode ? 'bg-blue-900/40 text-blue-100 ring-blue-500/30' : 'bg-blue-50 text-blue-700 ring-blue-100'
          }`}
        >
          Video guides
        </span>
      </div>
      <div className="mt-5 space-y-3">
        {focusModels.length === 0 ? (
          <div
            className={`rounded-2xl border border-dashed p-4 text-sm ${
              isDarkMode ? 'border-white/20 bg-white/5 text-white/70' : 'border-blue-200/70 bg-white/80 text-slate-700'
            }`}
          >
            Add laptop assets to surface tailored repair videos.
          </div>
        ) : (
          focusModels.map((entry) => (
            <div
              key={`videos-${entry.model}`}
              className={`rounded-2xl border p-4 ${
                isDarkMode ? 'border-white/10 bg-white/5 shadow-inner backdrop-blur' : 'border-blue-100 bg-white/95 shadow-sm'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{entry.model}</p>
                  <p className={`text-[11px] uppercase tracking-widest ${isDarkMode ? 'text-white/60' : 'text-blue-800/80'}`}>
                    Difficult repairs
                  </p>
                </div>
                <div
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${
                    isDarkMode ? 'bg-white/10 text-white/80 ring-white/15' : 'bg-white text-slate-700 ring-slate-200'
                  }`}
                >
                  {entry.count} devices
                </div>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {DIFFICULT_REPAIR_TOPICS.map((topic) => (
                  <a
                    key={`${entry.model}-${topic.label}`}
                    href={buildYoutubeSearch(entry.model, topic.query)}
                    target="_blank"
                    rel="noreferrer"
                    className={`group inline-flex items-center justify-between gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold transition hover:-translate-y-0.5 ${
                      isDarkMode
                        ? 'border-white/10 bg-white/5 text-white hover:border-rose-300 hover:text-rose-100'
                        : 'border-slate-200 bg-white text-slate-700 shadow-sm hover:border-rose-200 hover:text-rose-700'
                    }`}
                  >
                    <span className="truncate">{topic.label}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-rose-500" />
                  </a>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const LaptopRefreshReport = ({ data, selectedDate, onDateChange, onExport }) => {
  if (!data) {
    return null;
  }
  const topRows = data.rows.slice(0, 6);
  const hasRows = topRows.length > 0;
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">Laptop refresh</p>
          <p className="text-xl font-semibold text-slate-900">Devices 5+ years old</p>
          <p className="text-xs text-slate-500">Snapshot as of {formatDate(data.referenceDate)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-slate-400">Evaluation date</p>
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => onDateChange(event.target.value)}
            className="mt-1 rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
          <p className="text-xs uppercase tracking-[0.3rem] text-slate-500">Candidates</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{data.total}</p>
          <p className="text-xs text-slate-500">Laptops at or beyond 5 years</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
          <p className="text-xs uppercase tracking-[0.3rem] text-slate-500">Average age</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{data.avgAgeYears || 0} yrs</p>
          <p className="text-xs text-slate-500">Across qualifying devices</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
          <p className="text-xs uppercase tracking-[0.3rem] text-slate-500">Threshold</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{formatDate(data.thresholdDate)}</p>
          <p className="text-xs text-slate-500">Purchase date cutoff</p>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.3rem] text-slate-500">Top replacement candidates</p>
          <button
            type="button"
            onClick={onExport}
            className="rounded-2xl border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
          >
            Export results
          </button>
        </div>
        {!hasRows ? (
          <p className="mt-4 text-sm text-slate-500">No laptops hit the 5-year window for the selected date.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {topRows.map((row) => (
              <div key={row.id} className="rounded-2xl border border-white bg-white/80 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{row.assetId}</p>
                  <span className="text-xs font-semibold text-slate-500">{row.ageYears.toFixed(1)} yrs</span>
                </div>
                <p className="text-xs text-slate-500">
                  {row.model} - Purchased {formatDate(row.purchaseDate)}
                </p>
                <p className="text-xs text-slate-500">
                  Assigned to <span className="font-semibold text-slate-900">{row.assignedTo}</span> - {row.location}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// LicenseRiskReport removed per request: "Software Risk" card no longer shown on Reports page.

// eslint-disable-next-line no-unused-vars
const LoanerCoverageReport = ({ data, onExport }) => {
  const {
    loanersAvailable = [],
    loanersDeployed = [],
    loanerAvailableCount = 0,
    loanerDeployedCount = 0,
    loanerTotal = 0,
  } = data || {};
  const [availablePage, setAvailablePage] = useState(1);
  const [deployedPage, setDeployedPage] = useState(1);
  const availableTotalPages = Math.max(1, Math.ceil(loanersAvailable.length / LOANER_PAGE_SIZE));
  const deployedTotalPages = Math.max(1, Math.ceil(loanersDeployed.length / LOANER_PAGE_SIZE));
  useEffect(() => {
    setAvailablePage((prev) => Math.min(prev, availableTotalPages));
  }, [availableTotalPages]);
  useEffect(() => {
    setDeployedPage((prev) => Math.min(prev, deployedTotalPages));
  }, [deployedTotalPages]);
  const pagedAvailable = loanersAvailable.slice(
    (availablePage - 1) * LOANER_PAGE_SIZE,
    availablePage * LOANER_PAGE_SIZE,
  );
  const pagedDeployed = loanersDeployed.slice(
    (deployedPage - 1) * LOANER_PAGE_SIZE,
    deployedPage * LOANER_PAGE_SIZE,
  );
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">Loaner coverage</p>
          <p className="text-xl font-semibold text-slate-900">Readiness summary</p>
          <p className="text-xs text-slate-500">
            {loanerAvailableCount}/{loanerTotal} laptops are staged
          </p>
        </div>
        <button
          type="button"
          onClick={onExport}
          className="rounded-2xl border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
        >
          Export
        </button>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-center">
          <p className="text-xs uppercase tracking-[0.3rem] status-success-muted">Available</p>
          <p className="mt-1 text-2xl font-semibold status-success">{loanerAvailableCount}</p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-center">
          <p className="text-xs uppercase tracking-[0.3rem] text-blue-600">Deployed</p>
          <p className="mt-1 text-2xl font-semibold text-blue-700">{loanerDeployedCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
          <p className="text-xs uppercase tracking-[0.3rem] text-slate-500">Pool size</p>
          <p className="mt-1 text-2xl font-semibold text-slate-700">{loanerTotal}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25rem] text-slate-500">Ready for checkout</p>
          {loanersAvailable.length === 0 ? (
            <p className="mt-2 text-xs text-slate-500">No devices staged.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {pagedAvailable.map((loaner) => (
                <li key={loaner.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-2 text-xs text-slate-600">
                  <span className="font-semibold text-slate-900">{loaner.assetId}</span> - {loaner.location}
                </li>
              ))}
            </ul>
          )}
          {loanersAvailable.length > LOANER_PAGE_SIZE && (
            <div className="mt-2">
              <PaginationControls
                page={availablePage}
                totalPages={availableTotalPages}
                onPageChange={setAvailablePage}
                align="end"
              />
            </div>
          )}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25rem] text-slate-500">In the field</p>
          {loanersDeployed.length === 0 ? (
            <p className="mt-2 text-xs text-slate-500">No active deployments.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {pagedDeployed.map((loaner) => (
                <li key={loaner.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-2 text-xs text-slate-600">
                  <span className="font-semibold text-slate-900">{loaner.assetId}</span> {'->'} {loaner.assignedTo}
                </li>
              ))}
            </ul>
          )}
          {loanersDeployed.length > LOANER_PAGE_SIZE && (
            <div className="mt-2">
              <PaginationControls
                page={deployedPage}
                totalPages={deployedTotalPages}
                onPageChange={setDeployedPage}
                align="end"
              />
            </div>
          )}
        </div>
      </div>
      <p className="mt-4 text-[11px] text-slate-400">Aim to keep at least two devices staged for emergency swaps.</p>
    </div>
  );
};

const DepreciationForecastTable = ({ forecast = [] }) => (
  <CardShell title="Depreciation forecast" icon={TrendingDown}>
    {forecast.length === 0 ? (
      <p className="text-sm text-slate-500">No cost data available to project depreciation.</p>
    ) : (
      <>
        <div className="overflow-hidden rounded-2xl border border-slate-100">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2">Year</th>
                <th className="px-4 py-2">Remaining value</th>
                <th className="px-4 py-2">Depreciated</th>
                <th className="px-4 py-2 text-right">Value retained</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {forecast.map((row) => (
                <tr key={row.year}>
                  <td className="px-4 py-3 font-semibold text-slate-900">FY {row.year}</td>
                  <td className="px-4 py-3 text-slate-600">{formatCurrency(row.remaining)}</td>
                  <td className="px-4 py-3 text-slate-600">{formatCurrency(row.depreciated)}</td>
                  <td className="px-4 py-3 text-right text-slate-900">{row.percentRemaining}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-slate-500">Straight-line depreciation over 36 months using current asset costs.</p>
      </>
    )}
  </CardShell>
);

const AssetFilters = ({ filters, onChange, onReset, types, embedded = false, isDarkMode = false }) => {
  const wrapperClass = embedded
    ? `rounded-2xl border ${isDarkMode ? 'border-white/10 bg-slate-900/40 shadow-inner' : 'border-slate-100 bg-slate-50/60'} p-4`
    : `rounded-2xl border ${isDarkMode ? 'border-white/10 bg-slate-900/70 shadow-[0_15px_35px_rgba(2,6,23,0.6)]' : 'border-slate-100 bg-white shadow-sm'} p-4`;
  const controlBase = 'h-11 w-full rounded-xl border text-sm outline-none focus:ring-2 transition';
  const controlTone = isDarkMode
    ? 'border-white/15 bg-slate-900/80 text-slate-50 placeholder:text-slate-500 focus:border-sky-400 focus:ring-sky-500/30'
    : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-100';
  const toggleClass = `flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold ${
    isDarkMode ? 'border-white/15 bg-slate-900/80 text-slate-50' : 'border-slate-200 bg-white text-slate-700'
  }`;
  const resetButtonClass = `inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${
    isDarkMode
      ? 'border-white/15 bg-slate-900/80 text-slate-50 hover:border-sky-400 hover:text-sky-200'
      : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-600'
  }`;
  const checkboxClass = `h-4 w-4 rounded border ${
    isDarkMode ? 'border-slate-600 bg-slate-900/80 text-sky-400 focus:ring-sky-500/30' : 'border-slate-300 text-blue-600 focus:ring-blue-500'
  }`;
  return (
    <div className={wrapperClass}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-[2fr_repeat(3,minmax(0,1fr))_auto] xl:items-center">
        <div className="relative sm:col-span-2 xl:col-span-1">
          <Search
            className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}
          />
          <input
            value={filters.search}
            onChange={(event) => onChange('search', event.target.value)}
            placeholder="Search by model, serial, or user"
            className={`${controlBase} ${controlTone} pl-9 pr-3`}
          />
        </div>
        <select
          value={filters.type}
          onChange={(event) => onChange('type', event.target.value)}
          className={`${controlBase} ${controlTone} px-4`}
        >
          <option value="all">All types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(event) => onChange('status', event.target.value)}
          className={`${controlBase} ${controlTone} px-4`}
        >
          <option value="all">All statuses</option>
          <option value="Available">Available</option>
          <option value="Checked Out">Checked Out</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Retired">Retired</option>
        </select>
        <label className={toggleClass}>
          <input
            type="checkbox"
            checked={Boolean(filters.hideRetired)}
            onChange={(event) => onChange('hideRetired', event.target.checked)}
            className={checkboxClass}
          />
          Hide retired
        </label>
        <button type="button" onClick={onReset} className={resetButtonClass}>
          <X className="h-4 w-4" />
          Reset
        </button>
      </div>
    </div>
  );
};

const AssetTable = ({
  assets,
  onEdit,
  onDelete,
  onAction,
  onSelect = () => {},
  selectedId,
  qualityLookup = {},
  sortConfig,
  onSortChange,
  isMobile = false,
}) => {
  const toggleSort = (key) => {
    if (!onSortChange) return;
    onSortChange(key);
  };
  const sortIcon = (key) => {
    if (sortConfig?.key !== key) {
      return '';
    }
    return sortConfig.direction === 'asc' ? '^' : 'v';
  };

  if (assets.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 p-12 text-center text-sm text-slate-500">
        No assets match the selected filters. Try clearing filters or adjusting search.
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-3">
        {assets.map((asset) => {
          const Icon = assetTypeIcons[asset.type] || Monitor;
          const isSelected = selectedId === asset.id;
          const statusLabel = getAssetDisplayStatus(asset);
          const subtitle = asset.model || asset.type || '';
          const quality =
            qualityLookup[asset.id] || { score: 100, issues: [], approvalStatus: asset.approvalStatus || 'Approved' };
          const ready = quality.issues.length === 0 && quality.approvalStatus === 'Approved';
          return (
            <div
              key={asset.id}
              onClick={() => onSelect(asset)}
              className={`rounded-2xl border p-4 shadow-sm transition ${
                isSelected
                  ? 'border-blue-200 bg-blue-50/60 ring-1 ring-blue-200'
                  : 'border-slate-100 bg-white hover:border-blue-100 hover:bg-blue-50/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-slate-100/80 p-2 text-slate-600 ring-1 ring-slate-200/60">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{asset.assetName}</p>
                    {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
                    <p className="text-[11px] text-slate-400">{asset.serialNumber || 'No serial set'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      statusClasses[statusLabel] || 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {statusLabel}
                  </span>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {ready ? 'Ready' : 'Needs info'} | {quality.score}% complete
                  </div>
                </div>
              </div>
              <div className="mt-3 grid gap-3 text-xs text-slate-600 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Owner</p>
                  <p className="font-semibold text-slate-800">{asset.assignedTo || 'Unassigned'}</p>
                  <p className="text-[11px] text-slate-500">{asset.department || 'Department not set'}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Location</p>
                  <p className="font-semibold text-slate-800">{asset.location || 'Not set'}</p>
                  <p className="text-[11px] text-slate-500">
                    Warranty: {asset.warrantyExpiry ? formatDate(asset.warrantyExpiry) : 'Not set'}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">{formatCurrency(asset.cost)}</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onAction(asset, asset.checkedOut ? 'checkin' : 'checkout');
                    }}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
                  >
                    {asset.checkedOut ? 'Check In' : 'Check Out'}
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit(asset);
                    }}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
                    title="Edit asset"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(asset);
                    }}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:text-rose-600"
                    title="Remove asset"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3">
                <button className="flex items-center gap-1 font-semibold" type="button" onClick={() => toggleSort('assetName')}>
                  Asset <span className="text-[10px]">{sortIcon('assetName')}</span>
                </button>
              </th>
              <th className="px-6 py-3">
                <button className="flex items-center gap-1 font-semibold" type="button" onClick={() => toggleSort('assignedTo')}>
                  Owner <span className="text-[10px]">{sortIcon('assignedTo')}</span>
                </button>
              </th>
              <th className="px-6 py-3">
                <button className="flex items-center gap-1 font-semibold" type="button" onClick={() => toggleSort('department')}>
                  Department <span className="text-[10px]">{sortIcon('department')}</span>
                </button>
              </th>
              <th className="px-6 py-3">
                <button className="flex items-center gap-1 font-semibold" type="button" onClick={() => toggleSort('status')}>
                  Status <span className="text-[10px]">{sortIcon('status')}</span>
                </button>
              </th>
              <th className="px-6 py-3">
                <button className="flex items-center gap-1 font-semibold" type="button" onClick={() => toggleSort('warrantyExpiry')}>
                  Lifecycle <span className="text-[10px]">{sortIcon('warrantyExpiry')}</span>
                </button>
              </th>
              <th className="px-6 py-3">
                <button className="flex items-center gap-1 font-semibold" type="button" onClick={() => toggleSort('cost')}>
                  Cost <span className="text-[10px]">{sortIcon('cost')}</span>
                </button>
              </th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600">
            {assets.map((asset) => {
              const Icon = assetTypeIcons[asset.type] || Monitor;
              const isSelected = selectedId === asset.id;
              const statusLabel = getAssetDisplayStatus(asset);
              const subtitle = asset.model || asset.type || '';
              const quality = qualityLookup[asset.id] || { score: 100, issues: [], approvalStatus: asset.approvalStatus || 'Approved' };
              const ready = quality.issues.length === 0 && quality.approvalStatus === 'Approved';
              return (
                <tr
                  key={asset.id}
                  onClick={() => onSelect(asset)}
                  className={`cursor-pointer transition ${
                    isSelected
                      ? 'bg-blue-50/80 shadow-inner ring-1 ring-blue-100'
                      : 'hover:bg-slate-50/30 hover:ring-1 hover:ring-slate-100/60'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{asset.assetName}</p>
                        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
                        <p className="text-xs text-slate-400">{asset.serialNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{asset.assignedTo || 'Unassigned'}</td>
                  <td className="px-6 py-4">
                    <div className="text-slate-700">{asset.department}</div>
                    <div className="text-xs text-slate-400">{asset.location}</div>
                  </td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[statusLabel] || 'bg-slate-100 text-slate-500'}`}>
                    {statusLabel}
                  </span>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {ready ? 'Ready' : 'Needs info'} - {quality.score}% complete
                  </div>
                </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    <div className="space-y-1">
                      <p>
                        <span className="font-semibold text-slate-600">Purchased:</span> {asset.purchaseDate ? formatDate(asset.purchaseDate) : 'Not set'}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-600">Warranty:</span> {asset.warrantyExpiry ? formatDate(asset.warrantyExpiry) : 'Not set'}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-600">Retires:</span> {asset.retiredDate ? formatDate(asset.retiredDate) : 'Not set'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{formatCurrency(asset.cost)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          onAction(asset, asset.checkedOut ? 'checkin' : 'checkout');
                        }}
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
                      >
                        {asset.checkedOut ? 'Check In' : 'Check Out'}
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          onEdit(asset);
                        }}
                        className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:text-blue-600"
                        title="Edit asset"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          onDelete(asset);
                        }}
                        className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-rose-200 hover:text-rose-600"
                        title="Remove asset"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LicenseUsage = ({ licenses }) => {
  const usage = useMemo(
    () =>
      licenses.map((license) => ({
        name: license.software,
        used: license.used,
        available: license.seats - license.used,
      })),
    [licenses],
  );

  return (
    <CardShell title="License usage" icon={Key}>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
          <BarChart data={usage} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="used" stackId="a" fill="#2563eb" name="Used seats" />
            <Bar dataKey="available" stackId="a" fill="#94a3b8" name="Available" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardShell>
  );
};

const ActivityPanel = ({ history, lookupAsset }) => (
  <CardShell title="Check-in/out activity" icon={History}>
    {history.length === 0 ? (
      <p className="text-sm text-slate-500">No check-in/out activity yet.</p>
    ) : (
      <div className="space-y-4">
        {history.map((entry) => (
          <div key={entry.id} className="flex items-start gap-3 rounded-2xl border border-slate-100 p-4">
            <div
              className={`rounded-full p-2 ${
                entry.action === 'Check Out' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 status-success-muted'
              }`}
            >
              <ArrowRightLeft className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {entry.action} - {lookupAsset(entry.assetId)}
              </p>
              <p className="text-xs text-slate-500">
                {entry.date} | {entry.user}
              </p>
              {entry.notes && <p className="mt-1 text-sm text-slate-600">{entry.notes}</p>}
            </div>
          </div>
        ))}
      </div>
    )}
  </CardShell>
);

const QrToolingPanel = ({
  qrInput,
  onQrInput,
  qrDataUrl,
  onCopy,
  onExportPng,
  scanResult,
  scannerActive,
  onStartScanner,
  onStopScanner,
  onUseScanResult,
  onManualInput,
  manualScanInput,
  scanMessage,
  scannerError,
  videoRef,
  employeeOptions = [],
  selectedEmployee = '',
  onSelectEmployee = () => {},
}) => (
  <div className="grid gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm md:grid-cols-2">
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <QrCode className="h-4 w-4 text-blue-600" />
        <p className="text-sm font-semibold text-slate-900">Generate QR</p>
      </div>
      <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70">
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="QR code preview"
            className="h-40 w-40 object-contain"
            style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          <p className="text-xs text-slate-500">Enter text to generate a QR code.</p>
        )}
      </div>
      <input
        value={qrInput}
        onChange={(event) => onQrInput(event.target.value)}
        placeholder="Text, asset ID, or URL"
        className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCopy}
          disabled={!qrDataUrl}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Copy QR
        </button>
        <button
          type="button"
          onClick={onExportPng}
          disabled={!qrDataUrl}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Export PNG
        </button>
        <p className="text-xs text-slate-500">Share labels or onboarding links quickly.</p>
      </div>
    </div>

    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scan className="h-4 w-4 status-success-muted" />
          <p className="text-sm font-semibold text-slate-900">Scan QR / barcode</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={scannerActive ? onStopScanner : onStartScanner}
            className={`rounded-2xl px-3 py-1.5 text-xs font-semibold ${
              scannerActive
                ? 'border border-rose-200 bg-rose-50 status-alert'
                : 'border border-emerald-200 bg-emerald-50 status-success'
            }`}
          >
            {scannerActive ? 'Stop' : 'Start'}
          </button>
          <button
            type="button"
            onClick={onUseScanResult}
            className="rounded-2xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700"
          >
            Use result
          </button>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        {scannerActive ? (
          <video ref={videoRef} className="h-48 w-full object-cover" playsInline muted autoPlay />
        ) : (
          <div className="flex h-48 items-center justify-center text-xs text-slate-500">
            Camera preview appears here when scanner is active.
          </div>
        )}
      </div>
      {scannerError && <p className="text-xs status-alert-muted">{scannerError}</p>}
      {scanMessage && <p className="text-xs status-warning-muted">{scanMessage}</p>}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700">Enter code manually</label>
        <div className="flex items-center gap-2">
          <input
            value={manualScanInput}
            onChange={(event) => onManualInput(event.target.value)}
            placeholder="Asset ID, serial, or QR value"
            className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="button"
            onClick={onUseScanResult}
            className="rounded-2xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500"
          >
            Apply
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700">Assign to employee (for checkout)</label>
        <input
          list="qr-employee-options"
          value={selectedEmployee}
          onChange={(event) => onSelectEmployee(event.target.value)}
          placeholder="Search or type employee name"
          className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <datalist id="qr-employee-options">
          {employeeOptions.map((name) => (
            <option key={`qr-employee-${name}`} value={name} />
          ))}
        </datalist>
        <p className="text-[11px] text-slate-500">
          We'll prefill check-out with this person when a matching asset is scanned.
        </p>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Last scan</p>
        <p className="mt-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
          {scanResult || 'No code detected yet.'}
        </p>
      </div>
      <p className="text-[11px] text-slate-500">
        Tip: scan to auto-select an asset for check in/out or quick updates, even while the desktop view stays on the table.
      </p>
    </div>
  </div>
);

const CommandPalette = ({ open, query, onQuery, results, onSelect, onClose }) => {
  if (!open) return null;
  return (
    <div className="sticky top-4 z-30 mx-auto mt-3 w-full max-w-4xl px-4">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-900/5">
        <div className="flex items-center gap-2 px-4 py-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            autoFocus
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                onClose();
              }
            }}
            placeholder="Search assets, printers, people, actions"
            className="w-full bg-transparent text-sm text-slate-800 outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto border-t border-slate-100">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-xs text-slate-500">No matches. Try another name or serial.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {results.map((item) => (
                <li key={`${item.kind}-${item.id}`} className="hover:bg-slate-50">
                  <button
                    type="button"
                    onClick={() => onSelect(item)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.subtitle}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      {item.kind}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const PrinterFormModal = ({ printer, onSubmit, onCancel }) => {
  const [form, setForm] = useState(
    printer || {
      id: null,
      deviceType: 'Printer',
      location: '',
      model: '',
      serial: '',
      ip: '',
      colonyId: '',
      vendorName: '',
      vendor: '',
      vendorBadge: 'bg-slate-100 text-slate-700 ring-slate-200',
    },
  );

  useEffect(() => {
    setForm(
      printer || {
        id: null,
        deviceType: 'Printer',
        location: '',
        model: '',
        serial: '',
        ip: '',
        colonyId: '',
        vendorName: '',
        vendor: '',
        vendorBadge: 'bg-slate-100 text-slate-700 ring-slate-200',
      },
    );
  }, [printer]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ModalShell title={form.id ? 'Edit machine' : 'Add machine'} onClose={onCancel}>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold text-slate-600">Device type</p>
          <input
            value={form.deviceType}
            onChange={(event) => update('deviceType', event.target.value)}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-600">Location</p>
          <input
            value={form.location}
            onChange={(event) => update('location', event.target.value)}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-600">Model</p>
          <input
            value={form.model}
            onChange={(event) => update('model', event.target.value)}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-600">Serial</p>
          <input
            value={form.serial}
            onChange={(event) => update('serial', event.target.value)}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-600">IP address</p>
          <input
            value={form.ip}
            onChange={(event) => update('ip', event.target.value)}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-600">Fleet ID</p>
          <input
            value={form.colonyId}
            onChange={(event) => update('colonyId', event.target.value)}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-600">Vendor</p>
          <input
            value={form.vendorName}
            onChange={(event) => update('vendorName', event.target.value)}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSubmit(form)}
          className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          Save
        </button>
      </div>
    </ModalShell>
  );
};

const MobileActionBar = ({ onAdd, onWarranty, onFilters, onScan, onMenu }) => (
  <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white/95 shadow-2xl backdrop-blur">
    <div className="mx-auto grid max-w-5xl grid-cols-2 items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 sm:flex sm:flex-wrap sm:justify-between">
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-3 py-2 text-white shadow-sm"
      >
        <Plus className="h-4 w-4" />
        Add
      </button>
      <button
        type="button"
        onClick={onScan}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 status-success"
      >
        <Scan className="h-4 w-4" />
        Scan
      </button>
      <button
        type="button"
        onClick={onFilters}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-700"
      >
        <Filter className="h-4 w-4" />
        Filters
      </button>
      <button
        type="button"
        onClick={onWarranty}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 status-warning"
      >
        <CalendarClock className="h-4 w-4" />
        Warranty
      </button>
      <button
        type="button"
        onClick={onMenu}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-700"
      >
        <Menu className="h-4 w-4" />
        Menu
      </button>
    </div>
  </div>
);

const AssetSpotlight = ({
  asset,
  onEdit,
  onApproveIntake,
  repairHistory = [],
  currentRepairs = [],
  ownerHistory = [],
  onOpenAutomate,
  ownerContact,
  onRepair,
  onClearMaintenance = () => {},
  onClearMaintenanceAll = () => {},
  isDarkMode = false,
}) => {
  const Icon = asset ? assetTypeIcons[asset.type] || Monitor : Monitor;
  const statusLabel = asset ? getAssetDisplayStatus(asset) : 'Available';
  const qualityIssues = asset ? getAssetQualityIssues(asset) : [];
  const qualityScore = asset ? getAssetQualityScore(asset) : 100;
  const ready = isAssetReady(asset || {});
  const automateEligible = isComputerAsset(asset);
  const assetIdLabel = asset?.sheetId || asset?.serialNumber || asset?.assetName || (asset?.id ? `Asset-${asset.id}` : 'Asset');
  const heroCardClass = isDarkMode
    ? 'rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-lg'
    : 'rounded-2xl bg-gradient-to-br from-white via-blue-50 to-blue-100 p-6 text-slate-900 shadow-lg border border-blue-100 ring-1 ring-blue-200/50';
  const heroIconWrapClass = isDarkMode
    ? 'bg-white/10 text-white ring-white/20 shadow-inner'
    : 'bg-white text-slate-700 ring-slate-200/80 shadow-sm';
  const heroLabelClass = isDarkMode ? 'text-white/60' : 'text-slate-500';
  const heroSubLabelClass = isDarkMode ? 'text-white/70' : 'text-slate-500';
  const heroDividerClass = isDarkMode ? 'border-white/10' : 'border-slate-200/80';
  const heroValueClass = isDarkMode ? 'text-white' : 'text-slate-900';
  const heroAssignClass = isDarkMode ? 'text-emerald-100' : 'text-emerald-600';
  const heroBadgeClass = isDarkMode
    ? 'border-white/20 bg-white/10 text-white'
    : 'border-slate-200/70 bg-white/80 text-slate-700';

  return (
    <div className="sticky top-6 rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm">
      {asset ? (
        <>
          {/* Hero Card with Asset ID and Assigned To prominently displayed */}
          <div className={heroCardClass}>
            <div className="mb-4 flex items-start gap-3">
              <div className={`rounded-2xl p-3 ring-1 ${heroIconWrapClass}`}>
                <Icon className={`h-8 w-8 drop-shadow ${isDarkMode ? 'text-white' : 'text-slate-900'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs uppercase tracking-[0.25rem] ${heroLabelClass}`}>{asset.type}</p>
                <p className={`text-sm ${heroSubLabelClass}`}>{asset.model || 'Model not set'}</p>
              </div>
            </div>
            
            {/* Most Important Info: Asset ID and Assignment */}
            <div className={`grid gap-4 border-t pt-4 sm:grid-cols-2 ${heroDividerClass}`}>
              <div>
                <p className={`mb-1 text-xs uppercase tracking-widest ${heroLabelClass}`}>Asset ID</p>
                <div className="flex items-center gap-2">
                  <Tag className={`h-5 w-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`} />
                  <p className={`text-xl font-bold sm:text-2xl ${heroValueClass}`}>{assetIdLabel}</p>
                </div>
              </div>
              <div>
                <p className={`mb-1 text-xs uppercase tracking-widest ${heroLabelClass}`}>Assigned To</p>
                <div className="flex items-center gap-2">
                  <Users className={`h-5 w-5 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-500'}`} />
                  <p className={`text-lg font-bold sm:text-2xl ${heroAssignClass}`}>{asset.assignedTo || 'Unassigned'}</p>
                </div>
              </div>
            </div>

            {/* Status Badges */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${heroBadgeClass}`}>
                <ShieldCheck className="h-3.5 w-3.5" />
                {statusLabel}
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${heroBadgeClass}`}>
                <MapPin className="h-3.5 w-3.5" />
                {asset.location || 'Location not set'}
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${heroBadgeClass}`}>
                <DollarSign className={`h-3.5 w-3.5 ${isDarkMode ? '' : 'text-slate-500'}`} />
                {formatCurrency(asset.cost)}
              </span>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onEdit?.(asset)}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
            >
              <Edit2 className="h-4 w-4" />
              Edit Asset
            </button>
            {!ready && (
              <button
                onClick={() => onApproveIntake?.(asset)}
                className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold status-success hover:bg-emerald-100"
                type="button"
              >
                <Check className="h-4 w-4" />
                Approve Intake
              </button>
            )}
            {automateEligible && (
              <button
                type="button"
                onClick={() => onOpenAutomate?.(asset)}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-600"
              >
                <ExternalLink className="h-4 w-4" />
                Open in Automate
              </button>
            )}
            {isLaptopAsset(asset) && (
              <button
                type="button"
                onClick={() => onRepair?.(asset)}
                className="inline-flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold status-warning hover:bg-amber-100"
              >
                <HardDrive className="h-4 w-4" />
                Repair
              </button>
            )}
          </div>

          {/* Asset Details */}
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Details</p>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Serial Number</span>
                <span className="font-semibold text-slate-900">{asset.serialNumber || 'Not set'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Department</span>
                <span className="font-semibold text-slate-900">{asset.department || 'Not set'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">QR Code</span>
                <span className="font-semibold text-slate-900">{asset.qrCode || 'Not generated'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Purchase Date</span>
                <span className="font-semibold text-slate-900">{formatDate(asset.purchaseDate)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600">Warranty Expires</span>
                <span className="font-semibold text-slate-900">{formatDate(asset.warrantyExpiry)}</span>
              </div>
            </dl>
          </div>

          {/* Owner Contact */}
          {(ownerContact?.phone || ownerContact?.email) && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Contact Owner</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {ownerContact?.phone && (
                  <a
                    href={`tel:${ownerContact.phone}`}
                    className="inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 sm:w-auto sm:justify-start"
                  >
                    <PhoneCall className="h-4 w-4" />
                    <span className="truncate" title={ownerContact.phone}>
                      {ownerContact.phone}
                    </span>
                  </a>
                )}
                {ownerContact?.email && (
                  <a
                    href={`mailto:${ownerContact.email}`}
                    className="inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 sm:w-auto sm:justify-start"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="truncate" title={ownerContact.email}>
                      {ownerContact.email}
                    </span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Quality Check for Unapproved Assets */}
          {!ready && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold uppercase tracking-wider status-warning">Intake Readiness</p>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold status-warning">
                  {qualityScore}% Complete
                </span>
              </div>
              {qualityIssues.length > 0 && (
                <ul className="space-y-1 text-xs status-warning">
                  {qualityIssues.map((issue) => (
                    <li key={issue} className="flex items-start gap-2">
                      <span className="status-warning-muted mt-0.5">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Printer-Specific Info */}
          {asset.type === 'Printer' && (
            <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">Consumables</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">Toner Type</span>
                <span className="text-sm font-semibold text-slate-900">
                  {getPrinterToner(asset) || 'Not specified'}
                </span>
              </div>
            </div>
          )}

          {/* History Sections */}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Repairs & Service</p>
                {repairHistory.length > 0 && (
                  <button
                    type="button"
                    className="text-[11px] font-semibold status-warning underline underline-offset-2"
                    onClick={() => onClearMaintenanceAll(repairHistory)}
                  >
                    Clear history
                  </button>
                )}
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Current repairs</p>
                  {currentRepairs.length > 0 ? (
                    <ul className="mt-2 space-y-2">
                      {currentRepairs.map((order) => (
                        <li key={`current-repair-${order.id || order.assetName}`} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{order.notes || 'Repair ticket'}</p>
                              <p className="text-xs text-slate-500">
                                {(order.vendor || 'Internal IT')} · {order.status || 'In Progress'}
                              </p>
                            </div>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                order.status === 'Completed' ? 'bg-emerald-100 status-success' : 'bg-amber-100 status-warning'
                              }`}
                            >
                              {order.status || 'Open'}
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-500">
                            <span>Assigned: {order.assignedTo || 'Unassigned'}</span>
                            <span>ETA: {order.eta || 'TBD'}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500">No active repairs for this asset.</p>
                  )}
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Repair history</p>
                  {repairHistory.length > 0 ? (
                    <ul className="mt-2 space-y-2">
                      {repairHistory.map((item) => (
                        <li key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{item.type}</p>
                              <p className="text-xs text-slate-500">{formatDate(item.date)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                  item.status === 'Completed' ? 'bg-emerald-100 status-success' : 'bg-amber-100 status-warning'
                                }`}
                              >
                                {item.status}
                              </span>
                              <button
                                type="button"
                                className="text-[11px] font-semibold text-slate-500 underline underline-offset-2"
                                onClick={() => onClearMaintenance(item)}
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                          {item.description && <p className="mt-1 text-xs text-slate-600">{item.description}</p>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500">No past repairs recorded.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Owner History</p>
              {ownerHistory.length > 0 ? (
                <ul className="space-y-2">
                  {ownerHistory.map((entry) => (
                    <li key={entry.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <p className="text-sm font-semibold text-slate-900">
                        {entry.action} → {entry.user || 'Unassigned'}
                      </p>
                      <p className="text-xs text-slate-500">{formatDate(entry.date)}</p>
                      {entry.notes && <p className="mt-1 text-xs text-slate-600">{entry.notes}</p>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500">No ownership changes recorded.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
          Select an asset from the table to view a friendly summary of ownership, warranty, and deployment details.
        </div>
      )}
    </div>
  );
};

const AssetSpotlightModal = ({
  asset,
  onClose,
  repairHistory = [],
  currentRepairs = [],
  ownerHistory = [],
  onEdit,
  onApproveIntake,
  onOpenAutomate,
  ownerContact,
  onRepair,
  onClearMaintenance,
  onClearMaintenanceAll,
  isDarkMode = false,
}) => {
  if (!asset) return null;

  return (
    <ModalShell title="Asset spotlight" onClose={onClose}>
      <AssetSpotlight
        asset={asset}
        onEdit={onEdit}
        onApproveIntake={onApproveIntake}
        repairHistory={repairHistory}
        currentRepairs={currentRepairs}
        ownerHistory={ownerHistory}
        onOpenAutomate={onOpenAutomate}
        ownerContact={ownerContact}
        onRepair={onRepair}
        onClearMaintenance={onClearMaintenance}
        onClearMaintenanceAll={onClearMaintenanceAll}
        isDarkMode={isDarkMode}
      />
    </ModalShell>
  );
};

const ModalShell = ({ title, onClose, children }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    requestAnimationFrame(() => {
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, []);

  const modalContent = (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/70 px-4 py-8"
      onClick={(event) => {
        if (event.target === event.currentTarget && typeof onClose === 'function') {
          onClose();
        }
      }}
    >
      <div ref={dialogRef} className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl" role="dialog" aria-modal="true">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <p className="text-lg font-semibold text-slate-900">{title}</p>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-4">{children}</div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(modalContent, document.body);
};

const PhotoLightbox = ({ photo, onClose }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    requestAnimationFrame(() => {
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, []);

  if (typeof document === 'undefined') {
    return null;
  }

  const content = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4" onClick={onClose}>
      <div ref={dialogRef} className="relative max-w-3xl rounded-3xl bg-white p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Close photo"
        >
          <X className="h-5 w-5" />
        </button>
        <img src={photo?.src} alt={photo?.name || 'Employee photo'} className="max-h-[75vh] w-full rounded-2xl object-contain" />
        <div className="mt-3 text-center">
          {photo?.name && <p className="text-sm font-semibold text-slate-900">{photo.name}</p>}
          {photo?.title && <p className="text-xs text-slate-500">{photo.title}</p>}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

const AssetFormModal = ({
  asset,
  onSubmit,
  onCancel,
  suggestionListId,
  modelSuggestionListId,
  departmentSuggestionListId,
  locationSuggestionListId,
  departmentSuggestionOptions,
  locationSuggestionOptions,
}) => {
  const [form, setForm] = useState(asset || defaultAsset);

  useEffect(() => {
    setForm(asset || defaultAsset);
  }, [asset]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const qualityIssues = getAssetQualityIssues(form);
  const qualityScore = getAssetQualityScore(form);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ ...form, approvalStatus: qualityIssues.length ? 'Pending Approval' : 'Approved' });
  };

  return (
    <ModalShell title={asset?.id ? 'Edit asset' : 'New asset'} onClose={onCancel}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Asset type
            <select
              value={form.type}
              onChange={(event) => update('type', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Computer">Computer</option>
              <option value="Desktop">Desktop</option>
              <option value="Dock">Dock</option>
              <option value="HotSpot">HotSpot</option>
              <option value="KeyFob">KeyFob</option>
              <option value="Monitor">Monitor</option>
              <option value="Phone">Phone</option>
              <option value="Printer">Printer</option>
              <option value="Tablet">Tablet</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Asset ID
            <input
              value={form.assetName}
              onChange={(event) => update('assetName', event.target.value)}
              placeholder="Match the IT Computers entry (e.g., Laptop450)"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Model
            <input
              value={form.model}
              onChange={(event) => update('model', event.target.value)}
              list={modelSuggestionListId}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Serial number
            <input
              value={form.serialNumber}
              onChange={(event) => update('serialNumber', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Department
            <select
              value={form.department}
              onChange={(event) => update('department', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select a department...</option>
              {departmentSuggestionOptions.map((dept) => (
                <option key={`asset-dept-${dept}`} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Location
            <select
              value={form.location}
              onChange={(event) => update('location', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select a location...</option>
              {locationSuggestionOptions.map((location) => (
                <option key={`asset-location-${location}`} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Assigned to
            <input
              value={form.assignedTo}
              onChange={(event) => update('assignedTo', event.target.value)}
              list={suggestionListId}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Status
            <select
              value={form.status}
              onChange={(event) => update('status', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Available">Available</option>
              <option value="Checked Out">Checked Out</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Retired">Retired</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Purchase date
            <input
              type="date"
              value={form.purchaseDate}
              onChange={(event) => update('purchaseDate', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Warranty expiry
            <input
              type="date"
              value={form.warrantyExpiry}
              onChange={(event) => update('warrantyExpiry', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Retirement date
            <input
              type="date"
              value={form.retiredDate}
              onChange={(event) => update('retiredDate', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Cost
            <div className="relative mt-2">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">$</span>
              <input
                type="number"
                value={form.cost === '' ? '' : form.cost}
                onChange={(event) => {
                  const raw = event.target.value;
                  update('cost', raw === '' ? '' : Number(raw));
                }}
                placeholder="0"
                className="w-full rounded-2xl border border-slate-200 pl-7 pr-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </label>
          <label className="text-sm font-medium text-slate-700">
            QR code value
            <input
              value={form.qrCode}
              onChange={(event) => update('qrCode', event.target.value)}
              placeholder="QR-XXXXXX"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </div>
        <div className="space-y-4">
          <label className="text-sm font-medium text-slate-700">
            Owner notes
            <textarea
              value={form.ownerNotes || ''}
              onChange={(event) => update('ownerNotes', event.target.value)}
              placeholder="Add notes about ownership history, transfers, or assignments..."
              rows={3}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Repair history notes
            <textarea
              value={form.repairNotes || ''}
              onChange={(event) => update('repairNotes', event.target.value)}
              placeholder="Add notes about repairs, maintenance, or service history..."
              rows={3}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-sm text-slate-700">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-slate-800">Intake readiness</p>
            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${qualityIssues.length === 0 ? 'bg-emerald-50 status-success' : 'bg-amber-50 status-warning'}`}>
              {qualityIssues.length === 0 ? 'Ready' : `${qualityScore}% complete`}
            </span>
          </div>
          {qualityIssues.length === 0 ? (
            <p className="mt-2 text-slate-600">All critical fields are filled. Saving will mark this as Approved.</p>
          ) : (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600">
              {qualityIssues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Check className="h-4 w-4" />
            Save asset
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

const EMPTY_REPAIR_TICKET = {
  id: null,
  assetId: '',
  model: '',
  assignedTo: '',
  location: '',
  issue: '',
  status: 'Awaiting intake',
  severity: 'Normal',
  eta: '',
  deviceType: 'Laptop',
};

const RepairTicketModal = ({ ticket, onSubmit, onCancel, modelOptions = [], employeeNames = [], locationOptions = [] }) => {
  const [form, setForm] = useState(() => ticket || { ...EMPTY_REPAIR_TICKET });

  useEffect(() => {
    setForm(ticket || { ...EMPTY_REPAIR_TICKET });
  }, [ticket]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(form);
  };

  const getModalTitle = () => {
    const deviceType = form.deviceType || 'Laptop';
    const isPrinter = deviceType.toLowerCase().includes('printer') || deviceType.toLowerCase().includes('copier');
    const deviceLabel = isPrinter ? 'Printer and Copier' : deviceType;
    return form.id ? `Edit ${deviceLabel.toLowerCase()} repair` : `Add ${deviceLabel.toLowerCase()} repair`;
  };

  return (
    <ModalShell title={getModalTitle()} onClose={onCancel}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Asset ID
            <input
              value={form.assetId}
              onChange={(event) => update('assetId', event.target.value)}
              placeholder="e.g., LAPTOP123"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Model
            <input
              value={form.model}
              onChange={(event) => update('model', event.target.value)}
              placeholder="Dell Latitude"
              list="repair-model-suggestions"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <datalist id="repair-model-suggestions">
              {modelOptions.map((model) => (
                <option key={model} value={model} />
              ))}
            </datalist>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Assigned to
            <input
              value={form.assignedTo}
              onChange={(event) => update('assignedTo', event.target.value)}
              placeholder="Name or team"
              list="repair-employee-suggestions"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <datalist id="repair-employee-suggestions">
              {employeeNames.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Location
            <input
              value={form.location}
              onChange={(event) => update('location', event.target.value)}
              placeholder="Depot, HQ, etc."
              list="repair-location-suggestions"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <datalist id="repair-location-suggestions">
              {locationOptions.map((location) => (
                <option key={location} value={location} />
              ))}
            </datalist>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Status
            <select
              value={form.status}
              onChange={(event) => update('status', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Awaiting intake">Awaiting intake</option>
              <option value="In Progress">In Progress</option>
              <option value="Awaiting Parts">Awaiting Parts</option>
              <option value="Completed">Completed</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Severity
            <select
              value={form.severity}
              onChange={(event) => update('severity', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Issue
            <textarea
              value={form.issue}
              onChange={(event) => update('issue', event.target.value)}
              rows={3}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            ETA (optional)
            <input
              value={form.eta || ''}
              onChange={(event) => update('eta', event.target.value)}
              placeholder="Dec 12"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Check className="h-4 w-4" />
            Save
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

const CheckActionModal = ({ asset, mode, onSubmit, onCancel, suggestionListId, defaultUser = '' }) => {
  const [form, setForm] = useState({
    user: defaultUser || asset?.assignedTo || '',
    notes: '',
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    setForm({
      user: defaultUser || asset?.assignedTo || '',
      notes: '',
      date: new Date().toISOString().slice(0, 10),
    });
  }, [asset, mode, defaultUser]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      assetId: asset.id,
      mode,
      user: form.user || 'Unassigned',
      notes: form.notes,
      date: form.date,
    });
  };

  return (
    <ModalShell title={mode === 'checkout' ? 'Check out asset' : 'Check in asset'} onClose={onCancel}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-slate-900">{asset.assetName}</p>
          <p className="text-xs text-slate-500">{asset.model}</p>
          <p className="text-xs text-slate-400">{asset.serialNumber}</p>
        </div>
        <label className="text-sm font-medium text-slate-700">
          User
          <input
            value={form.user}
            onChange={(event) => update('user', event.target.value)}
            list={suggestionListId}
            placeholder="Person receiving the asset"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Date
          <input
            type="date"
            value={form.date}
            onChange={(event) => update('date', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Notes
          <textarea
            rows={3}
            value={form.notes}
            onChange={(event) => update('notes', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowRightLeft className="h-4 w-4" />
            {mode === 'checkout' ? 'Check out' : 'Check in'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

const EmployeeFormModal = ({
  employee,
  onSubmit,
  onCancel,
  departmentSuggestionListId,
  locationSuggestionListId,
  modelSuggestionListId,
  employeeSuggestionListId,
  jobTitleSuggestionListId,
  departmentSuggestionOptions,
  locationSuggestionOptions,
  jobTitleSuggestionOptions,
}) => {
  const [form, setForm] = useState(employee || defaultEmployeeProfile);
  const [photoPreview, setPhotoPreview] = useState(employee?.avatar || '');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const tempPhotoUrlRef = useRef(null);

  useEffect(() => {
    if (tempPhotoUrlRef.current) {
      URL.revokeObjectURL(tempPhotoUrlRef.current);
      tempPhotoUrlRef.current = null;
    }
    setForm(employee || defaultEmployeeProfile);
    setPhotoPreview(employee?.avatar || '');
    setPhotoError('');
    setUploadingPhoto(false);
  }, [employee]);
  useEffect(
    () => () => {
      if (tempPhotoUrlRef.current) {
        URL.revokeObjectURL(tempPhotoUrlRef.current);
        tempPhotoUrlRef.current = null;
      }
    },
    [],
  );

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (tempPhotoUrlRef.current) {
      URL.revokeObjectURL(tempPhotoUrlRef.current);
      tempPhotoUrlRef.current = null;
    }
    const objectUrl = URL.createObjectURL(file);
    tempPhotoUrlRef.current = objectUrl;
    setPhotoPreview(objectUrl);
    setPhotoError('');
    setUploadingPhoto(true);
    try {
      const uploadedUrl = await uploadEmployeePhoto(file);
      if (tempPhotoUrlRef.current) {
        URL.revokeObjectURL(tempPhotoUrlRef.current);
        tempPhotoUrlRef.current = null;
      }
      if (uploadedUrl) {
        setPhotoPreview(uploadedUrl);
        setForm((prev) => ({ ...prev, avatar: uploadedUrl }));
      } else {
        setPhotoError('Upload did not return a URL.');
      }
    } catch (error) {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        if (tempPhotoUrlRef.current) {
          URL.revokeObjectURL(tempPhotoUrlRef.current);
          tempPhotoUrlRef.current = null;
        }
        setPhotoPreview(dataUrl);
        setForm((prev) => ({ ...prev, avatar: dataUrl }));
        setPhotoError(
          `${error?.message || 'Photo upload failed.'} Saved a local copy until the storage bucket is reachable.`,
        );
      } catch (readError) {
        console.error('Photo upload failed and fallback read failed', readError);
        setPhotoError(error?.message || 'Photo upload failed.');
      }
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    if (tempPhotoUrlRef.current) {
      URL.revokeObjectURL(tempPhotoUrlRef.current);
      tempPhotoUrlRef.current = null;
    }
    setPhotoPreview('');
    setForm((prev) => ({ ...prev, avatar: '' }));
    setPhotoError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (uploadingPhoto) {
      setPhotoError('Please wait for the photo upload to finish.');
      return;
    }
    const trimmedName = form.name.trim();
    if (!trimmedName) {
      return;
    }
    const normalizedName = normalizeKey(trimmedName);
    const originalName = employee?.name || '';
    const normalizedOriginal = normalizeKey(originalName);
    const shouldRefreshLookup = !employee?.id || normalizedOriginal !== normalizedName;
    const persistedLookup = employee?.lookupKey || form.lookupKey || '';
    const lookupKey = shouldRefreshLookup ? normalizedName : persistedLookup || normalizedName;
    const avatar = form.avatar || photoPreview || '';
    onSubmit({ ...form, name: trimmedName, avatar, lookupKey });
  };

  return (
    <ModalShell title={form?.id ? 'Edit employee' : 'New employee'} onClose={onCancel}>
      <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Full name
            <input
              value={form.name}
              onChange={(event) => update('name', event.target.value)}
              placeholder="e.g., Jamie Rivera"
              list={employeeSuggestionListId}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Role or title
            <input
              value={form.title}
              onChange={(event) => update('title', event.target.value)}
              list={jobTitleSuggestionListId}
              placeholder="Select or type a role..."
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Department
            <select
              value={form.department}
              onChange={(event) => update('department', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select a department...</option>
              {departmentSuggestionOptions.map((dept) => (
                <option key={`dept-option-${dept}`} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Location
            <select
              value={form.location}
              onChange={(event) => update('location', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select a location...</option>
              {locationSuggestionOptions.map((location) => (
                <option key={`location-option-${location}`} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => update('email', event.target.value)}
              placeholder="name@udservices.org"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Start date
            <input
              type="date"
              value={form.startDate}
              onChange={(event) => update('startDate', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Phone
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => update('phone', event.target.value)}
              placeholder="(717) 555-1212"
              autoComplete="tel"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Laptop / computer
            <input
              value={form.computer}
              onChange={(event) => update('computer', event.target.value)}
              name="employee-computer"
              autoComplete="new-password"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Printer
            <input
              value={form.printer}
              onChange={(event) => update('printer', event.target.value)}
              name="employee-printer"
              autoComplete="new-password"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Monitor
            <input
              value={form.monitor}
              onChange={(event) => update('monitor', event.target.value)}
              name="employee-monitor"
              autoComplete="new-password"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Dock
            <input
              value={form.dock}
              onChange={(event) => update('dock', event.target.value)}
              name="employee-dock"
              autoComplete="new-password"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </div>
        <div className="rounded-3xl border border-dashed border-slate-300 p-4 text-center">
          <p className="text-sm font-semibold text-slate-700">Profile photo</p>
          <p className="text-xs text-slate-500">Upload a headshot now or update it later.</p>
          <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
              {photoPreview ? (
                <img src={photoPreview} alt="Employee preview" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  {getInitials(form.name || 'UDS')}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col items-center gap-3 sm:items-start">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:border-blue-300">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                />
                {uploadingPhoto ? 'Uploading...' : 'Upload photo'}
              </label>
              {photoPreview && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="text-xs font-semibold status-alert-muted hover:opacity-80"
                  disabled={uploadingPhoto}
                >
                  Remove photo
                </button>
              )}
              {photoError && <p className="text-xs status-alert-muted">{photoError}</p>}
              {!photoError && uploadingPhoto && <p className="text-xs text-slate-500">Uploading to secure storage...</p>}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploadingPhoto}
            className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {form?.id ? 'Save changes' : 'Add employee'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};
const WarrantyAlertModal = ({ alerts = [], onClose, onClear, onClearAll }) => {
  const canClear = typeof onClear === 'function';
  const handleClearAll = () => {
    if (!alerts.length) {
      return;
    }
    if (typeof onClearAll === 'function') {
      onClearAll(alerts);
      return;
    }
    if (canClear) {
      alerts.forEach((alert) => onClear(alert));
    }
  };

  return (
    <ModalShell title="Warranty alerts" onClose={onClose}>
      {alerts.length === 0 ? (
        <p className="text-sm text-slate-500">All tracked hardware is within its warranty window.</p>
      ) : (
        <>
          {canClear && (
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={handleClearAll}
                className="rounded-2xl border border-amber-200 bg-white px-4 py-1.5 text-xs font-semibold status-warning transition hover:border-amber-300 hover:text-amber-900"
              >
                Clear all alerts
              </button>
            </div>
          )}
          <div className="max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-100">
            <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Asset</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Warranty ends</th>
                  <th className="px-4 py-3">Status</th>
                  {canClear && <th className="px-4 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {alerts.map((alert) => {
                  const statusLabel = alert.overdue
                    ? `${Math.abs(alert.daysRemaining)} days overdue`
                    : `In ${alert.daysRemaining} days`;
                  return (
                    <tr key={`warranty-${alert.assetId}-${alert.warrantyExpiry || 'none'}`}>
                      <td className="px-4 py-3 align-top">
                        <p className="font-semibold text-slate-900">{alert.assetName}</p>
                        <p className="text-xs text-slate-500">{alert.model}</p>
                      </td>
                      <td className="px-4 py-3 align-top text-slate-600">{alert.assignedTo}</td>
                      <td className="px-4 py-3 align-top text-slate-600">{alert.location}</td>
                      <td className="px-4 py-3 align-top">
                        {alert.warrantyExpiry ? formatDate(alert.warrantyExpiry) : 'Not set'}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span className={`text-sm font-semibold ${alert.overdue ? 'status-alert-muted' : 'status-warning-muted'}`}>{statusLabel}</span>
                      </td>
                      {canClear && (
                        <td className="px-4 py-3 align-top text-right">
                          <button
                            type="button"
                            onClick={() => onClear(alert)}
                            className="rounded-full px-3 py-1 text-xs font-semibold status-warning transition hover:opacity-80"
                          >
                            Clear
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </ModalShell>
  );
};

// HelpDesk Portal Helper Functions
const buildAiReply = (text) => {
  const input = text.toLowerCase();
  if (input.includes('password')) {
    return 'Got it. For password resets: open the UDS self-service reset page, choose "I forgot my password", and approve the Duo prompt. If you cannot receive Duo, reply with "no mfa" and I will route to IT with urgency.';
  }
  if (input.includes('vpn')) {
    return 'Let\'s steady the VPN. Confirm you\'re on UDS-Secure or wired, then open GlobalProtect and select the "UDS-Gateway". If disconnects continue, include the exact time and I will open a ticket with logs.';
  }
  if (input.includes('laptop') || input.includes('hardware')) {
    return 'I can start a laptop request. Share who it\'s for, needed-by date, and whether you need a dock/monitors. I will summarize and send to IT to stage hardware.';
  }
  if (input.includes('printer')) {
    return 'For printing issues: share the printer ID and location, and a photo of the error panel if possible. I\'ll package this for the Help Desk.';
  }
  return 'I\'ll help route this. Please add details like device type, urgency, and where you\'re working (onsite/remote). I can also draft a ticket for IT.';
};

const App = () => {
  const [assets, setAssets] = usePersistentState(STORAGE_KEYS.assets, BASE_ASSETS);
  const [history, setHistory] = usePersistentState(STORAGE_KEYS.history, BASE_HISTORY, { remote: false });
  const historyRef = useRef(history);
  useEffect(() => {
    historyRef.current = history;
  }, [history]);
  const historyHydratedRef = useRef(false);
  useEffect(() => {
    if (!API_STORAGE_BASE || historyHydratedRef.current) {
      return;
    }
    let cancelled = false;
    const hydrateHistoryFromBlob = async () => {
      try {
        const remoteValue = await fetchRemoteStorage(STORAGE_KEYS.history);
        if (cancelled) {
          return;
        }
        if (Array.isArray(remoteValue) && remoteValue.length > 0) {
          historyHydratedRef.current = true;
          setHistory((prev) => {
            const prevSnapshot = safeStringify(prev);
            const remoteSnapshot = safeStringify(remoteValue);
            if (prevSnapshot === remoteSnapshot) {
              return prev;
            }
            console.log('[Sync] history: hydrated from blob storage');
            return remoteValue;
          });
        } else {
          historyHydratedRef.current = true;
          persistRemoteStorage(STORAGE_KEYS.history, historyRef.current);
        }
      } catch (error) {
        console.warn('[Sync] history: failed to hydrate from blob storage', error);
      }
    };
    hydrateHistoryFromBlob();
    return () => {
      cancelled = true;
    };
  }, [setHistory]);
  const historyPersistSnapshotRef = useRef('');
  useEffect(() => {
    if (!API_STORAGE_BASE) {
      return;
    }
    const snapshot = safeStringify(history);
    if (!snapshot || snapshot === historyPersistSnapshotRef.current) {
      return;
    }
    historyPersistSnapshotRef.current = snapshot;
    persistRemoteStorage(STORAGE_KEYS.history, history);
  }, [history]);
  const [softwareSuites, setSoftwareSuites] = usePersistentState(STORAGE_KEYS.licenses, BASE_LICENSES);
  const [repairTickets, setRepairTickets] = usePersistentState(STORAGE_KEYS.laptopRepairs, []);
  const assetCount = Array.isArray(assets) ? assets.length : 0;
  const [isMobile, setIsMobile] = useState(false);
  const [clearedWarrantyAlerts, setClearedWarrantyAlerts] = usePersistentState(
    STORAGE_KEYS.clearedWarrantyAlerts,
    [],
  );
  const [clearedMaintenanceAlerts, setClearedMaintenanceAlerts] = usePersistentState(
    STORAGE_KEYS.clearedMaintenanceAlerts,
    [],
  );
  const [activePage, setActivePage] = useState('Overview');
  const reminderPrefs = useMemo(() => ({ email: true, zoom: true }), []);
  const [softwareForm, setSoftwareForm] = useState(null);
  const [warrantyModalOpen, setWarrantyModalOpen] = useState(false);
  const [laptopRefreshDate, setLaptopRefreshDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const sentWarrantyAlertRef = useRef(new Set());
  
  // HelpDesk Portal State
  const [helpdeskRequests, setHelpdeskRequests] = useState(() => loadStoredRequests());
  const [helpdeskFormAlert, setHelpdeskFormAlert] = useState(null);
  const [helpdeskIsSubmitting, setHelpdeskIsSubmitting] = useState(false);
  const [helpdeskForm, setHelpdeskForm] = useState({
    name: '',
    email: '',
    department: '',
    topic: '',
    urgency: 'Normal',
    details: '',
  });
  const [helpdeskChatMessages, setHelpdeskChatMessages] = useState(() => loadStoredChatMessages());
  const [helpdeskChatInput, setHelpdeskChatInput] = useState('');
  const [helpdeskBotTyping, setHelpdeskBotTyping] = useState(false);
  const helpdeskTypingTimeoutRef = useRef(null);
  
  const apiBaseUrl = resolveApiBaseUrl();
  const buildApiUrl = useCallback(
    (path) => {
      if (!apiBaseUrl) return path;
      // Avoid double /api when the base already includes /api
      const normalizedPath =
        apiBaseUrl.endsWith('/api') && path.startsWith('/api') ? path.replace(/^\/api/, '') : path;
      return `${apiBaseUrl}${normalizedPath}`;
    },
    [apiBaseUrl],
  );
  useEffect(() => {
    // Ensure newly added suites exist and drop legacy entries (e.g., old ABM Facilities card).
    setSoftwareSuites((prev) => {
      const filtered = prev.filter(
        (suite) =>
          suite.id !== 'abm' &&
          suite.software?.toLowerCase() !== 'abm facilities',
      );
      const byId = new Map(filtered.map((suite) => [suite.id, suite]));
      let changed = false;
      SOFTWARE_PORTFOLIO.forEach((suite) => {
        if (!byId.has(suite.id)) {
          byId.set(suite.id, suite);
          changed = true;
        }
      });
      const next = Array.from(byId.values());
      return changed || next.length !== prev.length ? next : prev;
    });
  }, [setSoftwareSuites]);
  useEffect(() => {
    setAssets((prev) => {
      const canonicalMap = buildCanonicalMap(prev);
      let changed = false;
      const normalized = prev.map((asset) => {
        const statusAdjusted = normalizeAssetStatus(asset);
        const defaultTypeCost = DEVICE_COST_BY_TYPE[statusAdjusted.type] || DEFAULT_DEVICE_COST;
        const existingCost = Number(statusAdjusted.cost || 0);
        const needsCostUpdate = !existingCost || Math.abs(existingCost - defaultTypeCost) < 1;
        if (!needsCostUpdate) {
          let nextAsset = statusAdjusted;
        const canonicalName = getCanonicalAssetName(statusAdjusted, canonicalMap);
          const typeKey = (statusAdjusted.type || '').toLowerCase();
          if (canonicalName && canonicalName !== statusAdjusted.assetName) {
            changed = true;
            nextAsset = {
              ...statusAdjusted,
              assetName: canonicalName,
              deviceName: canonicalName,
              sheetId: statusAdjusted.sheetId || canonicalName,
            };
          } else if (!canonicalName && typeKey === 'phone') {
            const phoneLabel =
              statusAdjusted.assetName ||
              statusAdjusted.deviceName ||
              statusAdjusted.serialNumber ||
              statusAdjusted.sheetId;
            if (phoneLabel && phoneLabel !== statusAdjusted.assetName) {
              changed = true;
              nextAsset = { ...statusAdjusted, assetName: phoneLabel, deviceName: phoneLabel };
            }
          } else if (statusAdjusted !== asset) {
            changed = true;
          }
          return nextAsset;
        }
        const inferredModel = statusAdjusted.model || `${statusAdjusted.brand || ''}`;
        const refreshedCost = estimateCost(statusAdjusted.type, inferredModel, statusAdjusted.brand);
        if (!refreshedCost || Math.abs(refreshedCost - existingCost) < 1) {
          let nextAsset = statusAdjusted;
          const canonicalName = getCanonicalAssetName(statusAdjusted, canonicalMap);
          if (canonicalName && canonicalName !== statusAdjusted.assetName) {
            changed = true;
            nextAsset = {
              ...statusAdjusted,
              assetName: canonicalName,
              deviceName: canonicalName,
              sheetId: statusAdjusted.sheetId || canonicalName,
            };
          } else if (statusAdjusted !== asset) {
            changed = true;
          }
          return nextAsset;
        }
        changed = true;
        const adjustedAsset = { ...statusAdjusted, cost: refreshedCost };
        const canonicalName = getCanonicalAssetName(adjustedAsset, canonicalMap);
        if (canonicalName && canonicalName !== adjustedAsset.assetName) {
          return {
            ...adjustedAsset,
            assetName: canonicalName,
            deviceName: canonicalName,
            sheetId: adjustedAsset.sheetId || canonicalName,
          };
        }
        return adjustedAsset;
      });
      return changed ? normalized : prev;
    });
  }, [setAssets]);

  const maintenanceRecordsRaw = useMemo(() => buildMaintenanceFromAssets(assets), [assets]);
  const clearedMaintenanceAlertSet = useMemo(() => new Set(clearedMaintenanceAlerts), [clearedMaintenanceAlerts]);
  const maintenanceRecords = useMemo(
    () =>
      maintenanceRecordsRaw.filter(
        (entry) => !clearedMaintenanceAlertSet.has(buildMaintenanceAlertKey(entry)),
      ),
    [clearedMaintenanceAlertSet, maintenanceRecordsRaw],
  );
  const sheetInsights = useMemo(() => computeSheetInsights(assets), [assets]);
  const vendorProfiles = useMemo(() => buildVendorProfiles(assets), [assets]);
const [networkPrinters, setNetworkPrinters] = useState(() =>
  NETWORK_PRINTERS.map((printer, index) => ({ id: printer.id ?? index + 1, ...printer })),
);
const patchNetworkPrinter = useCallback(
  (printerId, patch) => {
    if (!printerId) return;
    setNetworkPrinters((prev) =>
      prev.map((printer) => (printer.id === printerId ? { ...printer, ...patch } : printer)),
    );
  },
  [setNetworkPrinters],
);
  const printerVendors = useMemo(
    () =>
      Object.values(PRINTER_VENDOR_DIRECTORY).map((vendor) => {
        const devices = networkPrinters.filter((printer) => printer.vendor === vendor.id);
        return { ...vendor, deviceCount: devices.length, devices };
      }),
    [networkPrinters],
  );
  const printerCoverageStats = useMemo(() => {
    const brandEntries = [
      { brand: 'Canon', title: 'Canon copiers', note: 'Colony Products support' },
      { brand: 'HP', title: 'HP printers', note: 'Weaver Associates support' },
      { brand: 'Epson', title: 'Epson printers', note: 'Weaver Associates support' },
      { brand: 'Lexmark', title: 'Lexmark printers', note: 'Weaver Associates support' },
    ].map((entry) => ({
      ...entry,
      count: NETWORK_PRINTER_BRAND_TOTALS[entry.brand] || 0,
    }));
    const verizonCount = vendorProfiles.find((vendor) => vendor.id === 'verizon')?.assetCount || 0;
    const dellComputerCount =
      vendorProfiles.find((vendor) => vendor.id === 'dell')?.assetCount || 0;
    return [
      ...brandEntries,
      { title: 'Dell computers', count: dellComputerCount, note: 'Laptop and desktop fleet' },
      { title: 'Verizon lines', count: verizonCount, note: 'Active smartphones' },
    ];
  }, [vendorProfiles]);
  const printerRepairTickets = useMemo(() => {
    const printerLookup = new Map(
      networkPrinters.map((printer) => [
        normalizeKey(`${printer.deviceType || 'Printer'} @ ${printer.location || 'Unknown'}`),
        printer,
      ]),
    );
    const keywords = ['printer', 'copier', 'canon', 'hp', 'brother', 'lexmark', 'epson', 'toner'];
    return repairTickets
      .filter((ticket) => {
        const normalizedId = normalizeKey(ticket.assetId || '');
        if (printerLookup.has(normalizedId)) return true;
        const haystack = `${ticket.assetId || ''} ${ticket.model || ''} ${ticket.issue || ''}`.toLowerCase();
        return keywords.some((keyword) => haystack.includes(keyword));
      })
      .map((ticket) => {
        const normalizedId = normalizeKey(ticket.assetId || '');
        const printer = printerLookup.get(normalizedId);
        const vendorId = printer?.vendor || '';
        const vendorName =
          vendorId === 'colony'
            ? 'Colony Products'
            : vendorId === 'weaver'
              ? 'Weaver Associates'
              : (ticket.assignedTo || '').trim();
        const vendorBadge =
          vendorId === 'colony'
            ? 'tone-chip tone-alert'
            : vendorId === 'weaver'
              ? 'tone-chip tone-success'
              : 'tone-chip tone-neutral';
        return {
          ...ticket,
          printerLabel: printer
            ? `${printer.deviceType || 'Printer'} @ ${printer.location || 'Unknown'}`
            : ticket.assetId || 'Printer or Copier',
          vendorBadge,
          vendorName: vendorName || 'Unassigned',
          brand: printer?.model || ticket.model || '',
        };
      });
  }, [networkPrinters, repairTickets]);
  const [employeeGallery, setEmployeeGallery] = usePersistentState(STORAGE_KEYS.employees, BASE_EMPLOYEE_GALLERY);
  useEffect(() => {
    const loadOrgChart = async () => {
      try {
        const fileName = encodeURIComponent('Org Chart and HUB 12-25.xlsx');
        // Try both folder casings to avoid 404s on case-sensitive hosts.
        const orgChartUrls = [
          `${PUBLIC_URL}/tables/${fileName}`,
          `${PUBLIC_URL}/Tables/${fileName}`,
          `/tables/${fileName}`,
          `/Tables/${fileName}`,
        ];
        let response = null;
        for (const url of orgChartUrls) {
          const attempt = await fetch(url);
          if (isSpreadsheetResponse(attempt)) {
            response = attempt;
            break;
          }
          const contentType = (attempt.headers.get('content-type') || '').toLowerCase();
          if (attempt.ok) {
            console.warn('Org chart fetch returned non-spreadsheet content for', url, contentType);
          }
        }
        if (!response?.ok) return;
        const buffer = await response.arrayBuffer();
        XLSX.read(buffer, { type: 'array' });
        // Org chart parsing is performed in the dedicated supervisor loader effect; skip parsing rows here to avoid an unused variable.
        // Removed unused supervisorMap to avoid lint warnings; supervisor data is handled in the dedicated supervisor loader effect below.

      } catch (error) {
        console.warn('Org chart fetch failed', error);
      }
    };
    loadOrgChart();
    return () => {};
  }, [setEmployeeGallery]);
  useEffect(() => {
    if (keyFobNormalizedRef.current) {
      return;
    }
    const updated = assets.map((asset) => ensureKeyFobModel(asset));
    const changed = updated.some((asset, index) => asset !== assets[index]);
    if (changed) {
      setAssets(updated);
    }
    keyFobNormalizedRef.current = true;
  }, [assets, setAssets]);
  const employeeDepartmentCount = useMemo(() => new Set(employeeGallery.map((member) => member.department)).size, [employeeGallery]);
  const clearedWarrantyAlertSet = useMemo(() => new Set(clearedWarrantyAlerts), [clearedWarrantyAlerts]);
  const rawLifecycleReminders = useMemo(() => computeLifecycleReminders(assets), [assets]);
  const lifecycleReminders = useMemo(
    () =>
      rawLifecycleReminders.filter(
        (item) =>
          // Drop cleared alerts and skip overdue warranty items on initial load.
          (item.type !== 'Warranty' || !clearedWarrantyAlertSet.has(buildWarrantyAlertKey(item))) &&
          (item.type !== 'Service' || !clearedMaintenanceAlertSet.has(buildMaintenanceAlertKey(item))) &&
          !(item.type === 'Warranty' && item.overdue),
      ),
    [clearedMaintenanceAlertSet, clearedWarrantyAlertSet, rawLifecycleReminders],
  );
  const warrantyReminders = useMemo(
    () => lifecycleReminders.filter((item) => item.type === 'Warranty'),
    [lifecycleReminders],
  );
  const warrantyAlerts30 = useMemo(
    () => warrantyReminders.filter((item) => !item.overdue && item.daysRemaining >= 0 && item.daysRemaining <= 30),
    [warrantyReminders],
  );
  const maintenanceWorkOrders = useMemo(() => buildMaintenanceWorkOrders(assets, repairTickets), [assets, repairTickets]);
  const laptopServiceSummary = useMemo(
    () => computeLaptopServiceSummary(assets, maintenanceWorkOrders, repairTickets),
    [assets, maintenanceWorkOrders, repairTickets],
  );
  const laptopRefreshReport = useMemo(
    () => computeLaptopRefreshReport(assets, laptopRefreshDate),
    [assets, laptopRefreshDate],
  );
  const accessibilityDesignerCount = useMemo(
    () =>
      employeeGallery.filter((member) => normalizeKey(member.title || '') === 'accessibilitydesigner').length,
    [employeeGallery],
  );
  const licenseBuckets = useMemo(
    () =>
      softwareSuites.map((suite) => {
        const vendorKey = normalizeKey(suite.vendor || '');
        const softwareKey = normalizeKey((suite.software || '').replace(/[^a-z0-9]+/gi, ''));
        const logo =
          suite.logo ||
          SOFTWARE_LOGOS[suite.id] ||
          SOFTWARE_LOGOS[vendorKey] ||
          SOFTWARE_LOGOS[softwareKey] ||
          '';
        const used =
          suite.id === 'autocad'
            ? Math.max(suite.used || 0, accessibilityDesignerCount)
            : suite.used;
        return { ...suite, logo, used };
      }),
    [softwareSuites, accessibilityDesignerCount],
  );
  const licenseCompliance = useMemo(
    () =>
      licenseBuckets.map((license) => {
        const { delta, status } = getLicenseHealth(license.seats, license.used);
        return { ...license, delta, status };
      }),
    [licenseBuckets],
  );
  const sortedLicenseBuckets = useMemo(
    () => [...licenseBuckets].sort((a, b) => a.software.localeCompare(b.software)),
    [licenseBuckets],
  );
  const softwareAtRisk = useMemo(
    () => licenseCompliance.filter((item) => item.status !== 'Healthy'),
    [licenseCompliance],
  );
  const adminPortalTiles = useMemo(() => {
    const suiteMap = new Map();
    licenseBuckets.forEach((suite) => suiteMap.set(suite.id, suite));
    const formatLabel = (value) =>
      value
        .replace(/-/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    const tiles = Object.entries(SOFTWARE_ADMIN_PORTALS).map(([id, portal]) => {
      const primaryId = SOFTWARE_LOGO_KEYS[id] || id;
      const suite = suiteMap.get(primaryId) || suiteMap.get(id) || SOFTWARE_PORTFOLIO.find((item) => item.id === primaryId) || SOFTWARE_PORTFOLIO.find((item) => item.id === id);
      const label = suite?.software || formatLabel(primaryId);
      const logoKey = SOFTWARE_LOGO_KEYS[primaryId] || primaryId;
      const logo = suite?.logo || SOFTWARE_LOGOS[logoKey];
      return { id: primaryId, label, logo, portal };
    });
    // Deduplicate by primary id so aliases (e.g., Automate) render once, then sort alphabetically.
    const unique = new Map();
    tiles.forEach((tile) => {
      if (!unique.has(tile.id)) {
        unique.set(tile.id, tile);
      }
    });
    return Array.from(unique.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [licenseBuckets]);
  const softwareRenewalAlerts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return SOFTWARE_PORTFOLIO.map((software) => {
      const renewalDate = new Date(software.renewal);
      renewalDate.setHours(0, 0, 0, 0);
      const daysUntilRenewal = Math.ceil((renewalDate - today) / (1000 * 60 * 60 * 24));
      const monthsUntilRenewal = Math.floor(daysUntilRenewal / 30);
      
      let status = 'upcoming';
      let priority = 'low';
      
      if (daysUntilRenewal < 0) {
        status = 'overdue';
        priority = 'critical';
      } else if (daysUntilRenewal <= 30) {
        status = 'due-soon';
        priority = 'high';
      } else if (daysUntilRenewal <= 60) {
        status = 'approaching';
        priority = 'medium';
      } else if (daysUntilRenewal <= 90) {
        status = 'upcoming';
        priority = 'medium';
      }
      
      return {
        ...software,
        renewalDate: software.renewal,
        daysUntilRenewal,
        monthsUntilRenewal,
        status,
        priority,
        annualCost: software.seats * software.costPerSeat * 12,
      };
    }).sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal);
  }, []);
  
  const softwareRenewalsDue90Days = useMemo(
    () => softwareRenewalAlerts.filter((s) => s.daysUntilRenewal <= 90 && s.daysUntilRenewal >= 0),
    [softwareRenewalAlerts]
  );
  
  const softwareRenewalsOverdue = useMemo(
    () => softwareRenewalAlerts.filter((s) => s.daysUntilRenewal < 0),
    [softwareRenewalAlerts]
  );
  
  const softwareVendorCount = useMemo(
    () => new Set(licenseBuckets.map((license) => license.vendor)).size,
    [licenseBuckets],
  );
  const costByDepartment = useMemo(() => {
    const totals = assets.reduce((acc, asset) => {
      acc[asset.department] = (acc[asset.department] || 0) + Number(asset.cost || 0);
      return acc;
    }, {});
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, [assets]);
  const depreciationTrend = useMemo(() => {
    const horizon = 6;
    const now = new Date();
    return Array.from({ length: horizon }).map((_, index) => {
      const temp = new Date(now);
      temp.setMonth(now.getMonth() - (horizon - 1 - index));
      const monthLabel = temp.toLocaleString('default', { month: 'short' });
      const value = assets.reduce((sum, asset) => sum + getAssetValueAtDate(asset, temp), 0);
      return { month: monthLabel, value };
    });
  }, [assets]);
  const depreciationForecast = useMemo(() => computeDepreciationForecast(assets, 3), [assets]);
  const vendorTotals = useMemo(
    () =>
      vendorProfiles.reduce(
        (acc, vendor) => {
          acc.devices += vendor.assetCount;
          acc.active += vendor.activeCount;
          acc.maintenance += vendor.maintenanceCount;
          return acc;
        },
        { devices: 0, active: 0, maintenance: 0 },
      ),
    [vendorProfiles],
  );
  const hardwareSpotlights = useMemo(() => {
    const counts = sheetInsights.counts || {};
    const formatLabel = (count = 0, noun) => `${count} ${count === 1 ? noun : `${noun}s`}`;

    return [
      {
        title: 'Computers',
        stats: [{ label: formatLabel(counts.Computer || 0, 'computer'), type: 'Computer' }],
        description: 'Laptops and desktops.',
        image: MEDIA.devices.computer,
        meta: 'Hardware pulse',
      },
      {
        title: 'Displays',
        stats: [{ label: formatLabel(counts.Monitor || 0, 'display'), type: 'Monitor' }],
        description: 'Monitors for desks and conference rooms.',
        image: MEDIA.devices.monitor,
        meta: 'Peripherals',
      },
      {
        title: 'Docking Stations',
        stats: [{ label: formatLabel(counts.Dock || 0, 'dock'), type: 'Dock' }],
        description: 'Docking stations for workstations.',
        image: MEDIA.devices.dock,
        meta: 'Workspace',
      },
      {
        title: 'Printers',
        stats: [{ label: formatLabel(counts.Printer || 0, 'printer'), type: 'Printer' }],
        description: 'Printers and multifunction devices.',
        image: MEDIA.devices.printer,
        meta: 'Facilities',
      },
      {
        title: 'Phones',
        stats: [{ label: formatLabel(counts.Phone || 0, 'phone'), type: 'Phone' }],
        description: 'Phones and tablets.',
        image: MEDIA.devices.phone,
        meta: 'Mobility',
      },
      {
        title: 'KeyFobs',
        stats: [{ label: formatLabel(counts['Key Fob'] || 0, 'key fob'), type: 'Key Fob' }],
        description: 'Badges and door fobs.',
        image: MEDIA.devices.keyfob,
        meta: 'Security',
      },
    ];
  }, [sheetInsights]);

  const defaultAssetFilters = useMemo(
    () => ({ search: '', type: 'all', status: 'all', hideRetired: true, readiness: 'all' }),
    [],
  );
  const [filters, setFilters] = useState(() => {
    if (typeof window === 'undefined') {
      return { ...defaultAssetFilters };
    }
    try {
      const saved = window.localStorage.getItem(FILTERS_STORAGE_KEY);
      if (!saved) return { ...defaultAssetFilters };
      const parsed = JSON.parse(saved);
      return { ...defaultAssetFilters, ...parsed };
    } catch {
      return { ...defaultAssetFilters };
    }
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
    } catch {
      // ignore storage errors
    }
  }, [filters, defaultAssetFilters]);
  const [assetPage, setAssetPage] = useState(1);
  const [assetForm, setAssetForm] = useState(null);
  const [actionState, setActionState] = useState(null);
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [flashMessage, setFlashMessage] = useState('');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [employeeFilters, setEmployeeFilters] = useState({ department: 'all', location: 'all', jobTitle: 'all' });
  const isSpreadsheetResponse = (response) => {
    const type = (response.headers.get('content-type') || '').toLowerCase();
    if (!response.ok) return false;
    if (type.includes('html')) return false;
    return (
      type.includes('spreadsheetml') ||
      type.includes('application/vnd.ms-excel') ||
      type.includes('application/octet-stream')
    );
  };
  const [employeePage, setEmployeePage] = useState(1);
  const [employeeForm, setEmployeeForm] = useState(null);
  const [expandedEmployeeId, setExpandedEmployeeId] = useState(null);
  const [printerForm, setPrinterForm] = useState(null);
  const [assetSort, setAssetSort] = useState({ key: 'assetName', direction: 'asc' });
  const [assetPageSize, setAssetPageSize] = useState(() => {
    if (typeof window === 'undefined') {
      return 15;
    }
    const saved = Number(window.localStorage.getItem('uds_asset_page_size'));
    return Number.isFinite(saved) && saved > 0 ? saved : 15;
  });
  const [qrInput, setQrInput] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [scannerActive, setScannerActive] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [manualScanInput, setManualScanInput] = useState('');
  const [scanMessage, setScanMessage] = useState('');
  const [scannerError, setScannerError] = useState('');
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }
    const saved = window.localStorage.getItem('uds_theme_dark');
    if (saved === null) {
      return true;
    }
    return saved === 'true';
  });
  const pageAccent = useMemo(() => PAGE_ACCENTS[activePage] || PAGE_ACCENTS.default, [activePage]);
  const heroAccentStyle = useMemo(
    () => ({
      borderColor: isDarkMode ? `${pageAccent.to}55` : `${pageAccent.to}80`,
      boxShadow: `0 24px 80px ${pageAccent.to}33`,
    }),
    [isDarkMode, pageAccent],
  );
  const heroHeadingClass = isDarkMode ? 'text-white' : 'text-slate-900';
  const heroSubtextClass = isDarkMode ? 'text-white/80' : 'text-slate-600';
  const heroLabelClass = isDarkMode ? 'text-white/70' : 'text-slate-500';
  const heroChipClass = isDarkMode
    ? 'border border-white/20 bg-white/10 text-white'
    : 'border border-slate-200 bg-white text-slate-800 shadow-sm';
  const heroPanelClass = isDarkMode
    ? 'border border-white/15 bg-white/5 text-white'
    : 'border border-slate-200 bg-white text-slate-800 shadow-sm';
  const heroStatCardClass = isDarkMode
    ? 'border border-white/15 bg-white/10 text-white'
    : 'border border-slate-200 bg-white text-slate-800 shadow-sm';
  const videoRef = useRef(null);
  const fallbackCanvasRef = useRef(null);
  const multiFormatReaderRef = useRef(null);
  const scanLoopRef = useRef(null);
  const streamRef = useRef(null);
  const lastScanTsRef = useRef(0);
  const keyFobNormalizedRef = useRef(false);
  const phoneMergeRef = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const employeeSuggestionListId = 'employee-name-suggestions';
  const modelSuggestionListId = 'asset-model-suggestions';
  const departmentSuggestionListId = 'asset-department-suggestions';
  const locationSuggestionListId = 'asset-location-suggestions';
  const jobTitleSuggestionListId = 'job-title-suggestions';
  const resetMultiFormatReader = () => {
    const reader = multiFormatReaderRef.current;
    if (reader && typeof reader.reset === 'function') {
      reader.reset();
    }
    multiFormatReaderRef.current = null;
  };
  useEffect(() => {
    let cancelled = false;
    const loadAssetsFromWorkbook = async () => {
      const hasExistingAssets = (() => {
        if (assetCount > 0) {
          return true;
        }
        if (typeof window === 'undefined') {
          return false;
        }
        try {
          const saved = window.localStorage.getItem(STORAGE_KEYS.assets);
          const parsed = JSON.parse(saved || 'null');
          return Array.isArray(parsed) && parsed.length > 0;
        } catch {
          return false;
        }
      })();
      if (hasExistingAssets) {
        return;
      }
      try {
        const assetSources = [
          EXCEL_EXPORTS.assets,
          `${PUBLIC_URL}/tables/IT Computers 12-23-25.xlsx`,
          `${PUBLIC_URL}/tables/IT%20Computers%2012-23-25.xlsx`,
          '/tables/IT Computers 12-23-25.xlsx',
          '/tables/IT%20Computers%2012-23-25.xlsx',
          `${PUBLIC_URL}/Tables/IT Computers 12-23-25.xlsx`,
          `${PUBLIC_URL}/Tables/IT%20Computers%2012-23-25.xlsx`,
          '/Tables/IT Computers 12-23-25.xlsx',
          '/Tables/IT%20Computers%2012-23-25.xlsx',
        ];
        let buffer = null;
        for (const url of assetSources) {
          try {
            const response = await fetch(url);
            const contentType = (response.headers.get('content-type') || '').toLowerCase();
            if (isSpreadsheetResponse(response)) {
              buffer = await response.arrayBuffer();
              break;
            }
            if (response.ok) {
              console.warn('Asset workbook fetch returned non-spreadsheet content for', url, contentType);
            }
          } catch (error) {
            console.warn('Asset workbook fetch failed for', url, error);
          }
        }
        if (!buffer) {
          return;
        }
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) {
          return;
        }
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        const normalizedAssets = buildAssetsFromSheet(rows, employeeSheetData);
        if (!cancelled && Array.isArray(normalizedAssets) && normalizedAssets.length > 0) {
          setAssets(normalizedAssets);
          setAssetPage(1);
        }
      } catch (error) {
        console.error('Failed to load IT Computers workbook', error);
      }
    };
    loadAssetsFromWorkbook();
    return () => {
      cancelled = true;
    };
  }, [assetCount, setAssets, setAssetPage]);

  useEffect(() => {
    if (phoneMergeRef.current) return;
    if (!assets || assets.length === 0) return;
    
    const mergeNewPhones = async () => {
      console.log('Starting phone merge from New Phones.xlsx...');
      try {
        const sources = [
          `${PUBLIC_URL}/tables/New Phones.xlsx`,
          `${PUBLIC_URL}/tables/New%20Phones.xlsx`,
          '/tables/New Phones.xlsx',
          '/tables/New%20Phones.xlsx',
          `${PUBLIC_URL}/Tables/New Phones.xlsx`,
          `${PUBLIC_URL}/Tables/New%20Phones.xlsx`,
          '/Tables/New Phones.xlsx',
          '/Tables/New%20Phones.xlsx',
        ];
        let buffer = null;
        for (const url of sources) {
          try {
            console.log('Attempting to fetch:', url);
            const response = await fetch(url);
            const contentType = (response.headers.get('content-type') || '').toLowerCase();
            if (isSpreadsheetResponse(response)) {
              buffer = await response.arrayBuffer();
              console.log('Successfully loaded New Phones.xlsx from:', url);
              break;
            }
            if (response.ok) {
              console.warn('New Phones fetch returned non-spreadsheet content for', url, contentType);
            }
          } catch (error) {
            console.warn('New Phones fetch failed for', url, error);
          }
        }
        if (!buffer) {
          console.error('Failed to load New Phones.xlsx from any source');
          return;
        }
        let rows = [];
        try {
          const workbook = XLSX.read(buffer, { type: 'array' });
          console.log('Workbook sheets:', workbook.SheetNames);
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          if (!sheet) {
            console.error('No sheet found in workbook');
            return;
          }
          rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
          console.log(`Parsed ${rows.length} phone records from Excel`);
          if (rows.length > 0) {
            console.log('Sample row:', rows[0]);
          }
        } catch (error) {
          console.error('New Phones parse failed', error);
          return;
        }
        if (!Array.isArray(rows) || rows.length === 0) {
          console.error('No phone data found in Excel file');
          return;
        }

        const normalizePhone = (value = '') => String(value).replace(/\D+/g, '');
        const phoneAssets = rows
          .map((row, index) => {
            const mobileRaw = row['Mobile number'] || row['Mobile Number'] || row['Phone'] || row['Mobile'] || row['Cell'] || row['Phone Number'] || '';
            const mobile = normalizePhone(mobileRaw);
            const username = formatRosterName(row.Username || row['Username'] || row['User'] || row['Name'] || row['Employee Name'] || row['Employee'] || '');
            const assignedTo = username || 'Unassigned';
            const model = row['Equipment Model'] || row['Equipment'] || row['Model'] || row['Device Model'] || 'iPhone 16e';
            const deviceId = normalizePhone(row['Device ID'] || row['IMEI'] || row['DeviceID'] || row['Serial Number'] || row['Serial'] || row['IMEI number'] || '');
            const purchaseDate = normalizeSheetDate(row['Upgrade date'] || row['Upgrade Date'] || row['Upgrade'] || row['Purchase Date'] || row['Date'] || '');
            const baseName = mobile || deviceId || `Phone-${index + 1}`;
            const payload = {
              id: `phone-${deviceId || mobile || index + 1}`,
              assetName: baseName,
              deviceName: baseName,
              type: 'Phone',
              brand: model ? model.split(' ')[0] : 'Apple',
              model,
              serialNumber: deviceId || mobile,
              assignedTo,
              department: 'UDS',
              location: 'Mobile',
              status: assignedTo && normalizeKey(assignedTo) !== 'unassigned' ? 'Checked Out' : 'Available',
              purchaseDate,
              warrantyExpiry: '',
              retiredDate: '',
              cost: 0,
              checkedOut: assignedTo && normalizeKey(assignedTo) !== 'unassigned',
              checkOutDate: purchaseDate,
              qrCode: `QR-${deviceId || mobile || index + 1}`,
              approvalStatus: 'Approved',
              _matchKeys: new Set(
                [deviceId, mobile, baseName]
                  .filter(Boolean)
                  .map(normalizeKey),
              ),
              _phoneKeys: new Set([deviceId, mobile].filter(Boolean)),
            };
            return normalizeAssetStatus(payload);
          })
          .filter(Boolean);

        console.log(`Created ${phoneAssets.length} phone asset objects`);
        if (phoneAssets.length > 0) {
          console.log('Sample phone asset:', phoneAssets[0]);
        }

        if (!phoneAssets.length) {
          console.error('No valid phone assets created from Excel data');
          return;
        }

        const used = new Set();
        setAssets((prev) => {
          console.log(`Merging phones. Current assets: ${prev.length}`);
          const merged = [];
          const phonesByOwner = new Map();
          
          // Group new phones by owner
          phoneAssets.forEach((phone) => {
            const ownerKey = normalizeKey(phone.assignedTo || '');
            if (!phonesByOwner.has(ownerKey)) {
              phonesByOwner.set(ownerKey, []);
            }
            phonesByOwner.get(ownerKey).push(phone);
          });
          
          prev.forEach((asset) => {
            if (normalizeKey(asset.type || '') !== 'phone') {
              merged.push(asset);
              return;
            }
            const ownerKey = normalizeKey(asset.assignedTo || '');
            const newPhonesForOwner = phonesByOwner.get(ownerKey) || [];
            
            if (newPhonesForOwner.length > 0) {
              // Replace old phone with new phone for this owner
              const newPhone = newPhonesForOwner[0];
              used.add(newPhone.id);
              console.log(`Replacing phone for ${asset.assignedTo}: ${asset.model} → ${newPhone.model}`);
              merged.push({ 
                ...newPhone, 
                id: asset.id || newPhone.id, 
                _matchKeys: undefined, 
                _phoneKeys: undefined 
              });
              // Remove used phone from the list
              phonesByOwner.set(ownerKey, newPhonesForOwner.slice(1));
            } else {
              // Keep old phone if no replacement found
              merged.push(asset);
            }
          });
          
          // Add any remaining new phones that weren't matched to an existing owner
          phoneAssets.forEach((phone) => {
            if (used.has(phone.id)) return;
            merged.push({ ...phone, _matchKeys: undefined, _phoneKeys: undefined });
          });
          console.log(`Merge complete. New total: ${merged.length} (phones updated)`);
          return merged;
        });
      } catch (error) {
        console.error('Phone merge failed:', error);
      } finally {
        phoneMergeRef.current = true;
      }
    };
    mergeNewPhones();
  }, [assets, setAssets]);
  useEffect(() => {
    let cancelled = false;
    const syncDatesFromWorkbook = async () => {
      const assetSources = [
        EXCEL_EXPORTS.assets,
        `${PUBLIC_URL}/tables/IT Computers 12-23-25.xlsx`,
        `${PUBLIC_URL}/tables/IT%20Computers%2012-23-25.xlsx`,
        '/tables/IT Computers 12-23-25.xlsx',
        '/tables/IT%20Computers%2012-23-25.xlsx',
        `${PUBLIC_URL}/Tables/IT Computers 12-23-25.xlsx`,
        `${PUBLIC_URL}/Tables/IT%20Computers%2012-23-25.xlsx`,
        '/Tables/IT Computers 12-23-25.xlsx',
        '/Tables/IT%20Computers%2012-23-25.xlsx',
      ];
      let dateLookup = null;
      for (const url of assetSources) {
        try {
          const response = await fetch(url);
          const contentType = (response.headers.get('content-type') || '').toLowerCase();
          if (!isSpreadsheetResponse(response)) {
            if (response.ok) {
              console.warn('Asset date sync fetch returned non-spreadsheet content for', url, contentType);
            }
            continue;
          }
          const buffer = await response.arrayBuffer();
          const workbook = XLSX.read(buffer, { type: 'array' });
          const sheetName = workbook.SheetNames?.[0];
          const sheet = sheetName ? workbook.Sheets[sheetName] : null;
          if (!sheet) {
            continue;
          }
          const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
          const lookup = rows.reduce((acc, row) => {
            const purchaseDate = normalizeSheetDate(row['Purchase Date'] || row['PurchaseDate'] || '');
            const warrantyExpiry = normalizeSheetDate(row['Warranty End Date'] || row['WarrantyEndDate'] || '');
            const retiredDate = normalizeSheetDate(row['Retired Date'] || row['RetiredDate'] || '');
            if (!purchaseDate && !warrantyExpiry && !retiredDate) {
              return acc;
            }
            const serialKey = normalizeKey(row['Serial Num'] || row['Serial Number'] || '');
            const sheetKey = normalizeKey(row['Device Name'] || row['Product Num'] || row['Asset Name'] || '');
            const idKey = normalizeKey(row['Asset ID'] || row['ID'] || '');
            [serialKey, sheetKey, idKey].filter(Boolean).forEach((key) => {
              if (!acc[key]) {
                acc[key] = {};
              }
              if (purchaseDate && !acc[key].purchaseDate) acc[key].purchaseDate = purchaseDate;
              if (warrantyExpiry && !acc[key].warrantyExpiry) acc[key].warrantyExpiry = warrantyExpiry;
              if (retiredDate && !acc[key].retiredDate) acc[key].retiredDate = retiredDate;
            });
            return acc;
          }, {});
          dateLookup = lookup;
          break;
        } catch (error) {
          console.warn('Purchase date workbook fetch failed for', url, error);
        }
      }
      if (!dateLookup || cancelled) {
        return;
      }
      setAssets((prev) => {
        let changed = false;
        const updated = prev.map((asset) => {
          const keys = [
            normalizeKey(asset.serialNumber || ''),
            normalizeKey(asset.sheetId || ''),
            normalizeKey(asset.deviceName || ''),
            normalizeKey(asset.assetName || ''),
            normalizeKey(asset.id || ''),
          ].filter(Boolean);
          const match = keys.map((key) => dateLookup[key]).find(Boolean);
          if (match) {
            const nextPurchase = match.purchaseDate && match.purchaseDate !== asset.purchaseDate;
            const nextWarranty = match.warrantyExpiry && match.warrantyExpiry !== asset.warrantyExpiry;
            const nextRetired = match.retiredDate && match.retiredDate !== asset.retiredDate;
            if (nextPurchase || nextWarranty || nextRetired) {
              changed = true;
              return {
                ...asset,
                purchaseDate: nextPurchase ? match.purchaseDate : asset.purchaseDate,
                warrantyExpiry: nextWarranty ? match.warrantyExpiry : asset.warrantyExpiry,
                retiredDate: nextRetired ? match.retiredDate : asset.retiredDate,
              };
            }
          }
          return asset;
        });
        return changed ? updated : prev;
      });
    };
    syncDatesFromWorkbook();
    return () => {
      cancelled = true;
    };
  }, [setAssets]);
  useEffect(() => {
    let cancelled = false;
    const loadEmployeesFromWorkbook = async () => {
      const employeeSources = [
        EXCEL_EXPORTS.employees,
        `${PUBLIC_URL}/tables/Employee Information Hub.xlsx`,
        `${PUBLIC_URL}/tables/Employee%20Information%20Hub.xlsx`,
        '/tables/Employee Information Hub.xlsx',
        '/tables/Employee%20Information%20Hub.xlsx',
        `${PUBLIC_URL}/Tables/Employee Information Hub.xlsx`,
        `${PUBLIC_URL}/Tables/Employee%20Information%20Hub.xlsx`,
        '/Tables/Employee Information Hub.xlsx',
        '/Tables/Employee%20Information%20Hub.xlsx',
      ];
      for (const url of employeeSources) {
        try {
          const response = await fetch(url);
          const contentType = (response.headers.get('content-type') || '').toLowerCase();
          if (!isSpreadsheetResponse(response)) {
            if (response.ok) {
              console.warn('Employee workbook fetch returned non-spreadsheet content for', url, contentType);
            }
            continue;
          }
          const buffer = await response.arrayBuffer();
          const workbook = XLSX.read(buffer, { type: 'array' });
          const sheetNames = workbook.SheetNames || [];
          const preferredSheetName =
            sheetNames.find((name) => /contact/i.test(name)) ||
            sheetNames.find((name) => /employee/i.test(name)) ||
            sheetNames[0];
          const candidateSheets = preferredSheetName ? [preferredSheetName, ...sheetNames] : sheetNames;
          let spotlight = [];
          for (const name of candidateSheets) {
            const sheet = workbook.Sheets[name];
            if (!sheet) continue;
            const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
            const nextSpotlight = buildTeamSpotlight(rows, Number.MAX_SAFE_INTEGER);
            if (nextSpotlight.length > 0) {
              spotlight = nextSpotlight;
              break;
            }
          }
          if (!spotlight.length) {
            continue;
          }
          const seen = new Set();
          const normalizedRoster = spotlight.filter((member) => {
            const key = normalizeKey(member.id || member.lookupKey || member.name);
            if (!key || seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          if (!cancelled) {
            setEmployeeGallery((prev) => {
              const merged = [...normalizedRoster];
              const seen = new Set(normalizedRoster.map(m => normalizeKey(m.id || m.lookupKey || m.name)).filter(Boolean));
              
              prev.forEach((member) => {
                const key = normalizeKey(member.id || member.lookupKey || member.name);
                if (!key || seen.has(key)) {
                  return;
                }
                seen.add(key);
                merged.push(member);
              });
              
              // Preserve supervisor data from previous state when not in new data
              return merged.map(newMember => {
                const key = normalizeKey(newMember.id || newMember.lookupKey || newMember.name);
                const existingMember = prev.find(m => normalizeKey(m.id || m.lookupKey || m.name) === key);
                
                // If new data doesn't have supervisor info but existing data does, preserve it
                if (existingMember && !newMember.supervisor && existingMember.supervisor) {
                  return {
                    ...newMember,
                    supervisor: existingMember.supervisor,
                    supervisorEmail: existingMember.supervisorEmail,
                  };
                }
                return newMember;
              });
            });
          }
          break;
        } catch (error) {
          console.warn('Employee workbook fetch failed for', url, error);
        }
      }
    };
    loadEmployeesFromWorkbook();
    return () => {
      cancelled = true;
    };
  }, [setEmployeeGallery]);
  
  useEffect(() => {
    let cancelled = false;
    const loadSupervisorData = async () => {
      const fileName = encodeURIComponent('Org Chart and HUB 12-25.xlsx');
      const orgChartSources = [
        `${PUBLIC_URL}/tables/${fileName}`,
        `${PUBLIC_URL}/Tables/${fileName}`,
        `/tables/${fileName}`,
        '/tables/Org Chart and HUB 12-25.xlsx',
        '/tables/Org%20Chart%20and%20HUB%2012-25.xlsx',
        `/Tables/${fileName}`,
        '/Tables/Org Chart and HUB 12-25.xlsx',
        '/Tables/Org%20Chart%20and%20HUB%2012-25.xlsx',
      ];
      for (const url of orgChartSources) {
        try {
          const response = await fetch(url);
          const contentType = (response.headers.get('content-type') || '').toLowerCase();
          if (!isSpreadsheetResponse(response)) {
            if (response.ok) {
              console.warn('Org chart fetch returned non-spreadsheet content for', url, contentType);
            }
            continue;
          }
          const buffer = await response.arrayBuffer();
          const workbook = XLSX.read(buffer, { type: 'array' });
          const sheetNames = workbook.SheetNames || [];
          const sheetName = sheetNames[0];
          if (!sheetName) continue;
          
          const sheet = workbook.Sheets[sheetName];
          if (!sheet) continue;
          
          const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
          if (!rows.length) continue;
          
          // Create supervisor lookup by employee ID and name
          const supervisorLookup = {};
          rows.forEach((row) => {
            const firstName = (row['First Name'] || row['First'] || '').toString().trim();
            const lastName = (row['Last Name'] || row['Last'] || '').toString().trim();
            const employeeId = (row['Employee ID'] || '').toString().trim();
            const supervisor =
              (row['Supervisor'] ||
                row['1st Level Supervisor '] ||
                row['1st Level Supervisor'] ||
                row['Manager'] ||
                '').toString().trim();
            const supervisorEmail = sanitizeEmail(
              row["Supervisor's Email"] ||
                row['Supervisor Email'] ||
                row['Manager E-Mail Address'] ||
                row['Manager Email Address'] ||
                row['Manager Email'] ||
                ''
            );
            const employeeEmail = sanitizeEmail(row['E-Mail Address'] || row['Email'] || '');
            
            if (!firstName && !lastName && !employeeId && !employeeEmail) return;
            
            const name = `${formatPersonName(firstName)} ${formatPersonName(lastName)}`.trim();
            
            // Store by ID, normalized name, and employee email
            const nameKey = normalizeKey(name);
            const idKey = normalizeKey(employeeId);
            const emailKey = normalizeKey(employeeEmail);
            
            const supervisorData = {
              supervisor,
              supervisorEmail,
            };

            if (nameKey) {
              supervisorLookup[nameKey] = supervisorData;
            }
            if (idKey) {
              supervisorLookup[idKey] = supervisorData;
            }
            if (emailKey) {
              supervisorLookup[emailKey] = supervisorData;
            }
          });
          console.log('Org chart loader 2: Loaded supervisor data for', Object.keys(supervisorLookup).length, 'lookup keys');
          
          // Update employee gallery with supervisor data
          if (!cancelled && Object.keys(supervisorLookup).length > 0) {
            setEmployeeGallery((prev) => 
              prev.map((member) => {
                const nameKey = normalizeKey(member.name || '');
                const idKey = normalizeKey(member.id || member.lookupKey || '');
                const emailKey = normalizeKey(member.email || '');
                
                // Try matching by ID first, then name, then email
                const supervisorData = supervisorLookup[idKey] || supervisorLookup[nameKey] || supervisorLookup[emailKey];
                
                if (supervisorData && (supervisorData.supervisor || supervisorData.supervisorEmail)) {
                  return {
                    ...member,
                    supervisor: supervisorData.supervisor || member.supervisor,
                    supervisorEmail: supervisorData.supervisorEmail || member.supervisorEmail,
                  };
                }
                return member;
              })
            );
          }
          break;
        } catch (error) {
          console.warn('Org chart fetch failed for', url, error);
        }
      }
    };
    loadSupervisorData();
    return () => {
      cancelled = true;
    };
  }, [setEmployeeGallery]);
  
  const containerStyle = useMemo(
    () => (isMobile ? { width: '100%', maxWidth: '100%', margin: '0 auto' } : undefined),
    [isMobile],
  );
  const [newHireRole, setNewHireRole] = useState('');
  const [newHireLocation, setNewHireLocation] = useState('');
  const [newHireDepartment, setNewHireDepartment] = useState('');
  const [newHireRemote, setNewHireRemote] = useState(true);
  const [terminationEmployee, setTerminationEmployee] = useState('');
  const [repairTicketForm, setRepairTicketForm] = useState(null);
  const [repairModelQuery, setRepairModelQuery] = useState('');
  const [photoLightbox, setPhotoLightbox] = useState(null);
  const normalizedLocationsRef = useRef(false);

  const assetQualityMap = useMemo(
    () =>
      assets.reduce((acc, asset) => {
        acc[asset.id] = {
          issues: getAssetQualityIssues(asset),
          score: getAssetQualityScore(asset),
          approvalStatus: asset.approvalStatus || 'Approved',
        };
        return acc;
      }, {}),
    [assets],
  );
  const baseEmployeeLocationMap = useMemo(() => {
    return employeeSheetData.reduce((acc, row) => {
      const key = normalizeKey(row['Employee ID'] || `${row['First Name']} ${row['Last Name'] || ''}`);
      if (!key) return acc;
      const location = normalizeLocationLabel(row['Location'] || row['Company'] || 'Remote');
      acc[key] = location;
      return acc;
    }, {});
  }, []);
  const employeeNames = useMemo(
    () =>
      Array.from(new Set(employeeGallery.map((member) => member.name).filter(Boolean))).sort((a, b) =>
        safeLocaleCompare(a, b),
      ),
    [employeeGallery],
  );
  const formatRoleLabel = (value = '') =>
    normalizeKey(value) === 'servicecoordinator' ? 'Service Coordinator' : value.trim();
  const employeeHubJobTitles = useMemo(() => {
    const seen = new Set();
    const titles = [];
    employeeSheetData.forEach((row) => {
      const raw = formatRoleLabel(row['Job Title'] || '');
      const key = normalizeKey(raw);
      if (!key || seen.has(key)) return;
      seen.add(key);
      titles.push(raw);
    });
    return titles.sort((a, b) => safeLocaleCompare(a, b));
  }, []);
  const roleOptions = useMemo(() => {
    const titles = employeeGallery.map((member) => member.title || '').filter(Boolean);
    const seen = new Set();
    const filtered = [];
    titles.forEach((title) => {
      const trimmed = title.trim();
      if (!trimmed) return;
      const candidate = formatRoleLabel(trimmed);
      const key = normalizeKey(candidate);
      if (key === 'servicecoordinator' && candidate !== 'Service Coordinator') {
        return;
      }
      if (seen.has(key)) {
        return;
      }
      seen.add(key);
      filtered.push(candidate);
    });
    const uniqueTitles = filtered.sort((a, b) => safeLocaleCompare(a, b));
    return uniqueTitles;
  }, [employeeGallery]);
  const modelOptions = useMemo(() => {
    const isKeyFob = (value = '') => /key\s*fob/i.test(value);
    const isUnbrandedLatitude = (value = '') => /latitude/i.test(value) && !/^dell\s+latitude/i.test(value.trim());
    const isSevenDigitPattern = (value = '') => /^\d{7}(\s+\d{7})*$/.test(String(value || '').trim());
    const isPhoneNumber = (value = '') => {
      const str = String(value || '');
      return /\(\d{3}\)\s*\d{3}-\d{4}/.test(str) || /\d{3}-\d{3}-\d{4}/.test(str);
    };
    const containsMonitor = (value = '') => /monitor/i.test(String(value || '')) || /mointor/i.test(String(value || ''));
    const isGenericTerm = (value = '') => {
      const trimmed = String(value || '').trim().toLowerCase();
      return ['computer', 'dock', 'ipad'].includes(trimmed);
    };
    const isInvalidAssetPattern = (value = '') => {
      const trimmed = String(value || '').trim();
      // Match patterns like LAPOP503, LATOP374, AELAPTOP013, LATOP428
      return /^(lapop|latop|aelaptop)\d+$/i.test(trimmed);
    };
    const isAssetId = (value = '') => {
      const trimmed = String(value || '').trim();
      // Match single asset ID like "Laptop450"
      if (/^(laptop|desktop|computer|monitor|printer|phone|tablet|ipad|dock|server|storage)\d+$/i.test(trimmed)) {
        return true;
      }
      // Match multiple asset IDs separated by spaces like "Monitor121 Monitor081"
      if (/^((laptop|desktop|computer|monitor|printer|phone|tablet|ipad|dock|server|storage)\d+\s*)+$/i.test(trimmed)) {
        return true;
      }
      return false;
    };
    const employeeModels = employeeGallery.flatMap((member) =>
      [member.computer, member.printer, member.monitor, member.dock, member.keyFob].filter(Boolean),
    );
    return Array.from(
      new Set(
        [...assets.map((asset) => asset.model), ...employeeModels]
          .filter(Boolean)
          .filter((model) => !isKeyFob(model) && !isUnbrandedLatitude(model) && !isSevenDigitPattern(model) && !isAssetId(model) && !isPhoneNumber(model) && !containsMonitor(model) && !isGenericTerm(model) && !isInvalidAssetPattern(model)),
      ),
    ).sort((a, b) => safeLocaleCompare(a, b));
  }, [assets, employeeGallery]);
  const laptopModelCatalog = useMemo(() => {
    const counts = new Map();
    assets.forEach((asset) => {
      if (!isLaptopAsset(asset)) return;
      const modelLabel = (asset.model || asset.assetName || asset.deviceName || 'Laptop').trim() || 'Laptop';
      const normalized = modelLabel.replace(/\s+/g, ' ').trim();
      const key = normalized.toLowerCase();
      const existing = counts.get(key) || { model: normalized, count: 0 };
      existing.count += 1;
      counts.set(key, existing);
    });
    return Array.from(counts.values()).sort(
      (a, b) => b.count - a.count || safeLocaleCompare(a.model, b.model),
    );
  }, [assets]);
  const filteredRepairModels = useMemo(() => {
    const query = repairModelQuery.trim().toLowerCase();
    if (!query) return laptopModelCatalog;
    return laptopModelCatalog.filter((item) => item.model.toLowerCase().includes(query));
  }, [laptopModelCatalog, repairModelQuery]);
  const departmentOptions = useMemo(
    () =>
      Array.from(new Set(employeeGallery.map((member) => member.department).filter(Boolean))).filter(dept => normalizeKey(dept) !== 'uds').sort((a, b) =>
        safeLocaleCompare(a, b),
      ),
    [employeeGallery],
  );
  const employeeHubDepartments = useMemo(() => {
    const seen = new Set();
    const list = [];
    employeeSheetData.forEach((row) => {
      const dept = (row['Department'] || row['Company'] || '').trim();
      const key = normalizeKey(dept);
      if (!key || seen.has(key) || key === 'uds') return;
      seen.add(key);
      list.push(dept);
    });
    return list.sort((a, b) => safeLocaleCompare(a, b));
  }, []);
  const locationOptions = useMemo(
    () =>
      Array.from(new Set(employeeGallery.map((member) => member.location).filter(Boolean))).sort((a, b) =>
        safeLocaleCompare(a, b),
      ),
    [employeeGallery],
  );
  const employeeHubLocations = useMemo(() => {
    const seen = new Set();
    const list = [];
    employeeSheetData.forEach((row) => {
      const location = normalizeLocationLabel(row['Location'] || row['Company'] || 'Remote');
      const key = normalizeKey(location);
      if (!key || seen.has(key)) return;
      seen.add(key);
      list.push(location);
    });
    return list.sort((a, b) => safeLocaleCompare(a, b));
  }, []);
  const departmentSuggestionOptions = employeeHubDepartments.length ? employeeHubDepartments : departmentOptions;
  const locationSuggestionOptions = employeeHubLocations.length ? employeeHubLocations : locationOptions;
  const jobTitleSuggestionOptions = employeeHubJobTitles.length ? employeeHubJobTitles : roleOptions;
  const employeeNameOptions = useMemo(
    () => employeeGallery.map((member) => member.name).filter(Boolean).sort((a, b) => safeLocaleCompare(a, b)),
    [employeeGallery],
  );
  useEffect(() => {
    if (!jobTitleSuggestionOptions.length) {
      if (newHireRole) {
        setNewHireRole('');
      }
      return;
    }
    const normalized = normalizeKey(newHireRole || '');
    const inList = jobTitleSuggestionOptions.some((role) => normalizeKey(role) === normalized);
    if (!inList) {
      setNewHireRole(jobTitleSuggestionOptions[0]);
    } else if (normalized === 'servicecoordinator' && newHireRole !== 'Service Coordinator') {
      setNewHireRole('Service Coordinator');
    }
  }, [newHireRole, jobTitleSuggestionOptions]);
  useEffect(() => {
    if (!newHireDepartment && departmentSuggestionOptions.length > 0) {
      setNewHireDepartment(departmentSuggestionOptions[0]);
    }
  }, [departmentSuggestionOptions, newHireDepartment]);
  useEffect(() => {
    const normalizedSelection = normalizeKey(newHireLocation || '');
    const filteredLocations = locationSuggestionOptions.filter((location) => normalizeKey(location) !== 'hq');
    if (normalizedSelection && normalizedSelection !== 'hq') {
      const inList = filteredLocations.some(
        (location) => normalizeKey(location) === normalizedSelection,
      );
      if (inList) {
        return;
      }
    }
    if (filteredLocations.length > 0) {
      setNewHireLocation(filteredLocations[0]);
    } else if (newHireLocation) {
      setNewHireLocation('');
    }
  }, [newHireLocation, locationSuggestionOptions]);
  const remoteAssetCount = useMemo(
    () => assets.filter((asset) => normalizeLocationLabel(asset.location) === 'Remote').length,
    [assets],
  );
  const employeeLookupByName = useMemo(() => {
    return employeeGallery.reduce((acc, member) => {
      acc[normalizeKey(member.name || '')] = member;
      return acc;
    }, {});
  }, [employeeGallery]);
  const employeeLicenseMap = useMemo(() => {
    const normalizedEmployees = employeeGallery
      .map((member) => ({
        name: member.name,
        key: normalizeKey(member.lookupKey || member.name || ''),
        department: normalizeKey(member.department || ''),
        role: normalizeKey(member.title || ''),
      }))
      .filter((item) => item.name && item.key);
    const suiteById = softwareSuites.reduce((acc, suite) => {
      if (suite?.id) {
        acc[suite.id] = suite;
      }
      return acc;
    }, {});
    const seededAssignments = softwareSuites.reduce((acc, suite, index) => {
      const assignedUsers = Array.isArray(suite.assignedUsers)
        ? suite.assignedUsers
        : Array.isArray(suite.assignees)
          ? suite.assignees
          : Array.isArray(suite.users)
            ? suite.users
            : [];
      let names = assignedUsers.filter(Boolean);
      if (names.length === 0 && normalizedEmployees.length > 0) {
        const desired = Math.min(Math.max(Math.min(suite.used || 0, 8), 1), normalizedEmployees.length);
        const seed = String(suite.id || suite.software || index)
          .split('')
          .reduce((accSeed, ch) => accSeed + ch.charCodeAt(0), 0);
        for (let i = 0; i < desired; i += 1) {
          const person = normalizedEmployees[(seed + i * 7) % normalizedEmployees.length];
          names.push(person.name);
        }
      }
      names.forEach((name) => {
        const key = normalizeKey(name);
        if (!key) return;
        if (!acc[key]) acc[key] = [];
        acc[key].push({
          suiteId: suite.id,
          name: suite.software,
          vendor: suite.vendor,
          licenseKey: suite.licenseKey,
        });
      });
      return acc;
    }, {});
    const defaultSuiteIds = DEFAULT_SUITE_IDS;
    normalizedEmployees.forEach((employee) => {
      const isUpmc = employee.department === 'upmc' || employee.department === 'hcbsupmc';
      if (isUpmc) {
        return;
      }
      const hrmsSuite = suiteById.hrms;
      const isHr = employee.department === 'humanresources';
      const isFin = employee.department === 'financialservices';
      if ((isHr || isFin) && hrmsSuite) {
        if (!seededAssignments[employee.key]) seededAssignments[employee.key] = [];
        const alreadyHasHrms = seededAssignments[employee.key].some((entry) => entry.suiteId === 'hrms');
        if (!alreadyHasHrms) {
          seededAssignments[employee.key].push({
            suiteId: 'hrms',
            name: hrmsSuite.software || 'HRMS',
            vendor: hrmsSuite.vendor,
            licenseKey: hrmsSuite.licenseKey,
            expiryDate: hrmsSuite.expiryDate || hrmsSuite.renewal || '',
          });
        }
      }
      if (employee.role === 'accessibilitydesigner') {
        const autocadSuite = suiteById.autocad;
        if (autocadSuite) {
          if (!seededAssignments[employee.key]) seededAssignments[employee.key] = [];
          const alreadyAssigned = seededAssignments[employee.key].some((entry) => entry.suiteId === 'autocad');
          if (!alreadyAssigned) {
            seededAssignments[employee.key].push({
              suiteId: 'autocad',
              name: autocadSuite.software || 'AutoCAD',
              vendor: autocadSuite.vendor,
              licenseKey: autocadSuite.licenseKey,
            });
          }
        }
      }
      defaultSuiteIds.forEach((suiteId) => {
        const suite = suiteById[suiteId];
        if (!suite || !employee.key) return;
        if (!seededAssignments[employee.key]) seededAssignments[employee.key] = [];
        const alreadyAssigned = seededAssignments[employee.key].some((entry) => entry.suiteId === suiteId);
        if (alreadyAssigned) return;
        seededAssignments[employee.key].push({
          suiteId: suite.id,
          name: suite.software || suite.id,
          vendor: suite.vendor,
          licenseKey: suite.licenseKey,
          expiryDate: suite.expiryDate || suite.renewal || '',
        });
      });
    });
    return seededAssignments;
  }, [employeeGallery, softwareSuites]);
  useEffect(() => {
    if (!terminationEmployee && employeeNames.length > 0) {
      setTerminationEmployee(employeeNames[0]);
    } else if (terminationEmployee && !employeeNames.includes(terminationEmployee) && employeeNames.length > 0) {
      setTerminationEmployee(employeeNames[0]);
    }
  }, [employeeNames, terminationEmployee]);
  useEffect(() => {
    if (normalizedLocationsRef.current) return;
    normalizedLocationsRef.current = true;
    setAssets((prev) =>
      prev.map((asset) => {
        const normalized = normalizeLocationLabel(asset.location);
        return normalized === asset.location ? asset : { ...asset, location: normalized };
      }),
    );
    setEmployeeGallery((prev) =>
      prev.map((member) => {
        const normalizedKey = normalizeKey(member.id || member.lookupKey || member.name);
        const baseLocation = baseEmployeeLocationMap[normalizedKey] || '';
        const normalized = normalizeLocationLabel(member.location);
        const nextLocation = baseLocation || normalized;
        return nextLocation && nextLocation !== member.location ? { ...member, location: nextLocation } : member;
      }),
    );
  }, [baseEmployeeLocationMap, setAssets, setEmployeeGallery]);

  const filteredAssets = useMemo(() => {
    const query = safeLower(filters.search);

    const filtered = assets.filter((asset) => {
      const statusLabel = getAssetDisplayStatus(asset);
      if (filters.hideRetired && statusLabel === 'Retired') {
        return false;
      }
      const quality = assetQualityMap[asset.id] || { issues: [] };
      const hasIssues = quality.issues.length > 0;
      if (filters.readiness === 'needs' && !hasIssues) {
        return false;
      }
      if (filters.readiness === 'ready' && hasIssues) {
        return false;
      }
      const matchesSearch =
        !query ||
        safeLower(asset.assetName).includes(query) ||
        safeLower(asset.sheetId).includes(query) ||
        safeLower(asset.brand).includes(query) ||
        safeLower(asset.model).includes(query) ||
        safeLower(asset.assignedTo).includes(query);
      const matchesType = filters.type === 'all' || asset.type === filters.type;
      const matchesStatus = filters.status === 'all' || statusLabel === filters.status;

      return matchesSearch && matchesType && matchesStatus;
    });

    const sorted = filtered.slice().sort((a, b) => {
      const dir = assetSort.direction === 'asc' ? 1 : -1;
      const key = assetSort.key;
      if (key === 'cost') {
        return (Number(a.cost) - Number(b.cost)) * dir;
      }
      if (key === 'warrantyExpiry') {
        return (new Date(a.warrantyExpiry || 0) - new Date(b.warrantyExpiry || 0)) * dir;
      }
      const valA = (a[key] || '').toString().toLowerCase();
      const valB = (b[key] || '').toString().toLowerCase();
      if (valA < valB) return -1 * dir;
      if (valA > valB) return 1 * dir;
      return 0;
    });

    return sorted;
  }, [assetQualityMap, assetSort.direction, assetSort.key, assets, filters]);
  const ASSET_PAGE_SIZE = assetPageSize;
  const totalAssetPages = Math.max(1, Math.ceil(filteredAssets.length / ASSET_PAGE_SIZE));
  useEffect(() => {
    setAssetPage(1);
  }, [filters.search, filters.type, filters.status, filters.hideRetired, filters.readiness, assetSort.key, assetSort.direction, assetPageSize]);
  useEffect(() => {
    if (assetPage > totalAssetPages) {
      setAssetPage(totalAssetPages);
    }
  }, [assetPage, totalAssetPages]);
  const pagedAssets = useMemo(
    () => filteredAssets.slice((assetPage - 1) * ASSET_PAGE_SIZE, assetPage * ASSET_PAGE_SIZE),
    [ASSET_PAGE_SIZE, assetPage, filteredAssets],
  );

  const EMPLOYEE_PAGE_SIZE = 36;
  const filteredEmployees = useMemo(
    () =>
      employeeGallery.filter((member) => {
        const query = employeeSearch.toLowerCase();
        const searchMatch =
          !query ||
          member.name.toLowerCase().includes(query) ||
          member.department.toLowerCase().includes(query) ||
          member.title.toLowerCase().includes(query) ||
          (member.location && member.location.toLowerCase().includes(query));
        
        const departmentMatch =
          employeeFilters.department === 'all' ||
          member.department === employeeFilters.department;
        
        const locationMatch =
          employeeFilters.location === 'all' ||
          member.location === employeeFilters.location;
        
        const jobTitleMatch =
          employeeFilters.jobTitle === 'all' ||
          member.title === employeeFilters.jobTitle;
        
        return searchMatch && departmentMatch && locationMatch && jobTitleMatch;
      }),
    [employeeGallery, employeeSearch, employeeFilters],
  );
  const totalEmployeePages = Math.max(1, Math.ceil(filteredEmployees.length / EMPLOYEE_PAGE_SIZE));
  useEffect(() => {
    if (employeePage > totalEmployeePages) {
      setEmployeePage(totalEmployeePages);
    }
  }, [employeePage, totalEmployeePages]);
  const orderedEmployees = useMemo(() => {
    return [...filteredEmployees].sort((a, b) => {
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      if (nameA === nameB) {
        return String(a.id || '').localeCompare(String(b.id || ''));
      }
      return nameA.localeCompare(nameB);
    });
  }, [filteredEmployees]);
  const displayedEmployees = useMemo(
    () => orderedEmployees.slice((employeePage - 1) * EMPLOYEE_PAGE_SIZE, employeePage * EMPLOYEE_PAGE_SIZE),
    [orderedEmployees, employeePage],
  );
  const employeeAssignments = useMemo(() => {
    const lookup = {};
    const splitAssetList = (value) =>
      String(value || '')
        .split(/[\r\n,;/|&]+/)
        .map((item) => item.trim())
        .filter(Boolean);
    const extractAssetTokens = (value) =>
      String(value || '')
        .match(/[A-Za-z]+-?\d+/g)
        ?.map((item) => item.trim())
        .filter(Boolean) || [];
    const parseAssetIds = (value) => {
      const entries = splitAssetList(value);
      const parsed = [];
      entries.forEach((entry) => {
        const tokens = extractAssetTokens(entry);
        if (tokens.length > 1) {
          tokens.forEach((token) => parsed.push(token));
        } else {
          parsed.push(entry);
        }
      });
      return parsed;
    };
    const getAssetKey = (asset) =>
      normalizeKey(asset.sheetId || asset.assetName || asset.deviceName || asset.serialNumber || asset.id || '');
    const isLaptopAsset = (asset) => {
      const typeKey = normalizeKey(asset.type || '');
      const nameKey = normalizeKey(`${asset.sheetId || ''} ${asset.assetName || ''} ${asset.deviceName || ''}`);
      return typeKey.includes('laptop') || nameKey.includes('laptop');
    };
    const getLaptopNumber = (asset) => {
      const label = `${asset.sheetId || ''} ${asset.assetName || ''} ${asset.deviceName || ''}`;
      const matches = label.match(/(\d+)/g);
      if (!matches || matches.length === 0) return -1;
      const last = matches[matches.length - 1];
      const parsed = Number.parseInt(last, 10);
      return Number.isNaN(parsed) ? -1 : parsed;
    };

    employeeGallery.forEach((member) => {
      const memberKey = member.lookupKey || normalizeKey(member.name || '');
      const nameKey = normalizeKey(member.name || '');
      if (!memberKey) return;

      const hubAssets = [
        { value: member.computer, type: 'Computer' },
        { value: member.printer, type: 'Printer' },
        { value: member.monitor, type: 'Monitor' },
        { value: member.dock, type: 'Dock' },
        { value: member.keyFob, type: 'Key Fob' },
      ].filter(({ value }) => Boolean(value));

      const items = [];
      const seen = new Set();
      const hubIdSet = new Set();

      const addAsset = (asset) => {
        const key = getAssetKey(asset);
        if (key && seen.has(key)) {
          return;
        }
        if (key) {
          seen.add(key);
        }
        items.push(asset);
      };

      hubAssets.forEach(({ value, type }) => {
        const assetIds = parseAssetIds(value);
        assetIds.forEach((assetId) => {
          const normalized = normalizeKey(assetId);
          if (normalized) {
            hubIdSet.add(normalized);
          }
          const matchingAsset = assets.find((asset) => {
            const assetKeys = [
              normalizeKey(asset.assetName || ''),
              normalizeKey(asset.deviceName || ''),
              normalizeKey(asset.sheetId || ''),
              normalizeKey(asset.serialNumber || ''),
            ].filter(Boolean);
            return assetKeys.includes(normalized);
          });

          if (matchingAsset) {
            addAsset(matchingAsset);
            return;
          }

          addAsset({
            assetName: assetId,
            deviceName: assetId,
            sheetId: assetId,
            type,
          });
        });
      });

      assets
        .filter((asset) => {
          const assignedKey = normalizeKey(asset.assignedTo || '');
          return assignedKey === memberKey || (nameKey && assignedKey === nameKey);
        })
        .forEach((asset) => {
          const tokenMatches = extractAssetTokens(
            `${asset.sheetId || ''} ${asset.assetName || ''} ${asset.deviceName || ''}`.trim(),
          );
          if (tokenMatches.length > 1) {
            const hubMatches = tokenMatches.filter((token) => hubIdSet.has(normalizeKey(token))).length;
            if (hubMatches >= 2) {
              return;
            }
          }
          addAsset(asset);
        });

      if (items.length > 0) {
        const laptops = items.filter((asset) => isLaptopAsset(asset));
        const nonLaptops = items.filter((asset) => !isLaptopAsset(asset));
        if (laptops.length > 1) {
          let best = laptops[0];
          let bestNumber = getLaptopNumber(best);
          laptops.slice(1).forEach((asset) => {
            const currentNumber = getLaptopNumber(asset);
            if (currentNumber > bestNumber) {
              best = asset;
              bestNumber = currentNumber;
            }
          });
          lookup[memberKey] = [...nonLaptops, best];
        } else {
          lookup[memberKey] = items;
        }
      }
    });

    Object.values(lookup).forEach((list) =>
      list.sort((a, b) => {
        const nameA = (a.deviceName || a.assetName || '').toLowerCase();
        const nameB = (b.deviceName || b.assetName || '').toLowerCase();
        if (nameA === nameB) {
          return String(a.id || a.sheetId || '').localeCompare(String(b.id || b.sheetId || ''));
        }
        return nameA.localeCompare(nameB);
      }),
    );

    return lookup;
  }, [assets, employeeGallery]);
  useEffect(() => {
    if (!employeeGallery.length || !assets.length) {
      return;
    }
    const assignmentLookup = new Map();
    employeeGallery.forEach((member) => {
      const name = member?.name || '';
      if (!name) return;
      [member.computer, member.printer, member.monitor, member.dock, member.keyFob]
        .filter(Boolean)
        .forEach((assetId) => {
          const key = normalizeKey(assetId);
          if (key && !assignmentLookup.has(key)) {
            assignmentLookup.set(key, name);
          }
        });
    });

    if (!assignmentLookup.size) {
      return;
    }

    setAssets((prev) => {
      let changed = false;
      const next = prev.map((asset) => {
        const assetKeys = [
          normalizeKey(asset.assetName || ''),
          normalizeKey(asset.deviceName || ''),
          normalizeKey(asset.sheetId || ''),
          normalizeKey(asset.serialNumber || ''),
        ].filter(Boolean);
        const matchKey = assetKeys.find((key) => assignmentLookup.has(key));
        if (!matchKey) {
          return asset;
        }
        const assignedTo = assignmentLookup.get(matchKey) || '';
        if (!assignedTo || assignedTo === asset.assignedTo) {
          return asset;
        }
        changed = true;
        return {
          ...asset,
          assignedTo,
          status: 'Checked Out',
          checkedOut: true,
        };
      });
      return changed ? next : prev;
    });
  }, [assets, employeeGallery, setAssets]);
  const getEmployeeAssignments = useCallback(
    (member) => {
      if (!member) {
        return [];
      }
      const normalizedName = member.lookupKey || normalizeKey(member.name || '');
      if (!normalizedName) {
        return [];
      }
      return employeeAssignments[normalizedName] || [];
    },
    [employeeAssignments],
  );
  const getEmployeeLicenses = useCallback(
    (member) => {
      if (!member) return [];
      const normalizedName = member.lookupKey || normalizeKey(member.name || '');
      if (!normalizedName) return [];
      const licenses = employeeLicenseMap[normalizedName] || [];
      return licenses.filter((suite) => suite?.suiteId && !DEFAULT_SUITE_SET.has(suite.suiteId));
    },
    [employeeLicenseMap],
  );
  const availableByType = useMemo(() => {
    return assets.reduce((acc, asset) => {
      const key = asset.type || 'Other';
      const isAvailable = !asset.checkedOut && asset.status !== 'Retired';
      acc[key] = (acc[key] || 0) + (isAvailable ? 1 : 0);
      return acc;
    }, {});
  }, [assets]);
  const recommendedKit = useMemo(() => {
    const classifyRole = () => {
      const value = (newHireRole || '').toLowerCase();
      const isServiceCoordinator = /\bservice\s*coordinator\b/i.test(value);
      const isUpmcServiceCoordinator = isServiceCoordinator && normalizeKey(newHireDepartment || '') === 'hcbsupmc';
      if (isUpmcServiceCoordinator) return 'blocked';
      if (isServiceCoordinator) return 'serviceCoordinator';
      if (/engineer|developer|software|devops|cloud|data/i.test(value)) return 'engineering';
      if (/it|systems|sysadmin|network|support|help desk|helpdesk|service desk/i.test(value)) return 'it';
      if (/design|ux|ui|creative|graphics/i.test(value)) return 'design';
      if (/sales|account|bd|business development|rep|csr/i.test(value)) return 'sales';
      if (/finance|accounting|payroll|ap\\b|ar\\b|controller/i.test(value)) return 'finance';
      if (/hr|human resources|recruit|talent/i.test(value)) return 'hr';
      if (/marketing|brand|content|growth|communications|comms/i.test(value)) return 'marketing';
      if (/ops|operations|logistics|warehouse|field|technician|installer/i.test(value)) return 'operations';
      if (/manager|director|vp|c[eo][fo]|executive|leadership/i.test(value)) return 'executive';
      if (/nurse|clinical|therapist|care|aide|medical/i.test(value)) return 'clinical';
      return 'general';
    };
    const roleCategory = classifyRole();
    const normalizedDept = normalizeKey(newHireDepartment || '');
    const isUpmc = normalizedDept === 'upmc' || normalizedDept === 'hcbsupmc';
    if (roleCategory === 'blocked' || isUpmc) {
      return [];
    }
    const includeHeadset = roleCategory !== 'serviceCoordinator';
    const baseKit = [
      { label: 'Monitor', type: 'Monitor', reason: newHireRemote ? 'Extra monitor for remote setup' : 'Desk monitor' },
      { label: 'Dock + power', type: 'Accessory', reason: 'Connectivity and charging' },
      includeHeadset ? { label: 'Headset', type: 'Accessory', reason: 'Meetings and calls' } : null,
      { label: 'Keyboard + mouse', type: 'Accessory', reason: 'Ergonomic bundle' },
      { label: 'Backpack/Case', type: 'Accessory', reason: 'Carry kit' },
      { label: 'Apple iPhone or Samsung Galaxy', type: 'Phone', reason: 'Mobile choice based on preference' },
    ].filter(Boolean);
    const laptopForRole = () => {
      switch (roleCategory) {
        case 'serviceCoordinator':
          return { label: 'Dell Latitude 3400 (Core i5)', type: 'Laptop', reason: 'Standard issue for coordinators' };
        case 'it':
        case 'finance':
        case 'marketing':
        case 'executive':
          return { label: 'Dell Latitude 5400 (Core i7)', type: 'Laptop', reason: 'Premium device for critical roles' };
        case 'engineering':
          return { label: 'High-spec laptop (32GB/1TB)', type: 'Laptop', reason: 'Builds, VMs, and tooling' };
        case 'design':
          return { label: 'High-spec laptop (32GB/1TB)', type: 'Laptop', reason: 'Creative and rendering workloads' };
        case 'sales':
          return { label: 'Lightweight laptop', type: 'Laptop', reason: 'Travel-friendly for client visits' };
        case 'operations':
          return { label: 'Rugged laptop/tablet', type: 'Laptop', reason: 'Durable for field and warehouse use' };
        case 'clinical':
          return { label: 'Rugged tablet/laptop', type: 'Tablet', reason: 'Mobile charting and care coordination' };
        default:
          return { label: 'Standard laptop (i5)', type: 'Laptop', reason: 'Default issue for new hires' };
      }
    };
    const roleExtras = {
      serviceCoordinator: [
        { label: 'Brother laser printer', type: 'Printer', reason: 'Desk-side printing for coordinators' },
      ],
      engineering: [
        { label: 'Second monitor', type: 'Monitor', reason: 'Multi-screen workflows' },
        { label: 'Admin access request', type: 'Access', reason: 'Repos and packages' },
      ],
      design: [
        { label: 'Color-accurate monitor', type: 'Monitor', reason: 'Visual fidelity' },
        { label: 'iPad/Tablet (optional)', type: 'Tablet', reason: 'Reviews and sketching' },
        { label: 'Creative suite license', type: 'Software', reason: 'Adobe/Figma access' },
      ],
      it: [
        { label: 'Spare loaner', type: 'Laptop', reason: 'Hot-swap support' },
        { label: 'Label/QR printer access', type: 'Accessory', reason: 'Asset tagging' },
        { label: 'Remote support tools', type: 'Software', reason: 'Endpoint management' },
      ],
      sales: [
        { label: 'Mobile hotspot', type: 'Accessory', reason: 'Reliable connectivity' },
        { label: 'CRM license', type: 'Software', reason: 'Pipeline management' },
        { label: 'Phone line upgrade', type: 'Phone', reason: 'Client calls' },
      ],
      finance: [
        { label: 'Secure token', type: 'Accessory', reason: 'Approvals and MFA' },
        { label: 'Finance suite access', type: 'Software', reason: 'ERP/GL systems' },
      ],
      hr: [
        { label: 'HRIS access', type: 'Software', reason: 'On/Offboarding tasks' },
        { label: 'Background check portal', type: 'Software', reason: 'Hiring workflows' },
      ],
      marketing: [
        { label: 'Analytics/SEO tools', type: 'Software', reason: 'Campaign reporting' },
        { label: 'Brand asset access', type: 'Access', reason: 'Shared content libraries' },
      ],
      operations: [
        { label: 'Spare battery/charger', type: 'Accessory', reason: 'On-call shifts' },
        { label: 'Label/QR printer access', type: 'Accessory', reason: 'Inventory processing' },
      ],
      executive: [
        { label: 'Travel kit (charger + adapters)', type: 'Accessory', reason: 'Travel readiness' },
        { label: 'VIP support flag', type: 'Access', reason: 'White-glove support' },
      ],
      clinical: [
        { label: 'Phone/VOIP line', type: 'Phone', reason: 'Patient coordination' },
        { label: 'EHR access', type: 'Software', reason: 'Medical records' },
      ],
      general: [],
    };
    const extras = roleExtras[roleCategory] || roleExtras.general;
    const laptop = roleCategory === 'blocked' ? null : laptopForRole();
    const kit = [laptop, ...baseKit, ...extras].filter(Boolean);
    const cableAddOns = kit.flatMap((item) => {
      if (item.type === 'Monitor') {
        return [{ label: 'HDMI cable', type: 'Accessory', reason: 'Required for monitor connectivity' }];
      }
      if (item.type === 'Printer') {
        return [{ label: 'USB printer cable', type: 'Accessory', reason: 'Required for local printing' }];
      }
      return [];
    });
    const combined = [...kit, ...cableAddOns];
    return combined.map((item) => ({
      ...item,
      available: item.type && availableByType[item.type] !== undefined ? availableByType[item.type] : null,
    }));
  }, [availableByType, newHireDepartment, newHireRemote, newHireRole]);
  const terminationAssets = useMemo(() => {
    const normalized = normalizeKey(terminationEmployee || '');
    if (!normalized) {
      return [];
    }
    return employeeAssignments[normalized] || [];
  }, [employeeAssignments, terminationEmployee]);
  const terminationProfile = useMemo(() => {
    const normalized = normalizeKey(terminationEmployee || '');
    if (!normalized) {
      return null;
    }
    return employeeLookupByName[normalized] || null;
  }, [employeeLookupByName, terminationEmployee]);
  const terminationSupervisorMailto = useMemo(
    () => {
      const mailto = buildSupervisorMailto(
        terminationProfile?.supervisorEmail,
        terminationProfile?.supervisor,
        terminationEmployee,
        terminationAssets,
      );
      return mailto;
    },
    [terminationProfile, terminationEmployee, terminationAssets],
  );
  const handleEmployeeCardToggle = useCallback(
    (memberId) => {
      setExpandedEmployeeId((prev) => (prev === memberId ? null : memberId));
    },
    [],
  );
  useEffect(() => {
    if (!expandedEmployeeId) {
      return;
    }
    if (!displayedEmployees.some((member) => member.id === expandedEmployeeId)) {
      setExpandedEmployeeId(null);
    }
  }, [displayedEmployees, expandedEmployeeId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
    const requireAuth = String(process.env.REACT_APP_REQUIRE_AUTH || '').toLowerCase() === 'true';
    const allowDevBypass = isDevelopment && !requireAuth;

    // Fast bypass when no API base is configured locally.
    if (allowDevBypass && !apiBaseUrl) {
      setAuthUser({ name: 'Dev User', email: 'dev@udservices.org', sub: 'dev', expiresAt: Date.now() + 86400000 });
      setAuthLoading(false);
      setAuthError('');
      return;
    }

    const fetchSession = async () => {
      setAuthLoading(true);
      try {
        const resp = await fetch(buildApiUrl('/api/auth/universal/me'), { credentials: 'include' });
        if (resp.ok) {
          const isJson = (resp.headers.get('content-type') || '').includes('application/json');
          if (!isJson) {
            if (allowDevBypass) {
              setAuthUser({ name: 'Dev User', email: 'dev@udservices.org', sub: 'dev', expiresAt: Date.now() + 86400000 });
              setAuthError('Auth API returned non-JSON; using dev bypass.');
            } else {
              setAuthUser(null);
              setAuthError('Authentication response was invalid.');
            }
            return;
          }
          const data = await resp.json();
          setAuthUser(data.user);
          setAuthError('');
          return;
        }

        if (allowDevBypass && (resp.status === 404 || resp.status >= 500)) {
          setAuthUser({ name: 'Dev User', email: 'dev@udservices.org', sub: 'dev', expiresAt: Date.now() + 86400000 });
          setAuthError('Auth service unavailable; using dev bypass.');
          return;
        }

        setAuthError('');
        setAuthUser(null);
      } catch (error) {
        if (allowDevBypass) {
          setAuthUser({ name: 'Dev User', email: 'dev@udservices.org', sub: 'dev', expiresAt: Date.now() + 86400000 });
          setAuthError('Auth request failed; using dev bypass.');
          return;
        }
        setAuthError('Authentication failed. Please retry.');
        setAuthUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    fetchSession();
  }, [buildApiUrl, apiBaseUrl]);

  useEffect(() => {
    const syncViewport = () => {
      if (typeof window === 'undefined') {
        return;
      }
      setIsMobile(window.innerWidth <= 768);
    };
    syncViewport();
    window.addEventListener('resize', syncViewport);
    return () => window.removeEventListener('resize', syncViewport);
  }, []);

  useLayoutEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    const styleId = 'uds-theme-overrides';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.innerHTML = `${LIGHT_MODE_STYLES}${DARK_MODE_STYLES}`;
      document.head.appendChild(styleEl);
    }
    document.documentElement.classList.toggle('theme-dark', isDarkMode);
    document.documentElement.classList.toggle('theme-light', !isDarkMode);
    window.localStorage.setItem('uds_theme_dark', String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handler = (event) => {
      const isCmdK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (isCmdK) {
        event.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (event.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!flashMessage) return;
    const timer = setTimeout(() => setFlashMessage(''), 3000);
    return () => clearTimeout(timer);
  }, [flashMessage]);

  useEffect(() => {
    // Stop the scanner only when leaving the Hardware page, not on every state change.
    if (!scannerActive) return;
    if (activePage !== 'Hardware') {
      setScannerActive(false);
      setScanMessage('');
    }
  }, [activePage, scannerActive]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem('uds_asset_page_size', String(assetPageSize));
  }, [assetPageSize]);

  useEffect(() => {
    if (!qrInput) {
      setQrDataUrl('');
      return;
    }
    let cancelled = false;
    const generate = async () => {
      try {
        const url = await generateQrDataUrl(qrInput, 400);
        if (!cancelled) {
          setQrDataUrl(url);
        }
      } catch (error) {
        console.error('QR generation failed', error);
        if (!cancelled) {
          setQrDataUrl('');
        }
      }
    };
    generate();
    return () => {
      cancelled = true;
    };
  }, [qrInput]);

  useEffect(() => {
    if (!scannerActive || typeof window === 'undefined') {
      return;
    }
    let cancelled = false;
    lastScanTsRef.current = 0;
    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.playsInline = true;
          videoRef.current.muted = true;
          videoRef.current.style.display = 'block';
          videoRef.current.style.opacity = '1';
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        const hasNativeDetector = typeof window.BarcodeDetector !== 'undefined';
        let detector = null;
        if (hasNativeDetector) {
          let requestedFormats = [...BARCODE_DETECTOR_FORMATS];
          if (typeof window.BarcodeDetector.getSupportedFormats === 'function') {
            try {
              const availableFormats = await window.BarcodeDetector.getSupportedFormats();
              if (Array.isArray(availableFormats) && availableFormats.length > 0) {
                const filtered = requestedFormats.filter((format) => availableFormats.includes(format));
                if (filtered.length > 0) {
                  requestedFormats = filtered;
                }
              }
            } catch (err) {
              console.warn('Failed to read BarcodeDetector supported formats', err);
            }
          }
          detector = new window.BarcodeDetector({ formats: requestedFormats });
          setScannerError('');
          setScanMessage('Multipurpose scanner ready. Aim at any QR or barcode.');
        } else {
          setScannerError('BarcodeDetector is not available in this browser. Using multipurpose fallback decoder (slower).');
          setScanMessage('Fallback scanner active. Keep the barcode centered and well-lit.');
          if (!fallbackCanvasRef.current) {
            fallbackCanvasRef.current = document.createElement('canvas');
          }
          if (!multiFormatReaderRef.current) {
            multiFormatReaderRef.current = new BrowserMultiFormatReader();
          } else {
            resetMultiFormatReader();
            multiFormatReaderRef.current = new BrowserMultiFormatReader();
          }
        }
        const finishDetection = (value, message) => {
          if (!value) return;
          setScanResult(value);
          setScanMessage(message || 'Barcode detected.');
          cancelled = true;
          setScannerActive(false);
          if (scanLoopRef.current) {
            cancelAnimationFrame(scanLoopRef.current);
          }
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }
          if (multiFormatReaderRef.current) {
            resetMultiFormatReader();
          }
        };

        const tick = async () => {
          if (cancelled || !videoRef.current) {
            return;
          }
          try {
            if (detector) {
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes.length > 0) {
                finishDetection(barcodes[0].rawValue || '', 'Barcode detected.');
                return;
              }
            } else {
              const videoEl = videoRef.current;
              if (!videoEl || videoEl.readyState < 2) {
                scanLoopRef.current = requestAnimationFrame(tick);
                return;
              }
              const width = videoEl.videoWidth || videoEl.clientWidth;
              const height = videoEl.videoHeight || videoEl.clientHeight;
              if (width && height) {
                const now = typeof performance !== 'undefined' && typeof performance.now === 'function'
                  ? performance.now()
                  : Date.now();
                if (now - lastScanTsRef.current > 120) {
                  lastScanTsRef.current = now;
                  const canvas = fallbackCanvasRef.current || document.createElement('canvas');
                  fallbackCanvasRef.current = canvas;
                  const targetWidth = Math.min(640, width);
                  const scale = targetWidth / width;
                  const targetHeight = Math.max(1, Math.round(height * scale));
                  canvas.width = targetWidth;
                  canvas.height = targetHeight;
                  const ctx = canvas.getContext('2d');
                  ctx.drawImage(videoEl, 0, 0, targetWidth, targetHeight);
                  const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
                  const reader = multiFormatReaderRef.current;
                  if (reader) {
                    try {
                      const result = reader.decodeFromCanvas(canvas);
                      if (result?.getText()) {
                        finishDetection(result.getText(), 'Barcode detected via multipurpose fallback.');
                        return;
                      }
                    } catch (readerError) {
                      if (readerError?.name !== 'NotFoundException') {
                        console.warn('Fallback barcode decode failed', readerError);
                      }
                    }
                  }
                  const code = jsQR(imageData.data, targetWidth, targetHeight, { inversionAttempts: 'attemptBoth' });
                  if (code?.data) {
                    finishDetection(code.data, 'QR detected via fallback scanner.');
                    return;
                  }
                }
              }
            }
          } catch (err) {
            console.warn('Barcode detection failed', err);
          }
          scanLoopRef.current = requestAnimationFrame(tick);
        };
        tick();
      } catch (error) {
        console.error('Scanner failed', error);
        setScannerError(error?.message || 'Unable to access camera');
        setScannerActive(false);
      }
    };
    start();
    return () => {
      cancelled = true;
      if (scanLoopRef.current) {
        cancelAnimationFrame(scanLoopRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (multiFormatReaderRef.current) {
        resetMultiFormatReader();
      }
    };
  }, [scannerActive]);

  useEffect(() => {
    if (!scanResult) return;

    const value = scanResult.trim();
    if (!value) return;

    const normalized = normalizeScanValue(value);
    const matchedAsset = assets.find((asset) => assetMatchesScanValue(asset, normalized));

    setActivePage('Hardware');

    if (matchedAsset) {
      // Found matching asset - open spotlight modal
      setSelectedAssetId(matchedAsset.id);
      setSpotlightOpen(true);
      setScanMessage(`Found: ${matchedAsset.assetName || matchedAsset.serialNumber || 'asset'}`);
    } else {
      // No match - open create new asset form with prefilled QR code
      setAssetForm({
        ...defaultAsset,
        qrCode: value,
        sheetId: value,
      });
      setScanMessage(`No match found. Creating new asset with ID: ${value}`);
    }

    // Clear scan result after processing
    setScanResult('');
  }, [scanResult, assets]);

  useEffect(() => {
    if (!selectedAssetId) {
      return;
    }
    const exists = assets.some((asset) => asset.id === selectedAssetId);
    if (!exists) {
      setSelectedAssetId(null);
      setSpotlightOpen(false);
    }
  }, [assets, selectedAssetId]);

  const stats = useMemo(() => {
    const totalValue = assets.reduce((sum, asset) => sum + Number(asset.cost || 0), 0);
    const checkedOut = assets.filter((asset) => asset.checkedOut).length;
    const available = assets.filter((asset) => getAssetDisplayStatus(asset) === 'Available').length;
    const expiringSoon = assets.filter((asset) => {
      if (!asset.warrantyExpiry) {
        return false;
      }
      const diff = new Date(asset.warrantyExpiry) - new Date();
      return diff > 0 && diff / (1000 * 60 * 60 * 24) <= 90;
    }).length;
    const newThisYear = assets.filter((asset) => new Date(asset.purchaseDate).getFullYear() === new Date().getFullYear()).length;

    return {
      total: assets.length,
      totalValue,
      checkedOut,
      available,
      expiringSoon,
      newThisYear,
    };
  }, [assets]);

  const coordinatorKpis = useMemo(() => {
    const readyCount = assets.filter((asset) => {
      const quality = assetQualityMap[asset.id];
      return quality && quality.issues?.length === 0;
    }).length;
    const needsInfo = assets.length - readyCount;
    const warrantyExpiring = (warrantyReminders || []).length || 0;
    return [
      { label: 'Ready for dispatch', value: readyCount },
      { label: 'Needs info', value: needsInfo },
      { label: 'Warranty in 90d', value: warrantyExpiring },
      { label: 'Printers tracked', value: networkPrinters.length },
    ];
  }, [assetQualityMap, assets, networkPrinters, warrantyReminders]);

  const selectedAsset = useMemo(
    () => assets.find((asset) => asset.id === selectedAssetId) || null,
    [assets, selectedAssetId],
  );

  const ownerContact = useMemo(() => {
    if (!selectedAsset || !selectedAsset.assignedTo) return null;
    const key = normalizeKey(selectedAsset.assignedTo);
    if (!key) return null;
    return employeeGallery.find((member) => normalizeKey(member.name) === key) || null;
  }, [employeeGallery, selectedAsset]);

  useEffect(() => {
    if (selectedAsset && !spotlightOpen) {
      setSpotlightOpen(true);
    }
  }, [selectedAsset, spotlightOpen]);

  const assetOwnerHistory = useMemo(() => {
    if (!selectedAsset) return [];
    const keys = new Set(
      [selectedAsset.id, selectedAsset.sheetId, selectedAsset.assetName, selectedAsset.deviceName, selectedAsset.serialNumber]
        .filter(Boolean)
        .map((v) => v.toString().toLowerCase()),
    );
    return history
      .filter((entry) => {
        const entryKey = entry.assetId ? entry.assetId.toString().toLowerCase() : '';
        return keys.has(entryKey);
      })
      .slice()
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [history, selectedAsset]);

  const assetRepairHistory = useMemo(() => {
    if (!selectedAsset) return [];
    const keys = new Set(
      [selectedAsset.id, selectedAsset.sheetId, selectedAsset.assetName, selectedAsset.deviceName, selectedAsset.serialNumber]
        .filter(Boolean)
        .map((v) => v.toString().toLowerCase()),
    );
    return maintenanceRecords
      .filter((entry) => {
        const entryKey = entry.assetId ? entry.assetId.toString().toLowerCase() : '';
        return keys.has(entryKey);
      })
      .slice()
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [maintenanceRecords, selectedAsset]);

  const assetCurrentRepairs = useMemo(() => {
    if (!selectedAsset) return [];
    const keys = new Set(
      [selectedAsset.id, selectedAsset.sheetId, selectedAsset.assetName, selectedAsset.deviceName, selectedAsset.serialNumber]
        .filter(Boolean)
        .map((v) => v.toString().toLowerCase()),
    );
    return maintenanceWorkOrders
      .filter((order) => {
        const orderKey = order.assetId || order.assetName || order.id;
        return orderKey && keys.has(orderKey.toString().toLowerCase());
      })
      .slice();
  }, [maintenanceWorkOrders, selectedAsset]);

  const recentHistory = useMemo(
    () =>
      history
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5),
    [history],
  );

  const getAssetName = useCallback(
    (id) => {
      const asset = assets.find((item) => item.id === id);
      return asset ? asset.assetName : 'Unknown asset';
    },
    [assets],
  );

  const typeOptions = useMemo(() => Array.from(new Set(assets.map((asset) => asset.type))), [assets]);

  const licenseInsights = useMemo(() => {
    const totals = licenseBuckets.reduce(
      (acc, license) => {
        acc.used += license.used;
        acc.seats += license.seats;
        return acc;
      },
      { used: 0, seats: 0 },
    );
    const percent = totals.seats ? Math.round((totals.used / totals.seats) * 100) : 0;
    return { ...totals, percent };
  }, [licenseBuckets]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };
  const handleClearWarrantyAlert = useCallback(
    (alert) => {
      if (!alert) {
        return;
      }
      const key = buildWarrantyAlertKey(alert);
      setClearedWarrantyAlerts((prev) => (prev.includes(key) ? prev : [...prev, key]));
    },
    [setClearedWarrantyAlerts],
  );
  const handleClearAllWarrantyAlerts = useCallback(
    (alertsToClear = []) => {
      setClearedWarrantyAlerts((prev) => {
        const next = new Set(prev);
        alertsToClear.forEach((alert) => next.add(buildWarrantyAlertKey(alert)));
        return Array.from(next);
      });
    },
    [setClearedWarrantyAlerts],
  );
  const handleClearMaintenanceAlert = useCallback(
    (alert) => {
      if (!alert) return;
      const key = buildMaintenanceAlertKey(alert);
      setClearedMaintenanceAlerts((prev) => (prev.includes(key) ? prev : [...prev, key]));
    },
    [setClearedMaintenanceAlerts],
  );
  const handleClearAllMaintenanceAlerts = useCallback(
    (alertsToClear = []) => {
      setClearedMaintenanceAlerts((prev) => {
        const next = new Set(prev);
        alertsToClear.forEach((alert) => next.add(buildMaintenanceAlertKey(alert)));
        return Array.from(next);
      });
    },
    [setClearedMaintenanceAlerts],
  );
  const parseStackInput = (value) => {
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }
    return String(value || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const handleSaveSoftware = (payload) => {
    const suiteId = payload.id ?? Date.now();
    const normalized = {
      id: suiteId,
      software: payload.software || `Suite ${suiteId}`,
      vendor: payload.vendor || 'Vendor',
      owner: payload.owner || 'IT',
      category: payload.category || 'General',
      licenseKey: payload.licenseKey || `SUITE-${suiteId}`,
      seats: Number(payload.seats) || 0,
      used: Number(payload.used) || 0,
      expiryDate: payload.expiryDate || '',
      cost: Number(payload.cost) || 0,
      description: payload.description || '',
      deployment: payload.deployment || 'Cloud',
      criticality: payload.criticality || 'Medium',
      stack: parseStackInput(payload.stackText ?? payload.stack),
      logo: payload.logo || '',
      accent: {
        from: payload.accentFrom || payload.accent?.from || defaultSoftwareSuite.accent.from,
        to: payload.accentTo || payload.accent?.to || defaultSoftwareSuite.accent.to,
      },
    };
    setSoftwareSuites((prev) => {
      const exists = prev.some((suite) => suite.id === normalized.id);
      if (exists) {
        return prev.map((suite) => (suite.id === normalized.id ? normalized : suite));
      }
      return [...prev, normalized];
    });
    setSoftwareForm(null);
  };

  const handleDeleteSoftware = (id) => {
    if (!window.confirm('Remove this software suite?')) {
      return;
    }
    setSoftwareSuites((prev) => prev.filter((suite) => suite.id !== id));
  };
  const handleApproveIntake = useCallback(
    (asset) => {
      if (!asset) {
        return;
      }
      setAssets((prev) =>
        prev.map((item) =>
          item.id === asset.id ? { ...item, approvalStatus: 'Approved' } : item,
        ),
      );
    },
    [setAssets],
  );
  const handleSpotlightFilter = (type) => {
    setFilters({ ...defaultAssetFilters, type: type || 'all' });
    if (typeof window === 'undefined') {
      return;
    }
    const section = document.getElementById('asset-table');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const resolveSelectedAsset = useCallback(
    (asset) => {
      if (!asset) {
        return null;
      }
      if (asset.id) {
        return assets.find((item) => item.id === asset.id) || asset;
      }
      const matchKeys = [
        asset.assetName,
        asset.deviceName,
        asset.sheetId,
        asset.serialNumber,
      ]
        .filter(Boolean)
        .map(normalizeKey);
      if (matchKeys.length === 0) {
        return null;
      }
      return (
        assets.find((item) => {
          const itemKeys = [
            item.assetName,
            item.deviceName,
            item.sheetId,
            item.serialNumber,
            item.id,
          ]
            .filter(Boolean)
            .map(normalizeKey);
          return matchKeys.some((key) => itemKeys.includes(key));
        }) || null
      );
    },
    [assets],
  );

  const handleRowSelect = (asset) => {
    const resolved = resolveSelectedAsset(asset);
    if (!resolved?.id) {
      setFlashMessage('Asset not found in inventory yet.');
      return;
    }
    setSelectedAssetId(resolved.id);
    setSpotlightOpen(true);
  };

  const handleOpenAutomate = useCallback(
    (asset) => {
      if (typeof window === 'undefined') return;
      const targetUrl = getAutomateLink(asset);
      const warmUrl = AUTOMATE_BASE_URL;

      try {
        const popup = window.open(warmUrl, 'automate-prewarm', 'width=480,height=320,left=20,top=20');
        if (!popup) {
          setFlashMessage('Popup blocked. Opening Automate directly.');
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
          return;
        }
        setTimeout(() => {
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        }, 400);
        setTimeout(() => {
          try {
            popup.close();
          } catch (error) {
            // Ignore close failures from blocked popups.
          }
        }, 1500);
      } catch (error) {
        setFlashMessage('Automate link failed. Copy or retry from the direct link.');
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
    },
    [],
  );

  const handleAddPrinter = useCallback(() => {
    setPrinterForm({
      id: null,
      deviceType: 'Printer',
      location: '',
      model: '',
      serial: '',
      ip: '',
      colonyId: '',
      vendorName: '',
      vendor: '',
      vendorBadge: 'bg-slate-100 text-slate-700 ring-slate-200',
    });
  }, []);

  const handleEditPrinter = useCallback(
    (printer) => {
      if (!printer) return;
      setPrinterForm(printer);
    },
    [],
  );

  const handleDeletePrinter = useCallback(
    (printer, mode) => {
      if (!printer) return;
      if (mode === 'report') {
        setFlashMessage(`Issue logged for ${printer.deviceType} (${printer.model || ''}).`);
        return;
      }
      const confirmed = window.confirm(`Remove ${printer.deviceType} at ${printer.location || 'Unknown'}?`);
      if (!confirmed) return;
      setNetworkPrinters((prev) => prev.filter((p) => p.id !== printer.id));
    },
    [setNetworkPrinters],
  );

  const handleSavePrinter = useCallback(
    (form) => {
      if (!form) return;
      const vendor = (form.vendorName || '').toLowerCase().includes('colony') ? 'colony' : form.vendor || '';
      const vendorBadge = vendor
        ? 'bg-emerald-50 status-success ring-emerald-100'
        : 'bg-slate-100 text-slate-700 ring-slate-200';
      const normalized = { ...form, id: form.id || Date.now(), vendor, vendorBadge };
      setNetworkPrinters((prev) => {
        const exists = prev.some((p) => p.id === normalized.id);
        return exists ? prev.map((p) => (p.id === normalized.id ? normalized : p)) : [normalized, ...prev];
      });
      setPrinterForm(null);
      setFlashMessage('Printer saved');
    },
    [setNetworkPrinters],
  );

const handleTestPrinter = useCallback(
  async (printer) => {
    if (!printer?.id) return;
    const printerId = printer.id;
    patchNetworkPrinter(printerId, { isTesting: true, lastTestError: '' });
    try {
      const response = await fetch('/api/printer-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: printer.id,
          deviceType: printer.deviceType,
          location: printer.location,
          ip: printer.ip,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || 'Unable to queue test page');
      }
      patchNetworkPrinter(printerId, {
        isTesting: false,
        lastTestedAt: payload.testedAt || new Date().toISOString(),
        lastTestStatus: 'success',
        lastTestMessage: payload.message || '',
        lastTestError: '',
      });
      setFlashMessage(
        payload.message || `Test page queued for ${printer.deviceType} at ${printer.location || 'Unknown'}.`,
      );
    } catch (error) {
      console.error('[PrinterTest] error', error);
      patchNetworkPrinter(printerId, {
        isTesting: false,
        lastTestedAt: new Date().toISOString(),
        lastTestStatus: 'error',
        lastTestError: error.message || 'Unable to queue test page',
      });
      setFlashMessage(`Failed to queue test page for ${printer.deviceType} at ${printer.location || 'Unknown'}.`);
    }
  },
  [patchNetworkPrinter, setFlashMessage],
);

  const handleOpenPrinterTicket = useCallback(
    (printer) => {
      const printerLabel = printer ? `${printer.deviceType || 'Printer'} @ ${printer.location || 'Unknown'}` : 'Printer / Copier';
      setRepairTicketForm({
        ...EMPTY_REPAIR_TICKET,
        assetId: printerLabel,
        model: printer?.model || '',
        location: printer?.location || '',
        issue: printer ? `Service request for ${printer.deviceType || 'printer'}` : '',
        status: 'Awaiting intake',
        severity: 'Normal',
        deviceType: 'Printer',
      });
      setActivePage('Vendors');
    },
    [setActivePage, setRepairTicketForm],
  );

  const handleReportPrinter = useCallback(
    (printer) => {
      handleOpenPrinterTicket(printer);
    },
    [handleOpenPrinterTicket],
  );

  const handleAddRepairTicket = useCallback(() => {
    setRepairTicketForm({
      id: null,
      assetId: '',
      model: '',
      assignedTo: '',
      location: '',
      issue: '',
      status: 'Awaiting intake',
      severity: 'Normal',
      eta: '',
    });
  }, []);

  const handleEditRepairTicket = useCallback((ticket) => {
    if (!ticket) return;
    setRepairTicketForm({
      id: ticket.id || null,
      assetId: ticket.assetId || '',
      model: ticket.model || '',
      assignedTo: ticket.assignedTo || '',
      location: ticket.location || '',
      issue: ticket.issue || '',
      status: ticket.status || 'Awaiting intake',
      severity: ticket.severity || 'Normal',
      eta: ticket.eta || '',
    });
  }, []);

  const handleSaveRepairTicket = useCallback(
    (ticket) => {
      if (!ticket) {
        setRepairTicketForm(null);
        return;
      }
      const normalized = {
        ...ticket,
        id: ticket.id || `manual-${Date.now()}`,
        assetId: ticket.assetId || 'Laptop',
        model: ticket.model || 'Laptop',
        assignedTo: ticket.assignedTo || 'Unassigned',
        location: ticket.location || 'Operations',
        status: ticket.status || 'Awaiting intake',
        severity: ticket.severity || 'Normal',
        eta: ticket.eta || '',
      };
      
      // If repair is completed, remove from list and record history
      if (normalized.status === 'Completed') {
        setRepairTickets((prev) => prev.filter((item) => item.id !== normalized.id));
        
        // Find the asset and update its status back to Available
        setAssets((prev) =>
          prev.map((asset) => {
            if (asset.id === normalized.assetId || asset.assetName === normalized.assetId || asset.sheetId === normalized.assetId) {
              return normalizeAssetStatus({
                ...asset,
                status: 'Available',
              });
            }
            return asset;
          })
        );
        
        // Record in history
        setHistory((prev) => [
          {
            id: `history-${Date.now()}`,
            assetId: normalized.assetId,
            action: 'Repair Completed',
            user: 'IT Operations',
            date: new Date().toISOString().split('T')[0],
            notes: `${normalized.severity} priority repair completed. Issue: ${normalized.issue || 'N/A'}`,
          },
          ...prev,
        ]);
      } else {
        // Update or add repair ticket
        setRepairTickets((prev) => {
          const exists = prev.some((item) => item.id === normalized.id);
          return exists ? prev.map((item) => (item.id === normalized.id ? normalized : item)) : [normalized, ...prev];
        });
      }
      
      setRepairTicketForm(null);
    },
    [setRepairTickets, setAssets, setHistory],
  );

  const commandItems = useMemo(() => {
    const items = [];
    assets.forEach((asset) => {
      const label = asset.assetName || asset.deviceName || asset.serialNumber || 'Asset';
      const subtitle = `${asset.type || ''} - ${asset.serialNumber || ''}`.trim();
      items.push({ id: asset.id, kind: 'asset', label, subtitle });
      items.push({ id: asset.id, kind: 'automate', label: `Open Automate: ${label}`, subtitle: subtitle || 'Automate deep link' });
    });
    networkPrinters.forEach((printer) => {
      const label = `${printer.deviceType || 'Printer'} @ ${printer.location || 'Unknown'}`;
      items.push({ id: printer.id, kind: 'printer', label, subtitle: printer.model || '' });
    });
    employeeGallery.forEach((member) => {
      const memberKey = member.id || normalizeKey(member.name || '');
      items.push({
        id: memberKey,
        kind: 'employee',
        label: member.name,
        subtitle: `${member.title || ''} - ${member.department || ''}`,
      });
    });
    return items;
  }, [assets, employeeGallery, networkPrinters]);

  const commandResults = useMemo(() => {
    const query = commandQuery.trim().toLowerCase();
    if (!query) {
      return commandItems.slice(0, 12);
    }
    return commandItems
      .filter((item) => item.label.toLowerCase().includes(query) || (item.subtitle || '').toLowerCase().includes(query))
      .slice(0, 20);
  }, [commandItems, commandQuery]);

  const handleCommandSelect = useCallback(
    (item) => {
      if (!item) return;
      setCommandPaletteOpen(false);
      setCommandQuery('');
      if (item.kind === 'asset') {
        setActivePage('Hardware');
        setSelectedAssetId(item.id);
        setSpotlightOpen(true);
        return;
      }
      if (item.kind === 'automate') {
        const asset = assets.find((a) => a.id === item.id);
        if (asset) {
          handleOpenAutomate(asset);
        }
        return;
      }
      if (item.kind === 'printer') {
        const printer = networkPrinters.find((p) => p.id === item.id);
        if (printer) {
          handleEditPrinter(printer);
        }
        setActivePage('Hardware');
        return;
      }
      if (item.kind === 'employee') {
        setActivePage('Employees');
        setEmployeeSearch(item.label || '');
        setEmployeeFilters({ department: 'all', location: 'all', jobTitle: 'all' });
        setEmployeePage(1);
        setExpandedEmployeeId(item.id);
        setTimeout(() => {
          const el = document.getElementById(`employee-card-${item.id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.focus?.();
          }
        }, 300);
      }
    },
    [
      assets,
      handleEditPrinter,
      handleOpenAutomate,
      networkPrinters,
      setActivePage,
      setEmployeeFilters,
      setEmployeePage,
      setEmployeeSearch,
      setExpandedEmployeeId,
    ],
  );

  const handleSaveAsset = async (payload) => {
    const derivedBrand = payload.brand || (payload.model ? payload.model.split(' ')[0] : '');
    const estimatedCost = estimateCost(payload.type, payload.model, derivedBrand);
    const phoneType = (payload.type || '').toLowerCase() === 'phone';
    const normalizedAssetName = phoneType
      ? payload.assetName || payload.deviceName || payload.serialNumber || payload.sheetId || `Phone-${payload.id ?? Date.now()}`
      : payload.assetName;
    const normalizedDeviceName = phoneType
      ? payload.deviceName || normalizedAssetName
      : payload.deviceName;
    const providedCost = Number(payload.cost);
    const basePayload = {
      ...payload,
      brand: derivedBrand,
      assetName: normalizedAssetName,
      deviceName: normalizedDeviceName,
      id: payload.id ?? Date.now(),
      cost: Number.isFinite(providedCost) && providedCost > 0 ? providedCost : estimatedCost,
      qrCode: payload.qrCode || `QR-${payload.serialNumber || payload.id}`,
    };
    const qualityIssues = getAssetQualityIssues(basePayload);
    const inferredApproval = payload.approvalStatus || (qualityIssues.length ? 'Pending Approval' : 'Approved');
    if (qualityIssues.length && !payload.approvalStatus) {
      const proceed = window.confirm(
        `This asset is missing: ${qualityIssues.join(', ')}. Proceed and mark as Pending Approval?`,
      );
      if (!proceed) {
        return;
      }
    }
    const enrichedPayload = { ...basePayload, approvalStatus: inferredApproval };

    const upsertLocalAsset = (asset) => {
      setAssets((prev) => {
        const assetId = asset.id ?? Date.now();
        const existing = prev.find((item) => item.id === assetId);
        const assetName =
          existing?.assetName || asset.assetName || asset.sheetId || asset.serialNumber || `Asset-${assetId}`;
        const normalized = normalizeAssetStatus({ ...asset, id: assetId, assetName });
        if (existing) {
          return prev.map((item) => (item.id === normalized.id ? normalized : item));
        }
        return [...prev, normalized];
      });
    };

    upsertLocalAsset(enrichedPayload);
    setAssetForm(null);
  };

  const handleStartScanner = () => {
    setScannerError('');
    setScanMessage('');
    setScannerActive(true);
    setActivePage('Hardware');
    setMenuOpen(false);
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const el = document.getElementById('qr-tools-overview');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  };

  const handleStopScanner = () => {
    setScannerActive(false);
    setScanMessage('');
  };

  const handleJumpToSection = useCallback(
    (page, sectionId) => {
      setActivePage(page);
      setMenuOpen(false);
      if (typeof window === 'undefined' || !sectionId) {
        return;
      }
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    },
    [],
  );

  const handleNeedsInfoClick = useCallback(() => {
    setFilters({ ...defaultAssetFilters, readiness: 'needs' });
    setAssetPage(1);
    handleJumpToSection('Hardware', 'asset-table');
  }, [defaultAssetFilters, handleJumpToSection]);

  const [scanEmployee, setScanEmployee] = useState('');

  const handleUseScanResult = () => {
    const value = (manualScanInput || scanResult || '').trim();
    if (!value) {
      setScanMessage('Enter or scan a code first.');
      return;
    }
    setScanResult(value);
    const normalized = normalizeScanValue(value);
    const matchedAsset = assets.find((asset) => assetMatchesScanValue(asset, normalized)) || null;
    setFilters((prev) => ({ ...prev, search: value }));
    setActivePage('Hardware');
    if (matchedAsset) {
      setSelectedAssetId(matchedAsset.id);
      setActionState({
        asset: matchedAsset,
        mode: matchedAsset.checkedOut ? 'checkin' : 'checkout',
        user: scanEmployee || matchedAsset.assignedTo || '',
      });
      setScanMessage(`Matched ${matchedAsset.assetName || matchedAsset.serialNumber || 'asset'}`);
      setManualScanInput('');
      setScanEmployee('');
    } else {
      setScanMessage('No asset matched this code.');
    }
    if (typeof window === 'undefined') {
      return;
    }
    const section = document.getElementById('asset-table');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleToggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const handleAddEmployee = useCallback(() => {
    setEmployeeForm({ ...defaultEmployeeProfile });
    setActivePage('Employees');
  }, []);
  const handleOpenPhoto = useCallback((member) => {
    if (!member?.avatar) {
      return;
    }
    setPhotoLightbox({
      src: member.avatar,
      name: member.name || 'Employee photo',
      title: member.title || '',
    });
  }, []);

  const handleSortChange = useCallback((keyOrConfig) => {
    setAssetSort((prev) => {
      const isObject = typeof keyOrConfig === 'object' && keyOrConfig !== null;
      const key = isObject ? keyOrConfig.key : keyOrConfig;
      if (!key) {
        return prev;
      }
      if (isObject && keyOrConfig.direction) {
        return { key, direction: keyOrConfig.direction };
      }
      if (prev.key === key) {
        const nextDir = prev.direction === 'asc' ? 'desc' : 'asc';
        return { key, direction: nextDir };
      }
      return { key, direction: 'asc' };
    });
  }, []);

  const handleDeleteAsset = async (asset) => {
    if (!window.confirm(`Delete ${asset.assetName || `${asset.brand} ${asset.model}`}?`)) {
      return;
    }
    setAssets((prev) => prev.filter((item) => item.id !== asset.id));
  };

  const handleSaveEmployee = async (profile) => {
    if (!profile || !profile.name) {
      setEmployeeForm(null);
      return;
    }
    const trimmedName = profile.name.trim();
    const baseId = profile.id ?? `emp-${Date.now()}`;
    const lookupKey = profile.lookupKey || normalizeKey(trimmedName);
    const payload = {
      ...defaultEmployeeProfile,
      ...profile,
      id: baseId,
      name: trimmedName,
      avatar: profile.avatar || '',
      lookupKey,
    };

    const upsertLocalEmployee = (member) => {
      setEmployeeGallery((prev) => {
        const exists = prev.some((item) => item.id === member.id);
        if (exists) {
          return prev.map((item) => (item.id === member.id ? { ...item, ...member } : item));
        }
        return [member, ...prev];
      });
    };
    upsertLocalEmployee(payload);
    setEmployeeForm(null);
    setExpandedEmployeeId(payload.id);
  };

  const handleDeleteEmployee = async (member) => {
    if (!member) {
      return;
    }
    if (!window.confirm(`Remove ${member.name || 'this employee'} from the directory?`)) {
      return;
    }
    setEmployeeGallery((prev) => prev.filter((item) => item.id !== member.id));
    setExpandedEmployeeId((prev) => (prev === member.id ? null : prev));
  };

  const handleActionSubmit = async ({ assetId, mode, user, notes, date }) => {
    const currentAsset = assets.find((item) => item.id === assetId);
    const previousOwner = currentAsset?.assignedTo || '';
    const normalizedUser = normalizeKey(user);
    const normalizedPrevOwner = normalizeKey(previousOwner);

    setAssets((prev) =>
      prev.map((asset) => {
        if (asset.id !== assetId) {
          return asset;
        }
        if (mode === 'checkout') {
          const nextStatus = asset.status === 'Maintenance' || asset.status === 'Retired' ? asset.status : 'Checked Out';
          return normalizeAssetStatus({
            ...asset,
            assignedTo: user,
            status: nextStatus,
            checkedOut: true,
            checkOutDate: date,
          });
        }
        const resetStatus = asset.status === 'Maintenance' || asset.status === 'Retired' ? asset.status : 'Available';
        return normalizeAssetStatus({
          ...asset,
          assignedTo: 'Unassigned',
          status: resetStatus,
          checkedOut: false,
          checkOutDate: '',
        });
      }),
    );

    const skipHistory =
      (mode === 'checkout' && normalizedUser === 'unassigned') ||
      (mode === 'checkin' && (!previousOwner || normalizedPrevOwner === 'unassigned'));

    if (!skipHistory) {
      setHistory((prev) => [
        ...prev,
        {
          id: Date.now(),
          assetId,
          action: mode === 'checkout' ? 'Check Out' : 'Check In',
          user: mode === 'checkout' ? user : previousOwner || 'Unassigned',
          notes,
          date,
        },
      ]);
    }

    setActionState(null);
  };
  const handleLoanerCheckout = useCallback(
    (asset) => {
      if (!asset) {
        return;
      }
      setActionState({ asset, mode: 'checkout' });
    },
    [setActionState],
  );
  const handleLoanerCheckin = useCallback(
    (asset) => {
      if (!asset) {
        return;
      }
      setActionState({ asset, mode: 'checkin' });
    },
    [setActionState],
  );

  const handleOpenRepairTicketForAsset = useCallback(
    (asset) => {
      if (!asset) return;
      setRepairTicketForm({
        ...EMPTY_REPAIR_TICKET,
        assetId: asset.assetName || asset.id || '',
        model: asset.model || '',
        assignedTo: asset.assignedTo || '',
        location: asset.location || '',
        vendor: asset.vendor || asset.brand || '',
        deviceType: asset.type || 'Laptop',
      });
    },
    [setRepairTicketForm],
  );

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ assets, licenses: licenseBuckets, maintenanceRecords, history }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'asset-management-data.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };
  const handleExportQrPng = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleOpenHelpDeskPortal = useCallback(() => {
    setMenuOpen(false);
    setActivePage('HelpDesk');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // HelpDesk Portal Handlers


  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const userCreatedRequests = helpdeskRequests.filter((request) => request.fromUser);
      window.localStorage.setItem(STORAGE_KEYS.helpdeskRequests, JSON.stringify(userCreatedRequests));
    } catch (error) {
      console.warn('Unable to persist requests', error);
    }
  }, [helpdeskRequests]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const lastMessages = helpdeskChatMessages.slice(-20);
      window.localStorage.setItem(STORAGE_KEYS.helpdeskChat, JSON.stringify(lastMessages));
    } catch (error) {
      console.warn('Unable to persist chat messages', error);
    }
  }, [helpdeskChatMessages]);

  useEffect(() => {
    if (!helpdeskFormAlert || helpdeskFormAlert.type === 'error' || helpdeskFormAlert.detailText) return;
    const timeout = setTimeout(() => setHelpdeskFormAlert(null), 6000);
    return () => clearTimeout(timeout);
  }, [helpdeskFormAlert]);

  useEffect(
    () => () => {
      if (helpdeskTypingTimeoutRef.current) {
        clearTimeout(helpdeskTypingTimeoutRef.current);
      }
    },
    [],
  );

  const handleHelpdeskFormSubmit = async (event) => {
    event.preventDefault();
    const trimmedForm = {
      name: helpdeskForm.name.trim(),
      email: helpdeskForm.email.trim(),
      department: helpdeskForm.department.trim(),
      topic: helpdeskForm.topic.trim(),
      urgency: helpdeskForm.urgency,
      details: helpdeskForm.details.trim(),
    };
    const missingFields = [];
    if (!trimmedForm.name) missingFields.push('name');
    if (!trimmedForm.email) missingFields.push('email');
    if (!trimmedForm.topic) missingFields.push('topic');
    if (!trimmedForm.details) missingFields.push('details');
    if (missingFields.length) {
      setHelpdeskFormAlert({ type: 'error', message: `Please complete the required fields: ${missingFields.join(', ')}.` });
      return;
    }
    const emailInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedForm.email);
    if (emailInvalid) {
      setHelpdeskFormAlert({ type: 'error', message: 'Please enter a valid email address so we can follow up.' });
      return;
    }
    setHelpdeskIsSubmitting(true);
    setHelpdeskFormAlert(null);
    try {
      const now = new Date();
      const entry = {
        id: `REQ-${Math.floor(Math.random() * 9000 + 1000)}`,
        type: trimmedForm.topic.toLowerCase().includes('issue') ? 'Issue' : 'Request',
        name: trimmedForm.name,
        topic: trimmedForm.topic,
        status: 'Pending',
        timestamp: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        fromUser: true,
      };
      setHelpdeskRequests((prev) => [entry, ...prev]);
      setHelpdeskForm((prev) => ({
        ...prev,
        name: trimmedForm.name,
        email: trimmedForm.email,
        department: trimmedForm.department,
        topic: '',
        details: '',
      }));
      const payload = {
        name: trimmedForm.name,
        email: trimmedForm.email,
        department: trimmedForm.department,
        urgency: trimmedForm.urgency,
        topic: trimmedForm.topic,
        details: trimmedForm.details,
      };
      const emailBody = buildHelpDeskEmailBody(payload);
      sendHelpDeskEmail(payload, { body: emailBody });
      const copied = await copyTicketToClipboard(emailBody);
      setHelpdeskFormAlert({
        type: 'success',
        message: copied
          ? 'Request logged! We opened your email client and copied the ticket text in case you need it elsewhere.'
          : 'Request logged! Your email client should open automatically. Copy the ticket details below if it does not.',
        detailText: copied ? undefined : emailBody,
      });
    } catch (error) {
      console.error('Unable to submit help desk request', error);
      setHelpdeskFormAlert({
        type: 'error',
        message: 'Something went wrong drafting the ticket. Please try again or email ITHelpDesk@udservices.org directly.',
      });
    } finally {
      setHelpdeskIsSubmitting(false);
    }
  };

  const scrollToRequestForm = () => {
    if (typeof document === 'undefined') return;
    document.getElementById('helpdesk-request-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleHelpdeskQuickTopic = (topic) => {
    if (!topic) return;
    setHelpdeskForm((prev) => ({
      ...prev,
      topic,
      details: prev.details || '',
    }));
    setHelpdeskFormAlert(null);
    scrollToRequestForm();
  };

  const resetHelpdeskChat = () => {
    if (helpdeskTypingTimeoutRef.current) {
      clearTimeout(helpdeskTypingTimeoutRef.current);
      helpdeskTypingTimeoutRef.current = null;
    }
    setHelpdeskChatMessages(getDefaultChatMessages());
    setHelpdeskBotTyping(false);
    setHelpdeskChatInput('');
  };

  const handleHelpdeskAlertCopy = async () => {
    if (!helpdeskFormAlert?.detailText) return;
    const copied = await copyTicketToClipboard(helpdeskFormAlert.detailText);
    if (copied) {
      setHelpdeskFormAlert((prev) => (prev ? { ...prev, message: 'Ticket body copied. Paste it anywhere you need it.' } : prev));
    }
  };

  const sendHelpdeskChat = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setHelpdeskChatMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setHelpdeskChatInput('');
    setHelpdeskBotTyping(true);
    if (helpdeskTypingTimeoutRef.current) {
      clearTimeout(helpdeskTypingTimeoutRef.current);
    }
    const replyDelay = Math.min(900, 250 + trimmed.length * 8);
    helpdeskTypingTimeoutRef.current = setTimeout(() => {
      setHelpdeskBotTyping(false);
      setHelpdeskChatMessages((prev) => [...prev, { role: 'bot', text: buildAiReply(trimmed) }]);
      helpdeskTypingTimeoutRef.current = null;
    }, replyDelay);
  };

  const vendorQuickActions = useMemo(
    () => [
      {
        title: 'Brother toner replenishment',
        description: 'Email Sara Smoker with the device ID and site to dispatch Brother toner or drums.',
        icon: Printer,
        actionLabel: 'Email Sara',
        onAction: () => {
          if (typeof window === 'undefined') {
            return;
          }
          window.location.href = 'mailto:Sara@weaverassociatesinc.com?subject=Brother%20Toner%20Request';
        },
      },
      {
        title: 'Order Canon supplies',
        description: 'Open the Colony Products form to request toner for Canon copiers.',
        icon: ExternalLink,
        actionLabel: 'Open Colony form',
        onAction: () => {
          if (typeof window === 'undefined') {
            return;
          }
          window.open('https://www.colonyproducts.com/contact/order-supplies/', '_blank', 'noopener,noreferrer');
        },
      },
      {
        title: 'Dell procurement portal',
        description: 'Launch Dell Premier to place laptop, monitor, or dock replenishment orders.',
        icon: Server,
        actionLabel: 'Open Dell Premier',
        onAction: () => {
          if (typeof window === 'undefined') {
            return;
          }
          window.open('https://www.dell.com/premier', '_blank', 'noopener,noreferrer');
        },
      },
      {
        title: 'Verizon line support',
        description: 'Submit SIM swaps, activations, or device upgrades with Verizon Business Support.',
        icon: PhoneCall,
        actionLabel: 'Open Verizon support',
        onAction: () => {
          if (typeof window === 'undefined') {
            return;
          }
          window.open('https://www.verizon.com/business/support/', '_blank', 'noopener,noreferrer');
        },
      },
    ],
    [],
  );
  const menuNavItems = [
    { label: 'Overview', onClick: () => handleJumpToSection('Overview', 'overview-preview') },
    { label: 'Hardware', onClick: () => handleJumpToSection('Hardware', 'hardware-hero') },
    { label: 'Repairs', onClick: () => handleJumpToSection('Repairs', 'repairs-hero') },
    { label: 'Employees', onClick: () => handleJumpToSection('Employees', 'employees-hero') },
    { label: 'Reports', onClick: () => handleJumpToSection('Reports', 'reports-hero') },
    { label: 'Software', onClick: () => handleJumpToSection('Software', 'software-hero') },
    { label: 'Vendors', onClick: () => handleJumpToSection('Vendors', 'vendors-hero') },
    { label: 'HelpDesk Portal', page: 'HelpDesk', onClick: handleOpenHelpDeskPortal },
  ];

  const menuSectionLinks = [
    { label: 'Workspace previews', onClick: () => handleJumpToSection('Overview', 'overview-preview') },
    { label: 'QR tools', onClick: () => handleJumpToSection('Hardware', 'qr-tools-overview') },
    { label: 'Asset table', onClick: () => handleJumpToSection('Hardware', 'asset-table') },
    { label: 'Repair desk', onClick: () => handleJumpToSection('Repairs', 'repairs-hero') },
    { label: 'Parts ordering', onClick: () => handleJumpToSection('Repairs', 'repair-resources') },
    { label: 'Employee directory', onClick: () => handleJumpToSection('Employees', 'employee-directory') },
    { label: 'Reports gallery', onClick: () => handleJumpToSection('Reports', 'reports-hero') },
    { label: 'Software suites', onClick: () => handleJumpToSection('Software', 'software-hero') },
    { label: 'Vendor partners', onClick: () => handleJumpToSection('Vendors', 'vendors-hero') },
  ];

  const menuActionItems = [
    {
      label: 'Add asset',
      onClick: () => {
        setAssetForm(defaultAsset);
        setActivePage('Hardware');
        setMenuOpen(false);
      },
      icon: Plus,
    },
    {
      label: 'Add employee',
      onClick: () => {
        setEmployeeForm({ ...defaultEmployeeProfile });
        setActivePage('Employees');
        setMenuOpen(false);
      },
      icon: Users,
    },
    {
      label: 'Add software suite',
      onClick: () => {
        setSoftwareForm({ ...defaultSoftwareSuite });
        setActivePage('Software');
        setMenuOpen(false);
      },
      icon: Download,
    },
    {
      label: 'Warranty alerts',
      onClick: () => {
        setMenuOpen(false);
        setWarrantyModalOpen(true);
      },
      icon: CalendarClock,
    },
    {
      label: 'Scan barcode',
      onClick: () => {
        setMenuOpen(false);
        handleStartScanner();
      },
      icon: Scan,
    },
    {
      label: 'Export data',
      onClick: () => {
        setMenuOpen(false);
        handleExport();
      },
      icon: Share2,
    },
    {
      label: 'HelpDesk portal',
      onClick: () => {
        setMenuOpen(false);
        handleOpenHelpDeskPortal();
      },
      icon: ArrowRightLeft,
    },
  ];

  const menuUtilityItems = [
    {
      label: 'Search',
      onClick: () => {
        setCommandPaletteOpen(true);
        setMenuOpen(false);
      },
      icon: Search,
    },
    {
      label: isDarkMode ? 'Switch to light theme' : 'Switch to dark theme',
      onClick: () => {
        setMenuOpen(false);
        handleToggleTheme();
      },
      icon: isDarkMode ? Sun : Moon,
    },
  ];
  useEffect(() => {
    if (!reminderPrefs.email) {
      return;
    }
    const alertsDueIn30Days = warrantyReminders.filter(
      (reminder) =>
        reminder.type === 'Warranty' &&
        !reminder.overdue &&
        Number(reminder.daysRemaining) === 30 &&
        reminder.warrantyExpiry,
    );
    alertsDueIn30Days.forEach((reminder) => {
      const key = `${reminder.assetId || reminder.assetName || 'unknown'}-${reminder.warrantyExpiry}`;
      if (sentWarrantyAlertRef.current.has(key)) {
        return;
      }
      sentWarrantyAlertRef.current.add(key);
      // Email notification intentionally removed in the IT-facing app.
    });
  }, [reminderPrefs.email, sentWarrantyAlertRef, warrantyReminders]);
  useEffect(() => {
    if (!reminderPrefs.zoom || !ZOOM_WEBHOOK_URL) {
      return;
    }
    const alertsDueSoon = warrantyReminders.filter(
      (reminder) => reminder.type === 'Warranty' && reminder.warrantyExpiry && reminder.daysRemaining <= 14,
    );
    if (alertsDueSoon.length === 0) {
      return;
    }
    const send = async () => {
      for (const reminder of alertsDueSoon) {
        const key = `zoom-${reminder.assetId || reminder.assetName || 'unknown'}-${reminder.warrantyExpiry}`;
        if (sentWarrantyAlertRef.current.has(key)) {
          continue;
        }
        sentWarrantyAlertRef.current.add(key);
        const title = reminder.overdue
          ? 'Warranty expired'
          : `Warranty expiring in ${reminder.daysRemaining} days`;
        const details = `${reminder.assetName || 'Device'} - ${reminder.location || 'Location TBD'} - Owner: ${
          reminder.assignedTo || 'Unassigned'
        } - Expires ${formatDate(reminder.warrantyExpiry)}`;
        await sendZoomAlert(title, details);
      }
    };
    send();
  }, [reminderPrefs.zoom, warrantyReminders]);
  const overdueAlerts = useMemo(() => lifecycleReminders.filter((item) => item.overdue), [lifecycleReminders]);
  const dueSoonAlerts = useMemo(
    () => lifecycleReminders.filter((item) => !item.overdue && item.daysRemaining >= 0 && item.daysRemaining <= 14),
    [lifecycleReminders],
  );

  const snapshotMetrics = useMemo(
    () => [
      {
        label: 'Loaners staged',
        value: laptopServiceSummary.loanerAvailableCount || 0,
        subline: `${laptopServiceSummary.loanerTotal || 0} in pool`,
      },
      {
        label: 'Alerts open',
        value: overdueAlerts.length + dueSoonAlerts.length,
        subline: `${overdueAlerts.length} overdue / ${dueSoonAlerts.length} due soon`,
      },
      {
        label: 'Expires in 30d',
        value: warrantyAlerts30.length,
        subline: 'Warranty or renewal checks queued',
      },
      {
        label: 'License coverage',
        value: `${licenseInsights.percent || 0}%`,
        subline: `${licenseInsights.used || 0}/${licenseInsights.seats || 0} seats in use`,
      },
      {
        label: 'New this year',
        value: stats.newThisYear || 0,
        subline: 'Fresh hardware added to the fleet',
      },
      {
        label: 'Work orders',
        value: maintenanceWorkOrders.length,
        subline: 'Active maintenance tickets',
      },
      {
        label: 'Remote fleet',
        value: remoteAssetCount,
        subline: 'Devices assigned to remote/hybrid staff',
      },
      {
        label: 'Employees active',
        value: employeeGallery.length,
        subline: `${employeeDepartmentCount} departments`,
      },
    ],
    [
      dueSoonAlerts.length,
      laptopServiceSummary.loanerAvailableCount,
      laptopServiceSummary.loanerTotal,
      licenseInsights.percent,
      licenseInsights.seats,
      licenseInsights.used,
      maintenanceWorkOrders.length,
      overdueAlerts.length,
      remoteAssetCount,
      employeeDepartmentCount,
      employeeGallery.length,
      stats.newThisYear,
      warrantyAlerts30.length,
    ],
  );

  const lifecycleAgingReport = useMemo(() => {
    const buckets = [
      { label: '< 1 year', min: 0, max: 1, assets: [] },
      { label: '1-3 years', min: 1, max: 3, assets: [] },
      { label: '3-5 years', min: 3, max: 5, assets: [] },
      { label: '5+ years', min: 5, max: Infinity, assets: [] },
    ];
    const unknown = [];
    const now = Date.now();
    assets.forEach((asset) => {
      const purchaseDate = asset.purchaseDate ? new Date(asset.purchaseDate) : null;
      if (!purchaseDate || Number.isNaN(purchaseDate.getTime())) {
        unknown.push(asset);
        return;
      }
      const ageYears = (now - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      const bucket = buckets.find((b) => ageYears >= b.min && ageYears < b.max);
      if (bucket) {
        bucket.assets.push({ ...asset, ageYears: Math.round(ageYears * 10) / 10 });
      } else {
        unknown.push(asset);
      }
    });
    const summary = buckets.map((bucket) => ({ label: bucket.label, count: bucket.assets.length }));
    return { buckets, unknown, summary };
  }, [assets]);

  const dataQualityReport = useMemo(() => {
    const issues = assets
      .map((asset) => ({ asset, issues: assetQualityMap[asset.id]?.issues || [] }))
      .filter((entry) => entry.issues.length > 0);
    const counts = issues.reduce((acc, entry) => {
      entry.issues.forEach((issue) => {
        acc[issue] = (acc[issue] || 0) + 1;
      });
      return acc;
    }, {});
    return { issues, counts };
  }, [assetQualityMap, assets]);

  const utilizationReport = useMemo(() => {
    const byType = assets.reduce((acc, asset) => {
      const key = asset.type || 'Other';
      if (!acc[key]) acc[key] = { total: 0, checkedOut: 0 };
      acc[key].total += 1;
      acc[key].checkedOut += asset.checkedOut ? 1 : 0;
      return acc;
    }, {});
    const idleAssets = assets.filter((asset) => !asset.checkedOut && asset.status !== 'Retired').slice(0, 15);
    return { byType, idleAssets };
  }, [assets]);

  const maintenanceSlaReport = useMemo(() => {
    const byStatus = maintenanceWorkOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
    const bySeverity = maintenanceWorkOrders.reduce((acc, order) => {
      acc[order.severity] = (acc[order.severity] || 0) + 1;
      return acc;
    }, {});
    return { byStatus, bySeverity, workOrders: maintenanceWorkOrders };
  }, [maintenanceWorkOrders]);

  const softwareComplianceReport = useMemo(
    () => ({ suites: licenseCompliance, summary: licenseInsights }),
    [licenseCompliance, licenseInsights],
  );

  const riskReport = useMemo(() => {
    const overdueWarranty = lifecycleReminders.filter((reminder) => reminder.overdue);
    const criticalMaintenance = maintenanceWorkOrders.filter((order) => /high|urgent/i.test(order.severity || ''));
    return { overdueWarranty, criticalMaintenance };
  }, [lifecycleReminders, maintenanceWorkOrders]);

  const auditReport = useMemo(
    () => ({
      inventory: assets.map((asset) => ({
        assetId: asset.sheetId || asset.assetName || `Asset-${asset.id}`,
        name: asset.assetName || '',
        type: asset.type || '',
        model: asset.model || '',
        serial: asset.serialNumber || '',
        location: normalizeLocationLabel(asset.location || ''),
        assignedTo: asset.assignedTo || 'Unassigned',
        status: getAssetDisplayStatus(asset),
        purchaseDate: asset.purchaseDate || '',
      })),
    }),
    [assets],
  );

  const financialRollupReport = useMemo(
    () => ({
      depreciationForecast,
      spendByDepartment: costByDepartment,
      licenseSpend: licenseCompliance,
    }),
    [costByDepartment, depreciationForecast, licenseCompliance],
  );

  const procurementReport = useMemo(() => {
    const unassigned = assets.filter((asset) => !asset.assignedTo || asset.assignedTo === 'Unassigned');
    const readyToDeploy = unassigned.filter((asset) => asset.status !== 'Retired' && !asset.checkedOut).slice(0, 20);
    return { readyToDeploy, total: readyToDeploy.length };
  }, [assets]);

  const sustainabilityReport = useMemo(() => {
    const now = Date.now();
    const recycleCandidates = assets.filter((asset) => {
      if (asset.status === 'Retired') return true;
      const purchaseDate = asset.purchaseDate ? new Date(asset.purchaseDate) : null;
      if (!purchaseDate || Number.isNaN(purchaseDate.getTime())) return false;
      const ageYears = (now - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      return ageYears >= 5;
    });
    return { recycleCandidates };
  }, [assets]);

  const executiveSnapshotReport = useMemo(
    () => ({
      totals: stats,
      license: licenseInsights,
      maintenance: { open: maintenanceWorkOrders.length },
      dataQuality: { gaps: Object.keys(assetQualityMap).length },
    }),
    [assetQualityMap, licenseInsights, maintenanceWorkOrders.length, stats],
  );

  const reportCatalog = useMemo(
    () => [
      {
        title: 'Laptop refresh',
        description: 'Laptops 5+ years old using the selected evaluation date.',
        payload: {
          referenceDate: laptopRefreshReport.referenceDate.toISOString(),
          thresholdDate: laptopRefreshReport.thresholdDate.toISOString(),
          laptops: laptopRefreshReport.rows,
        },
      },
      {
        title: 'Loaner coverage',
        description: 'Availability vs. deployments across the loaner pool.',
        payload: { summary: laptopServiceSummary },
      },
      {
        title: 'License compliance',
        description: 'Seat utilization with buffers for every suite.',
        payload: { suites: licenseCompliance },
      },
      {
        title: 'Lifecycle readiness',
        description: 'Upcoming warranty expirations and service reminders.',
        payload: { reminders: lifecycleReminders },
      },
      {
        title: 'Departmental spend',
        description: 'Top hardware cost centers based on asset values.',
        payload: { departments: costByDepartment },
      },
      {
        title: 'Lifecycle aging',
        description: 'Devices grouped by age to plan refresh and budget.',
        payload: lifecycleAgingReport,
      },
      {
        title: 'Data quality gaps',
        description: 'Assets missing serials, locations, owners, or models.',
        payload: dataQualityReport,
      },
      {
        title: 'Utilization and idle pool',
        description: 'Checkout vs available by type plus idle device list.',
        payload: utilizationReport,
      },
      {
        title: 'Maintenance SLA',
        description: 'Open work orders by status and severity.',
        payload: maintenanceSlaReport,
      },
      {
        title: 'Software compliance',
        description: 'License risks and utilization by suite.',
        payload: softwareComplianceReport,
      },
      {
        title: 'Risk and incidents',
        description: 'Overdue warranties and high-severity maintenance tickets.',
        payload: riskReport,
      },
      {
        title: 'Financial rollup',
        description: 'Depreciation forecast and spend by department.',
        payload: financialRollupReport,
      },
      {
        title: 'Audit report',
        description: 'Inventory export for audit sampling and spot checks.',
        payload: auditReport,
      },
      {
        title: 'Procurement pipeline',
        description: 'Unassigned inventory ready to deploy.',
        payload: procurementReport,
      },
      {
        title: 'Sustainability',
        description: 'Retired or 5+ year devices eligible for recycling.',
        payload: sustainabilityReport,
      },
      {
        title: 'Executive snapshot',
        description: 'One-page KPI rollup for leadership.',
        payload: executiveSnapshotReport,
      },
    ],
    [
      dataQualityReport,
      costByDepartment,
      auditReport,
      executiveSnapshotReport,
      financialRollupReport,
      laptopRefreshReport,
      laptopServiceSummary,
      licenseCompliance,
      lifecycleAgingReport,
      lifecycleReminders,
      maintenanceSlaReport,
      procurementReport,
      riskReport,
      sustainabilityReport,
      utilizationReport,
      softwareComplianceReport,
    ],
  );

  const overviewPreviewCards = useMemo(() => {
    const formatCount = (value) => (Number(value) || 0).toLocaleString();
    const licenseCoverage = Math.round(Number(licenseInsights.percent) || 0);
    const avgRepairAge = Math.round(Number(laptopServiceSummary.avgRepairAgeMonths) || 0);
    const loanersReady = laptopServiceSummary.loanerAvailableCount || 0;
    const openHelpdeskCount = helpdeskRequests.filter((request) => (request.status || '').toLowerCase() !== 'resolved').length;

    return [
      {
        key: 'Hardware',
        title: 'Hardware',
        description: 'Inventory & readiness',
        icon: Laptop,
        tone: 'blue',
        highlights: [
          { label: 'Devices', value: formatCount(stats.total) },
          { label: 'Ready', value: formatCount(stats.available) },
        ],
        meta: `${formatCount(stats.checkedOut)} checked out`,
      },
      {
        key: 'Repairs',
        title: 'Repairs',
        description: 'Service queue overview',
        icon: Wrench,
        tone: 'amber',
        highlights: [
          { label: 'Work orders', value: formatCount(maintenanceWorkOrders.length) },
          { label: 'Loaners ready', value: formatCount(loanersReady) },
        ],
        meta: `${avgRepairAge} mo avg repair`,
      },
      {
        key: 'Employees',
        title: 'Employees',
        description: 'Directory & ownership',
        icon: Users,
        tone: 'emerald',
        highlights: [
          { label: 'Directory', value: formatCount(employeeGallery.length) },
          { label: 'Departments', value: formatCount(employeeDepartmentCount) },
        ],
        meta: `${formatCount(remoteAssetCount)} remote devices`,
      },
      {
        key: 'Software',
        title: 'Software',
        description: 'Licenses & renewals',
        icon: Plug,
        tone: 'indigo',
        highlights: [
          { label: 'Seats', value: `${licenseInsights.used || 0}/${licenseInsights.seats || 0}` },
          { label: 'Renewals 90d', value: formatCount(softwareRenewalsDue90Days.length) },
        ],
        meta: `${licenseCoverage}% coverage`,
      },
      {
        key: 'Reports',
        title: 'Reports',
        description: 'Trends & KPIs',
        icon: BarChart3,
        tone: 'rose',
        highlights: [
          { label: 'Reports', value: formatCount(reportCatalog.length) },
          { label: 'Signals', value: formatCount(snapshotMetrics.length) },
        ],
        meta: `${formatCount(stats.expiringSoon || 0)} assets due`,
      },
      {
        key: 'Vendors',
        title: 'Vendors',
        description: 'Partners & SLAs',
        icon: Tag,
        tone: 'purple',
        highlights: [
          { label: 'Partners', value: formatCount(vendorProfiles.length) },
          { label: 'Devices', value: formatCount(vendorTotals.devices) },
        ],
        meta: `${formatCount(vendorTotals.active)} active`,
      },
      {
        key: 'HelpDesk',
        title: 'Help desk',
        description: 'Requests & routing',
        icon: Headset,
        tone: 'slate',
        highlights: [
          { label: 'Requests', value: formatCount(helpdeskRequests.length) },
          { label: 'Open', value: formatCount(openHelpdeskCount) },
        ],
        meta: 'Route the next ticket',
      },
    ];
  }, [
    employeeDepartmentCount,
    employeeGallery.length,
    helpdeskRequests,
    licenseInsights.percent,
    licenseInsights.seats,
    licenseInsights.used,
    maintenanceWorkOrders.length,
    reportCatalog.length,
    remoteAssetCount,
    snapshotMetrics.length,
    softwareRenewalsDue90Days.length,
    stats.available,
    stats.checkedOut,
    stats.expiringSoon,
    stats.total,
    vendorProfiles.length,
    vendorTotals.active,
    vendorTotals.devices,
    laptopServiceSummary.avgRepairAgeMonths,
    laptopServiceSummary.loanerAvailableCount,
  ]);

  const overviewToneStyles = useMemo(
    () => ({
      blue: {
        icon: isDarkMode ? 'bg-blue-500/20 text-blue-100' : 'bg-blue-50 text-blue-700',
        meta: isDarkMode ? 'text-blue-200' : 'text-blue-600',
      },
      amber: {
        icon: isDarkMode ? 'bg-amber-500/20 text-amber-100' : 'bg-amber-50 text-amber-600',
        meta: isDarkMode ? 'text-amber-200' : 'text-amber-600',
      },
      emerald: {
        icon: isDarkMode ? 'bg-emerald-500/20 text-emerald-100' : 'bg-emerald-50 text-emerald-600',
        meta: isDarkMode ? 'text-emerald-200' : 'text-emerald-600',
      },
      indigo: {
        icon: isDarkMode ? 'bg-indigo-500/20 text-indigo-100' : 'bg-indigo-50 text-indigo-600',
        meta: isDarkMode ? 'text-indigo-200' : 'text-indigo-600',
      },
      rose: {
        icon: isDarkMode ? 'bg-rose-500/20 text-rose-100' : 'bg-rose-50 text-rose-600',
        meta: isDarkMode ? 'text-rose-200' : 'text-rose-600',
      },
      purple: {
        icon: isDarkMode ? 'bg-purple-500/20 text-purple-100' : 'bg-purple-50 text-purple-600',
        meta: isDarkMode ? 'text-purple-200' : 'text-purple-600',
      },
      slate: {
        icon: isDarkMode ? 'bg-slate-500/30 text-slate-100' : 'bg-slate-50 text-slate-600',
        meta: isDarkMode ? 'text-slate-200' : 'text-slate-500',
      },
      default: {
        icon: isDarkMode ? 'bg-slate-700/40 text-white/80' : 'bg-slate-100 text-slate-600',
        meta: isDarkMode ? 'text-slate-300' : 'text-slate-500',
      },
    }),
    [isDarkMode],
  );

  const handleRunReport = (title, payload = {}) => {
    const workbook = XLSX.utils.book_new();
    const summaryRows = [
      ['Report', title],
      ['Generated', new Date().toLocaleString()],
      ['Total assets', stats.total],
      ['License suites', licenseBuckets.length],
      ['Maintenance tickets', maintenanceRecords.length],
    ];
    const datasets = [];
    flattenReportPayload(payload, '', summaryRows, datasets);
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    datasets.forEach(({ name, rows }) => {
      if (!rows || rows.length === 0) {
        return;
      }
      let sheet;
      if (typeof rows[0] === 'object' && rows[0] !== null && !Array.isArray(rows[0])) {
        sheet = XLSX.utils.json_to_sheet(rows);
      } else {
        sheet = XLSX.utils.aoa_to_sheet(rows.map((row) => [row]));
      }
      XLSX.utils.book_append_sheet(workbook, sheet, name);
    });
    const filename = `${title.toLowerCase().replace(/\s+/g, '-')}-report.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  const handleLogout = useCallback(() => {
    setAuthUser(null);
    setAuthError('');
    fetch(buildApiUrl('/api/auth/universal/logout'), { method: 'POST', credentials: 'include' }).catch(() => {});
  }, [buildApiUrl]);

  const [loginUsername, setLoginUsername] = React.useState('');

  const beginDuoLogin = useCallback((e) => {
    e?.preventDefault();
    if (typeof window === 'undefined') return;
    if (!loginUsername.trim()) {
      setAuthError('Please enter a username');
      return;
    }
    window.location.href = buildApiUrl(`/api/auth/universal/start?username=${encodeURIComponent(loginUsername.trim())}`);
  }, [buildApiUrl, loginUsername]);

  useEffect(() => {
    if (!authUser?.expiresAt) return;
    if (Date.now() > authUser.expiresAt) {
      handleLogout();
    }
  }, [authUser, handleLogout]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-700">Checking session…</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">Login</p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900">Duo Universal Prompt</h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter your username to continue with Duo 2FA verification.
          </p>
          {authError && <p className="mt-3 rounded-2xl bg-rose-50 px-4 py-2 text-sm font-semibold status-alert">{authError}</p>}
          <form onSubmit={beginDuoLogin} className="mt-6">
            <label htmlFor="username" className="block text-sm font-medium text-slate-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              placeholder="Enter your username"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              autoFocus
            />
            <button
              type="submit"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
            >
              Continue with Duo
            </button>
          </form>
          <p className="mt-3 text-[11px] uppercase tracking-[0.25rem] text-slate-400">
            Secured by Duo Universal Prompt
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`app-canvas theme-nebula min-h-screen overflow-x-hidden pb-24 sm:pb-16 ${
        isDarkMode ? 'text-slate-100' : 'text-slate-900'
      }`}
    >
      <style>{`${LIGHT_MODE_STYLES}${DARK_MODE_STYLES}`}</style>
      <div className="ambient-layer">
        <div className="ambient-orb blue" style={{ width: '42vw', height: '42vw', top: '-12vh', left: '-8vw' }} />
        <div className="ambient-orb pink" style={{ width: '36vw', height: '36vw', bottom: '-10vh', right: '4vw' }} />
        <div className="ambient-orb gold" style={{ width: '28vw', height: '28vw', top: '32vh', right: '55vw' }} />
        <div className="grid-overlay" />
      </div>
      <div className="relative z-10">
        <div className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 lg:px-8" style={containerStyle}>
          <CommandHeader
            onAdd={() => setAssetForm(defaultAsset)}
            onAddEmployee={handleAddEmployee}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
            onToggleTheme={handleToggleTheme}
            onOpenMenu={() => setMenuOpen(true)}
            isDarkMode={isDarkMode}
            activePage={activePage}
            onNavigate={setActivePage}
          />
          <div className="experience-main space-y-8">
            <datalist id={employeeSuggestionListId}>
              {employeeNames.map((name) => (
                <option key={`employee-suggestion-${name}`} value={name} />
              ))}
            </datalist>
            <datalist id={modelSuggestionListId}>
              {modelOptions.map((model) => (
                <option key={`model-suggestion-${model}`} value={model} />
              ))}
            </datalist>
            <datalist id={departmentSuggestionListId}>
              {departmentSuggestionOptions.map((dept) => (
                <option key={`department-suggestion-${dept}`} value={dept} />
              ))}
            </datalist>
            <datalist id={locationSuggestionListId}>
              {locationSuggestionOptions.map((location) => (
                <option key={`location-suggestion-${location}`} value={location} />
              ))}
            </datalist>
            <datalist id={jobTitleSuggestionListId}>
              {jobTitleSuggestionOptions.map((title) => (
                <option key={`title-suggestion-${title}`} value={title} />
              ))}
            </datalist>
            <CommandPalette
              open={commandPaletteOpen}
              query={commandQuery}
              onQuery={setCommandQuery}
              results={commandResults}
              onSelect={handleCommandSelect}
              onClose={() => setCommandPaletteOpen(false)}
            />
        {isOffline && (
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm status-warning">
            Offline mode: changes will queue locally until you reconnect.
          </div>
        )}

        {activePage === 'Overview' && (
          <section id="overview-preview" className="mb-10 space-y-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400 dark:text-white/50">Overview</p>
              <h1 className={`text-3xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Workspace previews</h1>
              <p className={`text-sm ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>Pick a page and jump straight to the signal you need.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {overviewPreviewCards.map((card) => {
                const Icon = card.icon;
                const palette = overviewToneStyles[card.tone] || overviewToneStyles.default;
                return (
                  <button
                    key={card.key}
                    type="button"
                    onClick={() => setActivePage(card.key)}
                    className={`group flex flex-col rounded-3xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 ${
                      isDarkMode
                        ? 'border-white/15 bg-white/5 text-white/80 focus-visible:ring-white/30'
                        : 'border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50 text-slate-900 shadow-sm focus-visible:ring-blue-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className={`rounded-2xl p-3 ${palette.icon}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-base font-semibold">{card.title}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-white/60' : 'text-slate-500'}`}>{card.description}</p>
                        </div>
                      </div>
                      <ArrowRight className={`h-4 w-4 ${isDarkMode ? 'text-white/50' : 'text-slate-400'}`} />
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {card.highlights.map((highlight) => (
                        <div
                          key={`${card.key}-${highlight.label}`}
                          className={`rounded-2xl border px-3 py-2 ${
                            isDarkMode ? 'border-white/10 bg-white/5' : 'border-white/80 bg-white/90 shadow-sm'
                          }`}
                        >
                          <p className={`text-[11px] uppercase tracking-wide ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>{highlight.label}</p>
                          <p className="text-lg font-semibold">{highlight.value}</p>
                        </div>
                      ))}
                    </div>
                    {card.meta && (
                      <p className={`mt-4 text-xs font-semibold ${palette.meta}`}>
                        {card.meta}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}
        {activePage === 'Hardware' && (
          <>
            <section
              id="hardware-hero"
              className={`hero-shell relative mb-8 overflow-hidden rounded-3xl border p-8 shadow-[0_24px_80px_rgba(2,6,23,0.55)] ring-1 ${
                isDarkMode
                  ? 'border-slate-900/60 bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900 text-white ring-white/10'
                  : 'border-slate-200 bg-gradient-to-br from-white via-blue-50 to-sky-100 text-slate-900 ring-blue-100'
              }`}
              style={heroAccentStyle}
            >
              <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-blue-500/40 blur-3xl" />
              <div className="pointer-events-none absolute -right-10 top-6 h-52 w-52 rounded-full bg-rose-400/30 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 left-10 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
              <p className="text-2xl font-bold tracking-wide">Hardware</p>
              <p className="mt-2 text-sm text-white/75">Real-time visibility into every laptop, display, dock, and printer with proactive lifecycle tracking.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/60">Total inventory</p>
                  <p className="mt-1 text-2xl font-semibold">{stats.total}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/60">Checked out</p>
                  <p className="mt-1 text-2xl font-semibold">{stats.checkedOut}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/60">Available</p>
                  <p className="mt-1 text-2xl font-semibold">{stats.available}</p>
                </div>
              </div>
              </section>

            <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {coordinatorKpis.map((kpi) => {
                const isNeedsInfo = kpi.label === 'Needs info';
                const Wrapper = isNeedsInfo ? 'button' : 'div';
                return (
                  <Wrapper
                    key={kpi.label}
                    type={isNeedsInfo ? 'button' : undefined}
                    onClick={isNeedsInfo ? handleNeedsInfoClick : undefined}
                    className={`rounded-2xl border border-slate-100 bg-white p-4 text-left text-sm shadow-sm ${
                      isNeedsInfo ? 'transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md' : ''
                    }`}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.25rem] text-slate-400">{kpi.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{kpi.value}</p>
                    {isNeedsInfo && <p className="mt-1 text-xs text-slate-500">Show assets missing required fields</p>}
                  </Wrapper>
                );
              })}
            </section>

            <section className="mb-8 grid gap-4 md:grid-cols-3">
              {hardwareSpotlights.map((item) => (
                <DeviceSpotlightCard key={`hardware-${item.title}`} {...item} onStatClick={handleSpotlightFilter} isDarkMode={isDarkMode} />
              ))}
            </section>

            <section id="asset-table" className="mb-10">
              <div className="rounded-3xl border border-slate-100 bg-white shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
                  <div>
                    <p className="text-lg font-bold uppercase tracking-wide">Hardware table</p>
                    <p className="text-xs text-slate-500">Filter, search, and add devices from the same surface.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={EXCEL_EXPORTS.assets}
                      download
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </a>
                    <button
                      type="button"
                      onClick={() => setAssetForm(defaultAsset)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
                    >
                      <Plus className="h-4 w-4" />
                      New asset
                    </button>
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <AssetFilters
                    embedded
                    filters={filters}
                    onChange={handleFilterChange}
                    onReset={() => setFilters({ ...defaultAssetFilters })}
                    types={typeOptions}
                    isDarkMode={isDarkMode}
                  />
                  {(filters.search || filters.type !== 'all' || filters.status !== 'all' || filters.readiness !== 'all' || !filters.hideRetired) && (
                    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/70 px-3 py-2 text-xs text-slate-700">
                      <span className="font-semibold text-slate-600">Active filters:</span>
                      {filters.search && <span className="rounded-full bg-white px-2 py-1">Search: {filters.search}</span>}
                      {filters.type !== 'all' && <span className="rounded-full bg-white px-2 py-1">Type: {filters.type}</span>}
                      {filters.status !== 'all' && <span className="rounded-full bg-white px-2 py-1">Status: {filters.status}</span>}
                      {filters.readiness !== 'all' && (
                        <span className="rounded-full bg-white px-2 py-1">
                          Readiness: {filters.readiness === 'needs' ? 'Needs info' : 'Ready'}
                        </span>
                      )}
                      {!filters.hideRetired && <span className="rounded-full bg-white px-2 py-1">Show retired</span>}
                      <button
                        type="button"
                        onClick={() => setFilters({ ...defaultAssetFilters })}
                        className="rounded-full bg-slate-200 px-2 py-1 font-semibold text-slate-700 hover:bg-slate-300"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                  <div className="space-y-3">
                    <AssetTable
                      assets={pagedAssets}
                      onEdit={setAssetForm}
                      onDelete={handleDeleteAsset}
                      onAction={(asset, mode) => setActionState({ asset, mode })}
                      onSelect={handleRowSelect}
                      selectedId={selectedAssetId}
                      qualityLookup={assetQualityMap}
                      sortConfig={assetSort}
                      onSortChange={handleSortChange}
                      isMobile={isMobile}
                    />
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-sm text-slate-700">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">Page size</span>
                        <select
                          value={assetPageSize}
                          onChange={(event) => setAssetPageSize(Number(event.target.value) || 15)}
                          className={`h-9 rounded-xl border px-2 text-sm outline-none focus:ring-2 ${
                            isDarkMode
                              ? 'border-white/15 bg-slate-900/70 text-slate-100 focus:border-sky-400 focus:ring-sky-500/30'
                              : 'border-slate-200 bg-white text-slate-700 focus:border-blue-500 focus:ring-blue-100'
                          }`}
                        >
                          {[10, 15, 25, 50].map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                        <span className="text-xs text-slate-500">Total: {filteredAssets.length}</span>
                      </div>
                      <PaginationControls align="end" page={assetPage} totalPages={totalAssetPages} onPageChange={setAssetPage} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-6">
              <ActivityPanel history={recentHistory} lookupAsset={getAssetName} />
            </section>

            <section id="qr-tools-overview" className="mb-8">
              <QrToolingPanel
                qrInput={qrInput}
                onQrInput={setQrInput}
            qrDataUrl={qrDataUrl}
            onCopy={() => {
              if (!qrDataUrl) return;
              navigator.clipboard?.writeText(qrDataUrl);
            }}
            onExportPng={handleExportQrPng}
            scanResult={scanResult}
            scannerActive={scannerActive}
            onStartScanner={handleStartScanner}
            onStopScanner={handleStopScanner}
            onUseScanResult={handleUseScanResult}
            onManualInput={setManualScanInput}
            manualScanInput={manualScanInput}
            scanMessage={scanMessage}
            scannerError={scannerError}
            videoRef={videoRef}
            employeeOptions={employeeNameOptions}
            selectedEmployee={scanEmployee}
            onSelectEmployee={setScanEmployee}
          />
            </section>
          </>
        )}

        {activePage === 'Repairs' && (
          <>
            <section
              id="repairs-hero"
              className={`hero-shell relative mb-8 overflow-hidden rounded-3xl border p-8 shadow-[0_24px_80px_rgba(2,6,23,0.55)] ring-1 ${
                isDarkMode
                  ? 'border-slate-900/60 bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900 text-white ring-white/10'
                  : 'border-slate-200 bg-gradient-to-br from-white via-blue-50 to-sky-100 text-slate-900 ring-blue-100'
              }`}
              style={heroAccentStyle}
            >
              <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-blue-500/40 blur-3xl" />
              <div className="pointer-events-none absolute -right-10 top-6 h-52 w-52 rounded-full bg-rose-400/30 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 left-10 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
              <p className="text-2xl font-bold tracking-wide">Repair desk</p>
              <div className="mt-4 grid gap-6 lg:grid-cols-[1.8fr,1fr]">
                <div className="space-y-4">
                  <p className={`text-sm ${heroSubtextClass}`}>
                    See every laptop in maintenance, reserve loaners, and jump straight to Amazon parts carts or YouTube guides matched to your fleet models.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.25rem]">
                    <span className={`rounded-full px-3 py-1 ${heroChipClass}`}>Loaner coverage</span>
                    <span className={`rounded-full px-3 py-1 ${heroChipClass}`}>Parts &amp; consumables</span>
                    <span className={`rounded-full px-3 py-1 ${heroChipClass}`}>How-to videos</span>
                  </div>
                  <div className={`flex flex-wrap items-center gap-3 rounded-2xl p-3 text-sm backdrop-blur ${heroPanelClass}`}>
                    <label htmlFor="repair-model-search" className={`text-xs font-semibold uppercase tracking-[0.2rem] ${heroLabelClass}`}>
                      Search by model
                    </label>
                    <input
                      id="repair-model-search"
                      type="text"
                      value={repairModelQuery}
                      onChange={(event) => setRepairModelQuery(event.target.value)}
                      placeholder="e.g., Latitude 5440 or EliteBook 850 G1"
                      className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold outline-none transition ${
                        isDarkMode
                          ? 'border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:border-emerald-200 focus:ring-2 focus:ring-emerald-300/40'
                          : 'border-slate-200 bg-white text-slate-800 placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                      }`}
                    />
                    {repairModelQuery && (
                      <button
                        type="button"
                        onClick={() => setRepairModelQuery('')}
                        className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                          isDarkMode
                            ? 'border border-white/20 bg-white/10 text-white hover:bg-white/20'
                            : 'border border-slate-200 bg-white text-slate-700 hover:border-blue-200'
                        }`}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                <div className={`rounded-3xl p-4 shadow-inner backdrop-blur ${heroPanelClass}`}>
                  <p className={`text-xs uppercase tracking-[0.3rem] ${heroLabelClass}`}>Quick counts</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <div className={`rounded-2xl p-3 text-center ${heroStatCardClass}`}>
                      <p className={`text-3xl font-semibold ${heroHeadingClass}`}>{laptopServiceSummary.repairTotal || 0}</p>
                      <p className={`text-[11px] uppercase tracking-[0.2rem] ${heroLabelClass}`}>In repair</p>
                    </div>
                    <div className={`rounded-2xl p-3 text-center ${heroStatCardClass}`}>
                      <p className={`text-3xl font-semibold ${heroHeadingClass}`}>{laptopServiceSummary.loanerAvailableCount || 0}</p>
                      <p className={`text-[11px] uppercase tracking-[0.2rem] ${heroLabelClass}`}>Loaners staged</p>
                    </div>
                    <div className={`rounded-2xl p-3 text-center ${heroStatCardClass}`}>
                      <p className={`text-3xl font-semibold ${heroHeadingClass}`}>{laptopServiceSummary.avgRepairAgeMonths || 0} mo</p>
                      <p className={`text-[11px] uppercase tracking-[0.2rem] ${heroLabelClass}`}>Avg age</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="repair-status" className="mb-8">
              <LaptopRepairCard
                data={laptopServiceSummary}
                onLoanerCheckout={handleLoanerCheckout}
                onLoanerCheckin={handleLoanerCheckin}
                onAddRepair={handleAddRepairTicket}
                onEditRepair={handleEditRepairTicket}
                isDarkMode={isDarkMode}
              />
            </section>

            <section id="repair-resources" className="mb-8 grid gap-6 lg:grid-cols-2">
              <RepairPartsPanel models={filteredRepairModels} isDarkMode={isDarkMode} />
              <RepairVideosPanel models={filteredRepairModels} isDarkMode={isDarkMode} />
            </section>
          </>
        )}

        {activePage === 'Employees' && (
          <>
            <section
              id="employees-hero"
              className={`hero-shell relative mb-8 overflow-hidden rounded-3xl border p-8 shadow-[0_24px_80px_rgba(2,6,23,0.55)] ring-1 ${
                isDarkMode
                  ? 'border-slate-900/60 bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900 text-white ring-white/10'
                  : 'border-slate-200 bg-gradient-to-br from-white via-indigo-50 to-purple-100 text-slate-900 ring-indigo-100'
              }`}
              style={heroAccentStyle}
            >
              <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-blue-500/40 blur-3xl" />
              <div className="pointer-events-none absolute -right-10 top-6 h-52 w-52 rounded-full bg-rose-400/30 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 left-10 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
              <p className="text-2xl font-bold tracking-wide">Employees</p>
              <p className={`mt-2 text-sm ${heroSubtextClass}`}>
                Browse featured team members, their departments, and contact info to keep deployments aligned with your workforce.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className={`text-xs uppercase tracking-widest ${heroLabelClass}`}>Featured teammates</p>
                  <p className={`mt-1 text-2xl font-semibold ${heroHeadingClass}`}>{employeeGallery.length}</p>
                </div>
                <div>
                  <p className={`text-xs uppercase tracking-widest ${heroLabelClass}`}>Remote workforce</p>
                  <p className={`mt-1 text-2xl font-semibold ${heroHeadingClass}`}>{sheetInsights.remoteShare}%</p>
                </div>
                <div>
                  <p className={`text-xs uppercase tracking-widest ${heroLabelClass}`}>Departments</p>
                  <p className={`mt-1 text-2xl font-semibold ${heroHeadingClass}`}>{employeeDepartmentCount}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setEmployeeForm({ ...defaultEmployeeProfile })}
                  className={`rounded-2xl px-5 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${
                    isDarkMode
                      ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/20 hover:bg-white/20'
                      : 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Add employee
                </button>
              </div>
            </section>

            <section id="employee-directory" className="grid gap-6">
              <div className="space-y-4">
                <EmployeeFilters
                  search={employeeSearch}
                  filters={employeeFilters}
                  departments={departmentOptions}
                  locations={locationOptions}
                  jobTitles={jobTitleSuggestionOptions}
                  onSearchChange={(value) => {
                    setEmployeeSearch(value);
                    setEmployeePage(1);
                  }}
                  onFilterChange={(key, value) => {
                    setEmployeeFilters((prev) => ({ ...prev, [key]: value }));
                    setEmployeePage(1);
                  }}
                  onReset={() => {
                    setEmployeeSearch('');
                    setEmployeeFilters({ department: 'all', location: 'all', jobTitle: 'all' });
                    setEmployeePage(1);
                  }}
                />
                <EmployeeDirectoryGrid
                  members={displayedEmployees}
                  totalCount={filteredEmployees.length}
                  expandedId={expandedEmployeeId}
                  onToggle={handleEmployeeCardToggle}
                  getAssignments={getEmployeeAssignments}
                  getLicenses={getEmployeeLicenses}
                  onEdit={(member) => setEmployeeForm({ ...member })}
                  onDelete={handleDeleteEmployee}
                  onPhoto={handleOpenPhoto}
                  onAssetClick={handleRowSelect}
                  downloadHref={EXCEL_EXPORTS.employees}
                  isDarkMode={isDarkMode}
                />
                <div className="rounded-2xl border border-slate-100 bg-white/70 px-4 py-3">
                  <PaginationControls align="center" page={employeePage} totalPages={totalEmployeePages} onPageChange={setEmployeePage} />
                </div>
              </div>
            </section>

            <section className="mb-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">New hire wizard</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">Recommend gear and licenses</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <div>
              <p className="text-xs font-semibold text-slate-500">Role</p>
              <select
                value={formatRoleLabel(newHireRole)}
                onChange={(event) => {
                  const value = formatRoleLabel(event.target.value);
                  setNewHireRole(value);
                }}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {jobTitleSuggestionOptions.map((role) => (
                  <option key={`newhire-role-${role}`} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Department</p>
              <select
                value={newHireDepartment}
                onChange={(event) => setNewHireDepartment(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {departmentSuggestionOptions.map((dept) => (
                  <option key={`newhire-dept-${dept}`} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Location</p>
              <select
                value={newHireLocation}
                onChange={(event) => setNewHireLocation(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {locationSuggestionOptions
                  .filter((value) => normalizeKey(value) !== 'hq')
                  .map((location) => (
                    <option key={`newhire-location-${location}`} value={location}>
                      {location}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <input
                id="new-hire-remote"
                type="checkbox"
                      checked={newHireRemote}
                      onChange={(event) => setNewHireRemote(event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="new-hire-remote" className="text-sm font-semibold text-slate-600">
                      Remote
                    </label>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {recommendedKit.map((item) => (
                    <div
                      key={`${item.label}-${item.type}`}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-2 text-sm text-slate-700"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.reason}</p>
                      </div>
                      {item.available !== null && (
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                          {item.available} available
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-slate-500">
                  Location: {newHireLocation || 'Unspecified'} - Mode: {newHireRemote ? 'Remote/Hybrid' : 'On-site'}
                </p>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">Termination wizard</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">Expect returns and closeout</h3>
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-500">Employee</p>
                  <select
                    value={terminationEmployee}
                    onChange={(event) => setTerminationEmployee(event.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {employeeNames.map((name) => (
                      <option key={`term-${name}`}>{name}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-4 space-y-2">
                  {terminationAssets.length === 0 && (
                    <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-500">
                      No assigned assets found for this employee.
                    </p>
                  )}
                  {terminationAssets.map((asset) => (
                    <div
                      key={`term-asset-${asset.id}`}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-2 text-sm text-slate-700"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">{asset.assetName || asset.model || 'Asset'}</p>
                        <p className="text-xs text-slate-500">
                          {asset.type || 'Device'} - {asset.serialNumber || 'No serial'}
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                        Status: {getAssetDisplayStatus(asset)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                    Supervisor: {terminationProfile?.supervisor ? normalizeNameCase(terminationProfile.supervisor) : 'Not set'}
                  </span>
                  {terminationSupervisorMailto ? (
                    <a
                      href={terminationSupervisorMailto}
                      className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-3 py-1 font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
                    >
                      <Mail className="h-4 w-4" />
                      Email Supervisor
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-3 py-1 font-semibold text-slate-400"
                    >
                      <Mail className="h-4 w-4" />
                      Email Supervisor
                    </button>
                  )}
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Remind IT to revoke software access and retrieve badges, accessories, and loaners during offboarding.
                </p>
              </div>
            </section>
          </>
        )}

        {activePage === 'Reports' && (
          <>
            <section
              id="reports-hero"
              className={`hero-shell relative mb-8 overflow-hidden rounded-3xl border p-8 shadow-[0_24px_80px_rgba(2,6,23,0.55)] ring-1 ${
                isDarkMode
                  ? 'border-slate-900/60 bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900 text-white ring-white/10'
                  : 'border-slate-200 bg-gradient-to-br from-white via-amber-50 to-yellow-100 text-slate-900 ring-amber-100'
              }`}
              style={heroAccentStyle}
            >
              <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-blue-500/40 blur-3xl" />
              <div className="pointer-events-none absolute -right-10 top-6 h-52 w-52 rounded-full bg-rose-400/30 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 left-10 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
              <p className="text-2xl font-bold tracking-wide">Reports</p>
              <p className="mt-2 text-sm text-white/75">
                Benchmark hardware performance, anticipate spend, and share ready-to-run reports with stakeholders.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/60">Aging fleet</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{stats.expiringSoon} devices</p>
                  <p className="text-xs text-white/70">Require attention in 90 days</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/60">Top spend</p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {costByDepartment[0] ? formatCurrency(costByDepartment[0].value) : '$0'}
                  </p>
                  <p className="text-xs text-white/70">{costByDepartment[0]?.name || 'No data'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/60">License compliance</p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {licenseCompliance.filter((item) => item.status !== 'Healthy').length} risks
                  </p>
                  <p className="text-xs text-white/70">Overused or at capacity suites</p>
                </div>
              </div>
            </section>

            <section className="mb-8 grid gap-6 xl:grid-cols-[1.6fr,1fr]">
              <LaptopRefreshReport
                data={laptopRefreshReport}
                selectedDate={laptopRefreshDate}
                onDateChange={setLaptopRefreshDate}
                onExport={() =>
                  handleRunReport('Laptop refresh', {
                    referenceDate: laptopRefreshReport.referenceDate.toISOString(),
                    thresholdDate: laptopRefreshReport.thresholdDate.toISOString(),
                    laptops: laptopRefreshReport.rows,
                  })
                }
              />
              <AnalyticsInsightsPanel costData={costByDepartment} depreciation={depreciationTrend} />
            </section>

            <section className="mb-8">
              <DepreciationForecastTable forecast={depreciationForecast} />
            </section>

            <section className="mb-8 grid gap-6 xl:grid-cols-[1.6fr,1fr]">
              <CardShell title="Report catalog" icon={Download}>
                <div className="grid gap-4">
                  {reportCatalog.map((report) => (
                    <div key={report.title} className="flex flex-wrap items-center justify-between rounded-2xl border border-slate-100 p-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{report.title}</p>
                        <p className="text-xs text-slate-500">{report.description}</p>
                      </div>
                      <button
                        onClick={() => handleRunReport(report.title, report.payload)}
                        className="mt-3 rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600 sm:mt-0"
                        type="button"
                      >
                        Run report
                      </button>
                    </div>
                  ))}
                </div>
              </CardShell>
              <MaintenanceWorkflowBoard workOrders={maintenanceWorkOrders} isDarkMode={isDarkMode} />
            </section>
          </>
        )}

        {activePage === 'Vendors' && (
          <div style={{overflowX: 'hidden', maxWidth: '100vw', width: '100%', boxSizing: 'border-box'}}>
            <div style={{overflowX: 'hidden', maxWidth: '100%', padding: '0'}}>
              <section
                id="vendors-hero"
                className={`hero-shell relative mb-8 w-full rounded-[2.5rem] border p-8 shadow-[0_24px_80px_rgba(2,6,23,0.55)] ring-1 ${
                  isDarkMode
                    ? 'border-slate-900/60 bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900 text-white ring-white/10'
                    : 'border-slate-200 bg-gradient-to-br from-white via-emerald-50 to-teal-100 text-slate-900 ring-emerald-100'
                }`}
                style={{...heroAccentStyle, overflow: 'hidden', maxWidth: '100%', boxSizing: 'border-box'}}
              >
                <div className="grid max-w-full gap-8 overflow-x-clip lg:grid-cols-2" style={{maxWidth: '100%', width: '100%'}}>
                  <div>
                    <p className="text-2xl font-bold tracking-wide">Vendors</p>
                    <p className={`mt-3 text-sm ${heroSubtextClass}`}>
                      Showcase vendor accountability with live device counts, SLAs, and lightning-fast contacts from a single pane.
                    </p>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2" style={{maxWidth: '100%'}}>
                      <div className={`rounded-2xl p-4 text-center ${heroStatCardClass}`}>
                        <p className={`text-xs uppercase tracking-widest ${heroLabelClass}`}>Vendors engaged</p>
                        <p className={`mt-2 text-3xl font-semibold ${heroHeadingClass}`}>{vendorProfiles.length}</p>
                      </div>
                      <div className={`rounded-2xl p-4 text-center ${heroStatCardClass}`}>
                        <p className={`text-xs uppercase tracking-widest ${heroLabelClass}`}>Devices covered</p>
                        <p className={`mt-2 text-3xl font-semibold ${heroHeadingClass}`}>{vendorTotals.devices}</p>
                      </div>
                      <div className={`rounded-2xl p-4 text-center ${heroStatCardClass}`}>
                        <p className={`text-xs uppercase tracking-widest ${heroLabelClass}`}>Active today</p>
                        <p className={`mt-2 text-3xl font-semibold ${heroHeadingClass}`}>{vendorTotals.active}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {vendorProfiles.slice(0, 4).map((vendor) => (
                      <a
                        key={`vendor-mosaic-${vendor.id}`}
                        className="relative block h-36 overflow-hidden rounded-3xl border border-white/15 bg-white/5 backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)] hover:border-cyan-200/60"
                        href={
                          vendor.contact?.url ||
                          (vendor.id === 'brother'
                            ? 'https://weaverassociatesinc.infoflopay.com/'
                            : vendor.id === 'canon'
                              ? 'https://www.colonyproducts.com/'
                              : vendor.id === 'dell'
                                ? 'https://www.dell.com/'
                                : vendor.id === 'verizon'
                                  ? 'https://www.verizon.com/business/my-business/'
                                  : vendor.contact?.href || '#')
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img src={vendor.image} alt={`${vendor.name} collage`} className="absolute inset-0 h-full w-full object-cover opacity-70" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/50 to-blue-900/65" />
                        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-cyan-400/30 blur-3xl" />
                        <p className="absolute bottom-4 left-4 text-lg font-semibold text-cyan-100 leading-tight drop-shadow-sm">
                          {vendor.name}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            <section className="mb-8 grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">Coverage pulses</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {printerCoverageStats.map((stat) => (
                    <div key={stat.title} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                      <p className="text-xs uppercase tracking-widest text-slate-400">{stat.title}</p>
                      <p className="mt-2 text-2xl font-semibold">{stat.count}</p>
                      <p className="text-xs text-slate-500">{stat.note}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">Procurement quick hits</p>
                <p className="mt-2 text-sm text-slate-600">Spin up orders or support tickets from the curated set below.</p>
                <div className="mt-4 flex flex-col gap-3">
                  {vendorQuickActions.map((action) => (
                    <button
                      key={`vendor-qa-${action.title}`}
                      type="button"
                      onClick={action.onAction}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
                    >
                      <span>{action.title}</span>
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section id="printer-repair-desk" className="mb-8 grid gap-6 lg:grid-cols-[1.6fr,1fr]">
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">Print service tickets</p>
                    <p className="text-lg font-semibold text-slate-900">Printer &amp; copier maintenance</p>
                    <p className="text-sm text-slate-600">Log requests here before dispatching Colony or Weaver.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenPrinterTicket()}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    <Plus className="h-4 w-4" />
                    Log request
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {printerRepairTickets.length ? (
                    printerRepairTickets.map((ticket) => {
                      const status = (ticket.status || '').toLowerCase();
                      const statusTone =
                        status.includes('complete')
                          ? 'tone-chip tone-success'
                          : status.includes('progress')
                            ? 'tone-chip tone-info'
                            : status.includes('await')
                              ? 'tone-chip tone-warning'
                              : 'tone-chip tone-neutral';
                      return (
                        <div
                          key={ticket.id || ticket.printerLabel || ticket.assetId}
                          className="flex flex-wrap items-start justify-between gap-3 py-4"
                        >
                          <div className="min-w-[240px] flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-slate-900">{ticket.printerLabel}</p>
                              <span className={`${ticket.vendorBadge} px-2.5 py-1 text-[11px] font-semibold`}>
                                {ticket.vendorName}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              {ticket.brand || 'Model pending'}
                              {ticket.location ? ` - ${ticket.location}` : ''}
                              {ticket.eta ? ` - ETA ${ticket.eta}` : ''}
                            </p>
                            <p className="text-xs text-slate-600">{ticket.issue || 'Awaiting triage details'}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`${statusTone} px-3 py-1 text-[11px] font-bold`}>{ticket.status || 'Queued'}</span>
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{ticket.severity || 'Normal'}</span>
                            <div className="flex items-center gap-2">
                              {ticket.eta && <span className="text-[11px] font-semibold text-slate-500">ETA {ticket.eta}</span>}
                              <button
                                type="button"
                                onClick={() => handleEditRepairTicket(ticket)}
                                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                              >
                                Update
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-6 text-sm text-slate-600">
                      No printer/copier tickets yet. Log a maintenance request to notify the right vendor.
                    </div>
                  )}
                </div>
              </div>
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">Dispatch routing</p>
                <p className="text-lg font-semibold text-slate-900">Who to notify</p>
                <p className="text-sm text-slate-600">Match the request to the vendor before you submit.</p>
                <div className="mt-4 space-y-3">
                  {printerVendors.map((vendor) => (
                    <div key={vendor.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">{vendor.name}</p>
                        <span className="text-xs font-semibold text-slate-500">{vendor.deviceCount} units</span>
                      </div>
                      <p className="text-xs text-slate-500">Brands: {vendor.brands.join(', ')}</p>
                      {vendor.contact && (
                        <a
                          href={vendor.contact.href}
                          target={vendor.contact.external ? '_blank' : '_self'}
                          rel={vendor.contact.external ? 'noreferrer' : undefined}
                          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline"
                        >
                          {vendor.contact.label}
                          {vendor.contact.external && <ExternalLink className="h-3.5 w-3.5" />}
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenPrinterTicket(vendor.devices?.[0])}
                        className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                      >
                        Draft request
                        <ArrowRightLeft className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mb-8 space-y-6">
              <NetworkPrinterBoard
                printers={networkPrinters}
                title="Network Printers and Copiers"
                subtitle="Local routing data; cloud sync will return when available."
                onAdd={handleAddPrinter}
                onEdit={handleEditPrinter}
                onDelete={handleDeletePrinter}
                onTest={handleTestPrinter}
                onReport={handleReportPrinter}
                enableSearch
              />
            </section>

            <section className="grid gap-6 md:grid-cols-2">
              {vendorProfiles.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </section>
          </div>
        )}

        {activePage === 'HelpDesk' && (
          <div className="mx-auto max-w-7xl px-4 py-8">
            <style>{`
              .helpdesk-app {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              }
              ${isDarkMode ? `
              .helpdesk-app {
                color: #e7edff;
              }
              .helpdesk-app .card {
                background: linear-gradient(135deg, #101827 0%, #1a2332 100%);
                border: 2px solid;
                border-color: #2563eb;
                box-shadow: 0 4px 20px rgba(37, 99, 235, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1);
              }
              .helpdesk-app .card.service-card {
                border-color: #8b5cf6;
                box-shadow: 0 4px 16px rgba(139, 92, 246, 0.2), 0 0 0 1px rgba(167, 139, 250, 0.15);
              }
              .helpdesk-app .card.service-card:hover {
                border-color: #a78bfa;
                box-shadow: 0 8px 24px rgba(139, 92, 246, 0.35), 0 0 0 1px rgba(167, 139, 250, 0.25);
                transform: translateY(-3px);
              }
              .helpdesk-app .service-icon {
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%);
                color: #a78bfa;
                box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
              }
              .helpdesk-app .card.article-card {
                background: linear-gradient(135deg, #0f1831 0%, #1e293b 100%);
                border-color: #0ea5e9;
              }
              .helpdesk-app .card.article-card:hover {
                background: linear-gradient(135deg, #1e293b 0%, #0f1831 100%);
                border-color: #38bdf8;
                box-shadow: 0 8px 24px rgba(14, 165, 233, 0.3);
              }
              .helpdesk-app .card.article-card h4 {
                color: #e7edff;
              }
              .helpdesk-app .card.article-card p {
                color: #a5b4cf;
              }
              .helpdesk-app .badge {
                background: #1e293b;
                color: #cbd5e1;
              }
              .helpdesk-app .chip {
                background: #1e293b;
                color: #cbd5e1;
              }
              .helpdesk-app .chip.mono {
                background: #0f172a;
                color: #94a3b8;
              }
              .helpdesk-app .pill {
                background: rgba(59, 130, 246, 0.2);
                color: #93c5fd;
              }
              .helpdesk-app .label {
                color: #cbd5e1;
              }
              .helpdesk-app .input,
              .helpdesk-app .textarea,
              .helpdesk-app .select {
                background: #0f1831;
                border-color: #203459;
                color: #e7edff;
              }
              .helpdesk-app .input::placeholder,
              .helpdesk-app .textarea::placeholder {
                color: #64748b;
              }
              .helpdesk-app .input:focus,
              .helpdesk-app .textarea:focus,
              .helpdesk-app .select:focus {
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
              }
              .helpdesk-app .btn-ghost {
                background: transparent;
                color: #60a5fa;
                border-color: #203459;
              }
              .helpdesk-app .btn-ghost:hover {
                border-color: #3b82f6;
                background: rgba(59, 130, 246, 0.1);
              }
              .helpdesk-app .chat-panel {
                background: linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%) !important;
                border: 2px solid #10b981 !important;
                box-shadow: 0 8px 32px rgba(16, 185, 129, 0.25), 0 0 0 1px rgba(52, 211, 153, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
                position: relative;
              }
              .helpdesk-app .chat-panel::before {
                content: '';
                position: absolute;
                inset: 0;
                border-radius: 20px;
                padding: 2px;
                background: linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6);
                -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
                opacity: 0.3;
                pointer-events: none;
              }
              .helpdesk-app .chat-bubble.bot {
                background: #1e293b;
                color: #e7edff;
              }
              .helpdesk-app .chat-typing {
                background: #1e293b;
              }
              .helpdesk-app .typing-dot {
                background: #64748b;
              }
              .helpdesk-app .form-alert.success {
                background: rgba(16, 185, 129, 0.15);
                color: #6ee7b7;
                border-color: rgba(16, 185, 129, 0.3);
              }
              .helpdesk-app .form-alert.error {
                background: rgba(239, 68, 68, 0.15);
                color: #fca5a5;
                border-color: rgba(239, 68, 68, 0.3);
              }
              .helpdesk-app .code-block {
                background: rgba(0, 0, 0, 0.3);
                color: #cbd5e1;
              }
              .helpdesk-app .empty-state {
                background: #0f1831;
                color: #a5b4cf;
              }
              .helpdesk-app .filter-chip:hover {
                background: rgba(59, 130, 246, 0.2);
              }
              .helpdesk-app .filter-chip.active {
                background: #1e40af;
                color: white;
              }
              .helpdesk-app .section-title {
                color: #64748b;
              }
              ` : `
              .helpdesk-app {
                color: #0e1117;
              }
              `}
              .helpdesk-app .chip {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.03em;
              }
              ${!isDarkMode ? `
              .helpdesk-app .chip {
                background: #e5e7eb;
                color: #1f2937;
              }
              .helpdesk-app .chip.mono {
                background: #f3f4f6;
                color: #475569;
              }
              .helpdesk-app .pill {
                background: #eff6ff;
                color: #1e40af;
              }
              .helpdesk-app .card {
                background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                border: 2px solid;
                border-color: #3b82f6;
                box-shadow: 0 4px 16px rgba(59, 130, 246, 0.12), 0 0 0 1px rgba(59, 130, 246, 0.08);
              }
              .helpdesk-app .card.service-card {
                border-color: #8b5cf6;
                background: linear-gradient(135deg, #faf5ff 0%, #f5f3ff 100%);
                box-shadow: 0 4px 16px rgba(139, 92, 246, 0.15), 0 0 0 1px rgba(139, 92, 246, 0.1);
              }
              .helpdesk-app .card.service-card:hover {
                border-color: #a78bfa;
                box-shadow: 0 8px 24px rgba(139, 92, 246, 0.25), 0 0 0 1px rgba(139, 92, 246, 0.15);
                transform: translateY(-3px);
              }
              .helpdesk-app .service-icon {
                background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
                color: #7c3aed;
                box-shadow: 0 0 16px rgba(124, 58, 237, 0.2);
              }
              .helpdesk-app .card.article-card {
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                border-color: #0ea5e9;
              }
              .helpdesk-app .card.article-card:hover {
                background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
                border-color: #0284c7;
                box-shadow: 0 8px 24px rgba(14, 165, 233, 0.2);
              }
              .helpdesk-app .chat-panel {
                background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #ecfdf5 100%) !important;
                border: 2px solid #10b981 !important;
                box-shadow: 0 8px 32px rgba(16, 185, 129, 0.2), 0 0 0 1px rgba(16, 185, 129, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5) !important;
                position: relative;
              }
              .helpdesk-app .chat-panel::before {
                content: '';
                position: absolute;
                inset: 0;
                border-radius: 20px;
                padding: 2px;
                background: linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6);
                -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
                opacity: 0.2;
                pointer-events: none;
              }
              .helpdesk-app .card.article-card h4 {
                color: #0e1117;
              }
              .helpdesk-app .card.article-card p {
                color: #55607a;
              }
              .helpdesk-app .badge {
                background: #f1f5f9;
                color: #475569;
              }
              .helpdesk-app .label {
                color: #334155;
              }
              .helpdesk-app .input,
              .helpdesk-app .textarea,
              .helpdesk-app .select {
                background: white;
                border: 1px solid #e5e7eb;
                color: #0e1117;
              }
              .helpdesk-app .input::placeholder,
              .helpdesk-app .textarea::placeholder {
                color: #9ca3af;
              }
              .helpdesk-app .input:focus,
              .helpdesk-app .textarea:focus,
              .helpdesk-app .select:focus {
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
              }
              .helpdesk-app .btn-ghost {
                background: transparent;
                color: #1e40af;
                border: 1px solid #e5e7eb;
              }
              .helpdesk-app .btn-ghost:hover {
                border-color: #bfdbfe;
                background: #eff6ff;
              }
              .helpdesk-app .chat-bubble.bot {
                background: #f1f5f9;
                color: #0e1117;
              }
              .helpdesk-app .chat-typing {
                background: #f1f5f9;
              }
              .helpdesk-app .typing-dot {
                background: #94a3b8;
              }
              .helpdesk-app .form-alert.success {
                background: #d1fae5;
                color: #065f46;
                border: 1px solid #a7f3d0;
              }
              .helpdesk-app .form-alert.error {
                background: #fee2e2;
                color: #991b1b;
                border: 1px solid #fecaca;
              }
              .helpdesk-app .code-block {
                background: rgba(0, 0, 0, 0.05);
                color: #0e1117;
              }
              .helpdesk-app .empty-state {
                background: #fafafa;
                color: #55607a;
              }
              .helpdesk-app .filter-chip:hover {
                background: #dbeafe;
              }
              .helpdesk-app .section-title {
                color: #94a3b8;
              }
              ` : ''}
              .helpdesk-app .chip.mono {
                font-family: "SF Mono", Monaco, monospace;
              }
              .helpdesk-app .pill {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 6px 12px;
                border-radius: 16px;
                font-size: 13px;
                font-weight: 600;
              }
              .helpdesk-app .status-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
              }
              .helpdesk-app .card {
                border-radius: 20px;
                padding: 20px;
              }
              .helpdesk-app .card.service-card {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px;
                cursor: pointer;
                transition: all 0.2s;
              }
              .helpdesk-app .card.service-card:hover {
                transform: translateY(-2px);
              }
              .helpdesk-app .service-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                border-radius: 12px;
              }
              .helpdesk-app .card.article-card {
                border-style: dashed;
                cursor: pointer;
                transition: all 0.2s;
              }
              .helpdesk-app .card.article-card:hover {
                border-style: solid;
              }
              .helpdesk-app .card.article-card h4 {
                margin: 8px 0 4px;
                font-size: 14px;
                font-weight: 700;
              }
              .helpdesk-app .card.article-card p {
                margin: 0;
                font-size: 13px;
              }
              .helpdesk-app .badge {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 4px 8px;
                border-radius: 8px;
                font-size: 11px;
                font-weight: 600;
              }
              .helpdesk-app .card.request-row {
                display: grid;
                grid-template-columns: 1fr auto auto;
                gap: 16px;
                align-items: center;
                padding: 16px;
                border-color: #e5e7eb;
              }
              .helpdesk-app .list-inline {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
              }
              .helpdesk-app .btn {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 10px 18px;
                border-radius: 12px;
                font-size: 14px;
                font-weight: 600;
                border: none;
                cursor: pointer;
                transition: all 0.2s;
              }
              .helpdesk-app .btn-primary {
                background: #1e40af;
                color: white;
              }
              .helpdesk-app .btn-primary:hover {
                background: #1e3a8a;
                box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
              }
              .helpdesk-app .btn-small {
                padding: 6px 12px;
                font-size: 12px;
              }
              .helpdesk-app .hero {
                position: relative;
                padding: 48px;
                border-radius: 24px;
                background: ${isDarkMode ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' : 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)'};
                color: white;
                overflow: hidden;
                margin-bottom: 32px;
              }
              .helpdesk-app .hero::before {
                content: "";
                position: absolute;
                top: -50%;
                right: -20%;
                width: 600px;
                height: 600px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                pointer-events: none;
              }
              .helpdesk-app .cta-row {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                margin-top: 20px;
              }
              .helpdesk-app .cta-strip {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                gap: 16px;
                margin-top: 24px;
              }
              .helpdesk-app .cta-tile {
                padding: 20px;
                border-radius: 16px;
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(10px);
              }
              .helpdesk-app .grid {
                display: grid;
                gap: 16px;
              }
              .helpdesk-app .label {
                display: block;
                font-size: 13px;
                font-weight: 600;
                margin-bottom: 8px;
              }
              .helpdesk-app .input,
              .helpdesk-app .textarea,
              .helpdesk-app .select {
                width: 100%;
                padding: 10px 14px;
                border-radius: 10px;
                font-size: 14px;
                font-family: inherit;
                transition: all 0.2s;
              }
              .helpdesk-app .input:focus,
              .helpdesk-app .textarea:focus,
              .helpdesk-app .select:focus {
                outline: none;
              }
              .helpdesk-app .textarea {
                min-height: 100px;
                resize: vertical;
              }
              .helpdesk-app .form-alert {
                padding: 16px;
                border-radius: 12px;
                margin-bottom: 16px;
                font-size: 14px;
              }
              .helpdesk-app .form-alert-message {
                font-weight: 600;
                margin-bottom: 8px;
              }
              .helpdesk-app .alert-close {
                background: none;
                border: none;
                color: inherit;
                text-decoration: underline;
                cursor: pointer;
                font-size: 12px;
                font-weight: 600;
                margin-top: 4px;
              }
              .helpdesk-app .form-alert-details {
                margin-top: 12px;
              }
              .helpdesk-app .code-block {
                padding: 12px;
                border-radius: 8px;
                font-family: monospace;
                font-size: 12px;
                white-space: pre-wrap;
                margin-top: 8px;
              }
              .helpdesk-app .chat-panel {
                display: flex;
                flex-direction: column;
                gap: 16px;
                height: 600px;
              }
              .helpdesk-app .chat-messages {
                flex: 1;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 12px;
                padding: 8px;
              }
              .helpdesk-app .chat-bubble {
                max-width: 75%;
                padding: 12px 16px;
                border-radius: 16px;
                font-size: 14px;
                line-height: 1.5;
              }
              .helpdesk-app .chat-bubble.user {
                background: #1e40af;
                color: white;
                margin-left: auto;
                border-bottom-right-radius: 4px;
              }
              .helpdesk-app .chat-typing {
                display: flex;
                gap: 4px;
                padding: 12px 16px;
                border-radius: 16px;
                width: fit-content;
              }
              .helpdesk-app .typing-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                animation: typing 1.4s infinite;
              }
              .helpdesk-app .typing-dot:nth-child(2) {
                animation-delay: 0.2s;
              }
              .helpdesk-app .typing-dot:nth-child(3) {
                animation-delay: 0.4s;
              }
              @keyframes typing {
                0%, 60%, 100% {
                  transform: translateY(0);
                  opacity: 0.7;
                }
                30% {
                  transform: translateY(-6px);
                  opacity: 1;
                }
              }
              .helpdesk-app .requests-list {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-top: 12px;
              }
              .helpdesk-app .empty-state {
                text-align: center;
                padding: 32px;
                border-radius: 16px;
                margin-top: 12px;
              }
              .helpdesk-app .filter-row {
                margin: 12px 0;
              }
              .helpdesk-app .filter-chip {
                cursor: pointer;
                transition: all 0.2s;
              }
              @media (max-width: 1100px) {
                .helpdesk-app .hero {
                  padding: 28px;
                }
                .helpdesk-app .helpdesk-split,
                .helpdesk-app .helpdesk-form-chat,
                .helpdesk-app .helpdesk-services {
                  grid-template-columns: 1fr !important;
                }
                .helpdesk-app .helpdesk-article-grid,
                .helpdesk-app .helpdesk-service-grid {
                  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                }
                .helpdesk-app .cta-strip {
                  grid-template-columns: 1fr;
                }
                .helpdesk-app .cta-row {
                  flex-direction: column;
                  align-items: stretch;
                }
                .helpdesk-app .cta-row .btn,
                .helpdesk-app .cta-row .btn-ghost {
                  justify-content: center;
                  width: 100%;
                }
                .helpdesk-app .card.request-row {
                  grid-template-columns: 1fr !important;
                  align-items: start;
                  gap: 10px;
                }
                .helpdesk-app .list-inline {
                  flex-wrap: wrap;
                }
                .helpdesk-app .chat-panel {
                  height: auto;
                  min-height: 420px;
                }
              }
              @media (max-width: 720px) {
                .helpdesk-app .hero {
                  padding: 22px;
                }
                .helpdesk-app .card {
                  padding: 16px;
                }
                .helpdesk-app .btn {
                  width: 100%;
                  justify-content: center;
                }
                .helpdesk-app .helpdesk-article-grid,
                .helpdesk-app .helpdesk-service-grid {
                  grid-template-columns: 1fr !important;
                }
                .helpdesk-app .input,
                .helpdesk-app .textarea,
                .helpdesk-app .select {
                  font-size: 15px;
                }
                .helpdesk-app .chat-panel {
                  min-height: 360px;
                }
              }
            `}</style>
            
            <div className="helpdesk-app">
              <header className="hero">
                <div style={{ position: 'relative', zIndex: 1, display: 'grid', gap: 12 }}>
                  <span className="pill">
                    <Sparkles size={16} />
                    UDS Tech Help Center
                  </span>
                  <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.1, color: 'white' }}>Answers, tickets, and live IT support for every UDS employee.</h1>
                  <p style={{ margin: 0, maxWidth: 720, color: 'rgba(255,255,255,0.9)' }}>
                    Start with self-help, ask the AI guide, or send a request to IT. For urgent outages, call immediately—everything else can be logged here.
                  </p>
                  <div className="cta-row">
                    <button className="btn btn-primary" type="button" onClick={scrollToRequestForm} style={{ background: isDarkMode ? '#3b82f6' : 'white', color: isDarkMode ? 'white' : '#1e40af' }}>
                      <Send size={18} />
                      Submit a request
                    </button>
                    <a className="btn btn-ghost" href="tel:+17175553000" style={{ background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
                      <PhoneCall size={18} />
                      Call for urgent issues
                    </a>
                  </div>
                </div>
              </header>

              <main className="grid" style={{ marginTop: 24, gap: 18 }}>
                <section className="card">
                  <div className="section-title">Start here</div>
                  <h2 style={{ margin: '6px 0 8px', fontSize: 22, color: isDarkMode ? '#e7edff' : '#0e1117' }}>
                    Need help fast?
                  </h2>
                  <p style={{ margin: '0 0 12px', color: isDarkMode ? '#a5b4cf' : '#55607a', fontSize: 14 }}>
                    Pick a quick issue below or jump straight to the request form. We will open your email with the ticket details.
                  </p>
                  <div className="list-inline" style={{ marginTop: 6 }}>
                    {starterMessages.map((prompt) => (
                      <button
                        key={prompt}
                        className="btn btn-ghost btn-small"
                        type="button"
                        onClick={() => handleHelpdeskQuickTopic(prompt)}
                      >
                        <Sparkles size={14} />
                        {prompt}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="grid helpdesk-form-chat" style={{ gridTemplateColumns: '1.1fr 0.9fr', gap: 16 }}>
                  <div className="card">
                    <div className="section-title">Start a request</div>
                    <h2 style={{ margin: '6px 0 8px', fontSize: 20, color: isDarkMode ? '#e7edff' : '#0e1117' }}>Tell IT what you need</h2>
                    <p style={{ margin: '0 0 12px', color: isDarkMode ? '#a5b4cf' : '#55607a', fontSize: 14 }}>
                      Use this form for non-urgent requests. We will acknowledge within 1 business day.
                    </p>
                    {helpdeskFormAlert && (
                      <div className={`form-alert ${helpdeskFormAlert.type}`} role="alert" aria-live="assertive">
                        <div className="form-alert-message">{helpdeskFormAlert.message}</div>
                        <button className="alert-close" type="button" onClick={() => setHelpdeskFormAlert(null)}>
                          Dismiss
                        </button>
                        {helpdeskFormAlert.detailText && (
                          <div className="form-alert-details">
                            <button className="btn btn-ghost btn-small" type="button" onClick={handleHelpdeskAlertCopy}>
                              Copy ticket text
                            </button>
                            <pre className="code-block">{helpdeskFormAlert.detailText}</pre>
                          </div>
                        )}
                      </div>
                    )}
                    <form id="helpdesk-request-form" onSubmit={handleHelpdeskFormSubmit} className="grid" style={{ gap: 12 }}>
                      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <label className="label">
                          Name
                          <input className="input" value={helpdeskForm.name} onChange={(e) => setHelpdeskForm((p) => ({ ...p, name: e.target.value }))} required />
                        </label>
                        <label className="label">
                          Email
                          <input className="input" type="email" value={helpdeskForm.email} onChange={(e) => setHelpdeskForm((p) => ({ ...p, email: e.target.value }))} required />
                        </label>
                      </div>
                      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <label className="label">
                          Department / Location
                          <input className="input" value={helpdeskForm.department} onChange={(e) => setHelpdeskForm((p) => ({ ...p, department: e.target.value }))} placeholder="Finance, Lancaster" />
                        </label>
                        <label className="label">
                          Urgency
                          <select className="select" value={helpdeskForm.urgency} onChange={(e) => setHelpdeskForm((p) => ({ ...p, urgency: e.target.value }))}>
                            <option>Normal</option>
                            <option>High</option>
                            <option>Urgent (service down)</option>
                          </select>
                        </label>
                      </div>
                      <label className="label">
                        What do you need?
                        <input
                          className="input"
                          value={helpdeskForm.topic}
                          onChange={(e) => setHelpdeskForm((p) => ({ ...p, topic: e.target.value }))}
                          placeholder="Example: VPN keeps disconnecting"
                          required
                        />
                      </label>
                      <label className="label">
                        Details
                        <textarea
                          className="textarea"
                          value={helpdeskForm.details}
                          onChange={(e) => setHelpdeskForm((p) => ({ ...p, details: e.target.value }))}
                          placeholder="Include device, urgency, steps tried, and screenshots if any."
                          required
                        />
                      </label>
                      <div className="cta-row">
                        <button className="btn btn-primary" type="submit" disabled={helpdeskIsSubmitting}>
                          <Send size={18} />
                          {helpdeskIsSubmitting ? 'Submitting...' : 'Submit to IT'}
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="card chat-panel">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span className="service-icon">
                          <Bot size={18} />
                        </span>
                        <div>
                          <div className="section-title" style={{ letterSpacing: '0.2em' }}>
                            AI Tech Guide
                          </div>
                          <p style={{ margin: 0, color: isDarkMode ? '#a5b4cf' : '#55607a', fontSize: 14 }}>Ask about issues, hardware, or policies. I'll draft a ticket if needed.</p>
                        </div>
                      </div>
                      <div className="list-inline">
                        <span className="chip">Beta</span>
                        <button className="btn btn-ghost btn-small" type="button" onClick={resetHelpdeskChat}>
                          Reset chat
                        </button>
                      </div>
                    </div>
                    <div className="chat-messages">
                      {helpdeskChatMessages.map((msg, idx) => (
                        <div key={`${msg.role}-${idx}-${msg.text.slice(0, 8)}`} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                          <div className={`chat-bubble ${msg.role}`}>
                            {msg.role === 'bot' && (
                              <div className="list-inline" style={{ marginBottom: 6 }}>
                                <span className="chip" style={{ background: '#e0f2fe', color: '#075985' }}>
                                  <Bot size={14} />
                                  UDS Tech Assist
                                </span>
                              </div>
                            )}
                            <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                          </div>
                        </div>
                      ))}
                      {helpdeskBotTyping && (
                        <div className="chat-typing">
                          <span className="typing-dot" />
                          <span className="typing-dot" />
                          <span className="typing-dot" />
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'grid', gap: 8 }}>
                      <div className="list-inline">
                        {starterMessages.map((prompt) => (
                          <button key={prompt} className="btn btn-ghost" type="button" onClick={() => sendHelpdeskChat(prompt)} style={{ fontSize: 12, padding: '6px 10px' }}>
                            <Sparkles size={14} />
                            {prompt}
                          </button>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          className="input"
                          placeholder="Type your question..."
                          value={helpdeskChatInput}
                          onChange={(e) => setHelpdeskChatInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendHelpdeskChat(helpdeskChatInput);
                            }
                          }}
                        />
                        <button className="btn btn-primary" type="button" onClick={() => sendHelpdeskChat(helpdeskChatInput)}>
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              </main>
            </div>
          </div>
        )}

        {activePage === 'Software' && (
          <>
            <section id="software-hero" className="mb-8">
              <div
                className={`hero-shell relative overflow-hidden rounded-3xl p-8 shadow-[0_24px_80px_rgba(2,6,23,0.55)] ring-1 ${
                  isDarkMode
                    ? 'border border-slate-900/60 bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900 text-white ring-white/10'
                    : 'border border-slate-200 bg-gradient-to-br from-white via-blue-50 to-indigo-50 text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.12)] ring-blue-100'
                }`}
                style={heroAccentStyle}
              >
                <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-blue-500/40 blur-3xl" />
                <div className="pointer-events-none absolute -right-10 top-6 h-52 w-52 rounded-full bg-rose-400/30 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 left-10 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-2xl font-bold tracking-wide">Software</p>
                    <h2 className="mt-3 text-3xl font-semibold text-white">Licensing + SaaS operations</h2>
                    <p className="mt-2 text-sm text-white/75">
                      Centralize entitlement tracking for Microsoft 365, Adobe, AutoCAD, Cisco Secure Client, Duo, Keeper, ESET, Barracuda, Citrix,
                      Zoom, and more without tying usage to hardware guesses.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSoftwareForm({ ...defaultSoftwareSuite })}
                    className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-white/20 transition hover:-translate-y-0.5 hover:bg-white/20"
                  >
                    <Plus className="h-4 w-4" />
                    Add software
                  </button>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/60">Suites tracked</p>
                    <p className="mt-1 text-2xl font-semibold text-white">{licenseBuckets.length}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/60">Active seats</p>
                    <p className="mt-1 text-2xl font-semibold text-white">{licenseInsights.used}</p>
                    <p className="text-xs text-white/70">{licenseInsights.seats} total licensed</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/60">Vendor ecosystems</p>
                    <p className="mt-1 text-2xl font-semibold text-white">{softwareVendorCount}</p>
                    <p className="text-xs text-white/70">{softwareAtRisk.length} suites watched</p>
                  </div>
                </div>
                {adminPortalTiles.some((tile) => tile.logo) && (
                  <div className="mt-8 min-h-[340px] rounded-2xl border border-white/15 bg-white/10 p-6 shadow-inner backdrop-blur">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-white/70">Admin Portals</p>
                    <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {adminPortalTiles
                        .filter((tile) => tile.logo)
                        .map((tile) => (
                        <a
                          key={`logo-${tile.id}`}
                          href={tile.portal || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="group relative flex h-24 items-center justify-center rounded-2xl bg-white/90 shadow-inner ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:ring-blue-200"
                          title={
                            tile.portal
                              ? `${tile.label} admin portal`
                              : tile.label
                          }
                        >
                          <img
                            src={tile.logo}
                            alt={`${tile.label} logo`}
                            className="h-20 w-full max-w-[90%] object-contain opacity-85 transition group-hover:opacity-100 group-hover:scale-110"
                            loading="lazy"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="mb-8">
              <LicenseUsage licenses={licenseBuckets} />
            </section>

            <section id="software-renewal-overview" className="mb-8">
              <div
                className={`rounded-3xl p-6 shadow-lg ${
                  isDarkMode
                    ? 'border border-slate-800/60 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-[0_20px_80px_rgba(0,0,0,0.5)]'
                    : 'bg-white border border-slate-200 shadow-xl'
                }`}
              >
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3">
                  <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 p-3 shadow-lg">
                    <CalendarClock className="h-7 w-7 text-white drop-shadow" />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-slate-50' : 'text-slate-900'}`}>Software Renewal Calendar</p>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Track upcoming renewals and budget for annual subscriptions
                    </p>
                  </div>
                </div>
                
                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                  <div className={`rounded-2xl border p-4 ${
                    isDarkMode ? 'border-rose-500/30 bg-rose-950/40' : 'border-rose-200 bg-white'
                  }`}>
                    <p className="text-xs font-semibold uppercase tracking-wide status-alert-muted">Overdue</p>
                    <p className="mt-1 text-3xl font-bold status-alert">
                      {softwareRenewalsOverdue.length}
                    </p>
                    <p className="text-xs status-alert-muted">Requires immediate action</p>
                  </div>
                  <div className={`rounded-2xl border p-4 ${
                    isDarkMode ? 'border-amber-500/30 bg-amber-950/30' : 'border-amber-200 bg-white'
                  }`}>
                    <p className="text-xs font-semibold uppercase tracking-wide status-warning-muted">Next 90 days</p>
                    <p className="mt-1 text-3xl font-bold status-warning">
                      {softwareRenewalsDue90Days.length}
                    </p>
                    <p className="text-xs status-warning-muted">Budget planning required</p>
                  </div>
                  <div className={`rounded-2xl border p-4 ${
                    isDarkMode ? 'border-blue-500/30 bg-blue-950/40' : 'border-blue-200 bg-white'
                  }`}>
                    <p className="text-xs font-semibold uppercase tracking-wide status-info-muted">Total annual cost</p>
                    <p className="mt-1 text-3xl font-bold status-info">
                      {formatCurrency(SOFTWARE_PORTFOLIO.reduce((sum, s) => sum + (s.seats * s.costPerSeat * 12), 0))}
                    </p>
                    <p className="text-xs status-info-muted">All software licenses</p>
                  </div>
                </div>

                <div
                  className={`rounded-2xl p-5 shadow-inner ${
                    isDarkMode ? 'border border-slate-800/60 bg-slate-900/70' : 'border border-slate-200 bg-white'
                  }`}
                >
                  <p className={`mb-4 text-sm font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Complete Renewal Timeline</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {softwareRenewalAlerts.map((software) => (
                      <div
                        key={software.id}
                        className={`flex w-full flex-col gap-4 rounded-xl p-3 sm:p-4 md:flex-row md:items-center md:justify-between ${
                          software.daysUntilRenewal < 0
                            ? isDarkMode
                              ? 'bg-gradient-to-r from-rose-900/60 via-rose-800/50 to-rose-900/60 border border-rose-500/50'
                              : 'bg-gradient-to-r from-rose-50 via-rose-100 to-white border border-rose-200'
                            : software.daysUntilRenewal <= 30
                            ? isDarkMode
                              ? 'bg-gradient-to-r from-amber-900/40 via-amber-800/40 to-amber-900/40 border border-amber-400/40'
                              : 'bg-gradient-to-r from-amber-50 via-amber-100 to-white border border-amber-200'
                            : software.daysUntilRenewal <= 60
                            ? isDarkMode
                              ? 'bg-gradient-to-r from-yellow-900/30 via-yellow-800/30 to-yellow-900/30 border border-yellow-400/40'
                              : 'bg-gradient-to-r from-yellow-50 via-yellow-100 to-white border border-yellow-200'
                            : software.daysUntilRenewal <= 90
                            ? isDarkMode
                              ? 'bg-gradient-to-r from-blue-900/40 via-blue-800/30 to-blue-900/40 border border-blue-400/40'
                              : 'bg-gradient-to-r from-blue-50 via-blue-100 to-white border border-blue-200'
                            : isDarkMode
                            ? 'bg-gradient-to-r from-slate-900/40 via-slate-800/35 to-slate-900/40 border border-slate-700/60'
                              : 'bg-gradient-to-r from-slate-50 via-slate-100 to-white border border-slate-200'
                        }`}
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          {software.logo && (
                            <img src={software.logo} alt={software.software} className="h-8 w-8 rounded-lg object-contain" />
                          )}
                          <div className="flex-1">
                            <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{software.software}</p>
                            <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                              {software.vendor} &bull; {software.category}
                            </p>
                          </div>
                        </div>
                        <div className="flex w-full flex-wrap items-start gap-3 sm:flex-nowrap sm:items-center sm:justify-end sm:gap-4">
                          <div className="text-left sm:text-right">
                            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Renewal Date</p>
                            <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{formatDate(software.renewalDate)}</p>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Annual Cost</p>
                            <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{formatCurrency(software.annualCost)}</p>
                          </div>
                          <span
                            className={`tone-chip ${getRenewalBadgeTone(software.daysUntilRenewal)} self-start whitespace-nowrap px-3 py-1.5 text-xs font-bold shadow-sm sm:self-auto`}
                          >
                            {software.daysUntilRenewal < 0
                              ? `${Math.abs(software.daysUntilRenewal)}d OVERDUE`
                              : `${software.daysUntilRenewal} days`}
                          </span>
                          {software.portal && (
                            <a
                              href={software.portal}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-xl bg-slate-700 p-2 text-white transition hover:bg-slate-800 sm:self-auto"
                              title="Open admin portal"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
  
            <section className="grid gap-4 md:grid-cols-2">
              {sortedLicenseBuckets.map((suite) => (
                <SoftwareSuiteCard
                  key={suite.id}
                  suite={suite}
                  onEdit={() => setSoftwareForm(suite)}
                  onDelete={handleDeleteSoftware}
                />
              ))}
            </section>
          </>
        )}
      </div>
    </div>
  </div>

      {spotlightOpen && selectedAsset && (
        <AssetSpotlightModal
          asset={selectedAsset}
          onClose={() => {
            setSpotlightOpen(false);
            setSelectedAssetId(null);
          }}
          repairHistory={assetRepairHistory}
          currentRepairs={assetCurrentRepairs}
          ownerHistory={assetOwnerHistory}
          onEdit={setAssetForm}
          onApproveIntake={handleApproveIntake}
          onOpenAutomate={handleOpenAutomate}
          ownerContact={ownerContact}
          onRepair={handleOpenRepairTicketForAsset}
          onClearMaintenance={handleClearMaintenanceAlert}
          onClearMaintenanceAll={handleClearAllMaintenanceAlerts}
          isDarkMode={isDarkMode}
        />
      )}
      {assetForm && (
        <AssetFormModal
          asset={assetForm}
          onSubmit={handleSaveAsset}
          onCancel={() => setAssetForm(null)}
          suggestionListId={employeeSuggestionListId}
          modelSuggestionListId={modelSuggestionListId}
          departmentSuggestionListId={departmentSuggestionListId}
          locationSuggestionListId={locationSuggestionListId}
          departmentSuggestionOptions={departmentSuggestionOptions}
          locationSuggestionOptions={locationSuggestionOptions}
        />
      )}
      {employeeForm && (
        <EmployeeFormModal
          employee={employeeForm}
          onSubmit={handleSaveEmployee}
          onCancel={() => setEmployeeForm(null)}
          departmentSuggestionListId={departmentSuggestionListId}
          locationSuggestionListId={locationSuggestionListId}
          modelSuggestionListId={modelSuggestionListId}
          employeeSuggestionListId={employeeSuggestionListId}
          jobTitleSuggestionListId={jobTitleSuggestionListId}
          departmentSuggestionOptions={departmentSuggestionOptions}
          locationSuggestionOptions={locationSuggestionOptions}
          jobTitleSuggestionOptions={jobTitleSuggestionOptions}
        />
      )}
      {actionState && (
        <CheckActionModal
          asset={actionState.asset}
          mode={actionState.mode}
          onSubmit={handleActionSubmit}
          onCancel={() => setActionState(null)}
          suggestionListId={employeeSuggestionListId}
          defaultUser={actionState.user}
        />
      )}
      {softwareForm && (
        <SoftwareFormModal
          suite={softwareForm}
          onSubmit={handleSaveSoftware}
          onCancel={() => setSoftwareForm(null)}
          suggestionListId={employeeSuggestionListId}
        />
      )}
      {warrantyModalOpen && (
        <WarrantyAlertModal
          alerts={warrantyReminders}
          onClose={() => setWarrantyModalOpen(false)}
          onClear={handleClearWarrantyAlert}
          onClearAll={handleClearAllWarrantyAlerts}
        />
      )}
      {repairTicketForm && (
        <RepairTicketModal
          ticket={repairTicketForm}
          onSubmit={handleSaveRepairTicket}
          onCancel={() => setRepairTicketForm(null)}
          modelOptions={modelOptions}
          employeeNames={employeeNameOptions}
          locationOptions={locationSuggestionOptions}
        />
      )}
      {photoLightbox && <PhotoLightbox photo={photoLightbox} onClose={() => setPhotoLightbox(null)} />}
      {printerForm && <PrinterFormModal printer={printerForm} onSubmit={handleSavePrinter} onCancel={() => setPrinterForm(null)} />}
      {flashMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-lg">
          {flashMessage}
        </div>
      )}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-full flex-1 bg-slate-900/60" onClick={() => setMenuOpen(false)} />
          <div className="relative h-full w-full max-w-sm bg-white shadow-2xl overflow-x-clip">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-semibold text-slate-900">Quick menu</p>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[calc(100vh-56px)] overflow-y-auto overflow-x-clip p-4 space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25rem] text-slate-500">Navigate</p>
                <div className="mt-2 flex flex-col gap-2 overflow-x-clip">
                  {menuNavItems.map((item) => {
                    const currentPage = item.page || item.label;
                    const isActive = activePage === currentPage;
                    return (
                      <button
                        key={`menu-nav-${item.label}`}
                        type="button"
                        onClick={item.onClick}
                        className={`flex items-center justify-between rounded-2xl border px-3 py-2 text-sm font-semibold ${
                          isActive
                            ? 'border-blue-200 bg-blue-50 text-blue-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200'
                        }`}
                        style={{ maxWidth: '100%' }}
                      >
                        {item.label}
                        <ArrowRightLeft className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25rem] text-slate-500">Jump to</p>
                <div className="mt-2 flex flex-col gap-2">
                  {menuSectionLinks.map((item) => (
                    <button
                      key={`menu-jump-${item.label}`}
                      type="button"
                      onClick={item.onClick}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200"
                    >
                      {item.label}
                      <Navigation className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25rem] text-slate-500">Actions</p>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {menuActionItems.map((item) => (
                    <button
                      key={`menu-action-${item.label}`}
                      type="button"
                      onClick={item.onClick}
                      className="inline-flex items-center justify-between rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200"
                    >
                      {item.label} <item.icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25rem] text-slate-500">Utilities</p>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {menuUtilityItems.map((item) => (
                    <button
                      key={`menu-util-${item.label}`}
                      type="button"
                      onClick={item.onClick}
                      className="inline-flex items-center justify-between rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200"
                    >
                      {item.label} <item.icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isMobile && (
        <MobileActionBar
          onAdd={() => {
            setAssetForm(defaultAsset);
            setActivePage('Hardware');
          }}
          onScan={handleStartScanner}
          onWarranty={() => setWarrantyModalOpen(true)}
          onFilters={() => {
            setActivePage('Hardware');
            setFilters({ ...defaultAssetFilters });
            const section = document.getElementById('asset-table');
            if (section) {
              section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          onMenu={() => setMenuOpen(true)}
        />
      )}
    </div>
  );
};

export default App;
