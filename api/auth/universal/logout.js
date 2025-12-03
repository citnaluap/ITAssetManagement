module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    res.end('Method Not Allowed');
    return;
  }

  res.setHeader('Set-Cookie', [
    'duo_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
    'duo_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
    'duo_username=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'
  ]);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ success: true }));
};
