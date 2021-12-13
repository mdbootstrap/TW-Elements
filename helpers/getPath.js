const path = require('path');
const root = path.join(__dirname, '..', '..');

const getPath = (dir) => path.join(root, dir);

module.exports = getPath;
