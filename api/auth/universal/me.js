const crypto = require('crypto');

const parseCookies = (req) => {
  const header = req.headers.cookie || '';
  return header.split(';').reduce((acc, part) => {
    const [key, ...rest] = part.split('=');
    if (!key) return acc;
    acc[key.trim()] = decodeURIComponent(rest.join('=').trim());
    return acc;
  }, {});
};

module.exports = (req, res) => {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    res.end('Method Not Allowed');
    return;
  }

  const cookieSecret = process.env.SESSION_SECRET || 'change-me';
  const cookies = parseCookies(req);
  const signedSession = cookies.duo_session || '';

  if (!signedSession) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Not authenticated' }));
    return;
  }

  // Verify signature
  const lastDot = signedSession.lastIndexOf('.');
  if (lastDot === -1) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid session' }));
    return;
  }

  const sessionValue = signedSession.slice(0, lastDot);
  const signature = signedSession.slice(lastDot + 1);
  const expected = crypto.createHmac('sha256', cookieSecret).update(sessionValue).digest('hex');

  try {
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Invalid session signature' }));
      return;
    }
  } catch {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid session' }));
    return;
  }

  // Decode session
  let sessionPayload;
  try {
    sessionPayload = JSON.parse(Buffer.from(sessionValue, 'base64url').toString('utf8'));
  } catch {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid session data' }));
    return;
  }

  // Check expiration
  if (sessionPayload.exp && Date.now() > sessionPayload.exp) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Session expired' }));
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    user: {
      name: sessionPayload.name,
      email: sessionPayload.email,
      sub: sessionPayload.sub,
      expiresAt: sessionPayload.exp,
    },
  }));
};
