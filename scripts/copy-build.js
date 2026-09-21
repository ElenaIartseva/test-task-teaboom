const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const buildDir = path.join(rootDir, 'build');

const entriesToCopy = [
  'index.html',
  '.nojekyll',
  'assets',
  'css',
  'js',
];

fs.rmSync(buildDir, { recursive: true, force: true });
fs.mkdirSync(buildDir, { recursive: true });

entriesToCopy.forEach((entry) => {
  const source = path.join(rootDir, entry);
  const destination = path.join(buildDir, entry);

  if (!fs.existsSync(source)) {
    return;
  }

  fs.cpSync(source, destination, { recursive: true });
});

console.log('Static build created in build/');
