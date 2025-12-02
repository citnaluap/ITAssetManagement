const crypto = require('crypto');
const {
  base64url,
  base64urlDecode,
  base64urlToBase64,
  sign,
  verify,
  parseCookies,
  setCookie,
  isRelativePath,
  isSecureRequest,
  getRequestOrigin,
} = require('../utils');

const DEFAULT_ISSUER = 'https://sso-a185ca23.sso.duosecurity.com/oidc/DIMN6DZG4KW4BK6MTFJP';
const DEFAULT_REDIRECT_BASE = 'https://it-asset-management-ten.vercel.app';

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    res.end('Method Not Allowed');
    return;
  }

  const clientId = process.env.DUO_CLIENT_ID || 'DIMN6DZG4KW4BK6MTFJP';
  const clientSecret = process.env.DUO_CLIENT_SECRET;
  const origin = getRequestOrigin(req, DEFAULT_REDIRECT_BASE);
  const redirectUri = process.env.DUO_REDIRECT_URI || `${origin}/auth/callback`;
  const issuer = process.env.DUO_ISSUER || DEFAULT_ISSUER;
  const cookieSecret = process.env.SESSION_SECRET || process.env.COOKIE_SECRET || 'change-me';
  const secureCookie = isSecureRequest(req) || process.env.NODE_ENV === 'production';

  if (!clientSecret) {
    res.statusCode = 500;
    res.end('Missing DUO_CLIENT_SECRET');
    return;
  }

  const { code, state, error } = req.query;
  if (error) {
    res.statusCode = 400;
    res.end(`Duo error: ${error}`);
    return;
  }
  if (!code || !state) {
    res.statusCode = 400;
    res.end('Missing code or state');
    return;
  }

  const cookies = parseCookies(req);
  const signedState = cookies.duo_csrf || '';
  const rawState = verify(signedState, cookieSecret);
  if (!rawState || rawState !== state) {
    res.statusCode = 400;
    res.end('Invalid state');
    return;
  }

  let statePayload;
  try {
    statePayload = JSON.parse(base64urlDecode(state));
  } catch {
    statePayload = null;
  }
  const returnTo = statePayload && isRelativePath(statePayload.returnTo) ? statePayload.returnTo : '/';

  try {
    const body = new URLSearchParams();
    body.append('grant_type', 'authorization_code');
    body.append('code', code);
    body.append('redirect_uri', redirectUri);
    body.append('client_id', clientId);

    const tokenResp = await fetch(`${issuer}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body,
    });

    if (!tokenResp.ok) {
      const text = await tokenResp.text();
      res.statusCode = 401;
      res.end(`Token exchange failed: ${text || tokenResp.status}`);
      return;
    }

    const tokenData = await tokenResp.json();
    const idToken = tokenData.id_token || '';
    if (!idToken) {
      res.statusCode = 401;
      res.end('Missing id_token');
      return;
    }

    const verifyIdToken = async (jwt) => {
      const [headerB64, payloadB64, signatureB64] = jwt.split('.');
      if (!headerB64 || !payloadB64 || !signatureB64) throw new Error('Invalid id_token format');
      const header = JSON.parse(base64urlDecode(headerB64) || '{}');
      const claims = JSON.parse(base64urlDecode(payloadB64) || '{}');
      if (!header.kid) throw new Error('Missing kid in token header');
      if (header.alg !== 'RS256') throw new Error(`Unsupported alg ${header.alg}`);

      const jwksUrl = process.env.DUO_JWKS_URL || `${issuer}/jwks`;
      const jwksResp = await fetch(jwksUrl);
      if (!jwksResp.ok) throw new Error(`Unable to fetch JWKS (${jwksResp.status})`);
      const { keys = [] } = await jwksResp.json();
      const jwk = keys.find((k) => k.kid === header.kid);
      if (!jwk || !Array.isArray(jwk.x5c) || jwk.x5c.length === 0) throw new Error('Signing key not found');
      const certBody = jwk.x5c[0].match(/.{1,64}/g).join('\n');
      const pem = `-----BEGIN CERTIFICATE-----\n${certBody}\n-----END CERTIFICATE-----\n`;

      const verifier = crypto.createVerify('RSA-SHA256');
      verifier.update(`${headerB64}.${payloadB64}`);
      verifier.end();
      const signature = Buffer.from(base64urlToBase64(signatureB64), 'base64');
      const valid = verifier.verify(pem, signature);
      if (!valid) throw new Error('Invalid token signature');

      const now = Math.floor(Date.now() / 1000);
      if (claims.exp && now >= claims.exp) throw new Error('Token expired');
      if (claims.nbf && now < claims.nbf) throw new Error('Token not yet valid');
      const audOk = Array.isArray(claims.aud) ? claims.aud.includes(clientId) : claims.aud === clientId;
      if (!audOk) throw new Error('Token audience mismatch');
      if (claims.iss && claims.iss !== issuer) throw new Error('Token issuer mismatch');
      return claims;
    };

    const claims = await verifyIdToken(idToken);

    const sessionExpMs = claims.exp ? claims.exp * 1000 : Date.now() + 60 * 60 * 1000;
    const sessionPayload = {
      sub: claims.sub,
      email: claims.email || claims.preferred_username || '',
      name: claims.name || claims.email || 'Duo user',
      exp: sessionExpMs,
    };

    const sessionValue = base64url(JSON.stringify(sessionPayload));
    const signedSession = sign(sessionValue, cookieSecret);
    const maxAge = Math.max(60, Math.floor((sessionExpMs - Date.now()) / 1000));

    setCookie(res, 'duo_session', signedSession, {
      httpOnly: true,
      secure: secureCookie,
      sameSite: 'Lax',
      path: '/',
      maxAge,
    });
    setCookie(res, 'duo_csrf', '', {
      httpOnly: true,
      secure: secureCookie,
      sameSite: 'Lax',
      path: '/',
      maxAge: 0,
    });

    res.statusCode = 302;
    res.setHeader('Location', returnTo || '/');
    res.end();
  } catch (err) {
    res.statusCode = 500;
    res.end(`Auth failed: ${err.message}`);
  }
};
