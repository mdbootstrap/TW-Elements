const fs = require('fs-extra');
const { EOL } = require('os');
const cssToJs = require('./cssToJs');
const cssFile = './src/css/index.css';

fs.watchFile(cssFile, () => {
  fs.readFile(
    cssFile,
    {
      encoding: 'utf-8',
    },
    (_, data) => {
      const cssText = data.toString();
      jsStyle = JSON.stringify(cssToJs(cssText));

      const newLines = [];
      newLines.push('const bsStyles = ');
      newLines.push(jsStyle);
      newLines.push('');
      newLines.push('module.exports = bsStyles;');

      fs.writeFileSync('./src/js/bs-styles.js', newLines.join(EOL), { encoding: 'utf-8' });
      console.log('\x1b[32m%s\x1b[0m', 'Compiled index.css to bs-styles.js');
    }
  );
});
