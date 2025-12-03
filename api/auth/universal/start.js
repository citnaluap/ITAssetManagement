const crypto = require('crypto');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    res.end('Method Not Allowed');
    return;
  }

  const clientId = process.env.DUO_CLIENT_ID;
  const clientSecret = process.env.DUO_CLIENT_SECRET;
  const apiHost = process.env.DUO_API_HOST; // e.g., api-xxxxxxxx.duosecurity.com
  const redirectUri = process.env.DUO_REDIRECT_URI || 'https://it-asset-management-ten.vercel.app/auth/callback';

  if (!clientId || !clientSecret || !apiHost) {
    res.statusCode = 500;
    res.end('Missing Duo configuration. Set DUO_CLIENT_ID, DUO_CLIENT_SECRET, and DUO_API_HOST');
    return;
  }

  try {
    // Get username from query parameter
    const username = req.query.username;
    
    if (!username || typeof username !== 'string' || !username.trim()) {
      res.statusCode = 400;
      res.end('Username is required');
      return;
    }

    // Generate state for CSRF protection
    const state = crypto.randomBytes(32).toString('hex');
    
    // Create request for Duo Universal Prompt
    const duoClient = require('@duosecurity/duo_universal');
    const client = new duoClient.Client(clientId, clientSecret, apiHost, redirectUri);
    
    // Generate authorization URL
    const authUrl = await client.createAuthUrl(username.trim(), state);

    // Store state in cookie for verification
    res.setHeader('Set-Cookie', [
      `duo_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=300`,
      `duo_username=${username.trim()}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=300`
    ]);

    res.statusCode = 302;
    res.setHeader('Location', authUrl);
    res.end();
  } catch (error) {
    res.statusCode = 500;
    res.end(`Duo auth failed: ${error.message}`);
  }
};
