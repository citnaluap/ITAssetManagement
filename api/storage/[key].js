import { put, get } from '@vercel/blob';

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,PUT,OPTIONS',
  'access-control-allow-headers': 'content-type',
};

const jsonResponse = (res, data, status = 200) => {
  Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));
  res.status(status).json(data);
};

export default async function handler(req, res) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const tokenStatus = token ? (token.startsWith('vercel_blob_rw_') ? 'present' : 'invalid') : 'missing';
  res.setHeader('x-blob-token-present', tokenStatus === 'present' ? 'true' : 'false');
  if (tokenStatus !== 'present') {
    console.error('[Blob Storage] Missing or malformed BLOB_READ_WRITE_TOKEN environment variable');
    return jsonResponse(
      res,
      { error: 'BLOB token missing or malformed', tokenStatus },
      500,
    );
  }

  const {
    query: { key },
    method,
  } = req;

  if (method === 'OPTIONS') {
    return jsonResponse(res, {}, 204);
  }

  if (!key) {
    return jsonResponse(res, { error: 'Missing key' }, 400);
  }

  const blobPath = `storage/${encodeURIComponent(key)}.json`;

  if (method === 'GET') {
    try {
      const existing = await get(blobPath, { token });
      if (!existing?.downloadUrl) {
        return jsonResponse(res, { error: 'not found' }, 404);
      }
      const data = await fetch(existing.downloadUrl).then((r) => r.json());
      return jsonResponse(res, data, 200);
    } catch (error) {
      console.error(`[Blob Storage] GET error for ${key}:`, error.message || error);
      const status = error?.status || error?.statusCode || 500;
      return jsonResponse(
        res,
        {
          error: status === 404 ? 'not found' : 'failed to fetch',
          details: error?.message || error,
        },
        status === 404 ? 404 : 500,
      );
    }
  }

  if (method === 'PUT') {
    try {
      const body =
        typeof req.body === 'object' && req.body !== null
          ? req.body
          : await new Promise((resolve, reject) => {
              let raw = '';
              req.on('data', (chunk) => {
                raw += chunk;
              });
              req.on('end', () => {
                try {
                  resolve(raw ? JSON.parse(raw) : {});
                } catch (error) {
                  reject(error);
                }
              });
              req.on('error', reject);
            });
      await put(blobPath, JSON.stringify(body), {
        access: 'public',
        contentType: 'application/json',
        token,
      });
      console.log(`[Blob Storage] Successfully saved ${key}`);
      return jsonResponse(res, { ok: true }, 200);
    } catch (error) {
      console.error(`[Blob Storage] PUT error for ${key}:`, error.message || error);
      return jsonResponse(res, { error: 'failed to persist', details: error.message || error }, 500);
    }
  }

  return jsonResponse(res, { error: 'method not allowed' }, 405);
}
