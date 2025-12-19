const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST,OPTIONS',
  'access-control-allow-headers': 'content-type',
  'cache-control': 'no-store',
};

const sendJson = (res, payload, status = 200) => {
  Object.entries(corsHeaders).forEach(([key, value]) => res.setHeader(key, value));
  res.status(status).json(payload);
};

const parseBody = async (req) => {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return sendJson(res, {}, 204);
  }

  if (req.method !== 'POST') {
    return sendJson(res, { error: 'method not allowed' }, 405);
  }

  try {
    const body = await parseBody(req);
    const { id, deviceType, location, ip } = body || {};
    if (!id && !deviceType && !ip) {
      return sendJson(res, { error: 'missing printer metadata' }, 400);
    }

    const normalizedDevice = deviceType || 'Printer';
    const normalizedLocation = location || 'Unknown location';

    // Simulate work that would queue a test page with the vendor.
    await sleep(450);

    const jobId = `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const testedAt = new Date().toISOString();

    console.log('[PrinterTest] queued', { id, deviceType: normalizedDevice, location: normalizedLocation, ip, jobId });

    return sendJson(res, {
      ok: true,
      message: `Test page queued for ${normalizedDevice} @ ${normalizedLocation}`,
      printerId: id || null,
      location: normalizedLocation,
      ip: ip || null,
      testedAt,
      jobId,
    });
  } catch (error) {
    console.error('[PrinterTest] failed', error);
    return sendJson(
      res,
      {
        error: 'failed to queue test page',
        details: error.message || String(error),
      },
      500,
    );
  }
}
