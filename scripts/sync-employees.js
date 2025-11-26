#!/usr/bin/env node
/**
 * Synchronizes employee roster + photo lookup tables.
 *
 * - Reads Tables/Employee Information Hub.xlsx (Contact Details sheet)
 * - Writes src/data/employees.json with trimmed values
 * - Reads /public/assets/employees/* for photo files and writes src/data/employeePhotos.json
 */
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const ROOT = path.resolve(__dirname, '..');
const EMPLOYEE_SOURCE = path.join(ROOT, 'Tables', 'Employee Information Hub.xlsx');
const EMPLOYEE_JSON = path.join(ROOT, 'src', 'data', 'employees.json');
const PHOTO_JSON = path.join(ROOT, 'src', 'data', 'employeePhotos.json');
const PHOTO_DIR = path.join(ROOT, 'public', 'assets', 'employees');

const normalizeKey = (value = '') => value.replace(/[^a-z0-9]/gi, '').toLowerCase();

const ensureFile = (targetPath) => {
  const dir = path.dirname(targetPath);
  fs.mkdirSync(dir, { recursive: true });
};

const syncEmployees = () => {
  if (!fs.existsSync(EMPLOYEE_SOURCE)) {
    throw new Error(`Missing Excel workbook at ${EMPLOYEE_SOURCE}`);
  }

  const workbook = XLSX.readFile(EMPLOYEE_SOURCE, { cellDates: false });
  const sheet =
    workbook.Sheets['Contact Details'] ||
    workbook.Sheets['Sheet1'] ||
    workbook.Sheets[workbook.SheetNames[0]];

  if (!sheet) {
    throw new Error('No worksheet found in Employee Information Hub.xlsx');
  }

  const rows = XLSX.utils.sheet_to_json(sheet, {
    defval: '',
    raw: false,
  });

  const trimmedRows = rows
    .map((row) => {
      const next = {};
      Object.entries(row).forEach(([key, value]) => {
        const normalizedKey = String(key || '').trim();
        if (!normalizedKey) {
          return;
        }
        if (typeof value === 'string') {
          next[normalizedKey] = value.trim();
        } else if (value === null || value === undefined) {
          next[normalizedKey] = '';
        } else {
          next[normalizedKey] = value;
        }
      });
      return next;
    })
    .filter((row) => Object.values(row).some((value) => String(value || '').trim().length > 0));

  ensureFile(EMPLOYEE_JSON);
  fs.writeFileSync(EMPLOYEE_JSON, JSON.stringify(trimmedRows, null, 2));
  console.log(`Wrote ${trimmedRows.length} employees to ${path.relative(ROOT, EMPLOYEE_JSON)}`);
};

const syncEmployeePhotos = () => {
  if (!fs.existsSync(PHOTO_DIR)) {
    throw new Error(`Missing photo directory at ${PHOTO_DIR}`);
  }

  const files = fs
    .readdirSync(PHOTO_DIR)
    .filter((file) => /\.(png|jpe?g|webp)$/i.test(file));

  const entries = files.reduce((acc, fileName) => {
    const slug = normalizeKey(path.basename(fileName, path.extname(fileName)));
    if (!slug || acc[slug]) {
      return acc;
    }
    acc[slug] = `/assets/employees/${fileName}`;
    return acc;
  }, {});

  ensureFile(PHOTO_JSON);
  fs.writeFileSync(PHOTO_JSON, JSON.stringify(entries, null, 2));
  console.log(
    `Mapped ${Object.keys(entries).length} employee photos to ${path.relative(ROOT, PHOTO_JSON)}`,
  );
};

try {
  syncEmployees();
  syncEmployeePhotos();
  console.log('Employee data sync complete.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

