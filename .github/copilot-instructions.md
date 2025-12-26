

# Copilot Instructions for UDS Asset Management

## Project Architecture & Data Flow
- **Monorepo**: Contains main React app (`src/`), HelpDesk portal (`helpdesk-portal/`), serverless API (`api/`), and SharePoint dashboard (`udsAssetDashboard/`).
- **Data sources**: Asset, employee, software, and vendor records are loaded from Excel or SharePoint at runtime, then normalized. See `src/App.js` (`buildAssetsFromSheet`, `normalizeKey`).
- **Critical flows**: Asset lifecycle, onboarding/offboarding, license management, and HelpDesk ticketing are core to the app's logic.

## Data & State Patterns
- **Normalization**: All loaded data (Excel/SharePoint) must be normalized using helpers in `src/App.js`.
- **State**: Managed via React hooks and `usePersistentState` (localStorage-backed) in `src/App.js`.
- **Excel/SharePoint sync**: Data can be hydrated from SharePoint lists (see SharePoint env vars below) or fallback to bundled Excel exports.

## Key Components & Integration
- **API**: Node.js serverless endpoints in `api/` (deployed via Vercel, local: Vercel CLI or `npm start`).
- **HelpDesk portal**: Standalone React app in `helpdesk-portal/`, built/copied to `public/helpdesk-portal/` for prod. Linked via `REACT_APP_HELPDESK_PORTAL_URL`.
- **SharePoint dashboard**: SPFx web part in `udsAssetDashboard/` (TypeScript, Gulp), syncs with SharePoint lists using `REACT_APP_SHAREPOINT_SITE_URL` and related env vars.

## Developer Workflows
- **Main app**: `npm start` (dev), `npm run build` (prod)
- **HelpDesk portal**: `cd helpdesk-portal && npm install && npm start` (dev), `npm run sync:helpdesk` (build/copy for prod)
- **SharePoint dashboard**: `cd udsAssetDashboard && npm install && gulp serve` (dev/test)
- **Testing**: `npm test` (React Testing Library)

## Project-Specific Conventions
- **Environment variables**: Use `.env.local` for secrets and URLs. See `DUO_UNIVERSAL_TROUBLESHOOTING.md` and `README.md` for required variables (e.g., SharePoint, HelpDesk, Duo SSO).
- **Component structure**: `src/App.js` is monolithic with many hooks/helpers; smaller components in `src/` and `helpdesk-portal/src/`.
- **Styling**: Tailwind CSS and custom SCSS modules are used throughout.
- **Cross-app links**: Use `REACT_APP_HELPDESK_PORTAL_URL` for dev/prod linking between main app and HelpDesk portal.

## Integration & External Dependencies
- **Duo SSO**: See `api/auth/universal/` and `DUO_UNIVERSAL_TROUBLESHOOTING.md` for setup and troubleshooting.
- **Excel parsing**: Uses `xlsx` for reading asset/employee data (see `scripts/sync-assets.js`).
- **QR/Barcode**: Uses `@zxing/browser` and `jsqr` for scanning.
- **SharePoint**: SPFx web part integrates with Microsoft 365; see `udsAssetDashboard/README.md` for setup and environment variables.

## Examples & References
- **Asset normalization**: `src/App.js` (`setAssets`, `buildAssetsFromSheet`)
- **HelpDesk build & sync**: See `README.md` > HelpDesk portal section and `scripts/sync-helpdesk.js`
- **Duo SSO troubleshooting**: `DUO_UNIVERSAL_TROUBLESHOOTING.md`
- **SharePoint dashboard**: `udsAssetDashboard/README.md`

---

**For new features:**
- Follow normalization and state patterns in `src/App.js`.
- Add new API endpoints to `api/` and document in the main README.
- For cross-app features, update environment variables and build steps as needed.
