const { base64urlDecode, verify, parseCookies } = require('../utils');

module.exports = (req, res) => {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    res.end('Method Not Allowed');
    return;
  }

  const cookieSecret = process.env.SESSION_SECRET || process.env.COOKIE_SECRET || 'change-me';
  const cookies = parseCookies(req);
  const signed = cookies.duo_session || '';
  const value = verify(signed, cookieSecret);
  if (!value) {
    res.statusCode = 401;
    res.end('Unauthorized');
    return;
  }

  let payload;
  try {
    payload = JSON.parse(base64urlDecode(value));
  } catch {
    payload = null;
  }

  if (!payload || !payload.exp || Date.now() > payload.exp) {
    res.statusCode = 401;
    res.end('Session expired');
    return;
  }

  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify({
      user: {
        name: payload.name,
        email: payload.email,
        sub: payload.sub,
        expiresAt: payload.exp,
      },
    }),
  );
};
