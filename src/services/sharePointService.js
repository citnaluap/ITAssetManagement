const RAW_SITE_URL = process.env.REACT_APP_SHAREPOINT_SITE_URL || '';
const SHAREPOINT_SITE_URL = RAW_SITE_URL.replace(/\/+$/, '');
const DEFAULT_ASSET_LIST_TITLE = process.env.REACT_APP_SHAREPOINT_ASSET_LIST || 'Asset List';
const DEFAULT_EMPLOYEE_LIST_TITLE = process.env.REACT_APP_SHAREPOINT_EMPLOYEE_LIST || 'Employee Information Hub';
const RAW_FIELD_MAP = process.env.REACT_APP_SHAREPOINT_FIELD_MAP || '';

const parseFieldMap = () => {
  if (!RAW_FIELD_MAP) {
    return {};
  }
  try {
    const parsed = JSON.parse(RAW_FIELD_MAP);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed;
    }
    console.warn(
      'REACT_APP_SHAREPOINT_FIELD_MAP must be a JSON object mapping normalized SharePoint columns to the names used in the dashboard.',
    );
  } catch (error) {
    console.warn('Failed to parse REACT_APP_SHAREPOINT_FIELD_MAP', error);
  }
  return {};
};

const FIELD_MAP = parseFieldMap();

const SHAREPOINT_CONFIG = {
  siteUrl: SHAREPOINT_SITE_URL,
  enabled: Boolean(SHAREPOINT_SITE_URL),
  assetListTitle: DEFAULT_ASSET_LIST_TITLE,
  employeeListTitle: DEFAULT_EMPLOYEE_LIST_TITLE,
  fieldMap: FIELD_MAP,
};

const decodeSharePointFieldName = (fieldName = '') => {
  const cleaned = String(fieldName)
    .replace(/^OData__/, '')
    .replace(/_x([0-9a-fA-F]{4})_/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned;
};

const isMetaKey = (key = '') => {
  const normalized = String(key || '').trim().toLowerCase();
  return normalized.startsWith('odata.') || normalized.startsWith('@odata.') || normalized.startsWith('__');
};

const normalizeSharePointRow = (row = {}) =>
  Object.entries(row).reduce((acc, [key, value]) => {
    if (!key || isMetaKey(key)) {
      return acc;
    }
    const decoded = decodeSharePointFieldName(key);
    if (!decoded) {
      return acc;
    }
    const targetKey = FIELD_MAP[decoded] || decoded;
    acc[targetKey] = value;
    return acc;
  }, {});

const extractItems = (payload) => {
  if (!payload) {
    return [];
  }
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload.value)) {
    return payload.value;
  }
  if (Array.isArray(payload.d?.results)) {
    return payload.d.results;
  }
  return [];
};

const getNextLink = (payload) => {
  if (!payload) {
    return null;
  }
  if (typeof payload['@odata.nextLink'] === 'string') {
    return payload['@odata.nextLink'];
  }
  if (typeof payload['odata.nextLink'] === 'string') {
    return payload['odata.nextLink'];
  }
  if (typeof payload.d?.__next === 'string') {
    return payload.d.__next;
  }
  return null;
};

const escapeListTitle = (value = '') => value.replace(/'/g, "''");

const ensureConfiguration = (listTitle) => {
  if (!SHAREPOINT_CONFIG.siteUrl) {
    throw new Error('REACT_APP_SHAREPOINT_SITE_URL is required to reach SharePoint.');
  }
  if (!listTitle) {
    throw new Error('A SharePoint list title is required.');
  }
};

const buildHeaders = (hasBody = false, extraHeaders = {}) => {
  const headers = {
    Accept: 'application/json;odata=nometadata',
    ...extraHeaders,
  };
  if (hasBody) {
    headers['Content-Type'] = 'application/json;odata=nometadata';
  }
  if (process.env.REACT_APP_SHAREPOINT_ACCESS_TOKEN) {
    headers.Authorization = `Bearer ${process.env.REACT_APP_SHAREPOINT_ACCESS_TOKEN}`;
  }
  return headers;
};

const fetchPage = async (url, accumulated = []) => {
  const response = await fetch(url, {
    headers: buildHeaders(),
    credentials: 'include',
  });
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(`SharePoint request failed (${response.status}): ${message}`);
  }
  const payload = await response.json();
  const items = extractItems(payload);
  const nextLink = getNextLink(payload);
  const normalized = items.map(normalizeSharePointRow);
  const merged = accumulated.concat(normalized);
  if (nextLink) {
    return fetchPage(nextLink, merged);
  }
  return merged;
};

export const fetchSharePointListItems = async (listTitle, { select, filter, top = 500 } = {}) => {
  ensureConfiguration(listTitle);
  const normalizedTitle = escapeListTitle(listTitle.trim());
  const baseUrl = `${SHAREPOINT_CONFIG.siteUrl}/_api/web/lists/getbytitle('${normalizedTitle}')/items`;
  const query = [];
  if (select) {
    query.push(`$select=${select}`);
  }
  if (filter) {
    query.push(`$filter=${filter}`);
  }
  if (top) {
    query.push(`$top=${top}`);
  }
  const url = query.length ? `${baseUrl}?${query.join('&')}` : baseUrl;
  return fetchPage(url);
};

const getListBaseUrl = (listTitle) => {
  const normalizedTitle = escapeListTitle(listTitle.trim());
  return `${SHAREPOINT_CONFIG.siteUrl}/_api/web/lists/getbytitle('${normalizedTitle}')/items`;
};

const handleResponse = async (response) => {
  if (response.status === 204) {
    return null;
  }
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const sendListRequest = async (listTitle, { method = 'GET', itemId, body, headers = {} } = {}) => {
  ensureConfiguration(listTitle);
  const baseUrl = getListBaseUrl(listTitle);
  const url = itemId ? `${baseUrl}(${itemId})` : baseUrl;
  const hasBody = body !== undefined && body !== null;
  const response = await fetch(url, {
    method,
    headers: buildHeaders(hasBody, headers),
    credentials: 'include',
    body: hasBody ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(`SharePoint request failed (${response.status}): ${message}`);
  }
  return handleResponse(response);
};

export const createSharePointListItem = async (listTitle, payload) =>
  sendListRequest(listTitle, { method: 'POST', body: payload });

export const updateSharePointListItem = async (listTitle, itemId, payload) =>
  sendListRequest(listTitle, {
    itemId,
    method: 'POST',
    headers: { 'IF-Match': '*', 'X-HTTP-Method': 'MERGE' },
    body: payload,
  });

export const deleteSharePointListItem = async (listTitle, itemId) =>
  sendListRequest(listTitle, { itemId, method: 'POST', headers: { 'IF-Match': '*', 'X-HTTP-Method': 'DELETE' } });

export { SHAREPOINT_CONFIG };
