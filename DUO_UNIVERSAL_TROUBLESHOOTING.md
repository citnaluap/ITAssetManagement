# Duo Universal Prompt SDK v4 - Comprehensive Research & Troubleshooting Guide

**Date:** December 4, 2025  
**Package:** @duosecurity/duo_universal v3.0.0  
**Error:** "Cannot read properties of undefined (reading 'length')" at line 630

---

## Executive Summary

The error occurs in the Duo SDK's `validateInitialConfig` method when it tries to validate the `clientId.length` but receives `undefined` for one or more required parameters. The root cause is improper handling of environment variables that can be `undefined` or empty strings.

---

## 1. ROOT CAUSE ANALYSIS

### The Error Location
```javascript
// Line 628-630 in node_modules/@duosecurity/duo_universal/dist/index.js
validateInitialConfig(options) {
  const { clientId, clientSecret, apiHost, redirectUrl } = options;
  if (clientId.length !== CLIENT_ID_LENGTH)  // LINE 630 - ERROR HERE
    throw new DuoException(INVALID_CLIENT_ID_ERROR);
  // ...
}
```

### Why It Happens
When you call:
```javascript
const client = new duoClient.Client({
  clientId,      // If this is undefined
  clientSecret,  // Or this is undefined
  apiHost,       // Or this is undefined
  redirectUrl,   // Or this is undefined
});
```

The SDK attempts to validate `clientId.length` but if `clientId` is `undefined`, JavaScript throws: `"Cannot read properties of undefined (reading 'length')"`

### The Bug in Original Code

**In `callback.js` line 40:**
```javascript
const redirectUrl = (process.env.DUO_REDIRECT_URI || `https://${req.headers.host}/api/auth/universal/callback`).trim();
```

**Problem:** If `process.env.DUO_REDIRECT_URI` is:
- `undefined` → fallback works ✓
- Empty string `""` → Empty string is truthy in `||` check, so `.trim()` returns `""` → validation fails ✗
- Whitespace `"   "` → `.trim()` returns `""` → validation fails ✗

**In `callback.js` line 37:**
```javascript
const clientId = process.env.DUO_CLIENT_ID?.trim();
```

**Problem:** If `DUO_CLIENT_ID` is not set, this evaluates to `undefined`, not an empty string.

---

## 2. CORRECT CLIENT CONSTRUCTOR SIGNATURE

### Version 3.0.0 Object-Based Constructor

```javascript
import { Client } from '@duosecurity/duo_universal';

