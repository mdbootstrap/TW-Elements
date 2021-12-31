const fs = require('fs-extra');

try {
  fs.copySync('dist/js/index.min.js', 'site/static/js/index.min.js');
  console.log('Successfully copied index.min.js');
} catch (err) {
  console.log('Failed to copy index.min.js');
}

try {
  fs.copySync('dist/js/index.min.js.map', 'site/static/js/index.min.js.map');
  console.log('Successfully copied index.min.js.map');
} catch (err) {
  console.log('Failed to copy index.min.js.map');
}

try {
  fs.copySync('dist/bs-styles.js', 'site/static/js/bs-styles.js');
  console.log('Successfully copied bs-styles.js');
} catch (err) {
  console.log('Failed to copy bs-styles.js');
}

try {
  fs.copySync('dist/plugin.js', 'site/static/js/plugin.js');
  console.log('Successfully copied plugin.js');
} catch (err) {
  console.log('Failed to copy plugin.js');
}
