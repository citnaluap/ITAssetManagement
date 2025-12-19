# Copilot Instructions for UDS Asset Management

## Project Overview
- **Monorepo** with main React app (`src/`), HelpDesk portal (`helpdesk-portal/`), API serverless functions (`api/`), and SharePoint dashboard (`udsAssetDashboard/`).
- **Primary data**: Asset, employee, software, and vendor records, often loaded from Excel workbooks at runtime.
- **Critical flows**: Asset lifecycle, software license management, employee onboarding/offboarding, and HelpDesk ticketing.

## Key Architectural Patterns
- **Data loading**: Excel files are fetched and parsed at runtime (see `src/App.js`, e.g., `XLSX.read(buffer, { type: 'array' })`).
- **State**: Uses React hooks and custom `usePersistentState` for localStorage-backed state.
- **API**: Serverless endpoints in `api/` (Node.js, e.g., `/api/auth/universal/callback.js` for Duo SSO).
- **HelpDesk**: Standalone React app in `helpdesk-portal/`, built and copied into `public/helpdesk-portal/` for production.
- **SharePoint**: SPFx web part in `udsAssetDashboard/` (TypeScript, Gulp).

## Developer Workflows
- **Main app**: `npm start` (root) for local dev, `npm run build` for production.
- **HelpDesk portal**: `cd helpdesk-portal && npm install && npm start` (dev), `npm run sync:helpdesk` (build/copy for prod).
- **SharePoint dashboard**: `cd udsAssetDashboard && npm install && gulp serve`.
- **API**: Deployed as Vercel serverless functions; local dev via Vercel CLI or `npm start`.
- **Testing**: Uses React Testing Library; run with `npm test`.

## Project-Specific Conventions
- **Environment variables**: Managed via `.env.local` (see `DUO_UNIVERSAL_TROUBLESHOOTING.md` for required keys).
- **Data normalization**: Asset/employee data is normalized on load (see `buildAssetsFromSheet`, `normalizeKey`).
- **Component structure**: Large, monolithic `App.js` with many hooks and helpers; smaller components in `src/` and `helpdesk-portal/src/`.
- **Styling**: Tailwind CSS and custom SCSS modules.
- **Cross-app links**: Use `REACT_APP_HELPDESK_PORTAL_URL` to link main app to HelpDesk portal in dev.

## Integration & External Dependencies
- **Duo SSO**: See `api/auth/universal/` and `DUO_UNIVERSAL_TROUBLESHOOTING.md` for setup, migration, and debugging.
- **Excel parsing**: Uses `xlsx` for reading asset/employee data.
- **QR/Barcode**: Uses `@zxing/browser` and `jsqr` for scanning.
- **SharePoint**: SPFx web part integrates with Microsoft 365.

## Examples & References
- **Asset normalization**: `src/App.js` (`setAssets`, `buildAssetsFromSheet`)
- **HelpDesk build**: `README.md` > HelpDesk portal section
- **Duo SSO troubleshooting**: `DUO_UNIVERSAL_TROUBLESHOOTING.md`
- **SharePoint dashboard**: `udsAssetDashboard/README.md`

---

**For new features:**
- Follow data normalization and state management patterns in `src/App.js`.
- For new API endpoints, add to `api/` and document in the main README.
- For cross-app features, ensure environment variables and build steps are updated.
