import React, { useState, useMemo, useEffect, useLayoutEffect, Fragment, useCallback, useRef } from 'react';
import jsQR from 'jsqr';
import QRCode from 'qrcode';
import * as XLSX from 'xlsx';
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
  Bell,
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
  QrCode,
  Scan,
  Sun,
  Moon,
  Menu,
  Mail,
  DollarSign,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import employeeSheetData from './data/employees.json';
import employeePhotoMap from './data/employeePhotos.json';
import automateMap from './data/automateMap.json';

const DARK_MODE_STYLES = `
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
    background-color: #101827 !important;
  }
  html.theme-dark .bg-slate-50,
  html.theme-dark .bg-slate-50\\/60,
  html.theme-dark .bg-slate-50\\/70,
  html.theme-dark .bg-slate-50\\/80,
  html.theme-dark .bg-slate-50\\/90,
  html.theme-dark .bg-slate-100,
  html.theme-dark .bg-slate-100\\/70,
  html.theme-dark .bg-slate-200 {
    background-color: #0f1831 !important;
  }
  html.theme-dark .bg-blue-50 { background-color: rgba(59,130,246,0.18) !important; color: #cfe1ff; }
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
  html.theme-dark .glass-card {
    background: linear-gradient(145deg, rgba(12, 16, 32, 0.96), rgba(11, 18, 36, 0.9)) !important;
    box-shadow:
      0 28px 70px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(92, 224, 255, 0.18) !important;
    border: 1px solid rgba(111, 134, 255, 0.25) !important;
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
    box-shadow: 0 18px 60px rgba(15, 23, 42, 0.08);
  }
  html.theme-light .bg-slate-200 {
    background: linear-gradient(135deg, #f7f9fc 0%, #eef3ff 100%) !important;
  }
  html.theme-light .bg-blue-50 { background: linear-gradient(135deg, rgba(219, 234, 254, 0.92) 0%, rgba(239, 246, 255, 0.96) 100%) !important; }
  html.theme-light .bg-rose-50 { background: linear-gradient(135deg, rgba(255, 241, 242, 0.92) 0%, rgba(255, 247, 248, 0.96) 100%) !important; }
  html.theme-light .bg-amber-50 { background: linear-gradient(135deg, rgba(255, 251, 235, 0.92) 0%, rgba(255, 253, 240, 0.96) 100%) !important; }
  html.theme-light .bg-emerald-50 { background: linear-gradient(135deg, rgba(236, 253, 245, 0.92) 0%, rgba(240, 253, 249, 0.96) 100%) !important; }
  html.theme-light .bg-indigo-50 { background: linear-gradient(135deg, rgba(238, 242, 255, 0.92) 0%, rgba(245, 247, 255, 0.96) 100%) !important; }
  html.theme-light .bg-sky-50 { background: linear-gradient(135deg, rgba(240, 249, 255, 0.92) 0%, rgba(244, 251, 255, 0.96) 100%) !important; }
  html.theme-light .bg-teal-50 { background: linear-gradient(135deg, rgba(240, 253, 250, 0.92) 0%, rgba(243, 253, 251, 0.96) 100%) !important; }
  html.theme-light .bg-yellow-50 { background: linear-gradient(135deg, rgba(254, 252, 232, 0.92) 0%, rgba(255, 253, 240, 0.96) 100%) !important; }
  html.theme-light .bg-orange-50 { background: linear-gradient(135deg, rgba(255, 247, 237, 0.92) 0%, rgba(255, 249, 240, 0.96) 100%) !important; }
  html.theme-light section:nth-of-type(3n+1) .rounded-3xl,
  html.theme-light section:nth-of-type(3n+1) .glass-card {
    background: linear-gradient(135deg, rgba(235, 244, 255, 0.98) 0%, rgba(221, 236, 255, 0.96) 100%) !important;
    border-color: rgba(193, 216, 255, 0.9) !important;
  }
  html.theme-light section:nth-of-type(3n+2) .rounded-3xl,
  html.theme-light section:nth-of-type(3n+2) .glass-card {
    background: linear-gradient(135deg, rgba(255, 246, 240, 0.98) 0%, rgba(255, 236, 229, 0.96) 100%) !important;
    border-color: rgba(255, 211, 197, 0.9) !important;
  }
  html.theme-light section:nth-of-type(3n) .rounded-3xl,
  html.theme-light section:nth-of-type(3n) .glass-card {
    background: linear-gradient(135deg, rgba(241, 252, 247, 0.98) 0%, rgba(228, 249, 241, 0.96) 100%) !important;
    border-color: rgba(191, 230, 214, 0.9) !important;
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
  html.theme-light .hero-shell { color: #0b1324 !important; }
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
    border: 1px solid rgba(211, 218, 230, 0.9) !important;
    box-shadow: 0 18px 56px rgba(15, 23, 42, 0.14) !important;
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

const STORAGE_KEYS = {
  assets: 'uds_assets',
  licenses: 'uds_licenses',
  maintenance: 'uds_maintenance',
  history: 'uds_history',
  employees: 'uds_employees',
  laptopRepairs: 'uds_laptop_repairs',
  clearedWarrantyAlerts: 'uds_cleared_warranty_alerts',
  clearedMaintenanceAlerts: 'uds_cleared_maintenance_alerts',
};
const STORAGE_VERSION_KEY = 'uds_storage_version';
const STORAGE_VERSION = '2025-11-20-zoom-refresh';
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

const NAV_LINKS = ['Overview', 'Hardware', 'Repairs', 'Employees', 'Reports', 'Software', 'Vendors'];

const PUBLIC_URL = process.env.PUBLIC_URL || '';
const normalizedPublicUrl = PUBLIC_URL.replace(/\/+$/, '');
const deriveHelpDeskFallback = () => {
  if (typeof window !== 'undefined') {
    const { port, origin } = window.location;
    if (port === '3000') {
      // Local dev: assume the portal runs separately on 3001.
      return 'http://localhost:3010';
    }
    // Default to the same origin plus the helpdesk path.
    return `${origin}/helpdesk-portal/`;
  }
  // Production build fallback.
  return `${normalizedPublicUrl || ''}/helpdesk-portal/`;
};
const HELP_DESK_PORTAL_FALLBACK = deriveHelpDeskFallback();
const HELP_DESK_PORTAL_URL = process.env.REACT_APP_HELPDESK_PORTAL_URL || HELP_DESK_PORTAL_FALLBACK;
const ZOOM_WEBHOOK_URL = process.env.REACT_APP_ZOOM_WEBHOOK_URL || '';
const ZOOM_WEBHOOK_TOKEN = process.env.REACT_APP_ZOOM_WEBHOOK_TOKEN || '';
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
  assets: `${PUBLIC_URL}/tables/${encodeURIComponent('Asset List 11-18-25.xlsx')}`,
  employees: `${PUBLIC_URL}/tables/${encodeURIComponent('Employee Information Hub.xlsx')}`,
};
const PRINTER_VENDOR_DIRECTORY = {
  colony: {
    id: 'colony',
    name: 'Colony Products',
    description: 'Canon copier fleet service and toner logistics.',
    badge: 'bg-rose-50 text-rose-700 ring-rose-100',
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
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
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
    vendorBadge: vendorInfo?.badge || 'bg-slate-100 text-slate-600 ring-slate-200',
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
      const hasRawColumns = row['Device Name'] || row['Serial Num'] || row['Product Num'];
      const hasNormalizedColumns = row.assetName || row.serialNumber || row.deviceName || row.sheetId;
      return hasRawColumns || hasNormalizedColumns;
    })
    .map((row, index) => {
      if (row.assetName || row.serialNumber || row.deviceName || row.sheetId) {
        return mapNormalizedAssetRow(row, index, employeeDirectory);
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
    return {
      id: ticket.id,
      assetName: ticket.assetId || 'Unknown Asset',
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
  if (!API_STORAGE_BASE || typeof fetch === 'undefined') {
    return null;
  }
  try {
    const response = await fetch(`${API_STORAGE_BASE}/storage/${encodeURIComponent(key)}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch {
    return null;
  }
};

