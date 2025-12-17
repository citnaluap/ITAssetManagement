import crypto from 'crypto';
import { Client } from '@duosecurity/duo_universal';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    res.end('Method Not Allowed');
    return;
  }

  // Trim all environment variables to remove any whitespace, handle undefined safely
  const clientId = process.env.DUO_CLIENT_ID?.trim() || '';
  const clientSecret = process.env.DUO_CLIENT_SECRET?.trim() || '';
  const apiHost = process.env.DUO_API_HOST?.trim() || ''; // e.g., api-xxxxxxxx.duosecurity.com
  const redirectUrlFromEnv = process.env.DUO_REDIRECT_URI?.trim();
  const redirectUrl = redirectUrlFromEnv || `https://${req.headers.host}/api/auth/universal/callback`;

  console.log('Duo config check:', {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    hasApiHost: !!apiHost,
    apiHost: apiHost,
    redirectUrl,
    clientIdValue: clientId?.substring(0, 4) + '...',
    clientSecretValue: clientSecret?.substring(0, 5) + '...',
  });

  if (!clientId || !clientSecret || !apiHost || !redirectUrl) {
    res.statusCode = 500;
    res.end('Missing Duo configuration. Set DUO_CLIENT_ID, DUO_CLIENT_SECRET, DUO_API_HOST, and DUO_REDIRECT_URI');
    return;
  }

  try {
    // Get username from query parameter
    const username = req.query.username;
    
    console.log('Username check:', { username, type: typeof username });
    
    if (!username || typeof username !== 'string' || !username.trim()) {
      res.statusCode = 400;
      res.end('Username is required');
      return;
    }

    // Generate state for CSRF protection
    const state = crypto.randomBytes(32).toString('hex');
    
    console.log('Creating Duo client with:', {
      clientIdLength: clientId?.length,
      clientSecretLength: clientSecret?.length,
      apiHost,
      redirectUrl,
    });
    
    // Create request for Duo Universal Prompt
    const client = new Client({
      clientId,
      clientSecret,
      apiHost,
      redirectUrl,
    });
    
    console.log('Duo client created, generating auth URL for username:', username.trim());
    
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
    console.error('Duo auth error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    res.statusCode = 500;
    res.end(`Duo auth failed: ${error.message} - Check Vercel logs for details`);
  }
};
