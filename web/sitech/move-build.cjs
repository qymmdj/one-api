const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'dist');
const destDir = path.join(__dirname, '..', 'build', 'sitech');

if (fs.existsSync(destDir)) {
  fs.rmSync(destDir, { recursive: true, force: true });
}

if (fs.existsSync(srcDir)) {
  fs.renameSync(srcDir, destDir);
  console.log('Build output moved to ../build/sitech');
}
