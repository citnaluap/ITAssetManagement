#!/usr/bin/env node
/**
 * Synchronizes the Asset List workbook into the app's starter JSON.
 *
 * - Reads Tables/Asset List 11-18-25.xlsx (first sheet)
 * - Uses the same normalization logic as App.js (status, costs, dates, key fobs)
 * - Writes src/data/assets.json
 */
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const ROOT = path.resolve(__dirname, '..');
const ASSET_SOURCE = path.join(ROOT, 'Tables', 'Asset List 11-18-25.xlsx');
const EMPLOYEE_JSON = path.join(ROOT, 'src', 'data', 'employees.json');
const ASSET_JSON = path.join(ROOT, 'src', 'data', 'assets.json');

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
  { match: ({ model }) => /elitebook\s*830/.test(model), price: 1400 },
  { match: ({ model }) => /elitebook\s*840/.test(model), price: 1450 },
  { match: ({ model }) => /elitebook\s*850/.test(model), price: 1550 },
  { match: ({ model }) => /precision\s*3590/.test(model), price: 1950 },
  { match: ({ model }) => /precision\s*3660/.test(model), price: 2250 },
  { match: ({ model }) => /precision\s*3930/.test(model), price: 2600 },
  { match: ({ model }) => /macbook\s*pro/.test(model), price: 2400 },
  { match: ({ model }) => /macbook\s*air/.test(model), price: 1400 },
  { match: ({ model }) => /iphone/.test(model), price: ({ model }) => (model.includes('pro') ? 1099 : 899) },
  { match: ({ model }) => /galaxy/.test(model), price: 799 },
  { match: ({ model }) => /pixel\s*(6|7|8)/.test(model), price: 699 },
  { match: ({ model }) => /surface\s*pro/.test(model), price: 1600 },
  { match: ({ model }) => /surface\s*laptop/.test(model), price: 1500 },
  { match: ({ model }) => /thinkpad\s*t14/.test(model), price: 1400 },
  { match: ({ model }) => /thinkpad\s*x1/.test(model), price: 1900 },
  { match: ({ model }) => /thinkpad/.test(model), price: 1300 },
  { match: ({ model }) => /xps\s*13/.test(model), price: 1500 },
  { match: ({ model }) => /xps\s*15/.test(model), price: 1900 },
  { match: ({ model }) => /xps/.test(model), price: 1700 },
  { match: ({ model }) => /chromebook/.test(model), price: 450 },
  { match: ({ model }) => /lenovo\s*m910q/.test(model), price: 800 },
  { match: ({ model }) => /lenovo\s*m900/.test(model), price: 700 },
  { match: ({ model }) => /lenovo\s*m910s/.test(model), price: 850 },
  { match: ({ model }) => /lenovo\s*m700/.test(model), price: 650 },
  { match: ({ model }) => /lenovo\s*m93p/.test(model), price: 600 },
  { match: ({ model }) => /lenovo\s*m92p/.test(model), price: 550 },
  { match: ({ model }) => /lenovo\s*m910t/.test(model), price: 900 },
  { match: ({ model }) => /lenovo\s*m920q/.test(model), price: 950 },
  { match: ({ model }) => /lenovo\s*m900\s*small/.test(model), price: 720 },
  { match: ({ model }) => /hp\s*280\s*g2/.test(model), price: 700 },
  { match: ({ model }) => /hp\s*280\s*g1/.test(model), price: 650 },
  { match: ({ model }) => /hp\s*elitedesk\s*800/.test(model), price: 950 },
  { match: ({ model }) => /hp\s*prodesk\s*400/.test(model), price: 750 },
  { match: ({ model }) => /hp\s*prodesk\s*600/.test(model), price: 850 },
  { match: ({ model }) => /hp\s*6000\s*pro/.test(model), price: 650 },
  { match: ({ model }) => /mac\s*mini/.test(model), price: 1100 },
  { match: ({ model }) => /imac/.test(model), price: 1800 },
  { match: ({ model }) => /dell\s*optiplex\s*5050/.test(model), price: 900 },
  { match: ({ model }) => /dell\s*optiplex\s*990/.test(model), price: 700 },
  { match: ({ model }) => /dell\s*optiplex\s*755/.test(model), price: 550 },
  { match: ({ model }) => /dell\s*optiplex\s*3020/.test(model), price: 750 },
  { match: ({ model }) => /dell\s*optiplex\s*7010/.test(model), price: 820 },
  { match: ({ model }) => /dell\s*optiplex\s*760/.test(model), price: 520 },
  { match: ({ model }) => /dell\s*optiplex\s*790/.test(model), price: 560 },
  { match: ({ model }) => /dell\s*optiplex\s*9010/.test(model), price: 880 },
  { match: ({ model }) => /dell\s*optiplex\s*9020/.test(model), price: 910 },
  { match: ({ model }) => /dell\s*optiplex\s*7040/.test(model), price: 980 },
  { match: ({ model }) => /dell\s*optiplex\s*3040/.test(model), price: 800 },
  { match: ({ model }) => /dell\s*optiplex\s*3050/.test(model), price: 820 },
  { match: ({ model }) => /dell\s*optiplex\s*3060/.test(model), price: 840 },
  { match: ({ model }) => /dell\s*optiplex\s*5040/.test(model), price: 880 },
  { match: ({ model }) => /dell\s*optiplex\s*3050\s*micro/.test(model), price: 780 },
  { match: ({ model }) => /dell\s*optiplex\s*3000/.test(model), price: 760 },
  { match: ({ model }) => /dell\s*optiplex\s*5480/.test(model), price: 1200 },
  { match: ({ model }) => /dell\s*optiplex\s*7760/.test(model), price: 1300 },
  { match: ({ model }) => /dell\s*optiplex\s*740/.test(model), price: 500 },
  { match: ({ model }) => /dell\s*optiplex\s*170l/.test(model), price: 450 },
  { match: ({ model }) => /alienware/.test(model), price: 2300 },
  { match: ({ model }) => /precision/.test(model), price: 1900 },
  { match: ({ model }) => /dell\s*vostro/.test(model), price: 950 },
  { match: ({ model }) => /hp\s*z400/.test(model), price: 1200 },
  { match: ({ model }) => /hp\s*z620/.test(model), price: 1400 },
  { match: ({ model }) => /hp\s*z420/.test(model), price: 1350 },
  { match: ({ model }) => /hp\s*z230/.test(model), price: 1150 },
  { match: ({ model }) => /hp\s*z1/.test(model), price: 1600 },
  { match: ({ model }) => /hp\s*z240/.test(model), price: 1250 },
  { match: ({ model }) => /hp\s*z2/.test(model), price: 1300 },
  { match: ({ model }) => /hp\s*z2\s*g4/.test(model), price: 1400 },
  { match: ({ model }) => /hp\s*zbook/.test(model), price: 1800 },
  { match: ({ model }) => /hp\s*z4/.test(model), price: 1800 },
  { match: ({ model }) => /hp\s*z6/.test(model), price: 2100 },
  { match: ({ model }) => /hp\s*z8/.test(model), price: 2600 },
  { match: ({ model }) => /prodesk/.test(model), price: 900 },
  { match: ({ model }) => /thinkcentre/.test(model), price: 900 },
  { match: ({ model }) => /acer\s*aspire/.test(model), price: 750 },
  { match: ({ model }) => /acer\s*travelmate/.test(model), price: 850 },
  { match: ({ model }) => /acer\s*veriton/.test(model), price: 900 },
  { match: ({ model }) => /asus\s*zenbook/.test(model), price: 1100 },
  { match: ({ model }) => /asus\s*vivobook/.test(model), price: 800 },
  { match: ({ model }) => /asus\s*rog/.test(model), price: 1500 },
  { match: ({ model }) => /msi\s*prestige/.test(model), price: 1400 },
  { match: ({ model }) => /msi\s*modern/.test(model), price: 1000 },
  { match: ({ model }) => /msi\s*stealth/.test(model), price: 1800 },
  { match: ({ model }) => /msi\s*katana/.test(model), price: 1200 },
  { match: ({ model }) => /rog\s*strix/.test(model), price: 1600 },
  { match: ({ model }) => /legion/.test(model), price: 1500 },
  { match: ({ model }) => /dell\s*g3/.test(model), price: 1100 },
  { match: ({ model }) => /dell\s*g5/.test(model), price: 1250 },
  { match: ({ model }) => /dell\s*g7/.test(model), price: 1400 },
  { match: ({ model }) => /hp\s*pavilion\s*x360/.test(model), price: 800 },
  { match: ({ model }) => /hp\s*envy/.test(model), price: 1100 },
  { match: ({ model }) => /hp\s*spectre/.test(model), price: 1400 },
  { match: ({ model }) => /elite\s*x2/.test(model), price: 1500 },
  { match: ({ model }) => /elite\s*mini/.test(model), price: 900 },
  { match: ({ model }) => /surface\s*go/.test(model), price: 650 },
  { match: ({ model }) => /ipad\s*pro/.test(model), price: 1100 },
  { match: ({ model }) => /ipad\s*air/.test(model), price: 750 },
  { match: ({ model }) => /ipad\s*mini/.test(model), price: 650 },
  { match: ({ model }) => /ipad/.test(model), price: 720 },
  { match: ({ model }) => /thinkvision/.test(model), price: 320 },
  { match: ({ model }) => /p\s*series\s*dell/.test(model), price: 310 },
  { match: ({ model }) => /u\s*series\s*dell/.test(model), price: 420 },
  { match: ({ model }) => /e\s*series\s*dell/.test(model), price: 250 },
  { match: ({ model }) => /s\s*series\s*dell/.test(model), price: 270 },
  { match: ({ model }) => /alienware\s*34/.test(model), price: 1200 },
  { match: ({ model }) => /ultrasharp/.test(model), price: 480 },
  { match: ({ model }) => /curved/.test(model), price: 520 },
  { match: ({ model }) => /wide/.test(model), price: 500 },
  { match: ({ model }) => /27\"/.test(model), price: 380 },
  { match: ({ model }) => /32\"/.test(model), price: 520 },
  { match: ({ model }) => /24\"/.test(model), price: 280 },
  { match: ({ model }) => /21\"/.test(model), price: 220 },
  { match: ({ model }) => /projector/.test(model), price: 900 },
  { match: ({ model }) => /benq/.test(model), price: 750 },
  { match: ({ model }) => /epson/.test(model), price: 620 },
  { match: ({ model }) => /sony\s*bravia/.test(model), price: 680 },
  { match: ({ model }) => /lg\s*ultrafine/.test(model), price: 650 },
  { match: ({ model }) => /lg\s*ultrawide/.test(model), price: 780 },
  { match: ({ model }) => /lg\s*c2/.test(model), price: 1200 },
  { match: ({ model }) => /samsung\s*odyssey/.test(model), price: 800 },
  { match: ({ model }) => /samsung\s*smart\s*monitor/.test(model), price: 500 },
  { match: ({ model }) => /asus\s*proart/.test(model), price: 750 },
  { match: ({ model }) => /apple\s*studio\s*display/.test(model), price: 1800 },
  { match: ({ model }) => /huawei\s*mateview/.test(model), price: 720 },
  { match: ({ model }) => /viewsonic/.test(model), price: 380 },
  { match: ({ model }) => /pixio/.test(model), price: 420 },
  { match: ({ model }) => /key\s*fob/.test(model), price: 45 },
  { match: ({ model, brand }) => brand.includes('canon') && model.includes('ir'), price: 3200 },
  { match: ({ model, brand }) => brand.includes('canon') && model.includes('adv'), price: 3800 },
  { match: ({ model, brand }) => brand.includes('brother') && model.includes('mfc'), price: 520 },
  { match: ({ model, brand }) => brand.includes('brother') && model.includes('hl'), price: 380 },
  { match: ({ model, brand }) => brand.includes('epson') && /579/.test(model), price: 620 },
  { match: ({ model, brand }) => brand.includes('epson') && /529/.test(model), price: 520 },
  { match: ({ model }) => /lexmark\s*m3150/.test(model), price: 680 },
  { match: ({ model }) => /laserjet/.test(model), price: 480 },
  { match: ({ model }) => /color\s*laserjet/.test(model), price: 680 },
  { match: ({ model }) => /scanner/.test(model), price: 420 },
  { match: ({ model }) => /prolite/.test(model), price: 260 },
  { match: ({ model }) => /logitech\s*rally/.test(model), price: 2200 },
  { match: ({ model }) => /poly\s*studio/.test(model), price: 2600 },
  { match: ({ model }) => /poly\s*x30/.test(model), price: 3200 },
  { match: ({ model }) => /poly\s*x50/.test(model), price: 3900 },
  { match: ({ model }) => /poly\s*sync/.test(model), price: 450 },
  { match: ({ model }) => /lenovo\s*dock/.test(model), price: 260 },
  { match: ({ model }) => /thinkpad\s*usb\s*c\s*dock/.test(model), price: 240 },
  { match: ({ model }) => /wd19/.test(model), price: 260 },
  { match: ({ model }) => /wd15/.test(model), price: 220 },
  { match: ({ model }) => /wd19s/.test(model), price: 260 },
  { match: ({ model }) => /wd19tb/.test(model), price: 340 },
  { match: ({ model }) => /wd22/.test(model), price: 360 },
  { match: ({ model }) => /wd19dc/.test(model), price: 380 },
  { match: ({ model }) => /surface\s*dock\s*2/.test(model), price: 280 },
  { match: ({ model }) => /hp\s*usb\s*c\s*dock/.test(model), price: 230 },
  { match: ({ model }) => /hp\s*thunderbolt\s*dock/.test(model), price: 320 },
  { match: ({ model }) => /lenovo\s*hybrid/.test(model), price: 250 },
  { match: ({ model }) => /plugable/.test(model), price: 220 },
  { match: ({ model }) => /anker\s*575/.test(model), price: 200 },
  { match: ({ model }) => /anker\s*577/.test(model), price: 250 },
  { match: ({ model }) => /anker\s*555/.test(model), price: 180 },
  { match: ({ model }) => /kensington/.test(model), price: 230 },
  { match: ({ model }) => /toshiba\s*dyna\s*dock/.test(model), price: 210 },
  { match: ({ model }) => /tripp\s*lite/.test(model), price: 190 },
  { match: ({ model }) => /belkin/.test(model), price: 200 },
  { match: ({ model }) => /targus/.test(model), price: 190 },
];

const normalizeModelName = (value = '') =>
  value
    .replace(/\bsamasung\b/gi, 'samsung')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const normalizeBrandName = (value = '') => value.trim().toLowerCase();

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

const normalizeLocationLabel = (value = '') => {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  const lower = trimmed.toLowerCase();
  if (lower === 'remote' || lower === 'field' || lower === 'remote/field' || lower === 'field/remote') {
    return 'Remote';
  }
  return trimmed;
};

const normalizeKey = (value = '') => {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) {
    return value.map((item) => normalizeKey(item)).filter(Boolean).join('');
  }
  const text = typeof value === 'string' ? value : String(value);
  return text.replace(/[^a-z0-9]/gi, '').toLowerCase();
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
      return ensureKeyFobModel(asset);
    }
    return ensureKeyFobModel({ ...asset, assignedTo: owner, status, checkedOut: false });
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

const buildEmployeeDirectory = (rows = []) =>
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
  const hasAssignee = Boolean(assignedName && assignedName !== 'Unassigned');
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

const buildAssetsFromSheet = (assetRows = [], employeeRows = []) => {
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
      const hasAssignee = Boolean(assignedName && assignedName !== 'Unassigned');
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

const readEmployees = () => {
  if (!fs.existsSync(EMPLOYEE_JSON)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(EMPLOYEE_JSON, 'utf8'));
  } catch (error) {
    console.warn('Could not parse employees.json, continuing without employee context.');
    return [];
  }
};

const main = () => {
  if (!fs.existsSync(ASSET_SOURCE)) {
    throw new Error(`Missing Asset List workbook at ${ASSET_SOURCE}`);
  }

  const workbook = XLSX.readFile(ASSET_SOURCE, { cellDates: false });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error('No worksheet found in Asset List workbook');
  }

  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  const employees = readEmployees();
  const assets = buildAssetsFromSheet(rows, employees);

  fs.writeFileSync(ASSET_JSON, JSON.stringify(assets, null, 2));
  console.log(`Wrote ${assets.length} assets to ${path.relative(ROOT, ASSET_JSON)}`);
};

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