const client = new Client({
  clientId: 'DI4RGGXF0A5UMPX9O17R',           // Required: EXACTLY 20 characters
  clientSecret: 'your-40-char-secret-here',   // Required: EXACTLY 40 characters
  apiHost: 'api-a185ca23.duosecurity.com',    // Required: Duo API hostname
  redirectUrl: 'https://your-app.com/callback', // Required: Valid HTTPS URL
  useDuoCodeAttribute: true                    // Optional: defaults to true
});
```

### TypeScript Type Definition
```typescript
type ClientOptions = {
    clientId: string;        // Must be exactly 20 characters
    clientSecret: string;    // Must be exactly 40 characters
    apiHost: string;         // Must not be empty
    redirectUrl: string;     // Must be a valid URL (checked with new URL())
    useDuoCodeAttribute?: boolean; // Optional
};
```

### Validation Rules
1. **clientId:** Must be exactly 20 characters (`CLIENT_ID_LENGTH = 20`)
2. **clientSecret:** Must be exactly 40 characters (`CLIENT_SECRET_LENGTH = 40`)
3. **apiHost:** Must not be an empty string
4. **redirectUrl:** Must be a valid URL (validated with `new globalThis.URL(redirectUrl)`)

---

## 3. CORRECT IMPLEMENTATION

### ✅ Fixed start.js
```javascript
// api/auth/universal/start.js
module.exports = async (req, res) => {
  // Handle undefined environment variables properly
  const clientId = process.env.DUO_CLIENT_ID?.trim() || '';
  const clientSecret = process.env.DUO_CLIENT_SECRET?.trim() || '';
  const apiHost = process.env.DUO_API_HOST?.trim() || '';
  const redirectUrlFromEnv = process.env.DUO_REDIRECT_URI?.trim();
  const redirectUrl = redirectUrlFromEnv || `https://${req.headers.host}/api/auth/universal/callback`;

  // Validate before proceeding
  if (!clientId || !clientSecret || !apiHost || !redirectUrl) {
    res.statusCode = 500;
    res.end('Missing Duo configuration');
    return;
  }

  // Create Duo client with object-based constructor
  const duoClient = require('@duosecurity/duo_universal');
  const client = new duoClient.Client({
    clientId,
    clientSecret,
    apiHost,
    redirectUrl,
  });

  // Generate state and auth URL
  const username = req.query.username?.trim();
  const state = crypto.randomBytes(32).toString('hex');
  const authUrl = await client.createAuthUrl(username, state);

  // Redirect to Duo
  res.statusCode = 302;
  res.setHeader('Location', authUrl);
  res.end();
};
```

### ✅ Fixed callback.js
```javascript
// api/auth/universal/callback.js
module.exports = async (req, res) => {
  // Handle undefined environment variables properly
  const clientId = process.env.DUO_CLIENT_ID?.trim() || '';
  const clientSecret = process.env.DUO_CLIENT_SECRET?.trim() || '';
  const apiHost = process.env.DUO_API_HOST?.trim() || '';
  const redirectUrlFromEnv = process.env.DUO_REDIRECT_URI?.trim();
  const redirectUrl = redirectUrlFromEnv || `https://${req.headers.host}/api/auth/universal/callback`;

  console.log('Callback Duo config:', {
    hasClientId: !!clientId,
    clientIdLength: clientId?.length,
    hasClientSecret: !!clientSecret,
    clientSecretLength: clientSecret?.length,
    hasApiHost: !!apiHost,
    apiHost,
    redirectUrl,
  });

  // Validate before proceeding
  if (!clientId || !clientSecret || !apiHost || !redirectUrl) {
    console.error('Missing Duo configuration');
    res.statusCode = 500;
    res.end('Missing Duo configuration');
    return;
  }

  const { state, duo_code } = req.query;
  const cookies = parseCookies(req);
  const savedState = cookies.duo_state;
  const username = cookies.duo_username;

  // Validate state and code
  if (!state || !duo_code || !savedState || state !== savedState) {
    res.statusCode = 400;
    res.end('Invalid request');
    return;
  }

  try {
    const duoClient = require('@duosecurity/duo_universal');
    const client = new duoClient.Client({
      clientId,
      clientSecret,
      apiHost,
      redirectUrl,
    });
    
    // Exchange code for token
    const decodedToken = await client.exchangeAuthorizationCodeFor2FAResult(duo_code, username.trim());
    
    // Create session and redirect
    // ... session handling code ...
    
  } catch (error) {
    console.error('Duo authentication error:', error);
    res.statusCode = 500;
    res.end(`Authentication failed: ${error.message}`);
  }
};
```

---

## 4. ENVIRONMENT VARIABLES

### Required Environment Variables

Set these in your Vercel project settings:

```bash
DUO_CLIENT_ID=DI4RGGXF0A5UMPX9O17R
DUO_CLIENT_SECRET=your-40-character-secret-here
DUO_API_HOST=api-a185ca23.duosecurity.com
DUO_REDIRECT_URI=https://it-asset-management-ten.vercel.app/api/auth/universal/callback
SESSION_SECRET=your-random-session-secret
```

### ⚠️ Common Pitfalls

1. **Leading/Trailing Whitespace:** Always trim environment variables
2. **Empty Strings:** Use `|| ''` fallback to convert `undefined` to `""`
3. **Missing Variables:** Vercel environment variables must be set for production/preview/development
4. **URL Validation:** `redirectUrl` must be a valid HTTPS URL
5. **Case Sensitivity:** Environment variable names are case-sensitive

---

## 5. DUO UNIVERSAL PROMPT WORKFLOW

### Complete Authentication Flow

```javascript
// 1. Import the SDK
const { Client } = require('@duosecurity/duo_universal');

