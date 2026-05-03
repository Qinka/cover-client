// postinstall script: configure electron path.txt so that electron-vite can find the binary
// after 'yarn install'. This runs after npm/yarn installs the electron package.
const path = require('path');
const fs = require('fs');

const electronDir = path.join(__dirname, '../node_modules/electron');
const pathFile = path.join(electronDir, 'path.txt');
const distDir = path.join(electronDir, 'dist');

// Check if the electron binary exists in dist/
if (fs.existsSync(path.join(distDir, 'electron'))) {
  // Write just 'electron' — electron-vite will prepend dist/ from ELECTRON_OVERRIDE_DIST_PATH
  // or use the relative path from node_modules/electron
  fs.writeFileSync(pathFile, 'electron');
  console.log('[postinstall] Configured electron path.txt');
} else {
  console.warn('[postinstall] electron binary not found in', distDir, '- skipping path.txt');
}
