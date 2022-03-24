const { parse } = require('css');
const stylis = require('stylis');

const SEL = '_';
const SELRE = new RegExp('^' + SEL);
const media = {};
const keyframes = {};
const keys = [];

const toObj = (css, opts) => {
  const wrapped = stylis(SEL, css);
  const ast = parse(wrapped);
  const obj = transform(opts)(ast.stylesheet.rules);
  return { ...obj, ...media, ...keyframes };
};

const transform =
  (opts) =>
  (rules, result = {}) => {
    rules.forEach((rule) => {
      if (rule.type === 'media') {
        const key = '@media ' + rule.media;
        const decs = transform(opts)(rule.rules);
        if (keys.includes(key)) {
          media[key] = { ...media[key], ...decs };
        } else {
          media[key] = decs;
          keys.push(key);
        }
        return;
      }

      if (rule.type === 'keyframes') {
        const key = '@keyframes ' + rule.name;
        const decs = transform(opts)(rule.keyframes);
        keyframes[key] = decs;
        return;
      }

      const selectors = rule.selectors || rule.values;

      selectors.forEach((selector) => {
        const key = selector.replace(SELRE, '').trim();
        result[key] = { ...result[key], ...getDeclarations(rule.declarations, opts) };
      });
    });

    return result;
  };

const getDeclarations = (decs, opts = {}) => {
  const result = decs
    .map((d) => ({
      key: opts.camelCase ? camel(d.property) : d.property,
      value: opts.numbers ? parsePx(d.value) : d.value,
    }))
    .reduce((a, b) => {
      a[b.key] = b.value;
      return a;
    }, {});
  return result;
};

const camel = (str) => str.replace(/(-[a-z])/g, (x) => x.toUpperCase()).replace(/-/g, '');

const parsePx = (val) => (/px$/.test(val) ? parseFloat(val.replace(/px$/, '')) : val);

module.exports = toObj;
