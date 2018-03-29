const path = require('path');
const fs = require('fs');
const COMMITMSG_FILE = './commit-msg.txt';
const ESLINT_FILE = './eslintrc.txt';

const root = path.resolve(__dirname, '..', '..');
const hookDir = path.resolve(root, '.git', './hooks');

const ESLINT_SOURCE = path.resolve(root, './');
const ESLINT_FILE_PATH = `${ESLINT_SOURCE}/.eslintrc`;
const ESLINT_FILE_NAMES_SEARCH = ['.eslintrc', '.eslintrc.js', '.eslintrc.yaml'];

function readFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

function writeFile(raw, target) {
  return new Promise((resolve, reject) => {
    fs.writeFile(target, raw, { mode: '0755' }, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function checkFile() {
  for (let i = 0; i < ESLINT_FILE_NAMES_SEARCH.length; i++) {
    try {
      fs.statSync(`${ESLINT_SOURCE}/${ESLINT_FILE_NAMES_SEARCH[i]}`);
      return true;
    } catch (error) {
      continue;
    }
  }
  return false;
}

readFile(COMMITMSG_FILE)
  .then(raw => writeFile(raw, `${hookDir}/commit-msg`))
  .then(() => console.log('Git commit-msg set up success!'))
  .catch(e => console.log(`Git commit-msg set up fail due to: ${e}`));

if (!checkFile()) {
  readFile(ESLINT_FILE)
    .then(raw => writeFile(raw, ESLINT_FILE_PATH));
}
