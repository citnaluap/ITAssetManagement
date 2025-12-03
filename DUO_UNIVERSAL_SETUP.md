# Duo Universal Prompt Setup Guide

This application now uses **Duo Universal Prompt** for authentication instead of the previous OIDC/SSO approach.

## What Changed

- **Before**: Duo SSO with OIDC (full OAuth 2.0 + OpenID Connect flow)
- **After**: Duo Universal Prompt (simpler 2FA integration with username/password + Duo push/SMS/call)

## Setup Steps

### 1. Create a Duo Application

1. Log into your [Duo Admin Panel](https://admin.duosecurity.com/)
2. Navigate to **Applications** → **Protect an Application**
3. Search for **Web SDK** and click **Protect**
4. Note down these values:
   - **Client ID**
   - **Client Secret**
   - **API Hostname** (e.g., `api-xxxxxxxx.duosecurity.com`)

### 2. Configure Duo Application

In your Duo application settings:

- **Redirect URIs**: Add `https://it-asset-management-ten.vercel.app/auth/callback`
  - For local development, also add: `http://localhost:3000/auth/callback`
- **Username normalization**: Set to your preference (typically "None")

### 3. Set Environment Variables

Add these to your Vercel project or `.env` file:

```bash
DUO_CLIENT_ID=your_client_id_here
DUO_CLIENT_SECRET=your_client_secret_here
DUO_API_HOST=api-xxxxxxxx.duosecurity.com
DUO_REDIRECT_URI=https://it-asset-management-ten.vercel.app/auth/callback
SESSION_SECRET=a_long_random_string_for_cookie_signing
```

For local development (`.env.local`):

```bash
DUO_CLIENT_ID=your_client_id_here
DUO_CLIENT_SECRET=your_client_secret_here
DUO_API_HOST=api-xxxxxxxx.duosecurity.com
DUO_REDIRECT_URI=http://localhost:3000/auth/callback
SESSION_SECRET=dev_secret_change_in_production
```

### 4. Install Dependencies

```bash
npm install
```

This will install the `@duosecurity/duo_universal` SDK package.

### 5. Test the Flow

1. Start your development server: `npm start`
2. Navigate to the app
3. Enter your username on the login page
4. You'll be redirected to Duo's Universal Prompt
5. Complete the 2FA challenge (push notification, SMS, or call)
6. You'll be redirected back and logged in

## User Experience

### Login Flow:
1. User enters their **username** on your app's login page
2. User is redirected to **Duo Universal Prompt**
3. User completes **2FA verification** (push/SMS/call)
4. User is redirected back and **authenticated**

### Session Management:
- Sessions last **1 hour** by default
- Sessions are stored in **HTTP-only cookies**
- Auto-logout when session expires

## Troubleshooting

### "Missing Duo configuration" error
- Ensure all environment variables are set correctly
- Verify `DUO_API_HOST` doesn't include `https://` prefix

### "Invalid state" error
- Check that cookies are enabled
- Ensure your redirect URI matches exactly in Duo admin panel
- Verify SESSION_SECRET is consistent

### "Authentication failed" error
- Confirm the user exists in your Duo account
- Check that the user is enrolled in Duo 2FA
- Verify Client ID and Secret are correct

## Benefits Over Previous Approach

1. **Simpler Setup**: No need for OIDC/JWKS configuration
2. **Better UX**: Traditional 2FA flow that users are familiar with
3. **More Control**: Works with local user database + Duo 2FA
4. **Easier Testing**: Can test with Duo's test users
5. **No SSO Required**: Works without enterprise SSO setup

## Migration Notes

- Old endpoints (`/api/auth/duo/*`) are no longer used
- New endpoints are at `/api/auth/universal/*`
- Sessions are still cookie-based with same security
- No changes needed to the main application logic

## Next Steps

Once configured, you can:
- Integrate with your user database for username validation
- Customize the session duration
- Add remember-me functionality
- Implement user enrollment flows
