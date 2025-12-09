module.exports = async (req, res) => {
  // Basic health endpoint to avoid noisy 404s when tools probe /api.
  if (req.method === 'HEAD') {
    res.statusCode = 200;
    res.end();
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: true }));
};