const persistRemoteStorage = async (key, value) => {
  if (!API_STORAGE_BASE || typeof fetch === 'undefined') {
    return;
  }
  try {
    await fetch(`${API_STORAGE_BASE}/storage/${encodeURIComponent(key)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(value),
    });
  } catch {
    // Best-effort; ignore offline/API errors.
  }
};

const usePersistentState = (key, initialValue) => {
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
    if (!API_STORAGE_BASE) {
      return;
    }
    let cancelled = false;
    const hydrateFromApi = async () => {
      const remoteValue = await fetchRemoteStorage(key);
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
          return remoteValue;
        }
        try {
          const localSnapshot = JSON.stringify(prev);
          const remoteSnapshot = JSON.stringify(remoteValue);
          return localSnapshot === remoteSnapshot ? prev : remoteValue;
        } catch {
          return remoteValue;
        }
      });
    };
    hydrateFromApi();
    return () => {
      cancelled = true;
    };
  }, [key]);

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
    persistRemoteStorage(key, state);
  }, [key, state]);

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
  if (!ZOOM_WEBHOOK_URL || typeof fetch !== 'function') {
    return;
  }
  const targetUrl = `${ZOOM_WEBHOOK_URL}?format=message`;
  const headers = { 'Content-Type': 'application/json' };
  if (ZOOM_WEBHOOK_TOKEN) {
    headers.Authorization = ZOOM_WEBHOOK_TOKEN;
  }
  const payloadText = (message || title ? `${title || 'Asset alert'} - ${message || ''}` : 'Asset alert').trim();
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
  Available: 'bg-emerald-50 text-emerald-700',
  'Checked Out': 'bg-blue-50 text-blue-700',
  Maintenance: 'bg-amber-50 text-amber-700',
  Retired: 'bg-slate-100 text-slate-500',
};

const getAssetDisplayStatus = (asset) =>
  normalizeStatusLabel(asset?.status) || (asset?.checkedOut ? 'Checked Out' : 'Available');

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
  const trimmedEmail = (supervisorEmail || '').trim();
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
  const recipient = trimmedEmail || '';
  return `mailto:${recipient}?subject=${subject}&body=${body}`;
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
    repairs: mergedRepairs.slice(0, 6),
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

const PrimaryNav = ({
  onAdd,
  onAddEmployee,
  activePage,
  onNavigate,
  onToggleTheme,
  isDarkMode,
  onOpenMenu,
  onOpenCommandPalette,
}) => (
  <nav
    className={`nav-ribbon ${isDarkMode ? 'nav-dark text-slate-100' : 'text-slate-700'} mb-10 rounded-3xl px-6 py-5 backdrop-blur-xl shadow-2xl transition-all duration-500 overflow-hidden`}
    style={{ overflow: 'hidden', maxWidth: '100%' }}
  >
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <img
              src={MEDIA.logo}
              alt="United Disabilities Services logo"
              className="h-11 w-11 rounded-2xl border border-slate-100 bg-white object-contain p-1.5 shadow-sm"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">United Disabilities Services</p>
              <p className="text-base font-semibold text-slate-900">Asset Control Studio</p>
            </div>
          </div>
          <span className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 sm:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5" />
            Sync paused
          </span>
        </div>
        <div className="flex flex-1 flex-wrap items-start justify-end gap-2">
          <div className="flex items-center gap-2 self-start">
            <button
              className={`rounded-full border p-2 ${isDarkMode ? 'border-slate-700 text-slate-200 hover:border-slate-500' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
              type="button"
              onClick={onToggleTheme}
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              className="rounded-full border border-slate-200 p-2 text-slate-500 hover:border-slate-300"
              type="button"
              onClick={onOpenMenu}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div
        className={`flex w-full flex-wrap items-center justify-between gap-4 text-sm font-medium ${
        isDarkMode ? 'text-slate-200' : 'text-slate-500'
      }`}
        style={{ overflow: 'hidden', maxWidth: '100%' }}
      >
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
        <button
          onClick={onAdd}
          className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover-lift hover:shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 sm:w-auto"
          style={{ letterSpacing: '0.025em' }}
        >
          <Monitor className="h-4 w-4" />
          New asset
        </button>
        <button
          onClick={onAddEmployee}
          type="button"
            className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover-lift hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 sm:w-auto"
            style={{ letterSpacing: '0.025em' }}
          >
            <Users className="h-4 w-4" />
            New employee
          </button>
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold shadow-md hover-lift transition-all duration-300 sm:w-auto ${
            isDarkMode
                ? 'border border-slate-600 bg-gradient-to-br from-slate-800 to-slate-900 text-slate-100 hover:border-slate-500 hover:shadow-lg'
                : 'border border-slate-300 bg-gradient-to-br from-white to-slate-50 text-slate-700 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-200/50'
            }`}
            style={{ letterSpacing: '0.025em' }}
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-4 overflow-x-auto pb-1">
          {NAV_LINKS.map((item) => (
            <button
              key={item}
              onClick={() => onNavigate?.(item)}
              className={`nav-pill relative transition ${isDarkMode ? 'hover:text-white' : 'hover:text-slate-900'} ${
                activePage === item ? 'is-active' : ''
              }`}
              type="button"
              aria-current={activePage === item ? 'page' : undefined}
            >
              <span className="glow" aria-hidden />
              <span className="relative z-10">{item}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  </nav>
);

const QuickActionCard = ({ title, description, icon: Icon, actionLabel, onAction }) => (
  <div className="rounded-2xl border border-slate-100 bg-white/70 p-5 shadow-sm backdrop-blur">
    <div className="flex items-start gap-3">
      <div className="rounded-2xl bg-blue-50 p-3 text-blue-500">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
    <button
      onClick={onAction}
      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
      type="button"
    >
      {actionLabel}
      <ArrowRightLeft className="h-4 w-4" />
    </button>
  </div>
);

const DeviceSpotlightCard = ({ title, stats = [], stat, description, image, meta, onStatClick, isDarkMode = false }) => {
  const displayStats = stats.length ? stats : stat ? [{ label: stat }] : [];

  return (
    <div className={`relative overflow-hidden rounded-3xl border shadow-2xl hover-lift transition-all duration-500 ${
      isDarkMode 
        ? 'border-slate-700 bg-slate-900 text-white' 
        : 'border-slate-200 bg-white text-slate-900'
    }`}>
      {image && <img src={image} alt="" className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 hover:opacity-50 ${
        isDarkMode ? 'opacity-40' : 'opacity-20'
      }`} />}
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

const SnapshotMetricsRow = ({ metrics = [], isDarkMode = false }) => (
  <div className="glass-card rounded-3xl p-6 shadow-lg">
    <p className="text-[11px] font-bold uppercase tracking-[0.35rem] bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Daily signals</p>
    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="metric-card p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-500">{metric.label}</p>
          <p className="metric-value mt-2">{metric.value}</p>
          <p className="metric-label mt-1">{metric.subline}</p>
        </div>
      ))}
      {metrics.length === 0 && <p className="text-sm text-slate-500">No live metrics available.</p>}
    </div>
  </div>
);

