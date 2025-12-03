const fs = require('fs');
const path = require('path');

const duoIndexPath = path.join(
  __dirname,
  '..',
  'node_modules',
  '@duosecurity',
  'duo_universal',
  'dist',
  'index.js'
);

if (!fs.existsSync(duoIndexPath)) {
  console.warn('duo_universal not installed yet; skipping jose patch');
  process.exit(0);
}

let content = fs.readFileSync(duoIndexPath, 'utf8');

if (content.includes('load_jose')) {
  console.log('duo_universal jose patch already applied');
  process.exit(0);
}

const replacements = [
  {
    from: 'var import_jose = require("jose");',
    to: [
      'var import_jose;',
      'var import_jose_promise;',
      'var load_jose = async () => {',
      '  import_jose_promise ??= import("jose");',
      '  import_jose ??= await import_jose_promise;',
      '  return import_jose;',
      '};'
    ].join('\n')
  },
  {
    from: '  async createJwtPayload(audience) {\n    const timeInSecs = getTimeInSeconds();',
    to: '  async createJwtPayload(audience) {\n    const jose = await load_jose();\n    const timeInSecs = getTimeInSeconds();'
  },
  {
    from: 'const jwt = await new import_jose.SignJWT(',
    to: 'const jwt = await new jose.SignJWT('
  },
  {
    from: '  async verifyToken(token) {\n    const tokenEndpoint = `${this.baseURL}${this.TOKEN_ENDPOINT}`;',
    to: '  async verifyToken(token) {\n    const jose = await load_jose();\n    const tokenEndpoint = `${this.baseURL}${this.TOKEN_ENDPOINT}`;'
  },
  {
    from: 'const decoded = await (0, import_jose.jwtVerify)(token, this.clientSecret, {',
    to: 'const decoded = await (0, jose.jwtVerify)(token, this.clientSecret, {'
  },
  {
    from: '  async createAuthUrl(username, state) {\n    if (!username) throw new DuoException(DUO_USERNAME_ERROR);',
    to: '  async createAuthUrl(username, state) {\n    const jose = await load_jose();\n    if (!username) throw new DuoException(DUO_USERNAME_ERROR);'
  },
  {
    from: 'const request = await new import_jose.SignJWT(payload).setProtectedHeader({ alg: SIG_ALGORITHM }).sign(this.clientSecret);',
    to: 'const request = await new jose.SignJWT(payload).setProtectedHeader({ alg: SIG_ALGORITHM }).sign(this.clientSecret);'
  }
];

for (const { from, to } of replacements) {
  if (!content.includes(from)) {
    console.error('Expected snippet not found while patching duo_universal:', from);
    process.exit(1);
  }
  content = content.replace(from, to);
}

fs.writeFileSync(duoIndexPath, content);
console.log('Patched duo_universal to use dynamic import for jose (avoids ESM require error).');
