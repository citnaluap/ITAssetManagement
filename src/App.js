import React, { useState, useMemo, useEffect, Fragment, useCallback, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  Laptop,
  Server,
  Monitor,
  HardDrive,
  Plus,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Download,
  Key,
  History,
  ArrowRightLeft,
  Wrench,
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
  ClipboardList,
  ClipboardCheck,
  Smartphone,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import assetSheetData from './data/assets.json';
import employeeSheetData from './data/employees.json';
import employeePhotoMap from './data/employeePhotos.json';
import {
  fetchSharePointListItems,
  SHAREPOINT_CONFIG,
  createSharePointListItem,
  updateSharePointListItem,
  deleteSharePointListItem,
} from './services/sharePointService';

const STORAGE_KEYS = {
  assets: 'uds_assets',
  licenses: 'uds_licenses',
  maintenance: 'uds_maintenance',
  history: 'uds_history',
};
const STORAGE_VERSION_KEY = 'uds_storage_version';
const STORAGE_VERSION = '2025-11-19-refresh';

const assetTypeIcons = {
  Laptop,
  Desktop: Monitor,
  Server,
  Storage: HardDrive,
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
  cost: 0,
  checkedOut: false,
  checkOutDate: '',
  qrCode: '',
  approvalStatus: 'Approved',
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
  cost: 0,
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
  phone: '',
  startDate: '',
  avatar: '',
  lookupKey: '',
};

const NAV_LINKS = ['Overview', 'Hardware', 'Employees', 'Reports', 'Software', 'Vendors'];

const PUBLIC_URL = process.env.PUBLIC_URL || '';
const normalizedPublicUrl = PUBLIC_URL.replace(/\/+$/, '');
const HELP_DESK_PORTAL_FALLBACK = normalizedPublicUrl
  ? `${normalizedPublicUrl}/helpdesk-portal/index.html`
  : '/helpdesk-portal/index.html';
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
const SOFTWARE_LOGOS = {
  m365: `${PUBLIC_URL}/assets/software/microsoft-365.png`,
  adobe: `${PUBLIC_URL}/assets/software/adobe.png`,
  autocad: `${PUBLIC_URL}/assets/software/autocad.png`,
  citrix: `${PUBLIC_URL}/assets/software/citrix.png`,
  zoom: `${PUBLIC_URL}/assets/software/zoom.jpg`,
};
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
      label: 'Order from Colony',
      href: 'https://www.colonyproducts.com/contact/order-supplies/',
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
      label: 'Email Sara Smoker',
      href: 'mailto:Sara@weaverassociatesinc.com?subject=Printer%20service%20request',
      external: false,
    },
  },
};
const RAW_NETWORK_PRINTER_ROWS = [
  { deviceType: 'Canon Copier', location: 'Administration Area', model: 'iR-ADV C5550', serial: 'XUG08932', ip: '10.0.0.27', colonyId: '14952' },
  { deviceType: 'Canon Copier', location: '1st Floor HM Area', model: 'iR-ADV C5535', serial: 'XLN05423', ip: '10.0.0.30', colonyId: '14851' },
  { deviceType: 'Canon Copier', location: 'AE Elm Ave', model: 'iR-ADV C257', serial: '3CE06826', ip: '192.168.3.7', colonyId: '15416' },
  { deviceType: 'Canon Copier', location: 'ASB/SC/Main Remote Fax', model: 'iR-ADV C3525 III', serial: '2GH10339', ip: '10.0.0.32', colonyId: '15134' },
  { deviceType: 'Canon Copier', location: 'Garden Level', model: 'iR-ADV C3525', serial: 'XTK01222', ip: '10.0.0.12', colonyId: '14824' },
  { deviceType: 'Canon Copier', location: 'ILS Elm Ave', model: 'iR-ADV C3525', serial: 'XTK10374', ip: '192.168.3.9', colonyId: '14945' },
  { deviceType: 'Canon Copier', location: 'KOP', model: 'iR-ADV C3525 III', serial: '2GH09996', ip: '10.165.5.20', colonyId: '15189' },
  { deviceType: 'Canon Copier', location: 'Resource Center', model: 'iR-ADV 4535', serial: 'UMU00616', ip: '10.0.0.34', colonyId: '11376' },
  { deviceType: 'Canon Copier', location: 'SC Office at 2260', model: 'iR-ADV C5550', serial: 'XLG05808', ip: '10.0.0.31', colonyId: '14800' },
  { deviceType: 'Canon Copier', location: 'West Side Copy Room', model: 'iR-ADV C3525', serial: 'XTK02577', ip: '10.0.0.25', colonyId: '' },
  { deviceType: 'Canon Copier', location: 'Chestnut St', model: 'iR1435', serial: 'RZJ27457', ip: '192.168.7.222', colonyId: '14739' },
  { deviceType: 'Epson Printer', location: 'Home Mods', model: 'WF-C579R', serial: '', ip: '10.0.0.74' },
  { deviceType: 'Epson Printer', location: 'SC 1st Floor', model: 'WF-PRO C579R', serial: '', ip: '10.0.0.40' },
  { deviceType: 'Epson Printer', location: 'KOP ASB', model: 'WF-PRO C579R', serial: '', ip: '10.165.5.21' },
  { deviceType: 'Epson Printer', location: 'Receptionist', model: 'WF-PRO 529R', serial: 'X57G000296', ip: '10.0.0.29' },
  { deviceType: 'Epson Printer', location: 'HR Office', model: 'WF-PRO 529R', serial: 'X57G000291', ip: '10.0.0.5' },
  { deviceType: 'HP Printer', location: 'HME Office', model: 'P4014', serial: 'CNDX206508', ip: '10.0.0.8' },
  { deviceType: 'HP Printer', location: 'Warehouse', model: 'LaserJet P3015', serial: 'VND3F75923', ip: '10.165.1.201' },
  { deviceType: 'HP Printer', location: 'Resource Center', model: 'LaserJet P3015', serial: 'VND3F25632', ip: '10.0.0.34' },
  { deviceType: 'HP Printer', location: 'ILS Office', model: 'LaserJet 9050', serial: 'JPRC9DW07R', ip: '192.168.3.8' },
  { deviceType: 'HP Printer', location: 'Finance Department', model: 'LaserJet 9050', serial: 'JPRCB4403H', ip: '10.0.0.13' },
  { deviceType: 'HP Printer', location: 'Fiscal', model: 'LaserJet 4200', serial: 'USGNP05083', ip: '10.0.0.26' },
  { deviceType: 'HP Printer', location: 'Executive', model: 'Color LaserJet M651', serial: 'NPI06BF0C', ip: '10.0.0.14' },
  { deviceType: 'HP Printer', location: 'Vocational Services Chestnut', model: 'Color LaserJet M451', serial: 'CNDF234516', ip: '192.168.7.3' },
  { deviceType: 'Lexmark Printer', location: 'SC Office Erin Court', model: 'M3150', serial: '45147PHH3R9W2', ip: '10.0.0.16' },
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

const normalizeKey = (value = '') => value.replace(/[^a-z0-9]/gi, '').toLowerCase();

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

const normalizeDateString = (value) => {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toISOString().slice(0, 10);
};

const normalizeAssetStatus = (asset) => {
  if (!asset) {
    return asset;
  }
  const rawOwner = (asset.assignedTo || '').trim();
  const owner = rawOwner.toLowerCase() === 'unassigned' ? '' : rawOwner;
  const statusFromValue = normalizeStatusLabel(asset.status);
  const checkoutFlag = Boolean(asset.checkedOut);
  let status = statusFromValue;

  if (status === 'Retired' || status === 'Maintenance') {
    const hasChanges = owner !== rawOwner || status !== asset.status || checkoutFlag !== false;
    if (!hasChanges) {
      return asset;
    }
    return { ...asset, assignedTo: owner, status, checkedOut: false };
  }

  if (!status) {
    status = checkoutFlag || owner ? 'Checked Out' : 'Available';
  }

  if (status === 'Available' && (checkoutFlag || owner)) {
    status = 'Checked Out';
  }

  if (status === 'Checked Out' && !owner) {
    status = 'Available';
  }

  const checkedOut = status === 'Checked Out';
  const ownerChanged = rawOwner !== owner;
  const statusChanged = asset.status !== status;
  const checkoutChanged = checkoutFlag !== checkedOut;

  if (!ownerChanged && !statusChanged && !checkoutChanged) {
    return asset;
  }

  return { ...asset, assignedTo: owner, status, checkedOut };
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
      name: 'Sara Smoker',
      email: 'Sara@weaverassociatesinc.com',
      org: 'Weaver Associates Inc.',
    },
    ctas: [
      {
        label: 'Email Sara Smoker',
        href: 'mailto:Sara@weaverassociatesinc.com?subject=Brother%20Toner%20Request',
        external: false,
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
    seats: 480,
    used: 452,
    costPerSeat: 32,
    renewal: '2025-12-31',
    logo: SOFTWARE_LOGOS.m365,
    accent: { from: '#0ea5e9', to: '#2563eb' },
    description: 'Email, collaboration, Teams telephony, and Intune device management for the entire workforce.',
    stack: ['Exchange', 'SharePoint', 'Teams', 'Intune'],
    deployment: 'Cloud',
    criticality: 'High',
  },
  {
    id: 'adobe-cc',
    software: 'Adobe Creative Cloud',
    vendor: 'Adobe',
    owner: 'Creative Services',
    category: 'Creative Suite',
    seats: 65,
    used: 58,
    costPerSeat: 55,
    renewal: '2025-09-01',
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
    renewal: '2025-04-15',
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
    seats: 220,
    used: 205,
    costPerSeat: 18,
    renewal: '2025-07-01',
    accent: { from: '#0f766e', to: '#0ea5e9' },
    description: 'Unified VPN, Secure Client, and Umbrella protection for remote staff.',
    stack: ['AnyConnect', 'Secure Client', 'Umbrella DNS', 'Secure Endpoint'],
    deployment: 'Hybrid',
    criticality: 'High',
  },
  {
    id: 'barracuda',
    software: 'Barracuda Email Protection',
    vendor: 'Barracuda Networks',
    owner: 'Security Operations',
    category: 'Security',
    seats: 480,
    used: 465,
    costPerSeat: 6,
    renewal: '2025-05-30',
    accent: { from: '#0284c7', to: '#0c4a6e' },
    description: 'Inbound filtering, archiving, and continuity for Microsoft 365 mailboxes.',
    stack: ['Impersonation Protect', 'Backup', 'Sentinel'],
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
    renewal: '2025-03-20',
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
    renewal: '2025-08-10',
    accent: { from: '#e11d48', to: '#fb923c' },
    description: 'Secure speech-to-text documentation for service coordinators.',
    stack: ['Dragon Professional', 'PowerMic'],
    deployment: 'Desktop',
    criticality: 'Medium',
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
    renewal: '2025-06-01',
    accent: { from: '#9333ea', to: '#2563eb' },
    description: 'Payroll, benefits enrollment, and onboarding workflows.',
    stack: ['Onboarding', 'Talent', 'Benefits'],
    deployment: 'Cloud',
    criticality: 'High',
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
    renewal: '2025-02-28',
    accent: { from: '#16a34a', to: '#15803d' },
    description: 'Accounting, grants, and fixed-asset workflows.',
    stack: ['General Ledger', 'Purchasing', 'Fixed Assets'],
    deployment: 'Cloud',
    criticality: 'High',
  },
  {
    id: 'zoom',
    software: 'Zoom One Business',
    vendor: 'Zoom',
    owner: 'IT Operations',
    category: 'Meetings & UC',
    seats: 220,
    used: 214,
    costPerSeat: 15,
    renewal: '2025-05-01',
    logo: SOFTWARE_LOGOS.zoom,
    accent: { from: '#2563eb', to: '#60a5fa' },
    description: 'Video conferencing, webinars, and digital signage feeds.',
    stack: ['Meetings', 'Rooms', 'Webinars'],
    deployment: 'Cloud',
    criticality: 'Medium',
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
      location: row['Location'] || row['Company'] || 'Field',
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

const SP_ASSET_FIELDS = {
  assetName: 'Asset ID',
  type: 'Asset Type',
  model: 'Model',
  assignedTo: 'Assigned To',
  location: 'Location',
  serialNumber: 'Serial Number',
  purchaseDate: 'Purchase Date',
  retiredDate: 'Retirement Date',
  warrantyExpiry: 'Warranty Expiry',
  department: 'Department',
  cost: 'Cost',
  id: 'ID',
};

const SP_EMPLOYEE_FIELDS = {
  lastName: 'LastName',
  firstName: 'FirstName',
  id: 'Employee ID',
  company: 'Company',
  department: 'Department',
  location: 'Location',
  title: 'Job Title',
  email: 'E-mail Address',
  startDate: 'Start Date',
  phone: 'Mobile Phone',
  computer: 'Computer',
  printer: 'Printer',
  monitor: 'Monitor',
  dock: 'Dock',
  keyFob: 'Key Fob',
};

const getField = (row = {}, key = '') => {
  if (!key) {
    return undefined;
  }
  return row[key] ?? row[key.replace(/\s+/g, ' ')];
};

const mapSharePointAssetRow = (row = {}, index = 0) => {
  const id = Number(getField(row, SP_ASSET_FIELDS.id) ?? index + 1);
  const assetName =
    getField(row, SP_ASSET_FIELDS.assetName) ||
    getField(row, 'Title') ||
    getField(row, SP_ASSET_FIELDS.serialNumber) ||
    `Asset-${id}`;
  const assignedTo = formatRosterName(getField(row, SP_ASSET_FIELDS.assignedTo) || '');
  const purchaseDate = normalizeDateString(getField(row, SP_ASSET_FIELDS.purchaseDate));
  const baseAsset = {
    id,
    sheetId: assetName,
    deviceName: assetName,
    assetName,
    type: getField(row, SP_ASSET_FIELDS.type) || 'Hardware',
    model: getField(row, SP_ASSET_FIELDS.model) || getField(row, SP_ASSET_FIELDS.type) || 'Device',
    serialNumber: getField(row, SP_ASSET_FIELDS.serialNumber) || assetName,
    assignedTo,
    department: getField(row, SP_ASSET_FIELDS.department) || 'UDS',
    location: getField(row, SP_ASSET_FIELDS.location) || 'Field',
    status: assignedTo ? 'Checked Out' : 'Available',
    purchaseDate,
    retiredDate: normalizeDateString(getField(row, SP_ASSET_FIELDS.retiredDate)),
    warrantyExpiry: normalizeDateString(getField(row, SP_ASSET_FIELDS.warrantyExpiry)),
    cost: Number(getField(row, SP_ASSET_FIELDS.cost) || 0) || 0,
    checkedOut: Boolean(assignedTo),
    checkOutDate: purchaseDate || new Date().toISOString().slice(0, 10),
    qrCode: getField(row, 'QR Code') || '',
  };
  return normalizeAssetStatus(baseAsset);
};

const buildSharePointAssetPayload = (asset = {}) => ({
  [SP_ASSET_FIELDS.assetName]: asset.assetName || asset.deviceName || '',
  [SP_ASSET_FIELDS.type]: asset.type || '',
  [SP_ASSET_FIELDS.model]: asset.model || '',
  [SP_ASSET_FIELDS.assignedTo]: asset.assignedTo || '',
  [SP_ASSET_FIELDS.location]: asset.location || '',
  [SP_ASSET_FIELDS.serialNumber]: asset.serialNumber || '',
  [SP_ASSET_FIELDS.purchaseDate]: asset.purchaseDate || null,
  [SP_ASSET_FIELDS.retiredDate]: asset.retiredDate || null,
  [SP_ASSET_FIELDS.warrantyExpiry]: asset.warrantyExpiry || null,
  [SP_ASSET_FIELDS.department]: asset.department || '',
  [SP_ASSET_FIELDS.cost]: Number(asset.cost) || null,
});

const mapSharePointEmployeeRow = (row = {}, index = 0) => {
  const firstName = formatPersonName(getField(row, SP_EMPLOYEE_FIELDS.firstName) || '');
  const lastName = formatPersonName(getField(row, SP_EMPLOYEE_FIELDS.lastName) || '');
  const name = `${firstName} ${lastName}`.trim() || getField(row, 'Title') || `Employee ${index + 1}`;
  const id = getField(row, SP_EMPLOYEE_FIELDS.id) || name || index + 1;
  const lookupKey = normalizeKey(id);
  return {
    id,
    name,
    title: getField(row, SP_EMPLOYEE_FIELDS.title) || 'Team member',
    department: getField(row, SP_EMPLOYEE_FIELDS.department) || getField(row, SP_EMPLOYEE_FIELDS.company) || 'UDS',
    location: getField(row, SP_EMPLOYEE_FIELDS.location) || getField(row, SP_EMPLOYEE_FIELDS.company) || 'Field',
    email: getField(row, SP_EMPLOYEE_FIELDS.email) || '',
    phone: getField(row, SP_EMPLOYEE_FIELDS.phone) || '',
    startDate: normalizeDateString(getField(row, SP_EMPLOYEE_FIELDS.startDate)),
    avatar: EMPLOYEE_PHOTOS[lookupKey],
    lookupKey,
  };
};

const buildSharePointEmployeePayload = (profile = {}) => {
  const nameParts = (profile.name || '').trim().split(/\s+/);
  const firstName = formatPersonName(nameParts[0] || '');
  const lastName = formatPersonName(nameParts.slice(1).join(' '));
  return {
    [SP_EMPLOYEE_FIELDS.firstName]: firstName,
    [SP_EMPLOYEE_FIELDS.lastName]: lastName,
    [SP_EMPLOYEE_FIELDS.id]: profile.id || profile.lookupKey || profile.email || firstName || lastName,
    [SP_EMPLOYEE_FIELDS.company]: profile.department || 'UDS',
    [SP_EMPLOYEE_FIELDS.department]: profile.department || 'UDS',
    [SP_EMPLOYEE_FIELDS.location]: profile.location || 'Field',
    [SP_EMPLOYEE_FIELDS.title]: profile.title || 'Team member',
    [SP_EMPLOYEE_FIELDS.email]: profile.email || '',
    [SP_EMPLOYEE_FIELDS.startDate]: profile.startDate || null,
    [SP_EMPLOYEE_FIELDS.phone]: profile.phone || '',
    [SP_EMPLOYEE_FIELDS.computer]: profile.computer || '',
    [SP_EMPLOYEE_FIELDS.printer]: profile.printer || '',
    [SP_EMPLOYEE_FIELDS.monitor]: profile.monitor || '',
    [SP_EMPLOYEE_FIELDS.dock]: profile.dock || '',
    [SP_EMPLOYEE_FIELDS.keyFob]: profile.keyFob || '',
  };
};

const buildAssetsFromSheet = (assetRows = assetSheetData, employeeRows = employeeSheetData) => {
  const employeeDirectory = buildEmployeeDirectory(employeeRows);
  return (assetRows || [])
    .filter((row) => row['Device Name'] || row['Serial Num'] || row['Product Num'])
    .map((row, index) => {
      const assignedName = formatRosterName(row.ContactID);
      const hasAssignee = Boolean(assignedName && assignedName !== 'Unassigned');
      const person = employeeDirectory[assignedName] || null;
      const type = row['Device Type'] || 'Hardware';
      const purchaseDate = row['Purchase Date'] || '';
      const warrantyExpiry = row['Warranty End Date'] || '';
      const retiredDate = row['Retired Date'] || '';
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
        location: row.Combo445 || person?.location || 'Field',
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

const buildHistoryFromAssets = (assets) =>
  assets
    .filter((asset) => asset.purchaseDate)
    .slice(0, 25)
    .map((asset, index) => ({
      id: index + 1,
      assetId: asset.id,
      action: asset.checkedOut ? 'Check Out' : 'Check In',
      user: asset.assignedTo || 'Operations',
      date: asset.checkOutDate || asset.purchaseDate,
      notes: asset.location,
    }));

const buildMaintenanceFromAssets = (assets) => {
  const today = new Date();

  return assets
    .filter((asset) => asset.warrantyExpiry)
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
        location: row['Location'] || row['Company'] || 'Field',
        email: row['E-mail Address'] || '',
      phone: row['Mobile Phone'] || '',
      startDate: row['Start Date'] || '',
      avatar: EMPLOYEE_PHOTOS[avatarKey],
      lookupKey: avatarKey,
    };
  });

const BASE_ASSETS = buildAssetsFromSheet();
const BASE_HISTORY = buildHistoryFromAssets(BASE_ASSETS);
const BASE_TEAM = buildTeamSpotlight();
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
          location: asset.location || 'Field',
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
          location: asset.location || 'Field',
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

const buildMaintenanceWorkOrders = (assets) => {
  const statuses = ['Planned', 'In Progress', 'Awaiting Parts', 'Completed'];
  const severities = ['Normal', 'High', 'Urgent'];
  return assets
    .filter((asset) => asset.warrantyExpiry)
    .slice(0, 12)
    .map((asset, index) => {
      const eta = new Date();
      eta.setDate(eta.getDate() + (index + 1) * 3);
      return {
        id: `WO-${asset.id}`,
        assetId: asset.id,
        assetName: asset.assetName,
        vendor: asset.brand || 'Preferred vendor',
        status: statuses[index % statuses.length],
        attachments: asset.checkedOut ? 2 : 1,
        severity: severities[index % severities.length],
        eta: eta.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      };
    });
};

const computeSheetInsights = (assets) => {
  const locationCounts = {};
  let remoteAssignments = 0;
  const counts = assets.reduce((acc, asset) => {
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

  const remoteShare = assets.length ? Math.round((remoteAssignments / assets.length) * 100) : 0;

  return { counts, topLocations, remoteShare };
};

const isBrowser = typeof window !== 'undefined';

const ensureStorageVersion = () => {
  if (!isBrowser) {
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

const usePersistentState = (key, initialValue) => {
  const [state, setState] = useState(() => {
    if (!isBrowser) {
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
    if (!isBrowser) {
      return;
    }

    try {
      ensureStorageVersion();
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Ignore quota errors so the dashboard still works offline.
    }
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
    return 'â€”';
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
  if (!asset.serialNumber) {
    issues.push('Serial number missing');
  }
  if (!asset.location) {
    issues.push('Location missing');
  }
  if (!asset.assignedTo) {
    issues.push('Owner missing');
  }
  if (!asset.warrantyExpiry) {
    issues.push('Warranty date missing');
  }
  if (!asset.qrCode) {
    issues.push('QR label missing');
  }
  if (!asset.purchaseDate) {
    issues.push('Purchase date missing');
  }
  return issues;
};

const getAssetQualityScore = (asset = {}) => {
  const total = 5;
  const missing = ['serialNumber', 'location', 'assignedTo', 'warrantyExpiry', 'qrCode'].reduce(
    (acc, key) => acc + (asset[key] ? 0 : 1),
    0,
  );
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
    .filter(isLaptopAsset)
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
        location: asset.location || 'Field',
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
    const eta = order.eta ? ` Â· ETA ${order.eta}` : '';
    return `${order.status} Â· ${order.severity || 'Normal'} priority with ${vendor}${eta}`;
  }
  const reference = asset.serialNumber || asset.assetName || asset.deviceName || asset.id;
  const note = LAPTOP_REPAIR_NOTES[hashString(reference) % LAPTOP_REPAIR_NOTES.length];
  const reporter = asset.assignedTo ? `Reported by ${asset.assignedTo}` : `Flagged from ${asset.location || 'Operations'}`;
  return `${note}. ${reporter}.`;
};

const computeLaptopServiceSummary = (assets = [], workOrders = []) => {
  const laptops = assets.filter(isLaptopAsset);
  const orderLookup = workOrders.reduce((acc, order) => {
    acc[order.assetId] = order;
    return acc;
  }, {});
  const now = Date.now();
  const monthMs = 1000 * 60 * 60 * 24 * 30;
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
      };
    })
    .sort((a, b) => b.ageMonths - a.ageMonths);
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
  const sortLoaners = (collection) => collection.map(mapLoaner).sort((a, b) => a.assetId.localeCompare(b.assetId));
  const avgRepairAgeMonths = repairsFull.length
    ? Math.round(repairsFull.reduce((sum, item) => sum + (item.ageMonths || 0), 0) / repairsFull.length)
    : 0;
  return {
    repairs: repairsFull.slice(0, 4),
    repairTotal: repairsFull.length,
    avgRepairAgeMonths,
    loanersAvailable: sortLoaners(availableLoanersRaw).slice(0, 6),
    loanerAvailableCount: availableLoanersRaw.length,
    loanersDeployed: sortLoaners(deployedLoanersRaw).slice(0, 6),
    loanerDeployedCount: deployedLoanersRaw.length,
    loanerTotal: loanerPool.length,
  };
};

const computeInventoryHealth = (assets = [], history = []) => {
  if (!assets.length) {
    return {
      dataQualityScore: 0,
      auditReadyPercent: 0,
      missingSerials: 0,
      missingLocation: 0,
      missingWarranty: 0,
      missingOwner: 0,
      qrMissing: 0,
      maintenanceCount: 0,
      retiredCount: 0,
      warrantySoon: 0,
      newAssets: 0,
      auditCandidates: [],
    };
  }

  const now = new Date();
  const msInDay = 1000 * 60 * 60 * 24;
  const missingSerials = assets.filter((asset) => !asset.serialNumber).length;
  const missingLocation = assets.filter((asset) => !asset.location).length;
  const missingWarranty = assets.filter((asset) => !asset.warrantyExpiry).length;
  const missingOwner = assets.filter((asset) => !asset.assignedTo && getAssetDisplayStatus(asset) !== 'Retired').length;
  const qrMissing = assets.filter((asset) => !asset.qrCode).length;
  const maintenanceCount = assets.filter((asset) => getAssetDisplayStatus(asset) === 'Maintenance').length;
  const retiredCount = assets.filter((asset) => getAssetDisplayStatus(asset) === 'Retired').length;
  const warrantySoon = assets.filter((asset) => {
    if (!asset.warrantyExpiry) {
      return false;
    }
    const diffDays = Math.round((new Date(asset.warrantyExpiry) - now) / msInDay);
    return diffDays >= -30 && diffDays <= 90;
  }).length;
  const newAssets = assets.filter((asset) => {
    if (!asset.purchaseDate) {
      return false;
    }
    const diffDays = Math.round((now - new Date(asset.purchaseDate)) / msInDay);
    return diffDays >= 0 && diffDays <= 30;
  }).length;

  const auditCandidates = assets
    .map((asset) => {
      const status = getAssetDisplayStatus(asset);
      const issues = [];
      if (!asset.location) {
        issues.push('Location missing');
      }
      if (!asset.serialNumber) {
        issues.push('Serial missing');
      }
      if (!asset.warrantyExpiry) {
        issues.push('No warranty date');
      } else {
        const diffDays = Math.round((new Date(asset.warrantyExpiry) - now) / msInDay);
        if (diffDays >= 0 && diffDays <= 90) {
          issues.push('Warranty expiring');
        }
      }
      if (!asset.qrCode) {
        issues.push('QR label needed');
      }
      if (!asset.assignedTo) {
        issues.push('Unassigned');
      }
      if (issues.length === 0 || status === 'Retired') {
        return null;
      }
      return {
        id: asset.id,
        name: asset.assetName || asset.deviceName || `Asset-${asset.id}`,
        location: asset.location || 'Not set',
        status,
        issue: issues.slice(0, 2).join(' \u2022 '),
        score: issues.length,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const auditReadyCount = assets.filter(
    (asset) => asset.location && asset.serialNumber && asset.warrantyExpiry && getAssetDisplayStatus(asset) !== 'Retired',
  ).length;
  const dataQualityScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        100 - ((missingSerials + missingLocation + missingWarranty + qrMissing) / (assets.length * 4 || 1)) * 100,
      ),
    ),
  );
  const auditReadyPercent = Math.round((auditReadyCount / (assets.length || 1)) * 100);

  return {
    dataQualityScore,
    auditReadyPercent,
    missingSerials,
    missingLocation,
    missingWarranty,
    missingOwner,
    qrMissing,
    maintenanceCount,
    retiredCount,
    warrantySoon,
    newAssets,
    auditCandidates,
  };
};

const buildAuditRuns = (assets = [], insights = { topLocations: [] }) => {
  const now = new Date();
  const msInDay = 1000 * 60 * 60 * 24;
  const warrantySoon = assets.filter((asset) => {
    if (!asset.warrantyExpiry) {
      return false;
    }
    const diffDays = Math.round((new Date(asset.warrantyExpiry) - now) / msInDay);
    return diffDays >= 0 && diffDays <= 90 && getAssetDisplayStatus(asset) !== 'Retired';
  }).length;
  const newAssets = assets.filter((asset) => asset.purchaseDate && (now - new Date(asset.purchaseDate)) / msInDay <= 30).length;
  const highValueAssets = assets.filter((asset) => Number(asset.cost || 0) >= 1500).length;
  const unassigned = assets.filter((asset) => !asset.assignedTo && getAssetDisplayStatus(asset) !== 'Retired').length;
  const locationTargets = (insights?.topLocations || []).map((entry) => `${entry.location} (${entry.count})`).slice(0, 3);

  return [
    {
      id: 'monthly-floor',
      title: 'Monthly floor walk',
      priority: 'High',
      due: 'This week',
      count: locationTargets.length || assets.length,
      description: 'Spot-check busiest sites, scan labels, and confirm each asset is physically present.',
      scope: locationTargets,
    },
    {
      id: 'high-value',
      title: 'High-value custody',
      priority: 'High',
      due: '7 days',
      count: highValueAssets,
      description: 'Verify chain-of-custody for laptops, phones, or gear valued above $1,500.',
      scope: ['Costing $1.5k+'],
    },
    {
      id: 'warranty-window',
      title: 'Warranty expirations',
      priority: 'Medium',
      due: '30 days',
      count: warrantySoon,
      description: 'Inspect devices before coverage ends and schedule proactive service if needed.',
      scope: ['Expiring within 90 days'],
    },
    {
      id: 'new-deployments',
      title: 'New deployments',
      priority: 'Medium',
      due: '14 days',
      count: newAssets,
      description: 'Baseline photos, QR labels, and owner confirmation for recently purchased equipment.',
      scope: ['Added in the last 30 days'],
    },
    {
      id: 'unassigned',
      title: 'Unassigned devices',
      priority: 'Medium',
      due: 'This week',
      count: unassigned,
      description: 'Attach owners and locations to gear floating between teams.',
      scope: ['Assign and document location'],
    },
  ];
};

const CardShell = ({ title, icon: Icon, action, children }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 text-slate-500" />}
        <p className="text-sm font-semibold text-slate-800">{title}</p>
      </div>
      {action}
    </div>
    {children}
  </div>
);

const PrimaryNav = ({ onAdd, onExport, activePage, onNavigate }) => (
  <nav className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white/70 px-5 py-4 backdrop-blur">
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
        Live sync
      </span>
    </div>
    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
      {NAV_LINKS.map((item) => (
        <button
          key={item}
          onClick={() => onNavigate?.(item)}
          className={`transition hover:text-slate-900 ${activePage === item ? 'text-slate-900' : ''}`}
          type="button"
          aria-current={activePage === item ? 'page' : undefined}
        >
          {item}
        </button>
      ))}
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={onExport}
        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-300"
      >
        <Download className="h-4 w-4" />
        Export
      </button>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
      >
        <Plus className="h-4 w-4" />
        New asset
      </button>
      <button className="rounded-full border border-slate-200 p-2 text-slate-500 hover:border-slate-300" type="button">
        <Bell className="h-4 w-4" />
      </button>
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-1.5">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500" />
        <div>
          <p className="text-xs font-semibold text-slate-700">Operations</p>
          <p className="text-[11px] font-semibold text-slate-500">IT Department</p>
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

const DeviceSpotlightCard = ({ title, stats = [], stat, description, image, meta, onStatClick }) => {
  const displayStats = stats.length ? stats : stat ? [{ label: stat }] : [];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-900 text-white shadow-sm">
      {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-blue-900/50" />
      <div className="relative flex h-full flex-col justify-between p-5">
        <div>
          {meta && <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-white/60">{meta}</p>}
          <p className="text-lg font-semibold">{title}</p>
          <p className="mt-1 text-sm text-white/70">{description}</p>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {displayStats.map((item, index) => {
            const key = `${item.type || item.label}-${index}`;
            const isClickable = Boolean(onStatClick && item.type);
            const content = isClickable ? (
              <button
                type="button"
                onClick={() => onStatClick(item.type)}
                className="text-left text-2xl font-semibold text-white underline decoration-white/60 underline-offset-4 transition hover:text-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-2xl font-semibold">{item.label}</span>
            );

            return (
              <Fragment key={key}>
                {content}
                {index < displayStats.length - 1 && <span className="text-2xl font-semibold text-white/50">/</span>}
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

const SnapshotMetricsRow = ({ metrics = [] }) => (
  <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
    <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">Daily signals</p>
    <div className="mt-4 grid gap-4 sm:grid-cols-3">
      {metrics.map((metric) => (
        <div key={metric.label} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-400">{metric.label}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{metric.value}</p>
          <p className="text-xs text-slate-500">{metric.subline}</p>
        </div>
      ))}
      {metrics.length === 0 && <p className="text-sm text-slate-500">No live metrics available.</p>}
    </div>
  </div>
);

const TeamSpotlightPanel = ({ team = [], remoteShare, downloadHref }) => (
  <div className="rounded-3xl border border-slate-100 bg-white shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">Employee Information Hub.xlsx</p>
        <p className="text-lg font-semibold text-slate-900">Team spotlight</p>
        <p className="text-sm text-slate-500">{remoteShare}% remote assignments</p>
      </div>
      <a
        href={downloadHref}
        download
        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300"
      >
        <Download className="h-4 w-4" />
        Roster
      </a>
    </div>
    <ul className="divide-y divide-slate-100">
      {team.map((member) => (
        <li key={member.id} className="flex items-start gap-3 p-5">
          {member.avatar ? (
            <img src={member.avatar} alt={`${member.name} avatar`} className="h-12 w-12 rounded-2xl object-cover" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-600">
              {getInitials(member.name)}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                <p className="text-xs text-slate-500">{member.title}</p>
              </div>
              {member.startDate && <p className="text-[11px] text-slate-400">Since {formatDate(member.startDate)}</p>}
            </div>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {member.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" />
                {member.department}
              </span>
            </div>
            <div className="mt-2 text-xs text-blue-600">
              {member.email && (
                <a href={`mailto:${member.email}`} className="hover:underline">
                  {member.email}
                </a>
              )}
              {!member.email && member.phone && <span>{member.phone}</span>}
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const VendorCard = ({ vendor }) => {
  const accentFrom = vendor.accent?.from || '#0f172a';
  const accentTo = vendor.accent?.to || '#475569';
  const imageSrc = vendor.image || VENDOR_IMAGES[vendor.id] || MEDIA.devices.computer;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl ring-1 ring-slate-100">
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
            {vendor.contact.url && (
              <a href={vendor.contact.url} target="_blank" rel="noreferrer" className="block text-blue-600 hover:underline">
                {vendor.contact.url.replace(/^https?:\/\//, '')}
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

const NetworkPrinterBoard = ({ printers = [], limit, title = 'Network printers & copiers', subtitle }) => {
  const rows = typeof limit === 'number' ? printers.slice(0, limit) : printers;
  const remaining = printers.length - rows.length;
  return (
    <div className="rounded-3xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">SharePoint table sync</p>
          <p className="text-lg font-semibold text-slate-900">{title}</p>
          <p className="text-sm text-slate-500">{subtitle || 'Live pull from â€œNetwork Printer and Copiersâ€.'}</p>
        </div>
        <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
          <Printer className="h-5 w-5" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-widest text-slate-500">
            <tr>
              <th className="px-5 py-3">Device</th>
              <th className="px-5 py-3">Location</th>
              <th className="px-5 py-3">Model</th>
              <th className="px-5 py-3">Serial</th>
              <th className="px-5 py-3">IP</th>
              <th className="px-5 py-3">Fleet ID</th>
              <th className="px-5 py-3">Vendor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {rows.map((printer, index) => (
              <tr key={`${printer.deviceType}-${printer.location}-${index}`} className="align-top hover:bg-slate-50/60">
                <td className="px-5 py-3">
                  <p className="font-semibold text-slate-900">{printer.deviceType}</p>
                </td>
                <td className="px-5 py-3 text-sm">{printer.location}</td>
                <td className="px-5 py-3 text-sm">{printer.model}</td>
                <td className="px-5 py-3 text-sm">{printer.serial || 'â€”'}</td>
                <td className="px-5 py-3 text-sm font-mono">{printer.ip || 'â€”'}</td>
                <td className="px-5 py-3 text-sm">{printer.colonyId || 'â€”'}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${printer.vendorBadge}`}>
                    {printer.vendorName}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {remaining > 0 && (
        <p className="px-5 py-4 text-xs text-slate-500">
          +{remaining} additional printers tracked in SharePoint.
        </p>
      )}
    </div>
  );
};

const PrinterVendorSummary = ({ vendors = [], title = 'Printer service partners', subtitle }) => (
  <div className="rounded-3xl border border-slate-100 bg-white shadow-sm">
    <div className="border-b border-slate-100 px-5 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">Vendor routing</p>
      <p className="text-lg font-semibold text-slate-900">{title}</p>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </div>
    <div className="space-y-4 p-5">
      {vendors.map((vendor) => (
        <div key={vendor.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{vendor.name}</p>
              <p className="text-xs text-slate-500">{vendor.description}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-slate-900">{vendor.deviceCount}</p>
              <p className="text-xs text-slate-500">printers</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-500">Brands: {vendor.brands.join(', ')}</p>
          {vendor.contact && (
            <a
              href={vendor.contact.href}
              target={vendor.contact.external ? '_blank' : '_self'}
              rel={vendor.contact.external ? 'noreferrer' : undefined}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline"
            >
              {vendor.contact.label}
              {vendor.contact.external && <ExternalLink className="h-3.5 w-3.5" />}
            </a>
          )}
        </div>
      ))}
    </div>
  </div>
);

const SoftwareSuiteCard = ({ suite, onEdit, onDelete }) => {
  const { status, delta } = getLicenseHealth(suite.seats, suite.used);
  const badgeStyle =
    status === 'Overused'
      ? 'bg-rose-50 text-rose-700'
      : status === 'At capacity'
        ? 'bg-amber-50 text-amber-700'
        : 'bg-emerald-50 text-emerald-700';
  const spareLabel = delta < 0 ? `${Math.abs(delta)} seats over` : `${delta} seats free`;
  const perSeat = suite.seats ? Math.round((suite.cost || 0) / suite.seats) : 0;
  const accentFrom = suite.accent?.from || '#0f172a';
  const accentTo = suite.accent?.to || '#1d4ed8';
  const gradientStyle = {
    backgroundImage: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
  };
  const initials = getInitials(suite.software);

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ring-transparent transition hover:-translate-y-0.5 hover:shadow-xl hover:ring-blue-100">
      <div>
        <div className="relative mb-5 overflow-hidden rounded-2xl border border-white/20 p-5 text-white shadow-inner" style={gradientStyle}>
          {onEdit && (
            <div className="absolute right-3 top-3 flex gap-2">
              <button
                type="button"
                onClick={() => onEdit(suite)}
                className="rounded-full bg-white/20 p-2 text-white hover:bg-white/40"
                title="Edit suite"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(suite.id)}
                className="rounded-full bg-white/20 p-2 text-white hover:bg-white/40"
                title="Delete suite"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
          <span className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/40 blur-3xl" />
          <span className="pointer-events-none absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-white/30 blur-2xl" />
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35rem] text-white/70">{suite.category}</p>
              <p className="mt-2 text-xl font-semibold leading-tight">{suite.software}</p>
              <p className="mt-1 text-xs text-white/80">{suite.owner}</p>
            </div>
            {suite.logo ? (
              <div className="flex h-14 w-24 items-center justify-center rounded-2xl bg-white/15 p-2 backdrop-blur">
                <img
                  src={suite.logo}
                  alt={`${suite.software} logo`}
                  className="max-h-10 w-auto object-contain drop-shadow-[0_10px_30px_rgba(15,23,42,0.35)]"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-lg font-semibold text-white">{initials}</div>
            )}
          </div>
        </div>

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
  );
};

const LifecycleReminderBoard = ({ reminders = [], preferences, onToggle, onViewAllWarranty, warrantyCount = 0 }) => (
  <div className="rounded-3xl border border-slate-100 bg-white shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">Lifecycle</p>
        <p className="text-lg font-semibold text-slate-900">Upcoming reminders</p>
        <p className="text-sm text-slate-500">Warranty expirations, lease returns, and compliance deadlines in one glance.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {['email', 'zoom'].map((channel) => (
          <button
            key={channel}
            onClick={() => onToggle(channel)}
            className={`rounded-full border px-3 py-1 font-semibold capitalize transition ${
              preferences[channel]
                ? 'border-blue-200 bg-blue-50 text-blue-600'
                : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
            type="button"
          >
            {channel} alerts
          </button>
        ))}
        {warrantyCount > 0 && typeof onViewAllWarranty === 'function' && (
          <button
            type="button"
            onClick={onViewAllWarranty}
            className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
          >
            View all warranty alerts
          </button>
        )}
      </div>
    </div>
    <ul className="divide-y divide-slate-100">
      {reminders.map((item) => (
        <li key={`${item.assetId}-${item.type}`} className="flex items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">{item.assetName}</p>
            <p className="text-xs text-slate-500">{item.description}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-slate-400">{item.type}</p>
            <p className={`text-sm font-semibold ${item.overdue ? 'text-rose-600' : 'text-slate-900'}`}>
              {item.overdue ? `${Math.abs(item.daysRemaining)} days overdue` : `in ${item.daysRemaining} days`}
            </p>
          </div>
        </li>
      ))}
      {reminders.length === 0 && (
        <li className="px-6 py-6 text-sm text-slate-500">All clear! No lifecycle events are due within the next 90 days.</li>
      )}
    </ul>
  </div>
);

const WarrantyAlertStrip = ({ alerts = [], onViewAll }) => {
  if (!alerts.length) {
    return null;
  }
  const highlight = alerts.slice(0, 3);
  return (
    <div className="rounded-3xl border border-amber-100 bg-amber-50/60 p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3rem] text-amber-800">Warranty alerts</p>
          <p className="text-lg font-semibold text-amber-900">Expiring within 30 days</p>
          <p className="text-sm text-amber-800/80">{alerts.length} device{alerts.length === 1 ? '' : 's'} need attention.</p>
        </div>
        {typeof onViewAll === 'function' && (
          <button
            type="button"
            className="rounded-2xl border border-amber-200 px-4 py-1.5 text-xs font-semibold text-amber-800 transition hover:border-amber-300 hover:text-amber-900"
            onClick={onViewAll}
          >
            View all
          </button>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-amber-900">
        {highlight.map((alert) => (
          <div key={`${alert.assetId || alert.assetName}-warranty`} className="flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-2">
            <span>{alert.assetName || alert.model || 'Device'}</span>
            <span className="text-xs font-normal text-amber-700">({formatDate(alert.warrantyExpiry)})</span>
          </div>
        ))}
        {alerts.length > highlight.length && (
          <span className="rounded-2xl bg-white/50 px-3 py-2 text-xs font-semibold text-amber-800">
            +{alerts.length - highlight.length} more
          </span>
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

const SoftwareFormModal = ({ suite, onSubmit, onCancel }) => {
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
            <input
              type="number"
              value={form.cost}
              onChange={(event) => update('cost', Number(event.target.value))}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              min="0"
            />
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
              placeholder="SharePoint, Teams, Intune"
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

const LicenseCompliancePanel = ({ data = [] }) => {
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () =>
      data.filter(
        (item) =>
          item.software.toLowerCase().includes(query.toLowerCase()) ||
          item.status.toLowerCase().includes(query.toLowerCase()),
      ),
    [data, query],
  );

  return (
    <div className="rounded-3xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">Software</p>
          <p className="text-lg font-semibold text-slate-900">License compliance</p>
          <p className="text-sm text-slate-500">Track seat usage and highlight over-allocated workloads.</p>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search suites"
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Suite</th>
              <th className="px-5 py-3">Used / Seats</th>
              <th className="px-5 py-3">Delta</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600">
            {filtered.map((item) => (
              <tr key={item.software}>
                <td className="px-5 py-3 font-semibold text-slate-900">{item.software}</td>
                <td className="px-5 py-3">
                  {item.used} / {item.seats}
                </td>
                <td className="px-5 py-3">{item.delta > 0 ? `+${item.delta}` : item.delta}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.status === 'Overused'
                        ? 'bg-rose-50 text-rose-600'
                        : item.status === 'At capacity'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="px-6 py-6 text-sm text-slate-500">No license data available.</p>}
      </div>
    </div>
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
          <BarChart data={costData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" hide />
            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="mt-3 text-xs uppercase tracking-widest text-slate-400">Spend by department</p>
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

const MaintenanceWorkflowBoard = ({ workOrders = [] }) => {
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
    <div className="rounded-3xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white shadow-xl ring-1 ring-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">Maintenance</p>
          <p className="text-2xl font-semibold text-slate-900">Work order board</p>
          <p className="text-sm text-slate-500">Track vendor SLAs, attachments, ETA, and technician notes.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <span className="rounded-2xl bg-slate-900 text-white px-3 py-1.5 shadow-md">Total {totals.total}</span>
          {columns.map((col) => (
            <span
              key={col.key}
              className={`rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-slate-700 shadow-inner ${col.chip}`}
            >
              {col.label}: {totals[col.key] || 0}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((status) => {
          const items = workOrders.filter((order) => order.status === status.key);
          return (
            <div
              key={status.key}
              className={`relative overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-b ${status.color} p-5 shadow-sm min-w-[260px]`}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.2rem] text-slate-500">{status.label}</p>
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow-inner">
                  {items.length} open
                </span>
              </div>
              <div className="space-y-3">
                {items.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-3xl border border-white/70 bg-white p-4 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-blue-200"
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
  onEdit = () => {},
  onDelete = () => {},
}) => (
  <div className="rounded-3xl border border-slate-100 bg-white shadow-sm">
    <div className="border-b border-slate-100 px-6 py-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">People ops</p>
      <p className="text-lg font-semibold text-slate-900">Employee directory</p>
      <p className="text-sm text-slate-500">
        Displaying {members.length} of {totalCount} team members with photos and contact info
      </p>
    </div>
    <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => {
        const isExpanded = expandedId === member.id;
        const assignments = getAssignments(member);
        const assignmentCount = assignments.length;
        const cardClasses = [
          'rounded-2xl border p-4 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50',
          'cursor-pointer select-none',
          isExpanded ? 'border-blue-200 bg-blue-50/80' : 'border-slate-100 bg-white',
        ].join(' ');
        const handleKeyDown = (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onToggle(member.id);
          }
        };

        return (
          <div
            key={member.id}
            className={cardClasses}
            role="button"
            tabIndex={0}
            aria-expanded={isExpanded}
            onClick={() => onToggle(member.id)}
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-start gap-4">
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} className="h-12 w-12 rounded-2xl object-cover" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-600">
                  {getInitials(member.name)}
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                <p className="text-xs text-slate-500">{member.title}</p>
                {member.email ? (
                  <p className="mt-1 text-xs">
                    <a
                      href={`mailto:${member.email}`}
                      onClick={(event) => event.stopPropagation()}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      {member.email}
                    </a>
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-400">No email on file</p>
                )}
                <p className="mt-2 text-xs text-slate-500">{member.department}</p>
                <p className="text-xs text-slate-400">{member.location}</p>
                {member.phone && <p className="mt-1 text-[11px] text-slate-400">{member.phone}</p>}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit(member);
                  }}
                  className="rounded-full p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
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
                  className="rounded-full p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                  title="Delete employee"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {isExpanded && (
              <div className="mt-4 rounded-2xl border border-slate-100 bg-white/90 p-4">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.3rem] text-slate-500">
                  <span>Assigned assets</span>
                  <span>{assignmentCount}</span>
                </div>
                {assignmentCount === 0 ? (
                  <p className="mt-3 text-xs text-slate-500">No asset assignments from the current inventory.</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {assignments.map((asset) => {
                      const deviceLabel = asset.deviceName || asset.assetName || `Asset ${asset.id}`;
                      const assetId = asset.sheetId || asset.assetName || `Asset-${asset.id}`;
                      const brandLabel = asset.brand || 'Unknown brand';
                      const modelLabel = asset.model || 'Unknown model';
                      const serialLabel = asset.serialNumber || 'N/A';
                      const showDeviceLabel =
                        deviceLabel && deviceLabel.toLowerCase() !== (assetId || '').toLowerCase();
                      return (
                        <li key={asset.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                          <p className="text-sm font-semibold text-slate-900">
                            {assetId}
                            {showDeviceLabel && (
                              <span className="text-xs font-normal text-slate-500"> Â· {deviceLabel}</span>
                            )}
                          </p>
                          <p className="mt-1 text-[11px] text-slate-600">
                            <span className="font-semibold text-slate-700">Brand:</span> {brandLabel}
                          </p>
                          <p className="text-[11px] text-slate-600">
                            <span className="font-semibold text-slate-700">Model:</span> {modelLabel}
                          </p>
                          <p className="text-[11px] text-slate-600">
                            <span className="font-semibold text-slate-700">Serial:</span> {serialLabel}
                          </p>
                        </li>
                      );
                    })}
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

const LaptopRepairCard = ({ data, onLoanerCheckout, onLoanerCheckin }) => {
  if (!data) {
    return null;
  }
  const {
    repairs = [],
    repairTotal = 0,
    avgRepairAgeMonths = 0,
    loanersAvailable = [],
    loanerAvailableCount = 0,
    loanersDeployed = [],
    loanerDeployedCount = 0,
    loanerTotal = 0,
  } = data;
  return (
    <div className="rounded-3xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">Repair desk</p>
          <p className="text-xl font-semibold text-slate-900">Laptop service status</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-slate-400">Avg age in repair</p>
          <p className="text-2xl font-semibold text-slate-900">{avgRepairAgeMonths || 0} mo</p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr,1fr]">
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25rem] text-slate-500">Laptops out for repair</p>
              <p className="text-sm text-slate-600">{repairTotal} devices</p>
            </div>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              {repairTotal > 0 ? 'In progress' : 'All clear'}
            </span>
          </div>
          {repairs.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No laptops currently staged at the depot.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {repairs.map((item) => (
                <li key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{item.assetId}</p>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500">{item.status}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{item.issue}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Assigned to <span className="font-semibold text-slate-900">{item.assignedTo}</span> Â· {item.model}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25rem] text-slate-500">Loaner laptops</p>
            <p className="text-sm font-semibold text-slate-900">
              {loanerAvailableCount}/{loanerTotal} ready
            </p>
            <p className="text-xs text-slate-500">Tap a device below to reserve or return it.</p>
          </div>
          <div className="mt-3">
            {loanersAvailable.length === 0 ? (
              <p className="text-xs text-slate-400">No devices ready.</p>
            ) : (
              <ul className="space-y-2">
                {loanersAvailable.map((loaner) => (
                  <li
                    key={loaner.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{loaner.assetId}</p>
                      <p className="text-[11px] text-emerald-600">{loaner.location}</p>
                    </div>
                    {typeof onLoanerCheckout === 'function' && (
                      <button
                        type="button"
                        onClick={() => onLoanerCheckout(loaner.asset)}
                        className="rounded-2xl border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:border-emerald-300"
                      >
                        Check out
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-4 border-t border-slate-100 pt-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25rem] text-slate-500">Currently deployed</p>
            {loanersDeployed.length === 0 ? (
              <p className="mt-2 text-xs text-slate-500">No loaners currently checked out.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {loanersDeployed.map((loaner) => (
                  <li key={loaner.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{loaner.assetId}</p>
                      <p className="text-xs text-slate-500">
                        Assigned to <span className="font-semibold text-slate-900">{loaner.assignedTo}</span> ? {loaner.location}
                      </p>
                    </div>
                    {typeof onLoanerCheckin === 'function' && (
                      <button
                        type="button"
                        onClick={() => onLoanerCheckin(loaner.asset)}
                        className="rounded-2xl border border-blue-200 bg-white px-3 py-1 text-xs font-semibold text-blue-700 transition hover:border-blue-300"
                      >
                        Check in
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-[11px] text-slate-400">
              {loanerDeployedCount} out in the field ? keep at least 2 staged for emergencies.
            </p>
          </div>
        </div>
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
                  {row.brand} {row.model} Â· Purchased {formatDate(row.purchaseDate)}
                </p>
                <p className="text-xs text-slate-500">
                  Assigned to <span className="font-semibold text-slate-900">{row.assignedTo}</span> Â· {row.location}
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
                {suite.used} / {suite.seats} seats Â· {suite.delta} buffer
              </p>
              <p className="text-xs text-slate-400">Owner: {suite.owner}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const LoanerCoverageReport = ({ data, onExport }) => {
  if (!data) {
    return null;
  }
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">Loaner coverage</p>
          <p className="text-xl font-semibold text-slate-900">Readiness summary</p>
          <p className="text-xs text-slate-500">
            {data.loanerAvailableCount}/{data.loanerTotal} laptops are staged
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
          <p className="mt-1 text-2xl font-semibold text-emerald-700">{data.loanerAvailableCount}</p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-center">
          <p className="text-xs uppercase tracking-[0.3rem] text-blue-600">Deployed</p>
          <p className="mt-1 text-2xl font-semibold text-blue-700">{data.loanerDeployedCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
          <p className="text-xs uppercase tracking-[0.3rem] text-slate-500">Pool size</p>
          <p className="mt-1 text-2xl font-semibold text-slate-700">{data.loanerTotal}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25rem] text-slate-500">Ready for checkout</p>
          {data.loanersAvailable.length === 0 ? (
            <p className="mt-2 text-xs text-slate-500">No devices staged.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {data.loanersAvailable.map((loaner) => (
                <li key={loaner.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-2 text-xs text-slate-600">
                  <span className="font-semibold text-slate-900">{loaner.assetId}</span> Â· {loaner.location}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25rem] text-slate-500">In the field</p>
          {data.loanersDeployed.length === 0 ? (
            <p className="mt-2 text-xs text-slate-500">No active deployments.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {data.loanersDeployed.map((loaner) => (
                <li key={loaner.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-2 text-xs text-slate-600">
                  <span className="font-semibold text-slate-900">{loaner.assetId}</span> â†’ {loaner.assignedTo}
                </li>
              ))}
            </ul>
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

const AssetFilters = ({ filters, onChange, onReset, types }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={filters.search}
          onChange={(event) => onChange('search', event.target.value)}
          placeholder="Search by brand, serial, or user"
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>
      <select
        value={filters.type}
        onChange={(event) => onChange('type', event.target.value)}
        className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
        className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="all">All statuses</option>
        <option value="Available">Available</option>
        <option value="Checked Out">Checked Out</option>
        <option value="Maintenance">Maintenance</option>
        <option value="Retired">Retired</option>
      </select>
      <button
        onClick={onReset}
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Reset filters
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
  sharePointMode = false,
  qualityLookup = {},
}) => {
  if (assets.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 p-12 text-center text-sm text-slate-500">
        No assets match the selected filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3">Asset</th>
              <th className="px-6 py-3">Owner</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Lifecycle</th>
              <th className="px-6 py-3">Cost</th>
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
                    isSelected ? 'bg-blue-50/80 shadow-inner ring-1 ring-blue-100' : 'hover:bg-slate-50/70'
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
                    {ready ? 'Ready' : 'Needs info'} · {quality.score}% complete
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

const MaintenanceList = ({ records, getAssetName }) => (
  <CardShell title="Recent maintenance" icon={Wrench}>
    <div className="space-y-4">
      {records.map((record) => (
        <div key={record.id} className="rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">{record.type}</p>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                record.status === 'Completed'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {record.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">{record.date}</p>
          <p className="mt-3 text-sm text-slate-600">{record.description}</p>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>{getAssetName(record.assetId)}</span>
            <span>${record.cost}</span>
          </div>
        </div>
      ))}
    </div>
  </CardShell>
);

const ActivityPanel = ({ history, lookupAsset }) => (
  <CardShell title="Check-in/out activity" icon={History}>
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
  </CardShell>
);

const InventoryHealthPanel = ({ health, onStartAudit }) => {
  const readiness = Math.max(0, Math.min(100, Math.round(health?.dataQualityScore || 0)));
  const auditReady = Math.max(0, Math.min(100, Math.round(health?.auditReadyPercent || 0)));
  const signals = [
    { label: 'Missing serials', value: health?.missingSerials || 0 },
    { label: 'No location', value: health?.missingLocation || 0 },
    { label: 'No warranty date', value: health?.missingWarranty || 0 },
    { label: 'Unassigned owners', value: health?.missingOwner || 0 },
    { label: 'QR needed', value: health?.qrMissing || 0 },
    { label: 'Maint/retired', value: `${health?.maintenanceCount || 0}/${health?.retiredCount || 0}` },
  ];
  const focusItems = (health?.auditCandidates || []).slice(0, 4);

  return (
    <CardShell
      title="Inventory health"
      icon={ShieldCheck}
      action={
        <button
          type="button"
          onClick={onStartAudit}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
        >
          <ClipboardCheck className="h-4 w-4" />
          Start audit
        </button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1.3fr,1fr]">
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-900 p-5 text-white">
            <p className="text-xs uppercase tracking-[0.3rem] text-white/60">Data quality</p>
            <p className="mt-2 text-4xl font-semibold">{readiness}%</p>
            <p className="text-sm text-white/70">Fields captured across the fleet</p>
            <div className="mt-4 h-2 w-full rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-emerald-300" style={{ width: `${readiness}%` }} />
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-white/70">
              <span>Audit-ready devices</span>
              <span className="font-semibold text-white">{auditReady}% ready</span>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25rem] text-slate-500">Audit focus</p>
            {focusItems.length === 0 ? (
              <p className="mt-2 text-sm text-slate-600">All assets look healthy. Continue with spot checks.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {focusItems.map((item) => (
                  <div key={`focus-${item.id}`} className="rounded-2xl bg-white p-3 text-sm shadow-sm ring-1 ring-slate-100">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{item.location}</p>
                    <p className="mt-1 text-xs font-medium text-slate-700">{item.issue}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.25rem] text-slate-500">Gaps to close</p>
          <div className="grid grid-cols-2 gap-3">
            {signals.map((signal) => (
              <div
                key={signal.label}
                className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-sm font-semibold text-slate-800 shadow-inner"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{signal.label}</p>
                <p className="mt-1 text-lg">{signal.value}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-xs text-emerald-900">
            <p className="font-semibold">Warranty window</p>
            <p className="text-slate-700">
              {health?.warrantySoon || 0} devices expire within 90 days; {health?.newAssets || 0} were added in the last month.
            </p>
          </div>
        </div>
      </div>
    </CardShell>
  );
};

const AuditRunBoard = ({ runs = [], onStartAudit }) => (
  <CardShell
    title="Audit queue"
    icon={ClipboardList}
    action={
      <button
        type="button"
        onClick={onStartAudit}
        className="rounded-2xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
      >
        Open hardware table
      </button>
    }
  >
    {runs.length === 0 ? (
      <p className="text-sm text-slate-600">No audit runs queued. Start with a quick floor walk.</p>
    ) : (
      <div className="space-y-3">
        {runs.map((run) => (
          <div key={run.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 shadow-inner">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{run.title}</p>
                <p className="text-xs text-slate-600">{run.description}</p>
                {run.scope?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {run.scope.map((item) => (
                      <span
                        key={`${run.id}-${item}`}
                        className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-right text-xs text-slate-500">
                <p className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700">{run.priority}</p>
                <p className="mt-1 font-semibold text-slate-900">{run.count} devices</p>
                <p className="text-slate-600">{run.due}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </CardShell>
);

const MobileAuditCard = ({ inventoryHealth, onStartAudit }) => (
  <div className="overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-slate-50 p-6 shadow-sm">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
          <Smartphone className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25rem] text-blue-700">Mobile audit-ready</p>
          <p className="text-lg font-semibold text-slate-900">Walk the floor with your phone</p>
          <p className="text-sm text-slate-600">
            Use the hardware table on a mobile device to scan QR codes, update owners, and capture quick notes during monthly audits.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onStartAudit}
        className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
      >
        <Smartphone className="h-4 w-4" />
        Launch audit mode
      </button>
    </div>
    <div className="mt-4 grid gap-3 md:grid-cols-3">
      <div className="rounded-2xl border border-slate-100 bg-white/80 p-3 text-sm">
        <p className="text-xs uppercase tracking-wide text-slate-500">Audit ready</p>
        <p className="mt-1 text-2xl font-semibold text-slate-900">{inventoryHealth?.auditReadyPercent || 0}%</p>
        <p className="text-xs text-slate-500">Have serials, owners, and warranty dates</p>
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white/80 p-3 text-sm">
        <p className="text-xs uppercase tracking-wide text-slate-500">Warranty window</p>
        <p className="mt-1 text-2xl font-semibold text-slate-900">{inventoryHealth?.warrantySoon || 0}</p>
        <p className="text-xs text-slate-500">Expiring within 90 days</p>
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white/80 p-3 text-sm">
        <p className="text-xs uppercase tracking-wide text-slate-500">QR to place</p>
        <p className="mt-1 text-2xl font-semibold text-slate-900">{inventoryHealth?.qrMissing || 0}</p>
        <p className="text-xs text-slate-500">Label-ready devices</p>
      </div>
    </div>
    <div className="mt-4 grid gap-3 md:grid-cols-3">
      {['Filter by location for each stop', 'Scan QR to open the record instantly', 'Capture photos and owner confirmations'].map((step) => (
        <div key={step} className="rounded-2xl border border-slate-100 bg-white p-3 text-sm font-semibold text-slate-800 shadow-sm">
          {step}
        </div>
      ))}
    </div>
  </div>
);

const AssetSpotlight = ({ asset, onEdit, sharePointMode = false, onApproveIntake }) => {
  const Icon = asset ? assetTypeIcons[asset.type] || Monitor : Monitor;
  const statusLabel = asset ? getAssetDisplayStatus(asset) : 'Available';
  const qualityIssues = asset ? getAssetQualityIssues(asset) : [];
  const qualityScore = asset ? getAssetQualityScore(asset) : 100;
  const approvalStatus = asset?.approvalStatus || 'Approved';
  const ready = isAssetReady(asset || {});

  return (
    <div className="sticky top-6 rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Asset spotlight</p>
          <p className="text-base font-semibold text-slate-900">{asset ? 'Live snapshot' : 'Choose a device'}</p>
        </div>
        {asset && (
          <div className="flex items-center gap-2">
            {!ready && (
              <button
                onClick={() => onApproveIntake?.(asset)}
                className="inline-flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 hover:border-emerald-200"
                type="button"
              >
                <Check className="h-3.5 w-3.5" />
                Approve intake
              </button>
            )}
            <button
              onClick={() => onEdit(asset)}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-300"
              type="button"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Update
            </button>
          </div>
        )}
      </div>

      {asset ? (
        <>
          <div className="mt-6 rounded-2xl bg-slate-900 p-5 text-white">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-3">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-white/60">{asset.type}</p>
                <p className="text-lg font-semibold">{asset.assetName}</p>
                <p className="text-xs text-white/60">{`${asset.brand} ${asset.model}`.trim()}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-3 py-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                {statusLabel}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1">
                <Sparkles className="h-3.5 w-3.5" />
                {ready ? 'Ready' : `${qualityScore}%`}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1">
                <Sparkles className="h-3.5 w-3.5" />
                {formatCurrency(asset.cost)}
              </span>
            </div>
          </div>
          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <dt className="text-xs uppercase tracking-widest text-slate-400">Assigned to</dt>
                <dd className="text-base font-semibold text-slate-900">{asset.assignedTo || 'Unassigned'}</dd>
              </div>
              <div className="text-right text-xs text-slate-400">
                {statusLabel === 'Checked Out' ? `Checked out ${formatDate(asset.checkOutDate)}` : statusLabel}
              </div>
            </div>
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>{asset.location || 'Not set'}</span>
            </div>
            {!sharePointMode && (
              <div className="flex items-center gap-2 text-slate-600">
                <Tag className="h-4 w-4 text-slate-400" />
                <span>{asset.qrCode || 'Not generated'}</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-600">
              <CalendarClock className="h-4 w-4 text-slate-400" />
              <span>Purchased {formatDate(asset.purchaseDate)}</span>
              </div>
              <div className="text-slate-600">
                Warranty ends {formatDate(asset.warrantyExpiry)}
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">Intake readiness</span>
                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${ready ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {ready ? 'Ready' : approvalStatus}
                </span>
              </div>
              {qualityIssues.length === 0 ? (
                <p className="mt-2 text-slate-600">All critical fields captured. You can approve and deploy.</p>
              ) : (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600">
                  {qualityIssues.map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
              )}
            </div>
          </dl>
        </>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
          Select an asset from the table to view a friendly summary of ownership, warranty, and deployment details.
        </div>
      )}
    </div>
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

const AssetFormModal = ({ asset, onSubmit, onCancel, sharePointMode = false, suggestionListId }) => {
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
    if (qualityIssues.length && !window.confirm(`Missing: ${qualityIssues.join(', ')}. Save as pending?`)) {
      return;
    }
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
              <option value="Laptop">Laptop</option>
              <option value="Desktop">Desktop</option>
              <option value="Server">Server</option>
              <option value="Storage">Storage</option>
              <option value="Phone">Phone</option>
              <option value="Monitor">Monitor</option>
              <option value="Printer">Printer</option>
              <option value="Dock">Dock</option>
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
          {!sharePointMode && (
            <label className="text-sm font-medium text-slate-700">
              Brand
              <input
                value={form.brand}
                onChange={(event) => update('brand', event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          )}
          <label className="text-sm font-medium text-slate-700">
            Model
            <input
              value={form.model}
              onChange={(event) => update('model', event.target.value)}
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
            <input
              value={form.department}
              onChange={(event) => update('department', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Location
            <input
              value={form.location}
              onChange={(event) => update('location', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
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
          {!sharePointMode && (
            <>
              <label className="text-sm font-medium text-slate-700">
                Cost
                <input
                  type="number"
                  value={form.cost}
                  onChange={(event) => update('cost', Number(event.target.value))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
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
            </>
          )}
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

const CheckActionModal = ({ asset, mode, onSubmit, onCancel, suggestionListId }) => {
  const [form, setForm] = useState({
    user: asset?.assignedTo || '',
    notes: '',
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    setForm({
      user: asset?.assignedTo || '',
      notes: '',
      date: new Date().toISOString().slice(0, 10),
    });
  }, [asset, mode]);

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
          <p className="text-xs text-slate-500">{`${asset.brand} ${asset.model}`.trim()}</p>
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

const EmployeeFormModal = ({ employee, onSubmit, onCancel }) => {
  const [form, setForm] = useState(employee || defaultEmployeeProfile);
  const [photoPreview, setPhotoPreview] = useState(employee?.avatar || '');

  useEffect(() => {
    setForm(employee || defaultEmployeeProfile);
    setPhotoPreview(employee?.avatar || '');
  }, [employee]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPhotoPreview(objectUrl);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
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
    onSubmit({ ...form, name: trimmedName, avatar: photoPreview, lookupKey });
  };

  return (
    <ModalShell title={form?.id ? 'Edit employee' : 'New employee'} onClose={onCancel}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Full name
            <input
              value={form.name}
              onChange={(event) => update('name', event.target.value)}
              placeholder="e.g., Jamie Rivera"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Role or title
            <input
              value={form.title}
              onChange={(event) => update('title', event.target.value)}
              placeholder="Service Coordinator"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Department
            <input
              value={form.department}
              onChange={(event) => update('department', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Location
            <input
              value={form.location}
              onChange={(event) => update('location', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
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
            Phone
            <input
              value={form.phone}
              onChange={(event) => update('phone', event.target.value)}
              placeholder="(717) 555-1212"
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
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                Upload photo
              </label>
              {photoPreview && (
                <button
                  type="button"
                  onClick={() => setPhotoPreview('')}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-500"
                >
                  Remove photo
                </button>
              )}
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
          <button type="submit" className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
            {form?.id ? 'Save changes' : 'Add employee'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};
const WarrantyAlertModal = ({ alerts = [], onClose }) => (
  <ModalShell title="Warranty alerts" onClose={onClose}>
    {alerts.length === 0 ? (
      <p className="text-sm text-slate-500">All tracked hardware is within its warranty window.</p>
    ) : (
      <div className="max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-100">
        <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Asset</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Warranty ends</th>
              <th className="px-4 py-3">Status</th>
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
                  <td className="px-4 py-3 align-top">{alert.warrantyExpiry ? formatDate(alert.warrantyExpiry) : 'â€”'}</td>
                  <td className="px-4 py-3 align-top">
                    <span className={`text-sm font-semibold ${alert.overdue ? 'text-rose-600' : 'text-amber-600'}`}>{statusLabel}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )}
  </ModalShell>
);

const App = () => {
  const [assets, setAssets] = usePersistentState(STORAGE_KEYS.assets, BASE_ASSETS);
  const [history, setHistory] = usePersistentState(STORAGE_KEYS.history, BASE_HISTORY);
  const [softwareSuites, setSoftwareSuites] = usePersistentState(STORAGE_KEYS.licenses, BASE_LICENSES);
  const [activePage, setActivePage] = useState('Overview');
  const [reminderPrefs, setReminderPrefs] = useState({ email: true, zoom: true });
  const [softwareForm, setSoftwareForm] = useState(null);
  const [warrantyModalOpen, setWarrantyModalOpen] = useState(false);
  const [laptopRefreshDate, setLaptopRefreshDate] = useState(() => new Date().toISOString().slice(0, 10));
  const sentWarrantyAlertRef = useRef(new Set());
  const [sharePointError, setSharePointError] = useState(null);
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
        const updatedAsset = { ...statusAdjusted, cost: refreshedCost };
        const canonicalName = getCanonicalAssetName(updatedAsset, canonicalMap);
        if (canonicalName && canonicalName !== updatedAsset.assetName) {
          return {
            ...updatedAsset,
            assetName: canonicalName,
            deviceName: canonicalName,
            sheetId: updatedAsset.sheetId || canonicalName,
          };
        }
        return updatedAsset;
      });
      return changed ? normalized : prev;
    });
  }, [setAssets]);

  const licenseBuckets = useMemo(() => softwareSuites, [softwareSuites]);
  const maintenanceRecords = useMemo(() => buildMaintenanceFromAssets(assets), [assets]);
  const sheetInsights = useMemo(() => computeSheetInsights(assets), [assets]);
  const vendorProfiles = useMemo(() => buildVendorProfiles(assets), [assets]);
  const networkPrinters = useMemo(() => NETWORK_PRINTERS, []);
  const printerVendors = useMemo(
    () =>
      Object.values(PRINTER_VENDOR_DIRECTORY).map((vendor) => {
        const devices = NETWORK_PRINTERS.filter((printer) => printer.vendor === vendor.id);
        return { ...vendor, deviceCount: devices.length, devices };
      }),
    [],
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
    return [
      ...brandEntries,
      { title: 'Verizon lines', count: verizonCount, note: 'Active smartphones' },
    ];
  }, [vendorProfiles]);
  const teamSpotlight = useMemo(() => BASE_TEAM, []);
  const [employeeGallery, setEmployeeGallery] = useState(() => BASE_EMPLOYEE_GALLERY);
  const sharePointEnabled = SHAREPOINT_CONFIG.enabled;
  const sharePointAssetList = SHAREPOINT_CONFIG.assetListTitle;
  const sharePointEmployeeList = SHAREPOINT_CONFIG.employeeListTitle;
  const shouldFetchAssets = sharePointEnabled && Boolean(sharePointAssetList);
  const shouldFetchEmployees = sharePointEnabled && Boolean(sharePointEmployeeList);

  useEffect(() => {
    if (!shouldFetchAssets && !shouldFetchEmployees) {
      setSharePointError(null);
      return undefined;
    }
    let mounted = true;
    setSharePointError(null);
    const loadLists = async () => {
      try {
        const [assetRows, employeeRows] = await Promise.all([
          shouldFetchAssets ? fetchSharePointListItems(sharePointAssetList) : Promise.resolve(null),
          shouldFetchEmployees ? fetchSharePointListItems(sharePointEmployeeList) : Promise.resolve(null),
        ]);
        if (!mounted) {
          return;
        }
        if (employeeRows) {
          setEmployeeGallery((employeeRows || []).map(mapSharePointEmployeeRow));
        }
        if (assetRows) {
          const updatedAssets = (assetRows || []).map(mapSharePointAssetRow);
          setAssets(updatedAssets);
        }
        setSharePointError(null);
      } catch (error) {
        if (!mounted) {
          return;
        }
        console.error('SharePoint synchronization failed', error);
        setSharePointError(error?.message || 'SharePoint sync failed');
      }
    };
    loadLists();
    return () => {
      mounted = false;
    };
  }, [
    shouldFetchAssets,
    shouldFetchEmployees,
    sharePointAssetList,
    sharePointEmployeeList,
    setAssets,
    setEmployeeGallery,
    setSharePointError,
  ]);
  const employeeDepartmentCount = useMemo(() => new Set(employeeGallery.map((member) => member.department)).size, [employeeGallery]);
  const lifecycleReminders = useMemo(() => computeLifecycleReminders(assets), [assets]);
  const reminderPreview = useMemo(() => lifecycleReminders.slice(0, 6), [lifecycleReminders]);
  const warrantyReminders = useMemo(
    () => lifecycleReminders.filter((item) => item.type === 'Warranty'),
    [lifecycleReminders],
  );
  const warrantyAlerts30 = useMemo(
    () => warrantyReminders.filter((item) => !item.overdue && item.daysRemaining >= 0 && item.daysRemaining <= 30),
    [warrantyReminders],
  );
  const maintenanceWorkOrders = useMemo(() => buildMaintenanceWorkOrders(assets), [assets]);
  const laptopServiceSummary = useMemo(
    () => computeLaptopServiceSummary(assets, maintenanceWorkOrders),
    [assets, maintenanceWorkOrders],
  );
  const laptopRefreshReport = useMemo(
    () => computeLaptopRefreshReport(assets, laptopRefreshDate),
    [assets, laptopRefreshDate],
  );
  const licenseCompliance = useMemo(
    () =>
      licenseBuckets.map((license) => {
        const { delta, status } = getLicenseHealth(license.seats, license.used);
        return { ...license, delta, status };
      }),
    [licenseBuckets],
  );
  const softwareAtRisk = useMemo(
    () => licenseCompliance.filter((item) => item.status !== 'Healthy'),
    [licenseCompliance],
  );
  const softwareVendorCount = useMemo(
    () => new Set(licenseBuckets.map((license) => license.vendor)).size,
    [licenseBuckets],
  );
  const suitesWithLogos = useMemo(() => licenseBuckets.filter((suite) => suite.logo), [licenseBuckets]);
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
  const inventoryHealth = useMemo(() => computeInventoryHealth(assets, history), [assets, history]);
  const auditRuns = useMemo(() => buildAuditRuns(assets, sheetInsights), [assets, sheetInsights]);
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
        title: 'Compute fleet',
        stats: [{ label: formatLabel(counts.Computer || 0, 'computer'), type: 'Computer' }],
        description: 'Live pull from the Asset List workbook keeps your laptops and desktops current.',
        image: MEDIA.devices.computer,
        meta: 'Hardware pulse',
      },
      {
        title: 'Display grid',
        stats: [{ label: formatLabel(counts.Monitor || 0, 'display'), type: 'Monitor' }],
        description: 'Conference rooms and hoteling desks stay paired with procurement.',
        image: MEDIA.devices.monitor,
        meta: 'Peripherals',
      },
      {
        title: 'Dock inventory',
        stats: [{ label: formatLabel(counts.Dock || 0, 'dock'), type: 'Dock' }],
        description: 'Hoteling docks keep travelers connected and are tracked from the Asset List.',
        image: MEDIA.devices.dock,
        meta: 'Workspace',
      },
      {
        title: 'Print backbone',
        stats: [{ label: formatLabel(counts.Printer || 0, 'printer'), type: 'Printer' }],
        description: 'Brother + HP devices mirrored from the Asset List for compliance.',
        image: MEDIA.devices.printer,
        meta: 'Facilities',
      },
      {
        title: 'Mobile fleet',
        stats: [{ label: formatLabel(counts.Phone || 0, 'phone'), type: 'Phone' }],
        description: 'Phones and tablets stay aligned with the source workbook and naming conventions.',
        image: MEDIA.devices.phone,
        meta: 'Mobility',
      },
      {
        title: 'Access control',
        stats: [{ label: formatLabel(counts['Key Fob'] || 0, 'key fob'), type: 'Key Fob' }],
        description: 'Badge + door fob inventory lives beside the rest of the Asset List.',
        image: MEDIA.devices.keyfob,
        meta: 'Security',
      },
    ];
  }, [sheetInsights]);

  const [filters, setFilters] = useState({ search: '', type: 'all', status: 'all' });
  const [assetPage, setAssetPage] = useState(1);
  const [assetForm, setAssetForm] = useState(null);
  const [actionState, setActionState] = useState(null);
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [employeePage, setEmployeePage] = useState(1);
  const [employeeForm, setEmployeeForm] = useState(null);
  const [expandedEmployeeId, setExpandedEmployeeId] = useState(null);
  const [mobileAuditMode, setMobileAuditMode] = useState(false);
  const employeeSuggestionListId = 'employee-name-suggestions';

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
  const employeeNames = useMemo(
    () =>
      Array.from(new Set(employeeGallery.map((member) => member.name).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [employeeGallery],
  );

  const filteredAssets = useMemo(() => {
    const query = filters.search.toLowerCase();

    let result = assets.filter((asset) => {
      const statusLabel = getAssetDisplayStatus(asset);
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

    if (mobileAuditMode) {
      result = result.filter((asset) => {
        const qualityIssues = assetQualityMap[asset.id]?.issues?.length || 0;
        const soonWarranty =
          asset.warrantyExpiry &&
          (() => {
            const diff = new Date(asset.warrantyExpiry) - new Date();
            return diff >= 0 && diff / (1000 * 60 * 60 * 24) <= 60;
          })();
        return qualityIssues > 0 || soonWarranty;
      });
    }

    return result;
  }, [assetQualityMap, assets, filters, mobileAuditMode]);
  const ASSET_PAGE_SIZE = 15;
  const totalAssetPages = Math.max(1, Math.ceil(filteredAssets.length / ASSET_PAGE_SIZE));
  useEffect(() => {
    setAssetPage(1);
  }, [filters.search, filters.type, filters.status]);
  useEffect(() => {
    if (assetPage > totalAssetPages) {
      setAssetPage(totalAssetPages);
    }
  }, [assetPage, totalAssetPages]);
  const pagedAssets = useMemo(
    () => filteredAssets.slice((assetPage - 1) * ASSET_PAGE_SIZE, assetPage * ASSET_PAGE_SIZE),
    [filteredAssets, assetPage],
  );

  const EMPLOYEE_PAGE_SIZE = 36;
  const filteredEmployees = useMemo(
    () =>
      employeeGallery.filter((member) => {
        const query = employeeSearch.toLowerCase();
        return (
          !query ||
          member.name.toLowerCase().includes(query) ||
          member.department.toLowerCase().includes(query) ||
          member.title.toLowerCase().includes(query)
        );
      }),
    [employeeGallery, employeeSearch],
  );
  const totalEmployeePages = Math.max(1, Math.ceil(filteredEmployees.length / EMPLOYEE_PAGE_SIZE));
  useEffect(() => {
    if (employeePage > totalEmployeePages) {
      setEmployeePage(totalEmployeePages);
    }
  }, [employeePage, totalEmployeePages]);
  const displayedEmployees = useMemo(
    () => filteredEmployees.slice((employeePage - 1) * EMPLOYEE_PAGE_SIZE, employeePage * EMPLOYEE_PAGE_SIZE),
    [filteredEmployees, employeePage],
  );
  const employeeAssignments = useMemo(() => {
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
  }, [assets]);
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
    if (filteredAssets.length === 0) {
      setSelectedAssetId(null);
      return;
    }
    if (!filteredAssets.some((asset) => asset.id === selectedAssetId)) {
      setSelectedAssetId(filteredAssets[0].id);
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

  const selectedAsset = useMemo(
    () => assets.find((asset) => asset.id === selectedAssetId) || null,
    [assets, selectedAssetId],
  );

  const recentMaintenance = useMemo(
    () =>
      maintenanceRecords
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 4),
    [maintenanceRecords],
  );

  const recentHistory = useMemo(
    () =>
      history
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5),
    [history],
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
  const handleToggleReminder = (channel) => {
    setReminderPrefs((prev) => ({ ...prev, [channel]: !prev[channel] }));
  };
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
  const handleStartAudit = useCallback(() => {
    setActivePage('Hardware');
    setFilters((prev) => ({ ...prev, status: 'all' }));
    setMobileAuditMode(true);
    if (!isBrowser) {
      return;
    }
    const section = document.getElementById('asset-table');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [setFilters]);
  const handleToggleMobileAudit = useCallback(() => {
    setMobileAuditMode((prev) => !prev);
    setActivePage('Hardware');
  }, []);
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
    setFilters({ search: '', type: type || 'all', status: 'all' });
    if (!isBrowser) {
      return;
    }
    const section = document.getElementById('asset-table');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleRowSelect = (asset) => {
    setSelectedAssetId(asset.id);
  };

  const handleSaveAsset = async (payload) => {
    const estimatedCost = estimateCost(payload.type, payload.model, payload.brand);
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
      assetName: normalizedAssetName,
      deviceName: normalizedDeviceName,
      id: sharePointEnabled ? payload.id ?? null : payload.id ?? Date.now(),
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

    if (sharePointEnabled) {
      try {
        const payloadForSharePoint = buildSharePointAssetPayload(enrichedPayload);
        const hasSharePointId = Number.isFinite(Number(enrichedPayload.id));
        const response = hasSharePointId
          ? await updateSharePointListItem(sharePointAssetList, enrichedPayload.id, payloadForSharePoint)
          : await createSharePointListItem(sharePointAssetList, payloadForSharePoint);
        const mergedAsset =
          response && typeof response === 'object'
            ? mapSharePointAssetRow(response)
            : { ...enrichedPayload, id: hasSharePointId ? enrichedPayload.id : Date.now() };
        upsertLocalAsset(mergedAsset);
        setSharePointError(null);
        setAssetForm(null);
        return;
      } catch (error) {
        console.error('SharePoint asset sync failed', error);
        setSharePointError(error?.message || 'SharePoint sync failed');
        return;
      }
    }

    upsertLocalAsset(enrichedPayload);
    setAssetForm(null);
  };

  const handleDeleteAsset = async (asset) => {
    if (!window.confirm(`Delete ${asset.assetName || `${asset.brand} ${asset.model}`}?`)) {
      return;
    }
    if (sharePointEnabled && asset?.id) {
      try {
        await deleteSharePointListItem(sharePointAssetList, asset.id);
        setAssets((prev) => prev.filter((item) => item.id !== asset.id));
        setSharePointError(null);
        return;
      } catch (error) {
        console.error('SharePoint delete failed', error);
        setSharePointError(error?.message || 'SharePoint delete failed');
        return;
      }
    }
    setAssets((prev) => prev.filter((item) => item.id !== asset.id));
  };

  const handleSaveEmployee = async (profile) => {
    if (!profile || !profile.name) {
      setEmployeeForm(null);
      return;
    }
    const trimmedName = profile.name.trim();
    const baseId = profile.id ?? (sharePointEnabled ? null : `emp-${Date.now()}`);
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

    if (sharePointEnabled) {
      try {
        const payloadForSharePoint = buildSharePointEmployeePayload(payload);
        const hasSharePointId = Boolean(payload.id);
        const response = hasSharePointId
          ? await updateSharePointListItem(sharePointEmployeeList, payload.id, payloadForSharePoint)
          : await createSharePointListItem(sharePointEmployeeList, payloadForSharePoint);
        const merged =
          response && typeof response === 'object'
            ? mapSharePointEmployeeRow(response)
            : { ...payload, id: payload.id || `emp-${Date.now()}` };
        upsertLocalEmployee(merged);
        setSharePointError(null);
        setEmployeeForm(null);
        setExpandedEmployeeId(merged.id);
        return;
      } catch (error) {
        console.error('SharePoint employee sync failed', error);
        setSharePointError(error?.message || 'SharePoint sync failed');
        return;
      }
    }

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
    if (sharePointEnabled && member?.id) {
      try {
        await deleteSharePointListItem(sharePointEmployeeList, member.id);
        setEmployeeGallery((prev) => prev.filter((item) => item.id !== member.id));
        setExpandedEmployeeId((prev) => (prev === member.id ? null : prev));
        setSharePointError(null);
        return;
      } catch (error) {
        console.error('SharePoint employee delete failed', error);
        setSharePointError(error?.message || 'SharePoint delete failed');
        return;
      }
    }
    setEmployeeGallery((prev) => prev.filter((item) => item.id !== member.id));
    setExpandedEmployeeId((prev) => (prev === member.id ? null : prev));
  };

  const handleActionSubmit = async ({ assetId, mode, user, notes, date }) => {
    let updatedAsset = null;
    setAssets((prev) =>
      prev.map((asset) => {
        if (asset.id !== assetId) {
          return asset;
        }
        if (mode === 'checkout') {
          const nextStatus = asset.status === 'Maintenance' || asset.status === 'Retired' ? asset.status : 'Checked Out';
          const normalized = normalizeAssetStatus({
            ...asset,
            assignedTo: user,
            status: nextStatus,
            checkedOut: true,
            checkOutDate: date,
          });
          updatedAsset = normalized;
          return normalized;
        }
        const resetStatus = asset.status === 'Maintenance' || asset.status === 'Retired' ? asset.status : 'Available';
        const normalized = normalizeAssetStatus({
          ...asset,
          assignedTo: '',
          status: resetStatus,
          checkedOut: false,
          checkOutDate: '',
        });
        updatedAsset = normalized;
        return normalized;
      }),
    );

    setHistory((prev) => [
      ...prev,
      {
        id: Date.now(),
        assetId,
        action: mode === 'checkout' ? 'Check Out' : 'Check In',
        user,
        notes,
        date,
      },
    ]);

    if (sharePointEnabled && updatedAsset?.id) {
      try {
        await updateSharePointListItem(sharePointAssetList, updatedAsset.id, buildSharePointAssetPayload(updatedAsset));
        setSharePointError(null);
      } catch (error) {
        console.error('SharePoint update failed', error);
        setSharePointError(error?.message || 'SharePoint sync failed');
      }
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

  const handleOpenHelpDeskPortal = useCallback(() => {
    if (!isBrowser) {
      return;
    }
    window.open(HELP_DESK_PORTAL_URL, '_blank', 'noopener,noreferrer');
  }, []);

  const vendorQuickActions = useMemo(
    () => [
      {
        title: 'Brother toner replenishment',
        description: 'Email Sara Smoker with the device ID and site to dispatch Brother toner or drums.',
        icon: Printer,
        actionLabel: 'Email Sara',
        onAction: () => {
          if (!isBrowser) {
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
          if (!isBrowser) {
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
          if (!isBrowser) {
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
          if (!isBrowser) {
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
      title: 'Start mobile audit',
      description: 'Walk a site with your phone, scan QR codes, and reconcile owners.',
      icon: Smartphone,
      actionLabel: 'Open audit table',
      onAction: handleStartAudit,
    },
    {
      title: 'Plan monthly audit',
      description: 'Queue locations, warranty expirations, and high-value devices.',
      icon: ClipboardCheck,
      actionLabel: 'Build run list',
      onAction: handleStartAudit,
    },
    {
      title: 'Share executive snapshot',
      description: 'Export JSON for finance, compliance, or reporting workflows.',
      icon: Share2,
      actionLabel: 'Export data',
      onAction: handleExport,
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
        const details = `${reminder.assetName || 'Device'} • ${reminder.location || 'Location TBD'} • Owner: ${
          reminder.assignedTo || 'Unassigned'
        } • Expires ${formatDate(reminder.warrantyExpiry)}`;
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
    ],
    [dueSoonAlerts.length, laptopServiceSummary.loanerAvailableCount, laptopServiceSummary.loanerTotal, overdueAlerts.length],
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
    ],
    [costByDepartment, laptopRefreshReport, laptopServiceSummary, licenseCompliance, lifecycleReminders],
  );

  const getAssetName = (id) => {
    const asset = assets.find((item) => item.id === id);
    return asset ? asset.assetName : 'Unknown asset';
  };
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 pb-16">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PrimaryNav onAdd={() => setAssetForm(defaultAsset)} onExport={handleExport} activePage={activePage} onNavigate={setActivePage} />
        <datalist id={employeeSuggestionListId}>
          {employeeNames.map((name) => (
            <option key={`employee-suggestion-${name}`} value={name} />
          ))}
        </datalist>
        {sharePointError && (
          <div className="mb-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            SharePoint sync failed: {sharePointError}
          </div>
        )}

        {activePage === 'Overview' && (
          <>
        <section className="mb-8 grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-lg">
            <img src={MEDIA.hero} alt="UDS operations" className="absolute inset-0 h-full w-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-blue-900/70" />
            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.3rem] text-white/60">Asset command center</p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight">One command center for every asset lifecycle</h1>
              <p className="mt-3 text-sm text-white/70">
                Monitor procurement, deployment, and renewals from a single, human-friendly surface. Everything updates in real time so you can make confident decisions.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Compliance ready
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1">
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                  Live audit logs
                </span>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => setAssetForm(defaultAsset)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
                >
                  <Plus className="h-4 w-4" />
                  Add hardware
                </button>
                <button
                  onClick={handleExport}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <Share2 className="h-4 w-4" />
                  Share snapshot
                </button>
                <button
                  type="button"
                  onClick={handleOpenHelpDeskPortal}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-white/20"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  Open HelpDesk Portal
                </button>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/50">Assets tracked</p>
                  <p className="mt-1 text-2xl font-semibold">{stats.total}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/50">Inventory value</p>
                  <p className="mt-1 text-2xl font-semibold">{formatCurrency(stats.totalValue)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/50">Warranty alerts</p>
                  <p className="mt-1 text-2xl font-semibold">{stats.expiringSoon}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-900/60 bg-slate-900 p-6 text-white shadow-inner">
            <p className="text-xs font-semibold uppercase tracking-[0.3rem] text-white/60">Fleet health</p>
            <p className="mt-3 text-4xl font-semibold">{utilization}%</p>
            <p className="text-sm text-white/70">Checked out utilisation</p>
            <div className="mt-4 h-2 w-full rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-teal-300"
                style={{ width: `${utilization}%` }}
              />
            </div>
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Active hardware</span>
                <span className="font-semibold">{stats.available} available</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Checked out</span>
                <span className="font-semibold">{stats.checkedOut} devices</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">License usage</span>
                <span className="font-semibold">{licenseInsights.percent}% of {licenseInsights.seats} seats</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-6">
          <SnapshotMetricsRow metrics={snapshotMetrics} />
        </section>

        {warrantyAlerts30.length > 0 && (
          <section className="mb-8">
            <WarrantyAlertStrip alerts={warrantyAlerts30} onViewAll={() => setWarrantyModalOpen(true)} />
          </section>
        )}

        <section className="mb-8 grid gap-4 lg:grid-cols-[1.5fr,1fr]">
          <LifecycleReminderBoard
            reminders={reminderPreview}
            preferences={reminderPrefs}
            onToggle={handleToggleReminder}
            onViewAllWarranty={() => setWarrantyModalOpen(true)}
            warrantyCount={warrantyReminders.length}
          />
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {quickActions.map((action) => (
              <QuickActionCard key={action.title} {...action} />
            ))}
          </div>
          <WhatsNewCard />
        </section>

        <section className="mb-8 grid gap-6 xl:grid-cols-[1.6fr,1fr]">
          <InventoryHealthPanel health={inventoryHealth} onStartAudit={handleStartAudit} />
          <AuditRunBoard runs={auditRuns} onStartAudit={handleStartAudit} />
        </section>

        <section className="mb-10">
          <MobileAuditCard inventoryHealth={inventoryHealth} onStartAudit={handleStartAudit} />
        </section>
          </>
        )}

        {activePage === 'Hardware' && (
          <>
            <section className="mb-8 rounded-3xl border border-slate-900/60 bg-slate-900 p-8 text-white shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.35rem] text-white/60">Hardware</p>
              <h2 className="mt-3 text-3xl font-semibold">Full-fidelity device management</h2>
              <p className="mt-2 text-sm text-white/70">Real-time visibility into every laptop, display, dock, and printer with proactive lifecycle tracking.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/50">Total inventory</p>
                  <p className="mt-1 text-2xl font-semibold">{stats.total}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/50">Checked out</p>
                  <p className="mt-1 text-2xl font-semibold">{stats.checkedOut}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/50">Available</p>
                  <p className="mt-1 text-2xl font-semibold">{stats.available}</p>
                </div>
              </div>
              </section>

            {mobileAuditMode && (
              <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-sm text-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">Mobile audit mode</p>
                    <p className="text-xs text-slate-600">Showing devices needing attention or nearing warranty. Scan and update owners/locations in the table below.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFilters({ search: '', type: 'all', status: 'all' })}
                      className="rounded-2xl border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:border-blue-300"
                    >
                      Reset filters
                    </button>
                    <button
                      type="button"
                      onClick={handleToggleMobileAudit}
                      className="rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300"
                    >
                      Exit mobile mode
                    </button>
                  </div>
                </div>
              </div>
            )}

            {warrantyAlerts30.length > 0 && (
              <section className="mb-8">
                <WarrantyAlertStrip alerts={warrantyAlerts30} onViewAll={() => setWarrantyModalOpen(true)} />
              </section>
            )}

            <section className="mb-8 grid gap-4 md:grid-cols-3">
              {hardwareSpotlights.map((item) => (
                <DeviceSpotlightCard key={`hardware-${item.title}`} {...item} onStatClick={handleSpotlightFilter} />
              ))}
            </section>

            <section className="mb-8">
              <LaptopRepairCard
                data={laptopServiceSummary}
                onLoanerCheckout={handleLoanerCheckout}
                onLoanerCheckin={handleLoanerCheckin}
              />
            </section>

            <section className="mb-8 grid gap-6 xl:grid-cols-[1.6fr,1fr]">
              <InventoryHealthPanel health={inventoryHealth} onStartAudit={handleStartAudit} />
              <AuditRunBoard runs={auditRuns} onStartAudit={handleStartAudit} />
            </section>

            <section id="asset-table" className="mb-10 grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-4">
                <AssetFilters
                  filters={filters}
                  onChange={handleFilterChange}
                  onReset={() => setFilters({ search: '', type: 'all', status: 'all' })}
                  types={typeOptions}
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setAssetForm(defaultAsset)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
                  >
                    <Plus className="h-4 w-4" />
                    New asset
                  </button>
                </div>
                <div className="space-y-3">
                  <AssetTable
                    assets={pagedAssets}
                    onEdit={setAssetForm}
                    onDelete={handleDeleteAsset}
                    onAction={(asset, mode) => setActionState({ asset, mode })}
                    onSelect={handleRowSelect}
                    selectedId={selectedAssetId}
                    sharePointMode={sharePointEnabled}
                    qualityLookup={assetQualityMap}
                  />
                  <div className="flex items-center justify-end rounded-2xl border border-slate-100 bg-white/70 px-4 py-3">
                    <PaginationControls align="end" page={assetPage} totalPages={totalAssetPages} onPageChange={setAssetPage} />
                  </div>
                </div>
              </div>
              <AssetSpotlight asset={selectedAsset} onEdit={setAssetForm} sharePointMode={sharePointEnabled} onApproveIntake={handleApproveIntake} />
            </section>

            <section className="mb-10">
              <LicenseUsage licenses={licenseBuckets} />
            </section>

            <section className="mb-10 grid gap-6 xl:grid-cols-[1.6fr,1fr]">
              <NetworkPrinterBoard printers={networkPrinters} />
              <PrinterVendorSummary
                vendors={printerVendors}
                title="Printer & copier partners"
                subtitle="Colony supports every Canon copier; Weaver services HP, Lexmark, and Epson fleets."
              />
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <MaintenanceList records={recentMaintenance} getAssetName={getAssetName} />
              <ActivityPanel history={recentHistory} lookupAsset={getAssetName} />
            </section>
          </>
        )}

        {activePage === 'Employees' && (
          <>
            <section className="mb-8 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.35rem] text-slate-400">Employees</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">The faces powering UDS technology</h2>
              <p className="mt-2 text-sm text-slate-600">
                Browse featured team members, their departments, and contact info to keep deployments aligned with your workforce.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">Featured teammates</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{employeeGallery.length}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">Remote workforce</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{sheetInsights.remoteShare}%</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">Departments</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{employeeDepartmentCount}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <input
                  value={employeeSearch}
                  onChange={(event) => {
                    setEmployeeSearch(event.target.value);
                    setEmployeePage(1);
                  }}
                  placeholder="Search the employee directory"
                  className="w-full flex-1 rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setEmployeeForm({ ...defaultEmployeeProfile })}
                  className="rounded-2xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
                >
                  Add employee
                </button>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.7fr,1fr]">
              <div className="space-y-4">
                <EmployeeDirectoryGrid
                  members={displayedEmployees}
                  totalCount={filteredEmployees.length}
                  expandedId={expandedEmployeeId}
                  onToggle={handleEmployeeCardToggle}
                  getAssignments={getEmployeeAssignments}
                  onEdit={(member) => setEmployeeForm({ ...member })}
                  onDelete={handleDeleteEmployee}
                />
                <div className="rounded-2xl border border-slate-100 bg-white/70 px-4 py-3">
                  <PaginationControls align="center" page={employeePage} totalPages={totalEmployeePages} onPageChange={setEmployeePage} />
                </div>
              </div>
              <TeamSpotlightPanel team={teamSpotlight} remoteShare={sheetInsights.remoteShare} downloadHref={EXCEL_EXPORTS.employees} />
            </section>
          </>
        )}

        {activePage === 'Reports' && (
          <>
            <section className="mb-8 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.35rem] text-slate-400">Reports</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Insights, forecasts, and exports</h2>
              <p className="mt-2 text-sm text-slate-600">
                Benchmark hardware performance, anticipate spend, and share ready-to-run reports with stakeholders.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">Aging fleet</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.expiringSoon} devices</p>
                  <p className="text-xs text-slate-500">Require attention in 90 days</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">Top spend</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    {costByDepartment[0] ? formatCurrency(costByDepartment[0].value) : '$0'}
                  </p>
                  <p className="text-xs text-slate-500">{costByDepartment[0]?.name || 'No data'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">License compliance</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    {licenseCompliance.filter((item) => item.status !== 'Healthy').length} risks
                  </p>
                  <p className="text-xs text-slate-500">Overused or at capacity suites</p>
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
                <LoanerCoverageReport
                  data={laptopServiceSummary}
                  onExport={() =>
                    handleRunReport('Loaner coverage', {
                      summary: laptopServiceSummary,
                    })
                  }
                />
              </div>
            </section>

            <section className="mb-8 grid gap-6 xl:grid-cols-3">
              <div className="space-y-4 xl:col-span-2">
                <AnalyticsInsightsPanel costData={costByDepartment} depreciation={depreciationTrend} />
                <DepreciationForecastTable forecast={depreciationForecast} />
              </div>
              <LicenseCompliancePanel data={licenseCompliance} />
            </section>

\n
            <section className="mb-8 grid gap-6 lg:grid-cols-[2fr,1fr]">
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
              <MaintenanceWorkflowBoard workOrders={maintenanceWorkOrders} />
            </section>
          </>
        )}

        {activePage === 'Vendors' && (
          <>
            <section className="mb-8 overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 text-white shadow-2xl">
              <div className="grid gap-8 lg:grid-cols-[1.5fr,1fr]">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-white/60">Vendor galaxy</p>
                  <h2 className="mt-4 text-4xl font-semibold leading-tight">
                    Bold partnerships powering laptops, networks, and carrier logistics.
                  </h2>
                  <p className="mt-3 text-sm text-white/80">
                    Showcase vendor accountability with live device counts, SLAs, and lightning-fast contacts from a single pane.
                  </p>
                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white/10 p-4 text-center">
                      <p className="text-xs uppercase tracking-widest text-white/70">Vendors engaged</p>
                      <p className="mt-2 text-3xl font-semibold">{vendorProfiles.length}</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4 text-center">
                      <p className="text-xs uppercase tracking-widest text-white/70">Devices covered</p>
                      <p className="mt-2 text-3xl font-semibold">{vendorTotals.devices}</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4 text-center">
                      <p className="text-xs uppercase tracking-widest text-white/70">Active today</p>
                      <p className="mt-2 text-3xl font-semibold text-emerald-300">{vendorTotals.active}</p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {vendorProfiles.slice(0, 4).map((vendor) => (
                    <a
                      key={`vendor-mosaic-${vendor.id}`}
                      className="relative block h-32 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-200"
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
                      <img src={vendor.image} alt={`${vendor.name} collage`} className="h-full w-full object-cover opacity-80" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/70 via-transparent to-slate-900/40" />
                      <div className="absolute bottom-3 left-3">
                        <p className="text-xs uppercase tracking-widest text-white/70">{vendor.coverage?.[0] || 'Coverage'}</p>
                        <p className="text-lg font-semibold">{vendor.name}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </section>

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

            <section className="mb-8 grid gap-6 lg:grid-cols-[1.6fr,1fr]">
              <NetworkPrinterBoard printers={networkPrinters} limit={8} title="Network printer routing" subtitle="SharePoint table snapshot powering vendor escalations." />
              <PrinterVendorSummary
                vendors={printerVendors}
                title="Service partner breakdown"
                subtitle="Canon copiers sync to Colony; HP, Lexmark, and Epson route to Weaver."
              />
            </section>

            <section className="grid gap-6 md:grid-cols-2">
              {vendorProfiles.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </section>
          </>
        )}

        {activePage === 'Software' && (
          <>
            <section className="mb-8 grid gap-6 lg:grid-cols-[1.6fr,1fr]">
              <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35rem] text-slate-400">Software</p>
                    <h2 className="mt-3 text-3xl font-semibold text-slate-900">Licensing + SaaS operations</h2>
                    <p className="mt-2 text-sm text-slate-600">
                      Centralize entitlement tracking for Microsoft 365, Adobe, AutoCAD, Cisco Secure Client, Barracuda, Citrix, Zoom, and more without
                      tying usage to hardware guesses.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSoftwareForm({ ...defaultSoftwareSuite })}
                    className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
                  >
                    <Plus className="h-4 w-4" />
                    Add software
                  </button>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">Suites tracked</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{licenseBuckets.length}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">Active seats</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{licenseInsights.used}</p>
                    <p className="text-xs text-slate-500">{licenseInsights.seats} total licensed</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">Vendor ecosystems</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{softwareVendorCount}</p>
                    <p className="text-xs text-slate-500">{softwareAtRisk.length} suites watched</p>
                  </div>
                </div>
                {suitesWithLogos.length > 0 && (
                  <div className="mt-8 rounded-2xl border border-slate-100/80 bg-slate-50/80 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">Stack highlights</p>
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      {suitesWithLogos.map((suite) => (
                        <div
                          key={`logo-${suite.id}`}
                          className="group relative flex h-14 w-28 items-center justify-center rounded-2xl bg-white/90 shadow-inner ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:ring-blue-200"
                        >
                          <img
                            src={suite.logo}
                            alt={`${suite.software} logo`}
                            className="h-8 w-auto object-contain opacity-80 transition group-hover:opacity-100 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="rounded-3xl border border-amber-100 bg-amber-50/70 p-6 text-amber-900">
                <p className="text-xs font-semibold uppercase tracking-[0.35rem] text-amber-900/70">Compliance alerts</p>
                {softwareAtRisk.length === 0 && (
                  <p className="mt-4 text-sm">
                    All suites are within their licensed capacity. Review renewals below to keep coverage aligned with demand.
                  </p>
                )}
                {softwareAtRisk.length > 0 && (
                  <ul className="mt-4 space-y-3">
                    {softwareAtRisk.map((suite) => (
                      <li key={suite.id} className="rounded-2xl bg-white/70 p-4 text-sm text-slate-900">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold">{suite.software}</p>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              suite.status === 'Overused' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {suite.status}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          {suite.used} used / {suite.seats} seats Â· {suite.delta < 0 ? `${Math.abs(suite.delta)} over capacity` : `${suite.delta} seats free`}
                        </p>
                        {suite.expiryDate && <p className="text-xs text-slate-500">Renewal: {suite.expiryDate}</p>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            <section className="mb-8 grid gap-6 lg:grid-cols-2">
              <LicenseUsage licenses={licenseBuckets} />
              <LicenseCompliancePanel data={licenseCompliance} />
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              {licenseBuckets.map((suite) => (
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

      {assetForm && (
        <AssetFormModal
          asset={assetForm}
          onSubmit={handleSaveAsset}
          onCancel={() => setAssetForm(null)}
          sharePointMode={sharePointEnabled}
          suggestionListId={employeeSuggestionListId}
        />
      )}
      {employeeForm && (
        <EmployeeFormModal employee={employeeForm} onSubmit={handleSaveEmployee} onCancel={() => setEmployeeForm(null)} />
      )}
      {actionState && (
        <CheckActionModal
          asset={actionState.asset}
          mode={actionState.mode}
          onSubmit={handleActionSubmit}
          onCancel={() => setActionState(null)}
          suggestionListId={employeeSuggestionListId}
        />
      )}
      {softwareForm && <SoftwareFormModal suite={softwareForm} onSubmit={handleSaveSoftware} onCancel={() => setSoftwareForm(null)} />}
      {warrantyModalOpen && (
        <WarrantyAlertModal alerts={warrantyReminders} onClose={() => setWarrantyModalOpen(false)} />
      )}
    </div>
  );
};

export default App;





















