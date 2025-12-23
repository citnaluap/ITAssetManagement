
# Copilot Instructions for UDS Asset Management

## Project Overview
- **Monorepo**: Contains main React app (`src/`), HelpDesk portal (`helpdesk-portal/`), API serverless functions (`api/`), and SharePoint dashboard (`udsAssetDashboard/`).
- **Data**: Asset, employee, software, and vendor records, typically loaded from Excel workbooks at runtime.
- **Critical flows**: Asset lifecycle, software license management, employee onboarding/offboarding, HelpDesk ticketing.

## Architecture & Data Flow
- **Excel-driven data**: Asset/employee/software/vendor data is loaded and normalized at runtime (see `src/App.js`, `buildAssetsFromSheet`, `normalizeKey`).
- **State**: Managed with React hooks and custom `usePersistentState` (localStorage-backed).
- **API**: Node.js serverless endpoints in `api/` (e.g., `/api/auth/universal/callback.js` for Duo SSO). Deployed via Vercel; local dev via Vercel CLI or `npm start`.
- **HelpDesk portal**: Standalone React app in `helpdesk-portal/`, built and copied to `public/helpdesk-portal/` for production. Linked via `REACT_APP_HELPDESK_PORTAL_URL`.
- **SharePoint dashboard**: SPFx web part in `udsAssetDashboard/` (TypeScript, Gulp), syncs with SharePoint lists using `REACT_APP_SHAREPOINT_SITE_URL` and related env vars.

## Developer Workflows
- **Main app**: `npm start` (dev), `npm run build` (prod).
- **HelpDesk portal**: `cd helpdesk-portal && npm install && npm start` (dev), `npm run sync:helpdesk` (build/copy for prod).
- **SharePoint dashboard**: `cd udsAssetDashboard && npm install && gulp serve` (dev/test).
- **Testing**: `npm test` (React Testing Library).

## Project-Specific Conventions
- **Environment variables**: Use `.env.local` for secrets and URLs (see `DUO_UNIVERSAL_TROUBLESHOOTING.md`).
- **Component structure**: `src/App.js` is monolithic with many hooks/helpers; smaller components in `src/` and `helpdesk-portal/src/`.
- **Styling**: Tailwind CSS and custom SCSS modules.
- **Data normalization**: Always normalize loaded data (see `buildAssetsFromSheet`, `normalizeKey`).
- **Cross-app links**: Use `REACT_APP_HELPDESK_PORTAL_URL` for dev/prod linking.

## Integration & External Dependencies
- **Duo SSO**: See `api/auth/universal/` and `DUO_UNIVERSAL_TROUBLESHOOTING.md` for setup/debugging.
- **Excel parsing**: Uses `xlsx` for reading asset/employee data.
- **QR/Barcode**: Uses `@zxing/browser` and `jsqr` for scanning.
- **SharePoint**: SPFx web part integrates with Microsoft 365; see `udsAssetDashboard/README.md` for setup.

## Examples & References
- **Asset normalization**: `src/App.js` (`setAssets`, `buildAssetsFromSheet`)
- **HelpDesk build**: See `README.md` > HelpDesk portal section
- **Duo SSO troubleshooting**: `DUO_UNIVERSAL_TROUBLESHOOTING.md`
- **SharePoint dashboard**: `udsAssetDashboard/README.md`

---

**For new features:**
- Follow data normalization and state management patterns in `src/App.js`.
- For new API endpoints, add to `api/` and document in the main README.
- For cross-app features, update environment variables and build steps as needed.
