const fs = require('fs-extra');

try {
  fs.copySync('dist/css/index.min.css', 'site/static/css/index.min.css');
  console.log('Successfully copied index.min.css');
} catch (err) {
  console.log('Failed to copy index.min.css');
}

try {
  fs.copySync('dist/js/index.min.js', 'site/static/js/index.min.js');
  console.log('Successfully copied index.min.js');
} catch (err) {
  console.log('Failed to copy index.min.js');
}
