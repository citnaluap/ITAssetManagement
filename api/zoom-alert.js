const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST,OPTIONS',
  'access-control-allow-headers': 'content-type',
  'cache-control': 'no-store',
};

const jsonResponse = (res, data, status = 200) => {
  Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));
  res.status(status).json(data);
};

export default async function handler(req, res) {
  const webhookUrl = process.env.ZOOM_WEBHOOK_URL || process.env.REACT_APP_ZOOM_WEBHOOK_URL || '';
  const webhookToken = process.env.ZOOM_WEBHOOK_TOKEN || process.env.REACT_APP_ZOOM_WEBHOOK_TOKEN || '';

  if (req.method === 'OPTIONS') {
    return jsonResponse(res, {}, 204);
  }

  if (req.method !== 'POST') {
    return jsonResponse(res, { error: 'method not allowed' }, 405);
  }

  if (!webhookUrl) {
    console.error('[Zoom Alert] Missing ZOOM_WEBHOOK_URL environment variable');
    return jsonResponse(res, { error: 'webhook not configured' }, 500);
  }

  try {
    let payload = {};
    if (req.body && typeof req.body === 'object') {
      payload = req.body;
    } else if (typeof req.body === 'string') {
      try {
        payload = JSON.parse(req.body);
      } catch {
        payload = {};
      }
    } else {
      payload = await new Promise((resolve, reject) => {
        let raw = '';
        req.on('data', (chunk) => {
          raw += chunk;
        });
        req.on('end', () => {
          try {
            resolve(raw ? JSON.parse(raw) : {});
          } catch {
            resolve({});
          }
        });
        req.on('error', reject);
      });
    }
    const { title, message } = payload;
    const payloadText = (message || title ? `${title || 'Asset alert'} - ${message || ''}` : 'Asset alert').trim();
    const targetUrl = webhookUrl.includes('format=message') ? webhookUrl : `${webhookUrl}?format=message`;
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(webhookToken ? { Authorization: webhookToken } : {}),
      },
      body: payloadText,
    });
    if (!response.ok) {
      console.error('[Zoom Alert] Upstream webhook failed', response.status);
      return jsonResponse(res, { error: 'upstream rejected', status: response.status }, 502);
    }
    return jsonResponse(res, { ok: true }, 200);
  } catch (error) {
    console.error('[Zoom Alert] Unexpected error', error?.stack || error);
    return jsonResponse(res, { error: 'failed to send alert' }, 500);
  }
}