// 2. Create Client Instance
const client = new Client({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  apiHost: 'api-xxxx.duosecurity.com',
  redirectUrl: 'https://your-app/callback',
});

// 3. Health Check (Optional but Recommended)
try {
  await client.healthCheck();
} catch (error) {
  // Duo servers are unreachable - decide to fail open or closed
}

// 4. Generate State (CSRF Protection)
const state = client.generateState();
// Store state in session/cookie for later verification

// 5. Create Authorization URL
const authUrl = await client.createAuthUrl(username, state);

// 6. Redirect User to Duo
res.redirect(authUrl);

// 7. Handle Callback
// User returns to your callback URL with ?state=xxx&duo_code=xxx

// 8. Validate State
if (req.query.state !== storedState) {
  // CSRF attack detected
  throw new Error('State mismatch');
}

// 9. Exchange Code for Token
const token = await client.exchangeAuthorizationCodeFor2FAResult(
  req.query.duo_code,
  username
);

// 10. Token Contains User Info
console.log(token.preferred_username);
console.log(token.auth_result.result); // "allow" or "deny"
```

---

## 6. VERCEL SERVERLESS FUNCTION CONSIDERATIONS

### Node.js Runtime Requirements
- **Minimum Node.js version:** v20 or later (as per @duosecurity/duo_universal v3.0.0)
- **TLS Support:** Node.js 20+ uses OpenSSL 1.1.1+ (supports TLS 1.2 and 1.3)

### Vercel Configuration
```json
// vercel.json
{
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs20.x",
      "maxDuration": 30
    }
  }
}
```

### Common Serverless Issues

1. **Cold Starts:** First request may be slow
2. **Statelessness:** Cannot store state in memory; use cookies or database
3. **Timeout:** Default is 10s, max is 60s for Pro accounts
4. **Environment Variables:** Must be set in Vercel dashboard for each environment

---

## 7. DUO ADMIN PANEL CONFIGURATION

### Required Settings

1. **Application Type:** Web SDK
2. **Client ID:** Copy to `DUO_CLIENT_ID`
3. **Client Secret:** Copy to `DUO_CLIENT_SECRET`
4. **API Hostname:** Copy to `DUO_API_HOST`
5. **User Access:** Grant access to Duo users/groups
6. **Universal Prompt:** Enable "Show new Universal Prompt"

### Redirect URI Registration
**Important:** The redirect URI does **NOT** need to be registered in Duo Admin Panel for Web SDK v4. The SDK validates it programmatically.

### Testing Checklist
- ✅ Application created in Duo Admin Panel
- ✅ User access granted to test user
- ✅ Universal Prompt enabled
- ✅ Test user has enrolled MFA device
- ✅ Environment variables set correctly
- ✅ Time synchronization (NTP) on server

---

## 8. DEBUGGING TIPS

### Enable Detailed Logging
```javascript
console.log('Duo config:', {
  hasClientId: !!clientId,
  clientIdLength: clientId?.length,
  clientIdValue: clientId?.substring(0, 4) + '...',
  hasClientSecret: !!clientSecret,
  clientSecretLength: clientSecret?.length,
  clientSecretValue: clientSecret?.substring(0, 5) + '...',
  apiHost,
  redirectUrl,
});
```

### Test Environment Variables Locally
```javascript
// Create a test.js file
require('dotenv').config();
console.log({
  DUO_CLIENT_ID: process.env.DUO_CLIENT_ID?.length,
  DUO_CLIENT_SECRET: process.env.DUO_CLIENT_SECRET?.length,
  DUO_API_HOST: process.env.DUO_API_HOST,
  DUO_REDIRECT_URI: process.env.DUO_REDIRECT_URI,
});
```

### Vercel Logs
```bash
vercel logs --follow
```

---

## 9. KNOWN ISSUES & SOLUTIONS

### Issue 1: "Cannot read properties of undefined (reading 'length')"
**Cause:** One of the required parameters is `undefined`  
**Solution:** Ensure all environment variables are set and use `|| ''` fallback

### Issue 2: "Invalid client ID" error
**Cause:** Client ID is not exactly 20 characters  
**Solution:** Verify client ID from Duo Admin Panel, check for whitespace

### Issue 3: "Invalid client secret" error
**Cause:** Client secret is not exactly 40 characters  
**Solution:** Regenerate secret in Duo Admin Panel if corrupted

### Issue 4: "Invalid redirect URL" error
**Cause:** Redirect URL is not a valid HTTPS URL  
**Solution:** Ensure URL starts with `https://` and has valid hostname