const OverviewAttentionPanel = ({
  overdue = [],
  dueSoon = [],
  maintenance = [],
  software = [],
  reminderPreview = [],
  onOpenAlerts,
  onClearServiceReminder = () => {},
  onClearWarrantyReminder = () => {},
}) => {
  const summary = [
    { label: 'Overdue', value: overdue.length, tone: 'bg-rose-50 text-rose-700' },
    { label: 'Due soon', value: dueSoon.length, tone: 'bg-amber-50 text-amber-700' },
    { label: 'Work orders', value: maintenance.length, tone: 'bg-blue-50 text-blue-700' },
  ];
  const reminders = reminderPreview.slice(0, 4);

  return (
    <CardShell
      title="Needs attention"
      icon={Bell}
      action={
        <button
          type="button"
          onClick={onOpenAlerts}
          className="rounded-2xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
        >
          Open alerts
        </button>
      }
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {summary.map((item) => (
          <div key={item.label} className={`rounded-2xl border border-slate-100 p-3 text-sm font-semibold ${item.tone}`}>
            <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="text-lg">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {reminders.length === 0 && <p className="text-sm text-slate-600">No upcoming lifecycle tasks. Keep shipping.</p>}
        {reminders.map((reminder) => (
          <div key={`${reminder.assetId}-${reminder.warrantyExpiry}`} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{reminder.assetName || reminder.model}</p>
                <p className="text-xs text-slate-500">
                  {reminder.type} - {reminder.overdue ? 'Overdue' : `${reminder.daysRemaining} days`}
                </p>
                <p className="text-xs text-slate-500">
                  {reminder.location || 'Location TBD'} - {reminder.assignedTo || 'Unassigned'}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                  reminder.overdue ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {reminder.overdue ? 'Overdue' : `Due in ${reminder.daysRemaining}d`}
              </span>
            </div>
            {reminder.type === 'Service' && (
              <button
                type="button"
                className="mt-2 text-xs font-semibold text-amber-700 underline underline-offset-4"
                onClick={() => onClearServiceReminder(reminder)}
              >
                Clear
              </button>
            )}
            {reminder.type === 'Warranty' && (
              <button
                type="button"
                className="mt-2 text-xs font-semibold text-slate-700 underline underline-offset-4"
                onClick={() => onClearWarrantyReminder(reminder)}
              >
                Clear
              </button>
            )}
          </div>
        ))}
      </div>
      {software.length > 0 && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white/70 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3rem] text-slate-500">Software watch</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {software.slice(0, 4).map((suite) => (
              <span
                key={suite.id}
                className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
              >
                {suite.software}
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                    suite.status === 'Overused' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {suite.status}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </CardShell>
  );
};

const OverviewActivityCard = ({ history = [], maintenance = [], lookupAsset }) => {
  const activity = history.slice(0, 4);
  const maintenanceByStatus = maintenance.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <CardShell title="Ops feed" icon={History}>
      <div className="space-y-3">
        {activity.length === 0 && <p className="text-sm text-slate-600">No recent check-ins or check-outs.</p>}
        {activity.map((entry) => (
          <div key={entry.id} className="flex items-start gap-3 rounded-2xl border border-slate-100 p-3">
            <div
              className={`rounded-full p-2 ${
                entry.action === 'Check Out' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              <ArrowRightLeft className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {entry.action} - {lookupAsset ? lookupAsset(entry.assetId) : entry.assetId}
              </p>
              <p className="text-xs text-slate-500">
                {entry.date} | {entry.user}
              </p>
              {entry.notes && <p className="mt-1 text-sm text-slate-600">{entry.notes}</p>}
            </div>
          </div>
        ))}
      </div>
      {maintenance.length > 0 && (
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3rem] text-slate-500">Maintenance queue</p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            {Object.entries(maintenanceByStatus).map(([status, count]) => (
              <div key={status} className="rounded-lg bg-white px-3 py-2 font-semibold text-slate-700 ring-1 ring-slate-100">
                <p className="text-[10px] uppercase tracking-wide text-slate-500">{status}</p>
                <p className="text-sm">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </CardShell>
  );
};

const SpendHotspotsCard = ({ costByDepartment = [], topLocations = [] }) => {
  const total = costByDepartment.reduce((sum, item) => sum + Number(item.value || 0), 0);
  return (
    <CardShell title="Spend hotspots" icon={Tag}>
      {costByDepartment.length === 0 && <p className="text-sm text-slate-600">Add cost data to surface spend outliers.</p>}
      {costByDepartment.length > 0 && (
        <div className="space-y-3">
          {costByDepartment.map((dept) => {
            const percent = total ? Math.round((Number(dept.value || 0) / total) * 100) : 0;
            return (
              <div key={dept.name} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                  <span>{dept.name}</span>
                  <span>{formatCurrency(dept.value)}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white">
                  <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-teal-400" style={{ width: `${percent}%` }} />
                </div>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">{percent}% of tracked spend</p>
              </div>
            );
          })}
        </div>
      )}
      {topLocations?.length > 0 && (
        <div className="mt-4 rounded-xl border border-slate-100 bg-white/70 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3rem] text-slate-500">Top locations</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
            {topLocations.slice(0, 3).map((location) => (
              <span key={location.location} className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-100">
                {location.location} ({location.count})
              </span>
            ))}
          </div>
        </div>
      )}
    </CardShell>
  );
};

const VendorCard = ({ vendor }) => {
  const accentFrom = vendor.accent?.from || '#0f172a';
  const accentTo = vendor.accent?.to || '#475569';
  const imageSrc = vendor.image || VENDOR_IMAGES[vendor.id] || MEDIA.devices.computer;

  return (
    <div className="glass-card flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/50 bg-white shadow-2xl ring-1 ring-slate-100 hover-lift transition-all duration-500 hover:ring-2 hover:ring-blue-300/50">
      <div className="relative h-48 w-full overflow-hidden">
        <img src={imageSrc} alt={`${vendor.name} visual`} className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`, opacity: 0.85 }} />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-white/70">Vendor partner</p>
          <p className="mt-1 text-2xl font-semibold text-white drop-shadow">{vendor.name}</p>
          <p className="text-xs text-white/80">{vendor.description}</p>
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
          <div className="rounded-2xl bg-emerald-50/80 p-3 text-center text-emerald-700">
            <p className="text-xs uppercase tracking-widest text-emerald-600/80">Active</p>
            <p className="mt-1 text-xl">{vendor.activeCount}</p>
          </div>
          <div className="rounded-2xl bg-amber-50/80 p-3 text-center text-amber-700">
            <p className="text-xs uppercase tracking-widest text-amber-600/80">Maintenance</p>
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
      <div className="overflow-hidden">
        <table className="w-full table-auto divide-y divide-slate-100 text-left text-sm">
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
              <p className="mt-1 text-2xl font-semibold text-slate-900">
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

const WarrantyAlertStrip = ({ alerts = [], onViewAll, onClearAll, isDarkMode = false }) => {
  if (!alerts.length) {
    return null;
  }
  const highlight = alerts.slice(0, 3);
  const nextExpiry = highlight[0]?.warrantyExpiry ? formatDate(highlight[0].warrantyExpiry) : null;
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border p-6 ${
        isDarkMode
          ? 'border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white shadow-[0_20px_60px_rgba(15,23,42,0.55)]'
          : 'border-amber-100 bg-gradient-to-br from-white via-amber-50/70 to-orange-50 text-slate-900 shadow-[0_16px_45px_rgba(15,23,42,0.12)]'
      }`}
    >
      <div className={`absolute inset-0 blur-3xl ${isDarkMode ? 'opacity-40' : 'opacity-30'}`}>
        <div
          className={`absolute -left-10 -top-8 h-40 w-40 rounded-full ${isDarkMode ? 'bg-cyan-500/40' : 'bg-amber-200/60'}`}
        />
        <div
          className={`absolute bottom-0 right-0 h-48 w-48 rounded-full ${isDarkMode ? 'bg-amber-400/30' : 'bg-orange-200/50'}`}
        />
      </div>
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ${
              isDarkMode
                ? 'bg-white/10 ring-white/20 shadow-inner'
                : 'bg-white ring-amber-200 shadow-sm'
            }`}
          >
            <CalendarClock className={`h-5 w-5 ${isDarkMode ? 'text-amber-200' : 'text-amber-700'}`} />
          </span>
          <div>
            <p
              className={`text-[11px] font-semibold uppercase tracking-[0.3rem] ${
                isDarkMode ? 'text-white/70' : 'text-amber-700/80'
              }`}
            >
              Warranty alerts
            </p>
            <p className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Expiring within 30 days</p>
            <p className={`text-sm ${isDarkMode ? 'text-white/70' : 'text-slate-700'}`}>
              {alerts.length} device{alerts.length === 1 ? '' : 's'} need attention {nextExpiry ? `- next on ${nextExpiry}` : ''}
            </p>
          </div>
        </div>
          <div className="flex items-center gap-2">
          {typeof onClearAll === 'function' && (
            <button
              type="button"
              className={`rounded-2xl px-4 py-2 text-xs font-semibold transition hover:-translate-y-0.5 ${
                isDarkMode
                  ? 'border border-white/20 bg-white/10 text-white hover:border-white/30 hover:bg-white/15'
                  : 'border border-amber-200 bg-white/80 text-amber-800 shadow-sm hover:border-amber-300 hover:bg-white'
              }`}
              onClick={() => onClearAll(alerts)}
            >
              Clear all
            </button>
          )}
          {typeof onViewAll === 'function' && (
            <button
              type="button"
              className={`rounded-2xl px-4 py-2 text-xs font-semibold shadow-lg transition hover:-translate-y-0.5 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 shadow-amber-500/30'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-400/50'
              }`}
              onClick={onViewAll}
            >
              View all
            </button>
          )}
          </div>
        </div>

      <div className="relative mt-5 grid gap-3 sm:grid-cols-3">
        <div
          className={`rounded-2xl border p-4 shadow-inner backdrop-blur ${
            isDarkMode ? 'border-white/10 bg-white/5' : 'border-amber-100 bg-white/80'
          }`}
        >
          <p
            className={`text-[11px] uppercase tracking-[0.25rem] ${
              isDarkMode ? 'text-white/60' : 'text-amber-700/70'
            }`}
          >
            Total alerts
          </p>
          <p className={`mt-2 text-3xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{alerts.length}</p>
        </div>
        <div
          className={`rounded-2xl border p-4 shadow-inner backdrop-blur ${
            isDarkMode ? 'border-white/10 bg-white/5' : 'border-amber-100 bg-white/80'
          }`}
        >
          <p
            className={`text-[11px] uppercase tracking-[0.25rem] ${
              isDarkMode ? 'text-white/60' : 'text-amber-700/70'
            }`}
          >
            Next expiry
          </p>
          <p className={`mt-2 text-lg font-semibold ${isDarkMode ? 'text-amber-100' : 'text-amber-700'}`}>{nextExpiry || '-'}</p>
        </div>
        <div
          className={`rounded-2xl border p-4 shadow-inner backdrop-blur ${
            isDarkMode ? 'border-white/10 bg-white/5' : 'border-amber-100 bg-white/80'
          }`}
        >
          <p
            className={`text-[11px] uppercase tracking-[0.25rem] ${
              isDarkMode ? 'text-white/60' : 'text-amber-700/70'
            }`}
          >
            Action
          </p>
          <p className={`mt-2 text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Schedule service or renew coverage
          </p>
        </div>
      </div>

      <div className="relative mt-5 space-y-3">
        {highlight.map((alert, index) => (
          <div
            key={`${alert.assetId || alert.assetName}-warranty`}
            className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm ${
              isDarkMode ? 'border-white/10 bg-white/5 shadow-inner backdrop-blur' : 'border-amber-100/80 bg-white/80 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ring-1 ${
                  isDarkMode ? 'bg-amber-500/20 text-amber-100 ring-amber-300/40' : 'bg-amber-100 text-amber-700 ring-amber-200'
                }`}
              >
                {index + 1}
              </div>
              <div>
                <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {alert.assetName || alert.model || 'Device'}
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>
                  {alert.location || 'Location TBD'} | {alert.assignedTo || 'Unassigned'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-white/60' : 'text-amber-700/70'}`}>Expires</p>
              <p className={`text-sm font-semibold ${isDarkMode ? 'text-amber-100' : 'text-amber-700'}`}>{formatDate(alert.warrantyExpiry)}</p>
            </div>
          </div>
        ))}
        {alerts.length > highlight.length && (
          <div
            className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs font-semibold ${
              isDarkMode
                ? 'border-white/10 bg-white/5 text-white/80 backdrop-blur'
                : 'border-amber-100 bg-white/90 text-slate-800 shadow-sm'
            }`}
          >
            <span>+{alerts.length - highlight.length} more devices in queue</span>
            {typeof onViewAll === 'function' && (
              <button
                type="button"
                className={isDarkMode ? 'text-amber-200 underline underline-offset-4' : 'text-amber-700 underline underline-offset-4'}
                onClick={onViewAll}
              >
                Review all
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const WhatsNewCard = () => (
  <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
    <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">What&apos;s new</p>
    <ul className="mt-4 space-y-3 text-sm text-slate-600">
      <li className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
        <p className="font-semibold text-slate-900">Loaner audit</p>
        <p className="text-xs text-slate-500">Weekly spot-check scheduled for Friday to keep five devices staged.</p>
      </li>
      <li className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
        <p className="font-semibold text-slate-900">Upcoming refresh</p>
        <p className="text-xs text-slate-500">Finance laptops older than 5 years will be swapped starting next Monday.</p>
      </li>
      <li className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
        <p className="font-semibold text-slate-900">Vendor cadence</p>
        <p className="text-xs text-slate-500">Quarterly vendor review slated for next week.</p>
      </li>
    </ul>
  </div>
);

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
    <div className="grid gap-6 p-6 lg:grid-cols-2">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%" minWidth={200}>
          <BarChart data={costData} margin={{ top: 8, right: 8, left: -16, bottom: 24 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              interval={0}
              tick={{ fontSize: 10 }}
              tickMargin={10}
              height={48}
            />
            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="mt-3 text-xs uppercase tracking-widest text-slate-400">Spend by department</p>
        <div className="mt-2 grid gap-2 text-xs text-slate-600 sm:grid-cols-2 lg:hidden">
          {costData.map((dept) => (
            <div key={dept.name} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
              <span className="font-semibold">{dept.name}</span>
              <span className="text-slate-500">{formatCurrency(dept.value)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%" minWidth={200}>
          <LineChart data={depreciation} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Line type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
        <p className="mt-3 text-xs uppercase tracking-widest text-slate-400">Depreciation outlook</p>
      </div>
    </div>
  </div>
);

const MaintenanceWorkflowBoard = ({ workOrders = [], isDarkMode = false }) => {
  const columns = [
    { label: 'Planned', key: 'Planned', color: 'from-sky-100 to-white', chip: 'bg-sky-500/10 text-sky-700' },
    { label: 'In Progress', key: 'In Progress', color: 'from-amber-100 to-white', chip: 'bg-amber-500/10 text-amber-700' },
    { label: 'Awaiting Parts', key: 'Awaiting Parts', color: 'from-indigo-100 to-white', chip: 'bg-indigo-500/10 text-indigo-700' },
    { label: 'Completed', key: 'Completed', color: 'from-emerald-100 to-white', chip: 'bg-emerald-500/10 text-emerald-700' },
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
        ? 'bg-rose-50 text-rose-700 border-rose-100'
        : /medium|sev\s*2/i.test(severity)
          ? 'bg-amber-50 text-amber-700 border-amber-100'
          : 'bg-emerald-50 text-emerald-700 border-emerald-100';
    return (
      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}>{severity}</span>
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
                    {assignments.map((asset) => {
                      const deviceLabel = asset.deviceName || asset.assetName || `Asset ${asset.id}`;
                      const assetId = asset.sheetId || asset.assetName || `Asset-${asset.id}`;
                      const modelLabel = asset.model || 'Unknown model';
                      const serialLabel = asset.serialNumber || 'N/A';
                      const showDeviceLabel =
                        deviceLabel && deviceLabel.toLowerCase() !== (assetId || '').toLowerCase();
                      return (
                        <li
                          key={asset.id}
                          className={`rounded-lg border p-3 ${
                            isDarkMode
                              ? 'border-slate-700/70 bg-slate-900/70 shadow-inner'
                              : 'border-blue-100 bg-white/95 shadow-sm'
                          }`}
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
                isDarkMode ? 'text-white/70' : 'text-amber-700/80'
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
                  : 'border border-amber-200 bg-white text-amber-800 shadow-sm hover:border-blue-200 hover:text-blue-700'
              }`}
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          )}
        </div>
        <div className="text-right">
          <p className={`text-xs uppercase tracking-widest ${isDarkMode ? 'text-white/60' : 'text-amber-700/80'}`}>Avg age in repair</p>
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
                  isDarkMode ? 'text-white/70' : 'text-amber-700/80'
                }`}
              >
                Laptops out for repair
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-white/80' : 'text-slate-700'}`}>{repairTotal} devices</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isDarkMode ? 'bg-amber-900/40 text-amber-100 ring-1 ring-amber-500/30' : 'bg-amber-100 text-amber-800 ring-1 ring-amber-200'
              }`}
            >
              {repairTotal > 0 ? 'In progress' : 'All clear'}
            </span>
          </div>
          {repairs.length === 0 ? (
            <p className={`mt-4 text-sm ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>No laptops currently staged at the depot.</p>
          ) : (
            <ul className="mt-4 space-y-3">
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
                    isDarkMode ? 'text-white/70' : 'text-amber-700/80'
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
                <p className={`text-lg ${isDarkMode ? 'text-emerald-200' : 'text-emerald-700'}`}>{loanerAvailableCount}</p>
                <p className={isDarkMode ? 'text-white/70' : 'text-slate-600'}>Available</p>
              </div>
              <div
                className={`rounded-xl border p-2 ${
                  isDarkMode ? 'border-white/10 bg-white/5 text-white' : 'border-amber-100 bg-white text-slate-800'
                }`}
              >
                <p className={`text-lg ${isDarkMode ? 'text-amber-200' : 'text-amber-700'}`}>{loanerDeployedCount}</p>
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
                      <p className={`text-[11px] ${isDarkMode ? 'text-emerald-200' : 'text-emerald-700'}`}>{loaner.location}</p>
                    </div>
                    {typeof onLoanerCheckout === 'function' && (
                      <button
                        type="button"
                        onClick={() => onLoanerCheckout(loaner.asset)}
                        className={`rounded-2xl px-3 py-1 text-xs font-semibold transition hover:-translate-y-0.5 ${
                          isDarkMode
                            ? 'border border-emerald-800 bg-emerald-950 text-emerald-100 hover:border-emerald-700'
                            : 'border border-emerald-200 bg-white text-emerald-700 shadow-sm hover:border-emerald-300'
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
                isDarkMode ? 'text-white/70' : 'text-amber-700/80'
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
              isDarkMode ? 'text-white/70' : 'text-amber-700/80'
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
              : 'bg-emerald-50 text-emerald-700 ring-emerald-100'
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
                  <p className={`text-[11px] uppercase tracking-widest ${isDarkMode ? 'text-white/60' : 'text-amber-700/70'}`}>
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

const LicenseRiskReport = ({ data = [], onExport }) => {
  const risks = data.filter((item) => item.status !== 'Healthy');
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">Software risk</p>
          <p className="text-xl font-semibold text-slate-900">License pressure</p>
          <p className="text-xs text-slate-500">{risks.length} suite(s) require attention</p>
        </div>
        <button
          type="button"
          onClick={onExport}
          className="rounded-2xl border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
        >
          Export
        </button>
      </div>
      {risks.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">All suites have healthy buffers.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {risks.slice(0, 5).map((suite) => (
            <li key={suite.id} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">{suite.software}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    suite.status === 'Overused' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {suite.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {suite.used} / {suite.seats} seats - {suite.delta} buffer
              </p>
              <p className="text-xs text-slate-400">Owner: {suite.owner}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

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
          <p className="text-xs uppercase tracking-[0.3rem] text-emerald-600">Available</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-700">{loanerAvailableCount}</p>
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

const AssetFilters = ({ filters, onChange, onReset, types, embedded = false }) => (
  <div
    className={`${
      embedded
        ? 'rounded-2xl border border-slate-100 bg-slate-50/60 p-4'
        : 'rounded-2xl border border-slate-100 bg-white p-4 shadow-sm'
    }`}
  >
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-[2fr_repeat(3,minmax(0,1fr))_auto] xl:items-center">
      <div className="relative sm:col-span-2 xl:col-span-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={filters.search}
          onChange={(event) => onChange('search', event.target.value)}
          placeholder="Search by model, serial, or user"
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>
      <select
        value={filters.type}
        onChange={(event) => onChange('type', event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="all">All statuses</option>
        <option value="Available">Available</option>
        <option value="Checked Out">Checked Out</option>
        <option value="Maintenance">Maintenance</option>
        <option value="Retired">Retired</option>
      </select>
      <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
        <input
          type="checkbox"
          checked={Boolean(filters.hideRetired)}
          onChange={(event) => onChange('hideRetired', event.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        Hide retired
      </label>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
      >
        <X className="h-4 w-4" />
        Reset
      </button>
    </div>
  </div>
);

const EmployeeFilters = ({ search, filters, departments, locations, jobTitles, onSearchChange, onFilterChange, onReset }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
      <div className="relative sm:col-span-2 lg:col-span-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name, title, or department"
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>
      <select
        value={filters.department}
        onChange={(event) => onFilterChange('department', event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="all">All departments</option>
        {departments.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>
      <select
        value={filters.location}
        onChange={(event) => onFilterChange('location', event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="all">All locations</option>
        {locations.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>
      <select
        value={filters.jobTitle}
        onChange={(event) => onFilterChange('jobTitle', event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="all">All roles</option>
        {jobTitles.map((title) => (
          <option key={title} value={title}>
            {title}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
      >
        <X className="h-4 w-4" />
        Reset
      </button>
    </div>
  </div>
);

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
                entry.action === 'Check Out' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
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
          <Scan className="h-4 w-4 text-emerald-600" />
          <p className="text-sm font-semibold text-slate-900">Scan QR</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={scannerActive ? onStopScanner : onStartScanner}
            className={`rounded-2xl px-3 py-1.5 text-xs font-semibold ${
              scannerActive
                ? 'border border-rose-200 bg-rose-50 text-rose-700'
                : 'border border-emerald-200 bg-emerald-50 text-emerald-700'
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
      {scannerError && <p className="text-xs text-rose-600">{scannerError}</p>}
      {scanMessage && <p className="text-xs text-amber-600">{scanMessage}</p>}
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
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700"
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
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800"
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
  ownerHistory = [],
  onOpenAutomate,
  ownerContact,
  onRepair,
  onClearMaintenance = () => {},
  onClearMaintenanceAll = () => {},
}) => {
  const Icon = asset ? assetTypeIcons[asset.type] || Monitor : Monitor;
  const statusLabel = asset ? getAssetDisplayStatus(asset) : 'Available';
  const qualityIssues = asset ? getAssetQualityIssues(asset) : [];
  const qualityScore = asset ? getAssetQualityScore(asset) : 100;
  const ready = isAssetReady(asset || {});
  const automateEligible = isComputerAsset(asset);
  const assetIdLabel = asset?.sheetId || asset?.serialNumber || asset?.assetName || (asset?.id ? `Asset-${asset.id}` : 'Asset');

  return (
    <div className="sticky top-6 rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm">
      {asset ? (
        <>
          {/* Hero Card with Asset ID and Assigned To prominently displayed */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-lg">
            <div className="mb-4 flex items-start gap-3">
              <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/20 shadow-inner">
                <Icon className="h-8 w-8 text-white drop-shadow" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-[0.25rem] text-white/60">{asset.type}</p>
                <p className="text-sm text-white/70">{asset.model || 'Model not set'}</p>
              </div>
            </div>
            
            {/* Most Important Info: Asset ID and Assignment */}
            <div className="grid gap-4 sm:grid-cols-2 border-t border-white/10 pt-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/50 mb-1">Asset ID</p>
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-blue-300" />
                  <p className="text-2xl font-bold text-white">{assetIdLabel}</p>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/50 mb-1">Assigned To</p>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-300" />
                  <p className="text-2xl font-bold text-emerald-100">{asset.assignedTo || 'Unassigned'}</p>
                </div>
              </div>
            </div>

            {/* Status Badges */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                <ShieldCheck className="h-3.5 w-3.5" />
                {statusLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                <MapPin className="h-3.5 w-3.5" />
                {asset.location || 'Location not set'}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                <DollarSign className="h-3.5 w-3.5" />
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
                className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
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
                className="inline-flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800 hover:bg-amber-100"
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
              <div className="flex flex-wrap gap-2">
                {ownerContact?.phone && (
                  <a
                    href={`tel:${ownerContact.phone}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    <PhoneCall className="h-4 w-4" />
                    {ownerContact.phone}
                  </a>
                )}
                {ownerContact?.email && (
                  <a
                    href={`mailto:${ownerContact.email}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    <Mail className="h-4 w-4" />
                    {ownerContact.email}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Quality Check for Unapproved Assets */}
          {!ready && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Intake Readiness</p>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                  {qualityScore}% Complete
                </span>
              </div>
              {qualityIssues.length > 0 && (
                <ul className="space-y-1 text-xs text-amber-800">
                  {qualityIssues.map((issue) => (
                    <li key={issue} className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
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

          {/* History Sections - Only show if there's data */}
          {(repairHistory.length > 0 || ownerHistory.length > 0) && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {repairHistory.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Repair History</p>
                    <button
                      type="button"
                      className="text-[11px] font-semibold text-amber-700 underline underline-offset-2"
                      onClick={() => onClearMaintenanceAll(repairHistory)}
                    >
                      Clear all
                    </button>
                  </div>
                  <ul className="space-y-2">
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
                                item.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
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
                </div>
              )}
              {ownerHistory.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Owner History</p>
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
                </div>
              )}
            </div>
          )}
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
  ownerHistory = [],
  onEdit,
  onApproveIntake,
  onOpenAutomate,
  ownerContact,
  onRepair,
  onClearMaintenance,
  onClearMaintenanceAll,
}) => {
  if (!asset) return null;

  return (
    <ModalShell title="Asset spotlight" onClose={onClose}>
      <AssetSpotlight
        asset={asset}
        onEdit={onEdit}
        onApproveIntake={onApproveIntake}
        repairHistory={repairHistory}
        ownerHistory={ownerHistory}
        onOpenAutomate={onOpenAutomate}
        ownerContact={ownerContact}
        onRepair={onRepair}
        onClearMaintenance={onClearMaintenance}
        onClearMaintenanceAll={onClearMaintenanceAll}
      />
    </ModalShell>
  );
};

const ModalShell = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/70 px-4 py-8">
    <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl">
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
              placeholder="Match the Asset List entry (e.g., Laptop450)"
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
            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${qualityIssues.length === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
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

  return (
    <ModalShell title={form.id ? 'Edit laptop repair' : 'Add laptop repair'} onClose={onCancel}>
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
            <select
              value={form.title}
              onChange={(event) => update('title', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select a role...</option>
              {jobTitleSuggestionOptions.map((title) => (
                <option key={`role-option-${title}`} value={title}>
                  {title}
                </option>
              ))}
            </select>
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
                  className="text-xs font-semibold text-rose-600 hover:text-rose-500"
                  disabled={uploadingPhoto}
                >
                  Remove photo
                </button>
              )}
              {photoError && <p className="text-xs text-rose-600">{photoError}</p>}
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
                className="rounded-2xl border border-amber-200 bg-white px-4 py-1.5 text-xs font-semibold text-amber-800 transition hover:border-amber-300 hover:text-amber-900"
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
                        <span className={`text-sm font-semibold ${alert.overdue ? 'text-rose-600' : 'text-amber-600'}`}>{statusLabel}</span>
                      </td>
                      {canClear && (
                        <td className="px-4 py-3 align-top text-right">
                          <button
                            type="button"
                            onClick={() => onClear(alert)}
                            className="rounded-full px-3 py-1 text-xs font-semibold text-amber-800 transition hover:text-rose-600"
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

const App = () => {
  const [assets, setAssets] = usePersistentState(STORAGE_KEYS.assets, BASE_ASSETS);
  const [history, setHistory] = usePersistentState(STORAGE_KEYS.history, BASE_HISTORY);
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
            ? 'bg-rose-50 text-rose-700 ring-rose-100'
            : vendorId === 'weaver'
              ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
              : 'bg-slate-100 text-slate-700 ring-slate-200';
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
    let cancelled = false;
    const loadOrgChart = async () => {
      try {
        const fileName = encodeURIComponent('Org Chart and HUB 12-25.xlsx');
        // Try both folder casings to avoid 404s on case-sensitive hosts.
        const orgChartUrls = [`${PUBLIC_URL}/Tables/${fileName}`, `${PUBLIC_URL}/tables/${fileName}`];
        let response = null;
        for (const url of orgChartUrls) {
          const attempt = await fetch(url);
          if (attempt.ok) {
            response = attempt;
            break;
          }
        }
        if (!response?.ok) return;
        const buffer = await response.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        const getField = (row, key) => {
          const target = key.toLowerCase();
          const match = Object.entries(row).find(([k]) => k.toLowerCase() === target);
          return match ? match[1] : '';
        };
        const supervisorMap = rows.reduce((acc, row) => {
          const first = formatPersonName(getField(row, 'First Name'));
          const last = formatPersonName(getField(row, 'Last Name'));
          const name = `${first} ${last}`.trim();
          const key = normalizeKey(name);
          if (!key) return acc;
          const managerName = (getField(row, 'Manager Name') || '').toString().trim();
          const managerEmail = (
            getField(row, 'Manager E-Mail Address') ||
            getField(row, 'Manager Email Address') ||
            ''
          )
            .toString()
            .trim();
          if (managerName || managerEmail) {
            acc[key] = { supervisor: managerName, supervisorEmail: managerEmail };
          }
          return acc;
        }, {});
        if (cancelled) return;
        setEmployeeGallery((prev) =>
          prev.map((member) => {
            const key = normalizeKey(member.lookupKey || member.name || '');
            const sup = supervisorMap[key];
            if (!sup) return member;
            return {
              ...member,
              supervisor: member.supervisor || sup.supervisor,
              supervisorEmail: member.supervisorEmail || sup.supervisorEmail,
            };
          }),
        );
      } catch (error) {
        console.warn('Failed to load org chart', error);
      }
    };
    loadOrgChart();
    return () => {
      cancelled = true;
    };
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
  const reminderPreview = useMemo(() => lifecycleReminders.slice(0, 6), [lifecycleReminders]);
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
        const assetSources = [EXCEL_EXPORTS.assets, '/Tables/Asset List 11-18-25.xlsx', '/Tables/Asset%20List%2011-18-25.xlsx'];
        let buffer = null;
        for (const url of assetSources) {
          try {
            const response = await fetch(url);
            if (response.ok) {
              buffer = await response.arrayBuffer();
              break;
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
        console.error('Failed to load Asset List workbook', error);
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
          `${PUBLIC_URL}/Tables/New Phones.xlsx`,
          `${PUBLIC_URL}/Tables/New%20Phones.xlsx`,
          '/Tables/New Phones.xlsx', 
          '/Tables/New%20Phones.xlsx'
        ];
        let buffer = null;
        for (const url of sources) {
          try {
            console.log('Attempting to fetch:', url);
            const response = await fetch(url);
            if (response.ok) {
              buffer = await response.arrayBuffer();
              console.log('Successfully loaded New Phones.xlsx from:', url);
              break;
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
            const mobileRaw = row['Mobile number'] || row['Mobile Number'] || row['Phone'] || row['Mobile'] || row['Cell'] || '';
            const mobile = normalizePhone(mobileRaw);
            const username = formatRosterName(row.Username || row['Username'] || row['User'] || row['Name'] || row['Employee Name'] || row['Employee'] || '');
            const assignedTo = username || 'Unassigned';
            const model = row['Equipment Model'] || row['Equipment'] || row['Model'] || row['Device Model'] || 'Phone';
            const deviceId = normalizePhone(row['Device ID'] || row['IMEI'] || row['DeviceID'] || row['Serial Number'] || row['Serial'] || '');
            const purchaseDate = normalizeSheetDate(row['Upgrade date'] || row['Upgrade Date'] || row['Upgrade'] || row['Purchase Date'] || row['Date'] || '');
            const baseName = mobile || deviceId || `Phone-${index + 1}`;
            const payload = {
              id: `phone-${deviceId || mobile || index + 1}`,
              assetName: baseName,
              deviceName: baseName,
              type: 'Phone',
              brand: model ? model.split(' ')[0] : 'Phone',
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

        const phoneLookup = phoneAssets.reduce((acc, phone) => {
          const ownerKey = normalizeKey(phone.assignedTo || '');
          const phoneKey = normalizePhone(phone.assetName || phone.deviceName || phone.serialNumber || '');
          if (!phoneKey) return acc;
          const composite = `${phoneKey}::${ownerKey}`;
          acc[composite] = phone;
          return acc;
        }, {});
        const used = new Set();
        const extractDigits = (value = '') => {
          const digits = String(value || '').replace(/\D+/g, '');
          return digits.length >= 7 ? digits : '';
        };
        setAssets((prev) => {
          console.log(`Merging phones. Current assets: ${prev.length}`);
          const merged = [];
          prev.forEach((asset) => {
            if (normalizeKey(asset.type || '') !== 'phone') {
              merged.push(asset);
              return;
            }
            const ownerKey = normalizeKey(asset.assignedTo || '');
            const phoneKey =
              extractDigits(asset.assetName) ||
              extractDigits(asset.deviceName) ||
              extractDigits(asset.sheetId) ||
              extractDigits(asset.serialNumber) ||
              extractDigits(asset.qrCode);
            const composite = phoneKey ? `${phoneKey}::${ownerKey}` : '';
            const match = composite ? phoneLookup[composite] : null;
            if (match) {
              used.add(match.id);
              merged.push({ ...match, id: asset.id || match.id, _matchKeys: undefined, _phoneKeys: undefined });
            }
          });
          phoneAssets.forEach((phone) => {
            if (used.has(phone.id)) return;
            merged.push({ ...phone, _matchKeys: undefined, _phoneKeys: undefined });
          });
          console.log(`Merge complete. New total: ${merged.length} (added ${merged.length - prev.length} phones)`);
          return merged;
        });
      } catch (error) {
        console.error('Phone merge failed:', error);
      } finally {
        phoneMergeRef.current = true;
      }
    };
    mergeNewPhones();
  }, [setAssets, assets]);
  useEffect(() => {
    let cancelled = false;
    const syncDatesFromWorkbook = async () => {
      const assetSources = [EXCEL_EXPORTS.assets, '/Tables/Asset List 11-18-25.xlsx', '/Tables/Asset%20List%2011-18-25.xlsx'];
      let dateLookup = null;
      for (const url of assetSources) {
        try {
          const response = await fetch(url);
          if (!response.ok) {
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
        '/Tables/Employee Information Hub.xlsx',
        '/Tables/Employee%20Information%20Hub.xlsx',
      ];
      for (const url of employeeSources) {
        try {
          const response = await fetch(url);
          if (!response.ok) {
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
      const orgChartSources = [
        '/Tables/Org Chart and HUB 12-25.xlsx',
        `${PUBLIC_URL}/tables/${encodeURIComponent('Org Chart and HUB 12-25.xlsx')}`,
      ];
      for (const url of orgChartSources) {
        try {
          const response = await fetch(url);
          if (!response.ok) {
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
    const query = filters.search.toLowerCase();

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
        asset.assetName.toLowerCase().includes(query) ||
        asset.brand.toLowerCase().includes(query) ||
        asset.model.toLowerCase().includes(query) ||
        asset.serialNumber.toLowerCase().includes(query) ||
        asset.assignedTo.toLowerCase().includes(query);
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
    // Build lookup from asset.assignedTo field
    const lookup = assets.reduce((acc, asset) => {
      const key = normalizeKey(asset.assignedTo || '');
      if (!key) {
        return acc;
      }
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(asset);
      return acc;
    }, {});
    
    // Also check Employee Hub data for assigned assets
    employeeGallery.forEach((member) => {
      const memberKey = member.lookupKey || normalizeKey(member.name || '');
      if (!memberKey) return;
      
      // Get asset IDs from Employee Hub columns
      const hubAssets = [
        member.computer,
        member.printer,
        member.monitor,
        member.dock,
        member.keyFob
      ].filter(Boolean);
      
      // Match these to actual assets
      hubAssets.forEach((assetId) => {
        const normalized = normalizeKey(assetId);
        if (!normalized) return;
        
        // Find matching asset by various fields
        const matchingAsset = assets.find((asset) => {
          const assetKeys = [
            normalizeKey(asset.assetName || ''),
            normalizeKey(asset.deviceName || ''),
            normalizeKey(asset.sheetId || ''),
            normalizeKey(asset.serialNumber || '')
          ].filter(Boolean);
          return assetKeys.includes(normalized);
        });
        
        if (matchingAsset) {
          if (!lookup[memberKey]) {
            lookup[memberKey] = [];
          }
          // Avoid duplicates
          if (!lookup[memberKey].some((a) => a.id === matchingAsset.id)) {
            lookup[memberKey].push(matchingAsset);
          }
        }
      });
    });
    
    Object.values(lookup).forEach((list) =>
      list.sort((a, b) => {
        const nameA = (a.deviceName || a.assetName || '').toLowerCase();
        const nameB = (b.deviceName || b.assetName || '').toLowerCase();
        if (nameA === nameB) {
          return String(a.id).localeCompare(String(b.id));
        }
        return nameA.localeCompare(nameB);
      }),
    );
    return lookup;
  }, [assets, employeeGallery]);
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
      console.log('Termination supervisor mailto:', {
        supervisorEmail: terminationProfile?.supervisorEmail,
        supervisor: terminationProfile?.supervisor,
        employee: terminationEmployee,
        assets: terminationAssets?.length,
        mailto,
      });
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
        const detector = hasNativeDetector ? new window.BarcodeDetector({ formats: ['qr_code'] }) : null;
        if (!hasNativeDetector) {
          setScannerError('BarcodeDetector is not available in this browser. Using fallback decoder (slower).');
          setScanMessage('Fallback scanner active. Keep the QR code centered and well-lit.');
          if (!fallbackCanvasRef.current) {
            fallbackCanvasRef.current = document.createElement('canvas');
          }
        } else {
          setScannerError('');
        }
        const finishDetection = (value, message) => {
          if (!value) return;
          setScanResult(value);
          setScanMessage(message || 'QR detected.');
          cancelled = true;
          setScannerActive(false);
          if (scanLoopRef.current) {
            cancelAnimationFrame(scanLoopRef.current);
          }
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
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
                finishDetection(barcodes[0].rawValue || '', 'QR detected.');
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
    };
  }, [scannerActive]);

  useEffect(() => {
    if (!scanResult) return;

    const value = scanResult.trim();
    if (!value) return;

    const normalized = value.toLowerCase();
    const matchedAsset = assets.find(
      (asset) =>
        (asset.qrCode && asset.qrCode.toLowerCase() === normalized) ||
        (asset.serialNumber && asset.serialNumber.toLowerCase() === normalized) ||
        (asset.assetName && asset.assetName.toLowerCase() === normalized) ||
        (asset.sheetId && asset.sheetId.toLowerCase() === normalized),
    );

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
        serialNumber: value,
      });
      setScanMessage(`No match found. Creating new asset with ID: ${value}`);
    }

    // Clear scan result after processing
    setScanResult('');
  }, [scanResult, assets]);

  useEffect(() => {
    if (!filteredAssets.length) {
      setSelectedAssetId(null);
      setSpotlightOpen(false);
      return;
    }
    if (selectedAssetId && !filteredAssets.some((asset) => asset.id === selectedAssetId)) {
      setSelectedAssetId(null);
      setSpotlightOpen(false);
    }
  }, [filteredAssets, selectedAssetId]);

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

  const utilization = stats.total ? Math.round((stats.checkedOut / stats.total) * 100) : 0;
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
  const handleClearWarrantyReminder = useCallback(
    (reminder) => {
      handleClearWarrantyAlert(reminder);
    },
    [handleClearWarrantyAlert],
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

  const handleRowSelect = (asset) => {
    if (!asset) return;
    setSelectedAssetId(asset.id);
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
        ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
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
    (printer) => {
      if (!printer) return;
      setFlashMessage(`Test page queued for ${printer.deviceType} at ${printer.location || 'Unknown'}.`);
    },
    [],
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
    const normalized = value.toLowerCase();
    const matchedAsset =
      assets.find(
        (asset) =>
          (asset.qrCode && asset.qrCode.toLowerCase() === normalized) ||
          (asset.serialNumber && asset.serialNumber.toLowerCase() === normalized) ||
          (asset.assetName && asset.assetName.toLowerCase() === normalized) ||
          (asset.sheetId && asset.sheetId.toLowerCase() === normalized),
      ) || null;
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
    if (typeof window === 'undefined') {
      return;
    }
    const target = HELP_DESK_PORTAL_URL;
    const absolute = /^https?:\/\//i.test(target)
      ? target
      : `${window.location.origin}${target.startsWith('/') ? '' : '/'}${target}`;
    window.open(absolute, '_blank', 'noopener,noreferrer');
  }, []);

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
  const quickActions = [
    {
      title: 'Register new hardware',
      description: 'Log laptops, peripherals, or sensors and auto-assign to teams.',
      icon: Plus,
      actionLabel: 'Add asset',
      onAction: () => setAssetForm(defaultAsset),
    },
    {
      title: 'Add employee record',
      description: 'Keep people data current before checkouts and approvals.',
      icon: Users,
      actionLabel: 'Add employee',
      onAction: handleAddEmployee,
    },
    {
      title: 'Scan asset label',
      description: 'Use your camera to jump into a device record without scrolling the table.',
      icon: Scan,
      actionLabel: 'Start scanner',
      onAction: handleStartScanner,
    },
    {
      title: 'Warranty review',
      description: 'See devices expiring soon and clear alerts after you act.',
      icon: CalendarClock,
      actionLabel: 'Open alerts',
      onAction: () => setWarrantyModalOpen(true),
    },
  ];

  const menuNavItems = [
    { label: 'Overview', onClick: () => handleJumpToSection('Overview', 'overview-hero') },
    { label: 'Hardware', onClick: () => handleJumpToSection('Hardware', 'hardware-hero') },
    { label: 'Repairs', onClick: () => handleJumpToSection('Repairs', 'repairs-hero') },
    { label: 'Employees', onClick: () => handleJumpToSection('Employees', 'employees-hero') },
    { label: 'Reports', onClick: () => handleJumpToSection('Reports', 'reports-hero') },
    { label: 'Software', onClick: () => handleJumpToSection('Software', 'software-hero') },
    { label: 'Vendors', onClick: () => handleJumpToSection('Vendors', 'vendors-hero') },
  ];

  const menuSectionLinks = [
    { label: 'Overview metrics', onClick: () => handleJumpToSection('Overview', 'overview-metrics') },
    { label: 'Quick actions', onClick: () => handleJumpToSection('Overview', 'overview-actions') },
    { label: 'QR tools', onClick: () => handleJumpToSection('Overview', 'qr-tools-overview') },
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
      label: 'Scan QR code',
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
          {authError && <p className="mt-3 rounded-2xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">{authError}</p>}
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
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" style={containerStyle}>
          <PrimaryNav
            onAdd={() => setAssetForm(defaultAsset)}
            onAddEmployee={handleAddEmployee}
            onExport={handleExport}
            activePage={activePage}
            onNavigate={setActivePage}
            onToggleTheme={handleToggleTheme}
            isDarkMode={isDarkMode}
            onOpenMenu={() => setMenuOpen(true)}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          />
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
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Offline mode: changes will queue locally until you reconnect.
          </div>
        )}

        {activePage === 'Overview' && (
          <>
            <section id="overview-hero" className="mb-10 grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div
            className={`hero-shell relative overflow-hidden rounded-[32px] p-8 shadow-[0_24px_80px_rgba(2,6,23,0.55)] ring-1 neon-grid ${
              isDarkMode
                ? 'border border-slate-900/60 bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900 text-white ring-white/10'
                : 'border border-slate-200 bg-gradient-to-br from-white via-blue-50 to-sky-100 text-slate-900 ring-blue-100'
            }`}
            style={heroAccentStyle}
          >
            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-blue-500/40 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 top-6 h-52 w-52 rounded-full bg-rose-400/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 left-10 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="relative space-y-5">
              <div
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35rem] shadow-sm backdrop-blur ${heroChipClass}`}
              >
                <Sparkles className="h-4 w-4" />
                Asset command center
              </div>
              <div>
                <h1 className={`text-4xl font-semibold leading-tight md:text-5xl ${heroHeadingClass}`}>One command surface for every asset lifecycle</h1>
                <p className={`mt-3 text-base ${heroSubtextClass}`}>
                  Monitor procurement, deployment, and renewals from a single, human-friendly surface.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className={`rounded-2xl p-4 text-sm shadow-inner ${heroStatCardClass}`}>
                  <p className={`text-[11px] uppercase tracking-[0.3rem] ${heroLabelClass}`}>Snapshot</p>
                  <p className={`mt-1 text-lg font-semibold ${heroHeadingClass}`}>Share executive view</p>
                  <button
                    onClick={handleExport}
                    className={`btn-primary mt-3 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition hover:-translate-y-0.5 ${
                      isDarkMode
                        ? 'border border-white/25 bg-gradient-to-r from-white/25 via-white/10 to-white/5 text-white hover:border-white/40'
                        : 'border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-slate-100 text-slate-800 hover:border-blue-200'
                    }`}
                  >
                    <Share2 className="h-4 w-4" />
                    Export data
                  </button>
                </div>
                <div className={`rounded-2xl p-4 text-sm shadow-inner ${heroStatCardClass}`}>
                  <p className={`text-[11px] uppercase tracking-[0.3rem] ${heroLabelClass}`}>Support</p>
                  <p className={`mt-1 text-lg font-semibold ${heroHeadingClass}`}>Open HelpDesk Portal</p>
                  <button
                    type="button"
                    onClick={handleOpenHelpDeskPortal}
                    className={`btn-primary mt-3 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition hover:-translate-y-0.5 ${
                      isDarkMode
                        ? 'border border-white/25 bg-gradient-to-r from-white/20 via-white/10 to-white/5 text-white hover:border-white/40'
                        : 'border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-slate-100 text-slate-800 hover:border-blue-200'
                    }`}
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                    Launch portal
                  </button>
                </div>
                <div className={`rounded-2xl p-4 text-sm shadow-inner ${heroStatCardClass}`}>
                  <p className={`text-[11px] uppercase tracking-[0.3rem] ${heroLabelClass}`}>Watchlist</p>
                  <p className={`mt-1 text-lg font-semibold ${heroHeadingClass}`}>Warranty alerts</p>
                  <button
                    type="button"
                    onClick={() => setWarrantyModalOpen(true)}
                    className={`btn-primary mt-3 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition hover:-translate-y-0.5 ${
                      isDarkMode
                        ? 'border border-white/25 bg-gradient-to-r from-white/20 via-white/10 to-white/5 text-white hover:border-white/40'
                        : 'border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-slate-100 text-slate-800 hover:border-blue-200'
                    }`}
                  >
                    <CalendarClock className="h-4 w-4" />
                    View alerts
                  </button>
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className={`rounded-2xl p-4 ${heroStatCardClass}`}>
                  <p className={`text-[11px] uppercase tracking-[0.3rem] ${heroLabelClass}`}>Assets tracked</p>
                  <p className={`mt-2 text-3xl font-semibold ${heroHeadingClass}`}>{stats.total}</p>
                </div>
                <div className={`rounded-2xl p-4 ${heroStatCardClass}`}>
                  <p className={`text-[11px] uppercase tracking-[0.3rem] ${heroLabelClass}`}>Inventory value</p>
                  <p className={`mt-2 text-3xl font-semibold ${heroHeadingClass}`}>{formatCurrency(stats.totalValue)}</p>
                </div>
                <div className={`rounded-2xl p-4 ${heroStatCardClass}`}>
                  <p className={`text-[11px] uppercase tracking-[0.3rem] ${heroLabelClass}`}>Warranty alerts</p>
                  <p className={`mt-2 text-3xl font-semibold ${heroHeadingClass}`}>{stats.expiringSoon}</p>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`hero-shell relative overflow-hidden rounded-[32px] border p-6 shadow-[0_18px_60px_rgba(2,6,23,0.5)] ring-1 ${
              isDarkMode
                ? 'border-slate-900/70 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 text-white ring-blue-500/15'
                : 'border-slate-200 bg-gradient-to-br from-white via-sky-50 to-blue-100 text-slate-900 ring-blue-100'
            }`}
            style={heroAccentStyle}
          >
            <div className="absolute inset-0 opacity-40">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.2),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.18),transparent_30%)] blur-3xl" />
            </div>
            <div className="relative">
              <p className={`text-xs font-semibold uppercase tracking-[0.3rem] ${heroLabelClass}`}>Fleet health</p>
              <p className={`mt-3 text-4xl font-semibold ${heroHeadingClass}`}>{utilization}%</p>
              <p className={`text-sm ${heroSubtextClass}`}>Checked out utilisation</p>
              <div className={`mt-4 h-2 w-full rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}>
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 shadow-[0_0_0_6px_rgba(59,130,246,0.2)]"
                  style={{ width: `${utilization}%` }}
                />
              </div>
              <div className="mt-6 space-y-4 text-sm">
                <div className={`flex items-center justify-between rounded-2xl px-3 py-2 ${heroPanelClass}`}>
                  <span className={heroSubtextClass}>Active hardware</span>
                  <span className={`font-semibold ${heroHeadingClass}`}>{stats.available} available</span>
                </div>
                <div className={`flex items-center justify-between rounded-2xl px-3 py-2 ${heroPanelClass}`}>
                  <span className={heroSubtextClass}>Checked out</span>
                  <span className={`font-semibold ${heroHeadingClass}`}>{stats.checkedOut} devices</span>
                </div>
                <div className={`flex items-center justify-between rounded-2xl px-3 py-2 ${heroPanelClass}`}>
                  <span className={heroSubtextClass}>License usage</span>
                  <span className={`font-semibold ${heroHeadingClass}`}>{licenseInsights.percent}% of {licenseInsights.seats} seats</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="overview-metrics" className="mb-8 grid gap-6">
          <SnapshotMetricsRow metrics={snapshotMetrics} />
        </section>

        <section id="overview-attention" className="mb-8 grid gap-6 lg:grid-cols-[1.6fr,1fr]">
          <OverviewAttentionPanel
            overdue={overdueAlerts}
            dueSoon={dueSoonAlerts}
            maintenance={maintenanceWorkOrders}
            software={softwareAtRisk}
            reminderPreview={reminderPreview}
            onOpenAlerts={() => setWarrantyModalOpen(true)}
            onClearServiceReminder={handleClearMaintenanceAlert}
            onClearWarrantyReminder={handleClearWarrantyReminder}
          />
          <OverviewActivityCard history={recentHistory} maintenance={maintenanceWorkOrders} lookupAsset={getAssetName} />
        </section>

        {warrantyAlerts30.length > 0 && (
          <section className="mb-8">
            <WarrantyAlertStrip
              alerts={warrantyAlerts30}
              onViewAll={() => setWarrantyModalOpen(true)}
              onClearAll={() => handleClearAllWarrantyAlerts(warrantyAlerts30)}
              isDarkMode={isDarkMode}
            />
          </section>
        )}

        {softwareRenewalsDue90Days.length > 0 && (
          <section className="mb-8">
            <div className="glass-card rounded-3xl border border-slate-100 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 p-6 shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-3 shadow-inner">
                    <CalendarClock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">Software Renewal Alerts</p>
                    <p className="text-sm text-slate-600">
                      {softwareRenewalsDue90Days.length} license renewal{softwareRenewalsDue90Days.length !== 1 ? 's' : ''} due within 90 days
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActivePage('Software')}
                  className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover-lift hover:shadow-xl transition-all duration-300"
                >
                  View all renewals
                </button>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {softwareRenewalsDue90Days.slice(0, 2).map((software) => (
                  <div key={software.id} className={`rounded-2xl border p-4 shadow-md ${
                    isDarkMode 
                      ? 'border-slate-700 bg-slate-900 text-white' 
                      : 'border-slate-200 bg-white text-slate-900'
                  }`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className={`font-semibold text-sm ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}>{software.software}</p>
                        <p className={`text-xs ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}>{software.vendor}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        software.daysUntilRenewal <= 30 
                          ? (isDarkMode ? 'bg-rose-500/20 text-rose-300' : 'bg-rose-100 text-rose-700')
                          : software.daysUntilRenewal <= 60
                          ? (isDarkMode ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700')
                          : (isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700')
                      }`}>
                        {software.daysUntilRenewal} days
                      </span>
                    </div>
                    <div className={`mt-3 space-y-1 text-xs ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      <div className="flex justify-between">
                        <span>Renewal date:</span>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}>{new Date(software.renewalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Annual cost:</span>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}>{formatCurrency(software.annualCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Seats:</span>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}>{software.seats} ({software.used} used)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {softwareRenewalsOverdue.length > 0 && (
                <div className={`mt-4 rounded-2xl border-2 p-4 ${
                  isDarkMode 
                    ? 'border-rose-500/30 bg-rose-950/50' 
                    : 'border-rose-300 bg-rose-50'
                }`}>
                  <p className={`flex items-center gap-2 text-sm font-bold ${
                    isDarkMode ? 'text-rose-300' : 'text-rose-700'
                  }`}>
                    <Bell className="h-4 w-4" />
                    {softwareRenewalsOverdue.length} OVERDUE renewal{softwareRenewalsOverdue.length !== 1 ? 's' : ''} requiring immediate attention
                  </p>
                  <div className="mt-3 space-y-2">
                    {softwareRenewalsOverdue.slice(0, 3).map((software) => (
                      <div key={software.id} className={`flex items-center justify-between rounded-xl border p-3 text-sm ${
                        isDarkMode 
                          ? 'border-slate-800 bg-slate-900' 
                          : 'border-rose-200 bg-white'
                      }`}>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}>{software.software}</span>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-rose-400' : 'text-rose-600'
                        }`}>{Math.abs(software.daysUntilRenewal)} days overdue</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <section id="overview-people" className="mb-8">
          <SpendHotspotsCard costByDepartment={costByDepartment} topLocations={sheetInsights.topLocations} />
        </section>

        <section id="overview-actions" className="mb-8 grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {quickActions.map((action) => (
              <QuickActionCard key={action.title} {...action} />
            ))}
          </div>
          <WhatsNewCard />
        </section>

            {isMobile && (
              <div className="mb-20">
                <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-700 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Navigation className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-semibold text-slate-900">Mobile-ready dashboard</p>
                      <p className="text-xs text-slate-500">
                        Tap the action bar to add hardware, scan QR codes, or jump to warranty alerts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
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
              <p className="text-xs font-semibold uppercase tracking-[0.35rem] text-white/70">Hardware</p>
              <h2 className="mt-3 text-3xl font-semibold">Full-fidelity device management</h2>
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
                    <p className="text-[11px] font-semibold uppercase tracking-[0.25rem] text-slate-500">Hardware table</p>
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
                          className="h-9 rounded-xl border border-slate-200 bg-white px-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
              <p className={`text-[11px] font-semibold uppercase tracking-[0.35rem] ${heroLabelClass}`}>Repair desk</p>
              <div className="mt-4 grid gap-6 lg:grid-cols-[1.8fr,1fr]">
                <div className="space-y-4">
                  <h2 className={`text-4xl font-semibold leading-tight ${heroHeadingClass}`}>Centralize depot status, parts ordering, and repair guides.</h2>
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
              <p className={`text-xs font-semibold uppercase tracking-[0.35rem] ${heroLabelClass}`}>Employees</p>
              <h2 className={`mt-3 text-3xl font-semibold ${heroHeadingClass}`}>The faces powering UDS technology</h2>
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
              <p className="text-xs font-semibold uppercase tracking-[0.35rem] text-white/70">Reports</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Insights, forecasts, and exports</h2>
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
              <div className="space-y-4">
                <LicenseRiskReport
                  data={licenseCompliance}
                  onExport={() =>
                    handleRunReport('License risk', {
                      suites: licenseCompliance,
                    })
                  }
                />
              </div>
            </section>

            <section className="mb-8 space-y-6">
              <AnalyticsInsightsPanel costData={costByDepartment} depreciation={depreciationTrend} />
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
          <div className="overflow-x-hidden">
            <div className="overflow-x-hidden">
              <section
                id="vendors-hero"
                className={`hero-shell relative mb-8 w-full max-w-full overflow-hidden rounded-[2.5rem] border p-8 shadow-[0_24px_80px_rgba(2,6,23,0.55)] ring-1 ${
                  isDarkMode
                    ? 'border-slate-900/60 bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900 text-white ring-white/10'
                    : 'border-slate-200 bg-gradient-to-br from-white via-emerald-50 to-teal-100 text-slate-900 ring-emerald-100'
                }`}
                style={heroAccentStyle}
              >
                <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-blue-500/40 blur-3xl" />
                <div className="pointer-events-none absolute -right-10 top-6 h-52 w-52 rounded-full bg-rose-400/30 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 left-10 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
                <div className="grid max-w-full gap-8 overflow-hidden lg:grid-cols-2">
                  <div>
                    <p className={`text-[11px] font-semibold uppercase tracking-[0.35rem] ${heroLabelClass}`}>Vendor galaxy</p>
                    <h2 className={`mt-4 text-4xl font-semibold leading-tight ${heroHeadingClass}`}>
                      Bold partnerships powering laptops, networks, and carrier logistics.
                    </h2>
                    <p className={`mt-3 text-sm ${heroSubtextClass}`}>
                      Showcase vendor accountability with live device counts, SLAs, and lightning-fast contacts from a single pane.
                    </p>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
                          : status.includes('progress')
                            ? 'bg-blue-50 text-blue-700 ring-blue-100'
                            : status.includes('await')
                              ? 'bg-amber-50 text-amber-700 ring-amber-100'
                              : 'bg-slate-100 text-slate-700 ring-slate-200';
                      return (
                        <div
                          key={ticket.id || ticket.printerLabel || ticket.assetId}
                          className="flex flex-wrap items-start justify-between gap-3 py-4"
                        >
                          <div className="min-w-[240px] flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-slate-900">{ticket.printerLabel}</p>
                              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${ticket.vendorBadge}`}>
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
                            <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${statusTone}`}>{ticket.status || 'Queued'}</span>
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
                    <p className="text-xs font-semibold uppercase tracking-[0.35rem] text-white/70">Software</p>
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
                    <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">Overdue</p>
                    <p className={`mt-1 text-3xl font-bold ${isDarkMode ? 'text-rose-200' : 'text-rose-700'}`}>
                      {softwareRenewalsOverdue.length}
                    </p>
                    <p className="text-xs text-rose-600">Requires immediate action</p>
                  </div>
                  <div className={`rounded-2xl border p-4 ${
                    isDarkMode ? 'border-amber-500/30 bg-amber-950/30' : 'border-amber-200 bg-white'
                  }`}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Next 90 days</p>
                    <p className={`mt-1 text-3xl font-bold ${isDarkMode ? 'text-amber-200' : 'text-amber-700'}`}>
                      {softwareRenewalsDue90Days.length}
                    </p>
                    <p className="text-xs text-amber-600">Budget planning required</p>
                  </div>
                  <div className={`rounded-2xl border p-4 ${
                    isDarkMode ? 'border-blue-500/30 bg-blue-950/40' : 'border-blue-200 bg-white'
                  }`}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Total annual cost</p>
                    <p className={`mt-1 text-3xl font-bold ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                      {formatCurrency(SOFTWARE_PORTFOLIO.reduce((sum, s) => sum + (s.seats * s.costPerSeat * 12), 0))}
                    </p>
                    <p className="text-xs text-blue-600">All software licenses</p>
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
                            className={`self-start whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold sm:self-auto ${
                              software.daysUntilRenewal < 0
                                ? 'bg-rose-600 text-white shadow-[0_8px_30px_rgba(225,29,72,0.35)]'
                                : software.daysUntilRenewal <= 30
                                ? 'bg-amber-600 text-white shadow-[0_8px_30px_rgba(245,158,11,0.35)]'
                                : software.daysUntilRenewal <= 60
                                ? 'bg-yellow-600 text-white shadow-[0_8px_30px_rgba(234,179,8,0.35)]'
                                : software.daysUntilRenewal <= 90
                                ? 'bg-blue-600 text-white shadow-[0_8px_30px_rgba(59,130,246,0.35)]'
                                : 'bg-slate-600 text-white shadow-[0_8px_30px_rgba(51,65,85,0.35)]'
                            }`}
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

      {spotlightOpen && selectedAsset && (
      <AssetSpotlightModal
        asset={selectedAsset}
        onClose={() => {
          setSpotlightOpen(false);
          setSelectedAssetId(null);
        }}
        repairHistory={assetRepairHistory}
        ownerHistory={assetOwnerHistory}
        onEdit={setAssetForm}
        onApproveIntake={handleApproveIntake}
        onOpenAutomate={handleOpenAutomate}
        ownerContact={ownerContact}
        onRepair={handleOpenRepairTicketForAsset}
        onClearMaintenance={handleClearMaintenanceAlert}
        onClearMaintenanceAll={handleClearAllMaintenanceAlerts}
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
      {photoLightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4"
          onClick={() => setPhotoLightbox(null)}
        >
          <div
            className="relative max-w-3xl rounded-3xl bg-white p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPhotoLightbox(null)}
              className="absolute right-3 top-3 rounded-full p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Close photo"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={photoLightbox.src}
              alt={photoLightbox.name}
              className="max-h-[75vh] w-full rounded-2xl object-contain"
            />
            <div className="mt-3 text-center">
              <p className="text-sm font-semibold text-slate-900">{photoLightbox.name}</p>
              {photoLightbox.title && <p className="text-xs text-slate-500">{photoLightbox.title}</p>}
            </div>
          </div>
        </div>
      )}
      {printerForm && <PrinterFormModal printer={printerForm} onSubmit={handleSavePrinter} onCancel={() => setPrinterForm(null)} />}
      {flashMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-lg">
          {flashMessage}
        </div>
      )}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-full flex-1 bg-slate-900/60" onClick={() => setMenuOpen(false)} />
          <div className="relative h-full w-full max-w-sm bg-white shadow-2xl">
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
            <div className="max-h-[calc(100vh-56px)] overflow-y-auto p-4 space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25rem] text-slate-500">Navigate</p>
                <div className="mt-2 flex flex-col gap-2">
                  {menuNavItems.map((item) => (
                    <button
                      key={`menu-nav-${item.label}`}
                      type="button"
                      onClick={item.onClick}
                      className={`flex items-center justify-between rounded-2xl border px-3 py-2 text-sm font-semibold ${
                        activePage === item.label
                          ? 'border-blue-200 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200'
                      }`}
                    >
                      {item.label}
                      <ArrowRightLeft className="h-4 w-4" />
                    </button>
                  ))}
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
    </div>
  );
};

export default App;
