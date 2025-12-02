const { setCookie, isSecureRequest } = require('../utils');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    res.end('Method Not Allowed');
    return;
  }

  const secureCookie = isSecureRequest(req) || process.env.NODE_ENV === 'production';

  setCookie(res, 'duo_session', '', {
    httpOnly: true,
    secure: secureCookie,
    sameSite: 'Lax',
    path: '/',
    maxAge: 0,
  });
  setCookie(res, 'duo_csrf', '', {
    httpOnly: true,
    secure: secureCookie,
    sameSite: 'Lax',
    path: '/',
    maxAge: 0,
  });

  res.statusCode = 200;
  res.end('Logged out');
};
