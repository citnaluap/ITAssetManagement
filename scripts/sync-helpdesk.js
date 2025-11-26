#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PORTAL_DIR = path.join(ROOT, 'helpdesk-portal');
const PORTAL_BUILD_DIR = path.join(PORTAL_DIR, 'build');
const STATIC_TARGET_DIR = path.join(ROOT, 'public', 'helpdesk-portal');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const ensureDirectory = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

const removeDirectory = (dirPath) => {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
};

const copyDirectory = (source, target) => {
  const entries = fs.readdirSync(source, { withFileTypes: true });
  ensureDirectory(target);
  entries.forEach((entry) => {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(target, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
};

const run = () => {
  if (!fs.existsSync(PORTAL_DIR)) {
    throw new Error(`HelpDesk portal directory not found at ${PORTAL_DIR}`);
  }

  console.log('Building HelpDesk portal…');
  execSync(`${npm} run build --if-present`, {
    cwd: PORTAL_DIR,
    stdio: 'inherit',
  });

  if (!fs.existsSync(PORTAL_BUILD_DIR)) {
    throw new Error(`Expected build output at ${PORTAL_BUILD_DIR} but it was missing`);
  }

  console.log('Copying HelpDesk build into public/helpdesk-portal');
  removeDirectory(STATIC_TARGET_DIR);
  copyDirectory(PORTAL_BUILD_DIR, STATIC_TARGET_DIR);
  console.log('HelpDesk portal synced to public/helpdesk-portal');
};

try {
  run();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
