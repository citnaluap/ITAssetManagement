# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## HelpDesk portal

The HelpDesk experience lives in `helpdesk-portal/` as a standalone CRA app that can be run independently or co-served through this repo.

### Development
1. Install dependencies inside the portal folder if you haven't already: `cd helpdesk-portal && npm install`.
2. Start the portal on its own dev server with `npm start` (defaults to `http://localhost:3001`).
3. If you also run the main Assets app, set `REACT_APP_HELPDESK_PORTAL_URL` (for example via `.env.local`) to the portal URL above so the “Open HelpDesk Portal” button jumps to that host instead of the assets UI.

### Production
1. Run `npm run sync:helpdesk` from this repo root. It builds `helpdesk-portal` and copies the output into `public/helpdesk-portal`, so the assets bundle can serve it at `/helpdesk-portal/`.
2. Deploy the built Assets app (for example with `npm run build`). The fallback `HELP_DESK_PORTAL_URL` value already points at `/helpdesk-portal/`, so visitors hitting the HelpDesk link will land on the portal content.

## SharePoint sync

The dashboard can now hydrate its asset and employee data directly from SharePoint lists. Provide the SharePoint site URL and optional list names via `REACT_APP_*` environment variables (for example in `.env.local`) before running `npm start`. The defaults are `Asset List` and `Employee Information Hub`.

Required variables:
1. `REACT_APP_SHAREPOINT_SITE_URL`: the base site URL (for example `https://<tenant>.sharepoint.com/sites/<site>/Lists`).
2. `REACT_APP_SHAREPOINT_ASSET_LIST` / `REACT_APP_SHAREPOINT_EMPLOYEE_LIST`: override the SharePoint list titles when they differ from the defaults.

Optional helpers:
- `REACT_APP_SHAREPOINT_ACCESS_TOKEN`: an OAuth bearer token issued via Azure AD or a SharePoint app registration if you cannot rely on browser cookie authentication.
- `REACT_APP_SHAREPOINT_FIELD_MAP`: a JSON object remapping normalized SharePoint column names (spaces are preserved after `_x0020_` decoding) to the field headers the dashboard expects; use this when your list columns do not match the names in the bundled workbooks.

When SharePoint is configured the UI follows REST pagination, normalizes field names, and replaces the embedded JSON data. Sync issues log to the console and display a warning banner near the primary navigation. If the variables are left unset, the dashboard keeps using the bundled Excel exports so it still works offline.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
