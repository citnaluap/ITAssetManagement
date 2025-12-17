import crypto from 'crypto';
import { Client } from '@duosecurity/duo_universal';

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
  const cookie = parts.join('; ');
  const existing = res.getHeader('Set-Cookie');
  if (existing) {
    res.setHeader('Set-Cookie', Array.isArray(existing) ? [...existing, cookie] : [existing, cookie]);
  } else {
    res.setHeader('Set-Cookie', cookie);
  }
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    res.end('Method Not Allowed');
    return;
  }

  // Trim environment variables, handling undefined/null safely
  const clientId = process.env.DUO_CLIENT_ID?.trim() || '';
  const clientSecret = process.env.DUO_CLIENT_SECRET?.trim() || '';
  const apiHost = process.env.DUO_API_HOST?.trim() || '';
  const redirectUrlFromEnv = process.env.DUO_REDIRECT_URI?.trim();
  const redirectUrl = redirectUrlFromEnv || `https://${req.headers.host}/api/auth/universal/callback`;
  const cookieSecret = process.env.SESSION_SECRET || 'change-me';

  console.log('Callback Duo config:', {
    hasClientId: !!clientId,
    clientIdLength: clientId?.length,
    hasClientSecret: !!clientSecret,
    clientSecretLength: clientSecret?.length,
    hasApiHost: !!apiHost,
    apiHost,
    redirectUrl,
  });

  if (!clientId || !clientSecret || !apiHost || !redirectUrl) {
    console.error('Missing Duo configuration:', { clientId: !!clientId, clientSecret: !!clientSecret, apiHost: !!apiHost, redirectUrl: !!redirectUrl });
    res.statusCode = 500;
    res.end('Missing Duo configuration');
    return;
  }

  const { state, duo_code } = req.query;
  const cookies = parseCookies(req);
  const savedState = cookies.duo_state;
  const username = cookies.duo_username;

  if (!state || !duo_code) {
    res.statusCode = 400;
    res.end('Missing state or duo_code parameter');
    return;
  }

  if (!savedState) {
    res.statusCode = 400;
    res.end('Missing duo_state cookie - session may have expired');
    return;
  }

  if (state !== savedState) {
    res.statusCode = 400;
    res.end('State mismatch - possible CSRF attack');
    return;
  }

  if (!username || typeof username !== 'string' || !username.trim()) {
    res.statusCode = 400;
    res.end('Missing or invalid username from session');
    return;
  }

  try {
    const client = new Client({
      clientId,
      clientSecret,
      apiHost,
      redirectUrl,
    });
    
    // Exchange duo_code for authentication result
    const decodedToken = await client.exchangeAuthorizationCodeFor2FAResult(duo_code, username.trim());
    
    // Create session
    const sessionPayload = {
      username: decodedToken.preferred_username || username,
      email: decodedToken.email || `${username}@udservices.org`,
      name: decodedToken.name || username,
      sub: decodedToken.sub || username,
      exp: Date.now() + (3600 * 1000), // 1 hour
    };

    // Sign session
    const sessionValue = Buffer.from(JSON.stringify(sessionPayload)).toString('base64url');
    const signature = crypto.createHmac('sha256', cookieSecret).update(sessionValue).digest('hex');
    const signedSession = `${sessionValue}.${signature}`;

    // Set session cookie
    setCookie(res, 'duo_session', signedSession, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      path: '/',
      maxAge: 3600,
    });

    // Clear temporary cookies
    setCookie(res, 'duo_state', '', { maxAge: 0, path: '/' });
    setCookie(res, 'duo_username', '', { maxAge: 0, path: '/' });

    res.statusCode = 302;
    res.setHeader('Location', '/');
    res.end();
  } catch (error) {
    console.error('Duo authentication error:', {
      message: error.message,
      stack: error.stack,
      username: username,
      hasState: !!state,
      hasDuoCode: !!duo_code,
    });
    res.statusCode = 500;
    res.end(`Authentication failed: ${error.message}`);
  }
};
