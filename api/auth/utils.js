const crypto = require('crypto');

const base64url = (input) =>
  Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

const base64urlDecode = (input = '') => {
  try {
    const padded = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(input.length / 4) * 4, '=');
    return Buffer.from(padded, 'base64').toString('utf8');
  } catch {
    return '';
  }
};

const base64urlToBase64 = (input = '') => input.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(input.length / 4) * 4, '=');

const sign = (value, secret) => {
  const signature = crypto.createHmac('sha256', secret).update(value).digest('hex');
  return `${value}.${signature}`;
};

const verify = (signedValue, secret) => {
  if (!signedValue || !secret) return null;
  const lastDot = signedValue.lastIndexOf('.');
  if (lastDot === -1) return null;
  const value = signedValue.slice(0, lastDot);
  const signature = signedValue.slice(lastDot + 1);
  const expected = crypto.createHmac('sha256', secret).update(value).digest('hex');
  try {
    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return value;
    }
  } catch {
    return null;
  }
  return null;
};

const parseCookies = (req) => {
  const header = req.headers.cookie || '';
  return header.split(';').reduce((acc, part) => {
    const [key, ...rest] = part.split('=');
    if (!key) return acc;
    acc[key.trim()] = decodeURIComponent(rest.join('=').trim());
    return acc;
  }, {});
};

const setCookie = (res, name, value, options = {}) => {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push(`Path=${options.path || '/'}`);
  if (options.httpOnly) parts.push('HttpOnly');
  if (options.secure) parts.push('Secure');
  parts.push(`SameSite=${options.sameSite || 'Lax'}`);
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
  if (options.expires) parts.push(`Expires=${options.expires.toUTCString()}`);
  const cookie = parts.join('; ');
  const existing = res.getHeader('Set-Cookie');
  if (existing) {
    res.setHeader('Set-Cookie', Array.isArray(existing) ? [...existing, cookie] : [existing, cookie]);
  } else {
    res.setHeader('Set-Cookie', cookie);
  }
};

const isRelativePath = (value = '') => typeof value === 'string' && value.startsWith('/') && !value.startsWith('//');

const normalizeProtoHeader = (value = '') => {
  const first = value.split(',')[0];
  return (first || '').trim().toLowerCase();
};

const isSecureRequest = (req) => {
  const proto = normalizeProtoHeader(req?.headers?.['x-forwarded-proto'] || '');
  if (proto) {
    return proto === 'https';
  }
  return Boolean(req?.connection?.encrypted);
};

const getRequestOrigin = (req, fallback = '') => {
  const protoHeader = normalizeProtoHeader(req?.headers?.['x-forwarded-proto'] || '');
  const proto = protoHeader || (req?.connection?.encrypted ? 'https' : 'http');
  const host = (req?.headers?.host || '').trim();
  if (host) {
    return `${proto}://${host}`;
  }
  return fallback;
};

module.exports = {
  base64url,
  base64urlDecode,
  sign,
  verify,
  parseCookies,
  setCookie,
  isRelativePath,
  base64urlToBase64,
  isSecureRequest,
  getRequestOrigin,
};
