const crypto = require('crypto');
const { base64url, sign, setCookie, isRelativePath, isSecureRequest, getRequestOrigin } = require('../utils');

const DEFAULT_ISSUER = 'https://sso-a185ca23.sso.duosecurity.com/oidc/DIMN6DZG4KW4BK6MTFJP';
const DEFAULT_REDIRECT_BASE = 'https://it-asset-management-ten.vercel.app';

module.exports = (req, res) => {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    res.end('Method Not Allowed');
    return;
  }

  const clientId = process.env.DUO_OIDC_CLIENT_ID || 'DIMN6DZG4KW4BK6MTFJP';FJP';
  const origin = getRequestOrigin(req, DEFAULT_REDIRECT_BASE);
  const redirectUri = process.env.DUO_OIDC_REDIRECT_URI || `${origin}/api/auth/duo/callback`;
  const issuer = process.env.DUO_ISSUER || DEFAULT_ISSUER;
  const cookieSecret = process.env.SESSION_SECRET || process.env.COOKIE_SECRET || 'change-me';
  const secureCookie = isSecureRequest(req) || process.env.NODE_ENV === 'production';

  const state = base64url(crypto.randomBytes(16));
  const nonce = base64url(crypto.randomBytes(16));
  const returnTo = isRelativePath(req.query.returnTo) ? req.query.returnTo : '/';

  const statePayload = { state, nonce, returnTo };
  const stateParam = base64url(JSON.stringify(statePayload));
  const signedState = sign(stateParam, cookieSecret);

  setCookie(res, 'duo_csrf', signedState, {
    httpOnly: true,
    secure: secureCookie,
    sameSite: 'Lax',
    path: '/',
    maxAge: 600,
  });

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'openid profile email',
    state: stateParam,
    nonce,
  });

  res.statusCode = 302;
  res.setHeader('Location', `${issuer}/authorize?${params.toString()}`);
  res.end();
};