### Issue 5: State mismatch
**Cause:** State cookie expired or CSRF attack  
**Solution:** Increase cookie max-age, implement session storage

---

## 10. MIGRATION FROM WEB SDK v2 TO v4

### Key Differences

| Feature | Web SDK v2 | Web SDK v4 (Universal) |
|---------|------------|------------------------|
| **Prompt Display** | iFrame | Redirect (frameless) |
| **Constructor** | `new Duo.init(...)` | `new Client({ ... })` |
| **Parameters** | ikey, skey, akey | clientId, clientSecret (no akey) |
| **Signing** | HMAC SHA-1 | HMAC SHA-512 |
| **Protocol** | Proprietary | OIDC-compliant |
| **Health Check** | Not available | `client.healthCheck()` |

### Migration Steps
1. Update package: `npm install @duosecurity/duo_universal@latest`
2. Replace constructor call with object-based syntax
3. Remove `akey` generation logic (not needed in v4)
4. Update parameter names: `ikey` → `clientId`, `skey` → `clientSecret`
5. Test authentication flow end-to-end

---

## 11. ADDITIONAL RESOURCES

### Official Documentation
- [Duo Web SDK v4 Documentation](https://duo.com/docs/duoweb-v4)
- [Universal Prompt Update Guide](https://duo.com/docs/universal-prompt-update-guide)
- [Duo OIDC API](https://duo.com/docs/oauthapi)

### GitHub Repositories
- [duo_universal_nodejs](https://github.com/duosecurity/duo_universal_nodejs)
- [Example Implementation](https://github.com/duosecurity/duo_universal_nodejs/tree/main/example)

### NPM Package
- [@duosecurity/duo_universal](https://www.npmjs.com/package/@duosecurity/duo_universal)

### Support
- [Duo Support](https://duo.com/support)
- [Duo Community Forums](https://community.cisco.com/t5/duo-security/ct-p/duo-security)
- [Duo Knowledge Base](https://help.duo.com/s/global-search/Web%20SDK)

---

## 12. SECURITY BEST PRACTICES

1. **Never commit secrets:** Use environment variables, never hardcode
2. **Use HTTPS only:** Redirect URLs must use HTTPS in production
3. **Validate state:** Always check state parameter to prevent CSRF
4. **Secure cookies:** Use HttpOnly, Secure, SameSite flags
5. **Time synchronization:** Use NTP to keep server time accurate
6. **Fail securely:** Decide fail-open vs fail-closed for health check failures
7. **Rate limiting:** Implement rate limiting on auth endpoints
8. **Log security events:** Log all authentication attempts and failures

---

## 13. TESTING CHECKLIST

- [ ] Environment variables set in Vercel
- [ ] Client ID is exactly 20 characters
- [ ] Client secret is exactly 40 characters
- [ ] API hostname is correct format (api-xxxxx.duosecurity.com)
- [ ] Redirect URL is valid HTTPS URL
- [ ] Test user exists in Duo with Active status
- [ ] Test user has enrolled MFA device
- [ ] User access granted in Duo application settings
- [ ] Universal Prompt enabled in Duo application
- [ ] Node.js version is 20 or higher
- [ ] Health check passes
- [ ] State generation works
- [ ] Auth URL creation succeeds
- [ ] Redirect to Duo works
- [ ] Callback receives state and duo_code
- [ ] State validation passes
- [ ] Token exchange succeeds
- [ ] Session creation works
- [ ] User redirected to app successfully

---

**Document Version:** 1.0  
**Last Updated:** December 4, 2025  
**Prepared by:** GitHub Copilot (Claude Sonnet 4.5)
