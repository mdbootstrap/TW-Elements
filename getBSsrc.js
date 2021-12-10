const fs = require('fs-extra');

try {
  fs.copySync('node_modules/bootstrap/js', 'src/js/bs');
  fs.copySync('node_modules/bootstrap/scss', 'src/scss/bs');
  console.log('Bootstrap source code successfully copied!');
} catch (err) {
  console.log('Failed to copy Bootstrap source code!');
}
