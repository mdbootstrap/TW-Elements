/* PrismJS 1.14.0
http://prismjs.com/download.html#themes=prism&languages=markup+css+clike+javascript+markup-templating+json+php+typescript+scss&plugins=line-numbers+toolbar+previewers+normalize-whitespace+copy-to-clipboard */
/* PrismJS 1.29.0
https://prismjs.com/download.html#themes=prism&languages=markup+clike+javascript+jsx */

var _self =
  typeof window !== 'undefined'
    ? window // if in browser
    : typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope
    ? self // if in worker
    : {}; // if in node js

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function () {
  // Private helper vars
  var lang = /\blang(?:uage)?-([\w-]+)\b/i;
  var uniqueId = 0;

  var _ = (_self.Prism = {
    manual: _self.Prism && _self.Prism.manual,
    disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
    util: {
      encode: function (tokens) {
        if (tokens instanceof Token) {
          return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
        } else if (_.util.type(tokens) === 'Array') {
          return tokens.map(_.util.encode);
        } else {
          return tokens
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/\u00a0/g, ' ');
        }
      },

      type: function (o) {
        return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
      },

      objId: function (obj) {
        if (!obj['__id']) {
          Object.defineProperty(obj, '__id', { value: ++uniqueId });
        }
        return obj['__id'];
      },

      // Deep clone a language definition (e.g. to extend it)
      clone: function (o, visited) {
        var type = _.util.type(o);
        visited = visited || {};

        switch (type) {
          case 'Object':
            if (visited[_.util.objId(o)]) {
              return visited[_.util.objId(o)];
            }
            var clone = {};
            visited[_.util.objId(o)] = clone;

            for (var key in o) {
              if (o.hasOwnProperty(key)) {
                clone[key] = _.util.clone(o[key], visited);
              }
            }

            return clone;

          case 'Array':
            if (visited[_.util.objId(o)]) {
              return visited[_.util.objId(o)];
            }
            var clone = [];
            visited[_.util.objId(o)] = clone;

            o.forEach(function (v, i) {
              clone[i] = _.util.clone(v, visited);
            });

            return clone;
        }

        return o;
      },
    },

    languages: {
      extend: function (id, redef) {
        var lang = _.util.clone(_.languages[id]);

        for (var key in redef) {
          lang[key] = redef[key];
        }

        return lang;
      },

      /**
       * Insert a token before another token in a language literal
       * As this needs to recreate the object (we cannot actually insert before keys in object literals),
       * we cannot just provide an object, we need anobject and a key.
       * @param inside The key (or language id) of the parent
       * @param before The key to insert before. If not provided, the function appends instead.
       * @param insert Object with the key/value pairs to insert
       * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
       */
      insertBefore: function (inside, before, insert, root) {
        root = root || _.languages;
        var grammar = root[inside];

        if (arguments.length == 2) {
          insert = arguments[1];

          for (var newToken in insert) {
            if (insert.hasOwnProperty(newToken)) {
              grammar[newToken] = insert[newToken];
            }
          }

          return grammar;
        }

        var ret = {};

        for (var token in grammar) {
          if (grammar.hasOwnProperty(token)) {
            if (token == before) {
              for (var newToken in insert) {
                if (insert.hasOwnProperty(newToken)) {
                  ret[newToken] = insert[newToken];
                }
              }
            }

            ret[token] = grammar[token];
          }
        }

        // Update references in other language definitions
        _.languages.DFS(_.languages, function (key, value) {
          if (value === root[inside] && key != inside) {
            this[key] = ret;
          }
        });

        return (root[inside] = ret);
      },

      // Traverse a language definition with Depth First Search
      DFS: function (o, callback, type, visited) {
        visited = visited || {};
        for (var i in o) {
          if (o.hasOwnProperty(i)) {
            callback.call(o, i, o[i], type || i);

            if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
              visited[_.util.objId(o[i])] = true;
              _.languages.DFS(o[i], callback, null, visited);
            } else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
              visited[_.util.objId(o[i])] = true;
              _.languages.DFS(o[i], callback, i, visited);
            }
          }
        }
      },
    },
    plugins: {},

    highlightAll: function (async, callback) {
      _.highlightAllUnder(document, async, callback);
    },

    highlightAllUnder: function (container, async, callback) {
      var env = {
        callback: callback,
        selector:
          'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
      };

      _.hooks.run('before-highlightall', env);

      var elements = env.elements || container.querySelectorAll(env.selector);

      for (var i = 0, element; (element = elements[i++]); ) {
        _.highlightElement(element, async === true, env.callback);
      }
    },

    highlightElement: function (element, async, callback) {
      // Find language
      var language,
        grammar,
        parent = element;

      while (parent && !lang.test(parent.className)) {
        parent = parent.parentNode;
      }

      if (parent) {
        language = (parent.className.match(lang) || [, ''])[1].toLowerCase();
        grammar = _.languages[language];
      }

      // Set language on the element, if not present
      element.className =
        element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

      if (element.parentNode) {
        // Set language on the parent, for styling
        parent = element.parentNode;

        if (/pre/i.test(parent.nodeName)) {
          parent.className =
            parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
        }
      }

      var code = element.textContent;

      var env = {
        element: element,
        language: language,
        grammar: grammar,
        code: code,
      };

      _.hooks.run('before-sanity-check', env);

      if (!env.code || !env.grammar) {
        if (env.code) {
          _.hooks.run('before-highlight', env);
          env.element.textContent = env.code;
          _.hooks.run('after-highlight', env);
        }
        _.hooks.run('complete', env);
        return;
      }

      _.hooks.run('before-highlight', env);

      if (async && _self.Worker) {
        var worker = new Worker(_.filename);

        worker.onmessage = function (evt) {
          env.highlightedCode = evt.data;

          _.hooks.run('before-insert', env);

          env.element.innerHTML = env.highlightedCode;

          callback && callback.call(env.element);
          _.hooks.run('after-highlight', env);
          _.hooks.run('complete', env);
        };

        worker.postMessage(
          JSON.stringify({
            language: env.language,
            code: env.code,
            immediateClose: true,
          })
        );
      } else {
        env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

        _.hooks.run('before-insert', env);

        env.element.innerHTML = env.highlightedCode;

        callback && callback.call(element);

        _.hooks.run('after-highlight', env);
        _.hooks.run('complete', env);
      }
    },

    highlight: function (text, grammar, language) {
      var env = {
        code: text,
        grammar: grammar,
        language: language,
      };
      _.hooks.run('before-tokenize', env);
      env.tokens = _.tokenize(env.code, env.grammar);
      _.hooks.run('after-tokenize', env);
      return Token.stringify(_.util.encode(env.tokens), env.language);
    },

    matchGrammar: function (text, strarr, grammar, index, startPos, oneshot, target) {
      var Token = _.Token;

      for (var token in grammar) {
        if (!grammar.hasOwnProperty(token) || !grammar[token]) {
          continue;
        }

        if (token == target) {
          return;
        }

        var patterns = grammar[token];
        patterns = _.util.type(patterns) === 'Array' ? patterns : [patterns];

        for (var j = 0; j < patterns.length; ++j) {
          var pattern = patterns[j],
            inside = pattern.inside,
            lookbehind = !!pattern.lookbehind,
            greedy = !!pattern.greedy,
            lookbehindLength = 0,
            alias = pattern.alias;

          if (greedy && !pattern.pattern.global) {
            // Without the global flag, lastIndex won't work
            var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
            pattern.pattern = RegExp(pattern.pattern.source, flags + 'g');
          }

          pattern = pattern.pattern || pattern;

          // Don’t cache length as it changes during the loop
          for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {
            var str = strarr[i];

            if (strarr.length > text.length) {
              // Something went terribly wrong, ABORT, ABORT!
              return;
            }

            if (str instanceof Token) {
              continue;
            }

            if (greedy && i != strarr.length - 1) {
              pattern.lastIndex = pos;
              var match = pattern.exec(text);
              if (!match) {
                break;
              }

              var from = match.index + (lookbehind ? match[1].length : 0),
                to = match.index + match[0].length,
                k = i,
                p = pos;

              for (
                var len = strarr.length;
                k < len && (p < to || (!strarr[k].type && !strarr[k - 1].greedy));
                ++k
              ) {
                p += strarr[k].length;
                // Move the index i to the element in strarr that is closest to from
                if (from >= p) {
                  ++i;
                  pos = p;
                }
              }

              // If strarr[i] is a Token, then the match starts inside another Token, which is invalid
              if (strarr[i] instanceof Token) {
                continue;
              }

              // Number of tokens to delete and replace with the new match
              delNum = k - i;
              str = text.slice(pos, p);
              match.index -= pos;
            } else {
              pattern.lastIndex = 0;

              var match = pattern.exec(str),
                delNum = 1;
            }

            if (!match) {
              if (oneshot) {
                break;
              }

              continue;
            }

            if (lookbehind) {
              lookbehindLength = match[1] ? match[1].length : 0;
            }

            var from = match.index + lookbehindLength,
              match = match[0].slice(lookbehindLength),
              to = from + match.length,
              before = str.slice(0, from),
              after = str.slice(to);

            var args = [i, delNum];

            if (before) {
              ++i;
              pos += before.length;
              args.push(before);
            }

            var wrapped = new Token(
              token,
              inside ? _.tokenize(match, inside) : match,
              alias,
              match,
              greedy
            );

            args.push(wrapped);

            if (after) {
              args.push(after);
            }

            Array.prototype.splice.apply(strarr, args);

            if (delNum != 1) _.matchGrammar(text, strarr, grammar, i, pos, true, token);

            if (oneshot) break;
          }
        }
      }
    },

    tokenize: function (text, grammar, language) {
      var strarr = [text];

      var rest = grammar.rest;

      if (rest) {
        for (var token in rest) {
          grammar[token] = rest[token];
        }

        delete grammar.rest;
      }

      _.matchGrammar(text, strarr, grammar, 0, 0, false);

      return strarr;
    },

    hooks: {
      all: {},

      add: function (name, callback) {
        var hooks = _.hooks.all;

        hooks[name] = hooks[name] || [];

        hooks[name].push(callback);
      },

      run: function (name, env) {
        var callbacks = _.hooks.all[name];

        if (!callbacks || !callbacks.length) {
          return;
        }

        for (var i = 0, callback; (callback = callbacks[i++]); ) {
          callback(env);
        }
      },
    },
  });

  var Token = (_.Token = function (type, content, alias, matchedStr, greedy) {
    this.type = type;
    this.content = content;
    this.alias = alias;
    // Copy of the full string this token was created from
    this.length = (matchedStr || '').length | 0;
    this.greedy = !!greedy;
  });

  Token.stringify = function (o, language, parent) {
    if (typeof o == 'string') {
      return o;
    }

    if (_.util.type(o) === 'Array') {
      return o
        .map(function (element) {
          return Token.stringify(element, language, o);
        })
        .join('');
    }

    var env = {
      type: o.type,
      content: Token.stringify(o.content, language, parent),
      tag: 'span',
      classes: ['token', o.type],
      attributes: {},
      language: language,
      parent: parent,
    };

    if (o.alias) {
      var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
      Array.prototype.push.apply(env.classes, aliases);
    }

    _.hooks.run('wrap', env);

    var attributes = Object.keys(env.attributes)
      .map(function (name) {
        return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
      })
      .join(' ');

    return (
      '<' +
      env.tag +
      ' class="' +
      env.classes.join(' ') +
      '"' +
      (attributes ? ' ' + attributes : '') +
      '>' +
      env.content +
      '</' +
      env.tag +
      '>'
    );
  };

  if (!_self.document) {
    if (!_self.addEventListener) {
      // in Node.js
      return _self.Prism;
    }

    if (!_.disableWorkerMessageHandler) {
      // In worker
      _self.addEventListener(
        'message',
        function (evt) {
          var message = JSON.parse(evt.data),
            lang = message.language,
            code = message.code,
            immediateClose = message.immediateClose;

          _self.postMessage(_.highlight(code, _.languages[lang], lang));
          if (immediateClose) {
            _self.close();
          }
        },
        false
      );
    }

    return _self.Prism;
  }

  //Get current script and highlight
  var script =
    document.currentScript || [].slice.call(document.getElementsByTagName('script')).pop();

  if (script) {
    _.filename = script.src;

    if (!_.manual && !script.hasAttribute('data-manual')) {
      if (document.readyState !== 'loading') {
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(_.highlightAll);
        } else {
          window.setTimeout(_.highlightAll, 16);
        }
      } else {
        document.addEventListener('DOMContentLoaded', _.highlightAll);
      }
    }
  }

  return _self.Prism;
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== 'undefined') {
  global.Prism = Prism;
}
Prism.languages.markup = {
  comment: /<!--[\s\S]*?-->/,
  prolog: /<\?[\s\S]+?\?>/,
  doctype: /<!DOCTYPE[\s\S]+?>/i,
  cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
  tag: {
    pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i,
    greedy: true,
    inside: {
      tag: {
        pattern: /^<\/?[^\s>\/]+/i,
        inside: {
          punctuation: /^<\/?/,
          namespace: /^[^\s>\/:]+:/,
        },
      },
      'attr-value': {
        pattern: /=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/i,
        inside: {
          punctuation: [
            /^=/,
            {
              pattern: /(^|[^\\])["']/,
              lookbehind: true,
            },
          ],
        },
      },
      punctuation: /\/?>/,
      'attr-name': {
        pattern: /[^\s>\/]+/,
        inside: {
          namespace: /^[^\s>\/:]+:/,
        },
      },
    },
  },
  entity: /&#?[\da-z]{1,8};/i,
};

Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
  Prism.languages.markup['entity'];

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function (env) {
  if (env.type === 'entity') {
    env.attributes['title'] = env.content.replace(/&amp;/, '&');
  }
});

Prism.languages.xml = Prism.languages.markup;
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;

Prism.languages.css = {
  comment: /\/\*[\s\S]*?\*\//,
  atrule: {
    pattern: /@[\w-]+?.*?(?:;|(?=\s*\{))/i,
    inside: {
      rule: /@[\w-]+/,
      // See rest below
    },
  },
  url: /url\((?:(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
  selector: /[^{}\s][^{};]*?(?=\s*\{)/,
  string: {
    pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: true,
  },
  property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
  important: /\B!important\b/i,
  function: /[-a-z0-9]+(?=\()/i,
  punctuation: /[(){};:]/,
};

Prism.languages.css['atrule'].inside.rest = Prism.languages.css;

if (Prism.languages.markup) {
  Prism.languages.insertBefore('markup', 'tag', {
    style: {
      pattern: /(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i,
      lookbehind: true,
      inside: Prism.languages.css,
      alias: 'language-css',
      greedy: true,
    },
  });

  Prism.languages.insertBefore(
    'inside',
    'attr-value',
    {
      'style-attr': {
        pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
        inside: {
          'attr-name': {
            pattern: /^\s*style/i,
            inside: Prism.languages.markup.tag.inside,
          },
          punctuation: /^\s*=\s*['"]|['"]\s*$/,
          'attr-value': {
            pattern: /.+/i,
            inside: Prism.languages.css,
          },
        },
        alias: 'language-css',
      },
    },
    Prism.languages.markup.tag
  );
}
Prism.languages.clike = {
  comment: [
    {
      pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
      lookbehind: true,
    },
    {
      pattern: /(^|[^\\:])\/\/.*/,
      lookbehind: true,
      greedy: true,
    },
  ],
  string: {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: true,
  },
  'class-name': {
    pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
    lookbehind: true,
    inside: {
      punctuation: /[.\\]/,
    },
  },
  keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
  boolean: /\b(?:true|false)\b/,
  function: /[a-z0-9_]+(?=\()/i,
  number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
  operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
  punctuation: /[{}[\];(),.:]/,
};

Prism.languages.javascript = Prism.languages.extend('clike', {
  keyword: /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
  number: /\b(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
  // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
  function: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\()/i,
  operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/,
});

Prism.languages.insertBefore('javascript', 'keyword', {
  regex: {
    pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[[^\]\r\n]+]|\\.|[^/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})\]]))/,
    lookbehind: true,
    greedy: true,
  },
  // This must be declared before keyword because we use "function" inside the look-forward
  'function-variable': {
    pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=\s*(?:function\b|(?:\([^()]*\)|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i,
    alias: 'function',
  },
  constant: /\b[A-Z][A-Z\d_]*\b/,
});

Prism.languages.insertBefore('javascript', 'string', {
  'template-string': {
    pattern: /`(?:\\[\s\S]|\${[^}]+}|[^\\`])*`/,
    greedy: true,
    inside: {
      interpolation: {
        pattern: /\${[^}]+}/,
        inside: {
          'interpolation-punctuation': {
            pattern: /^\${|}$/,
            alias: 'punctuation',
          },
          rest: null, // See below
        },
      },
      string: /[\s\S]+/,
    },
  },
});
Prism.languages.javascript['template-string'].inside['interpolation'].inside.rest =
  Prism.languages.javascript;

if (Prism.languages.markup) {
  Prism.languages.insertBefore('markup', 'tag', {
    script: {
      pattern: /(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
      lookbehind: true,
      inside: Prism.languages.javascript,
      alias: 'language-javascript',
      greedy: true,
    },
  });
}

Prism.languages.js = Prism.languages.javascript;

Prism.languages['markup-templating'] = {};

Object.defineProperties(Prism.languages['markup-templating'], {
  buildPlaceholders: {
    // Tokenize all inline templating expressions matching placeholderPattern
    // If the replaceFilter function is provided, it will be called with every match.
    // If it returns false, the match will not be replaced.
    value: function (env, language, placeholderPattern, replaceFilter) {
      if (env.language !== language) {
        return;
      }

      env.tokenStack = [];

      env.code = env.code.replace(placeholderPattern, function (match) {
        if (typeof replaceFilter === 'function' && !replaceFilter(match)) {
          return match;
        }
        var i = env.tokenStack.length;
        // Check for existing strings
        while (env.code.indexOf('___' + language.toUpperCase() + i + '___') !== -1) ++i;

        // Create a sparse array
        env.tokenStack[i] = match;

        return '___' + language.toUpperCase() + i + '___';
      });

      // Switch the grammar to markup
      env.grammar = Prism.languages.markup;
    },
  },
  tokenizePlaceholders: {
    // Replace placeholders with proper tokens after tokenizing
    value: function (env, language) {
      if (env.language !== language || !env.tokenStack) {
        return;
      }

      // Switch the grammar back
      env.grammar = Prism.languages[language];

      var j = 0;
      var keys = Object.keys(env.tokenStack);
      var walkTokens = function (tokens) {
        if (j >= keys.length) {
          return;
        }
        for (var i = 0; i < tokens.length; i++) {
          var token = tokens[i];
          if (typeof token === 'string' || (token.content && typeof token.content === 'string')) {
            var k = keys[j];
            var t = env.tokenStack[k];
            var s = typeof token === 'string' ? token : token.content;

            var index = s.indexOf('___' + language.toUpperCase() + k + '___');
            if (index > -1) {
              ++j;
              var before = s.substring(0, index);
              var middle = new Prism.Token(
                language,
                Prism.tokenize(t, env.grammar, language),
                'language-' + language,
                t
              );
              var after = s.substring(index + ('___' + language.toUpperCase() + k + '___').length);
              var replacement;
              if (before || after) {
                replacement = [before, middle, after].filter(function (v) {
                  return !!v;
                });
                walkTokens(replacement);
              } else {
                replacement = middle;
              }
              if (typeof token === 'string') {
                Array.prototype.splice.apply(tokens, [i, 1].concat(replacement));
              } else {
                token.content = replacement;
              }

              if (j >= keys.length) {
                break;
              }
            }
          } else if (token.content && typeof token.content !== 'string') {
            walkTokens(token.content);
          }
        }
      };

      walkTokens(env.tokens);
    },
  },
});
Prism.languages.json = {
  property: /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/i,
  string: {
    pattern: /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
    greedy: true,
  },
  number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
  punctuation: /[{}[\]);,]/,
  operator: /:/g,
  boolean: /\b(?:true|false)\b/i,
  null: /\bnull\b/i,
};

Prism.languages.jsonp = Prism.languages.json;

// start JSX

(function (Prism) {
  var javascript = Prism.util.clone(Prism.languages.javascript);

  var space = /(?:\s|\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))\*\/)/.source;
  var braces = /(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])*\})/.source;
  var spread = /(?:\{<S>*\.{3}(?:[^{}]|<BRACES>)*\})/.source;

  /**
   * @param {string} source
   * @param {string} [flags]
   */
  function re(source, flags) {
    source = source
      .replace(/<S>/g, function () {
        return space;
      })
      .replace(/<BRACES>/g, function () {
        return braces;
      })
      .replace(/<SPREAD>/g, function () {
        return spread;
      });
    return RegExp(source, flags);
  }

  spread = re(spread).source;

  Prism.languages.jsx = Prism.languages.extend("markup", javascript);
  Prism.languages.jsx.tag.pattern = re(
    /<\/?(?:[\w.:-]+(?:<S>+(?:[\w.:$-]+(?:=(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s{'"/>=]+|<BRACES>))?|<SPREAD>))*<S>*\/?)?>/
      .source
  );

  Prism.languages.jsx.tag.inside["tag"].pattern = /^<\/?[^\s>\/]*/;
  Prism.languages.jsx.tag.inside["attr-value"].pattern =
    /=(?!\{)(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s'">]+)/;
  Prism.languages.jsx.tag.inside["tag"].inside["class-name"] =
    /^[A-Z]\w*(?:\.[A-Z]\w*)*$/;
  Prism.languages.jsx.tag.inside["comment"] = javascript["comment"];

  Prism.languages.insertBefore(
    "inside",
    "attr-name",
    {
      spread: {
        pattern: re(/<SPREAD>/.source),
        inside: Prism.languages.jsx,
      },
    },
    Prism.languages.jsx.tag
  );

  Prism.languages.insertBefore(
    "inside",
    "special-attr",
    {
      script: {
        // Allow for two levels of nesting
        pattern: re(/=<BRACES>/.source),
        alias: "language-javascript",
        inside: {
          "script-punctuation": {
            pattern: /^=(?=\{)/,
            alias: "punctuation",
          },
          rest: Prism.languages.jsx,
        },
      },
    },
    Prism.languages.jsx.tag
  );

  // The following will handle plain text inside tags
  var stringifyToken = function (token) {
    if (!token) {
      return "";
    }
    if (typeof token === "string") {
      return token;
    }
    if (typeof token.content === "string") {
      return token.content;
    }
    return token.content.map(stringifyToken).join("");
  };

  var walkTokens = function (tokens) {
    var openedTags = [];
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      var notTagNorBrace = false;

      if (typeof token !== "string") {
        if (
          token.type === "tag" &&
          token.content[0] &&
          token.content[0].type === "tag"
        ) {
          // We found a tag, now find its kind

          if (token.content[0].content[0].content === "</") {
            // Closing tag
            if (
              openedTags.length > 0 &&
              openedTags[openedTags.length - 1].tagName ===
                stringifyToken(token.content[0].content[1])
            ) {
              // Pop matching opening tag
              openedTags.pop();
            }
          } else {
            if (token.content[token.content.length - 1].content === "/>") {
              // Autoclosed tag, ignore
            } else {
              // Opening tag
              openedTags.push({
                tagName: stringifyToken(token.content[0].content[1]),
                openedBraces: 0,
              });
            }
          }
        } else if (
          openedTags.length > 0 &&
          token.type === "punctuation" &&
          token.content === "{"
        ) {
          // Here we might have entered a JSX context inside a tag
          openedTags[openedTags.length - 1].openedBraces++;
        } else if (
          openedTags.length > 0 &&
          openedTags[openedTags.length - 1].openedBraces > 0 &&
          token.type === "punctuation" &&
          token.content === "}"
        ) {
          // Here we might have left a JSX context inside a tag
          openedTags[openedTags.length - 1].openedBraces--;
        } else {
          notTagNorBrace = true;
        }
      }
      if (notTagNorBrace || typeof token === "string") {
        if (
          openedTags.length > 0 &&
          openedTags[openedTags.length - 1].openedBraces === 0
        ) {
          // Here we are inside a tag, and not inside a JSX context.
          // That's plain text: drop any tokens matched.
          var plainText = stringifyToken(token);

          // And merge text with adjacent text
          if (
            i < tokens.length - 1 &&
            (typeof tokens[i + 1] === "string" ||
              tokens[i + 1].type === "plain-text")
          ) {
            plainText += stringifyToken(tokens[i + 1]);
            tokens.splice(i + 1, 1);
          }
          if (
            i > 0 &&
            (typeof tokens[i - 1] === "string" ||
              tokens[i - 1].type === "plain-text")
          ) {
            plainText = stringifyToken(tokens[i - 1]) + plainText;
            tokens.splice(i - 1, 1);
            i--;
          }
          tokens[i] = new Prism.Token("plain-text", plainText, null, plainText);
        }
      }

      if (token.content && typeof token.content !== "string") {
        walkTokens(token.content);
      }
    }
  };

  Prism.hooks.add("after-tokenize", function (env) {
    if (env.language !== "jsx" && env.language !== "tsx") {
      return;
    }
    walkTokens(env.tokens);
  });
})(Prism);

// end JSX

/**
 * Original by Aaron Harun: http://aahacreative.com/2012/07/31/php-syntax-highlighting-prism/
 * Modified by Miles Johnson: http://milesj.me
 *
 * Supports the following:
 * 		- Extends clike syntax
 * 		- Support for PHP 5.3+ (namespaces, traits, generators, etc)
 * 		- Smarter constant and function matching
 *
 * Adds the following new token classes:
 * 		constant, delimiter, variable, function, package
 */
(function (Prism) {
  Prism.languages.php = Prism.languages.extend('clike', {
    keyword: /\b(?:and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/i,
    constant: /\b[A-Z0-9_]{2,}\b/,
    comment: {
      pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
      lookbehind: true,
    },
  });

  Prism.languages.insertBefore('php', 'string', {
    'shell-comment': {
      pattern: /(^|[^\\])#.*/,
      lookbehind: true,
      alias: 'comment',
    },
  });

  Prism.languages.insertBefore('php', 'keyword', {
    delimiter: {
      pattern: /\?>|<\?(?:php|=)?/i,
      alias: 'important',
    },
    variable: /\$+(?:\w+\b|(?={))/i,
    package: {
      pattern: /(\\|namespace\s+|use\s+)[\w\\]+/,
      lookbehind: true,
      inside: {
        punctuation: /\\/,
      },
    },
  });

  // Must be defined after the function pattern
  Prism.languages.insertBefore('php', 'operator', {
    property: {
      pattern: /(->)[\w]+/,
      lookbehind: true,
    },
  });

  Prism.languages.insertBefore('php', 'string', {
    'nowdoc-string': {
      pattern: /<<<'([^']+)'(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\1;/,
      greedy: true,
      alias: 'string',
      inside: {
        delimiter: {
          pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
          alias: 'symbol',
          inside: {
            punctuation: /^<<<'?|[';]$/,
          },
        },
      },
    },
    'heredoc-string': {
      pattern: /<<<(?:"([^"]+)"(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\1;|([a-z_]\w*)(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\2;)/i,
      greedy: true,
      alias: 'string',
      inside: {
        delimiter: {
          pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
          alias: 'symbol',
          inside: {
            punctuation: /^<<<"?|[";]$/,
          },
        },
        interpolation: null, // See below
      },
    },
    'single-quoted-string': {
      pattern: /'(?:\\[\s\S]|[^\\'])*'/,
      greedy: true,
      alias: 'string',
    },
    'double-quoted-string': {
      pattern: /"(?:\\[\s\S]|[^\\"])*"/,
      greedy: true,
      alias: 'string',
      inside: {
        interpolation: null, // See below
      },
    },
  });
  // The different types of PHP strings "replace" the C-like standard string
  delete Prism.languages.php['string'];

  var string_interpolation = {
    pattern: /{\$(?:{(?:{[^{}]+}|[^{}]+)}|[^{}])+}|(^|[^\\{])\$+(?:\w+(?:\[.+?]|->\w+)*)/,
    lookbehind: true,
    inside: {
      rest: Prism.languages.php,
    },
  };
  Prism.languages.php['heredoc-string'].inside['interpolation'] = string_interpolation;
  Prism.languages.php['double-quoted-string'].inside['interpolation'] = string_interpolation;

  Prism.hooks.add('before-tokenize', function (env) {
    if (!/(?:<\?php|<\?)/gi.test(env.code)) {
      return;
    }

    var phpPattern = /(?:<\?php|<\?)[\s\S]*?(?:\?>|$)/gi;
    Prism.languages['markup-templating'].buildPlaceholders(env, 'php', phpPattern);
  });

  Prism.hooks.add('after-tokenize', function (env) {
    Prism.languages['markup-templating'].tokenizePlaceholders(env, 'php');
  });
})(Prism);
Prism.languages.typescript = Prism.languages.extend('javascript', {
  // From JavaScript Prism keyword list and TypeScript language spec: https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#221-reserved-words
  keyword: /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield|module|declare|constructor|namespace|abstract|require|type)\b/,
  builtin: /\b(?:string|Function|any|number|boolean|Array|symbol|console)\b/,
});

Prism.languages.ts = Prism.languages.typescript;
Prism.languages.scss = Prism.languages.extend('css', {
  comment: {
    pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
    lookbehind: true,
  },
  atrule: {
    pattern: /@[\w-]+(?:\([^()]+\)|[^(])*?(?=\s+[{;])/,
    inside: {
      rule: /@[\w-]+/,
      // See rest below
    },
  },
  // url, compassified
  url: /(?:[-a-z]+-)*url(?=\()/i,
  // CSS selector regex is not appropriate for Sass
  // since there can be lot more things (var, @ directive, nesting..)
  // a selector must start at the end of a property or after a brace (end of other rules or nesting)
  // it can contain some characters that aren't used for defining rules or end of selector, & (parent selector), or interpolated variable
  // the end of a selector is found when there is no rules in it ( {} or {\s}) or if there is a property (because an interpolated var
  // can "pass" as a selector- e.g: proper#{$erty})
  // this one was hard to do, so please be careful if you edit this one :)
  selector: {
    // Initial look-ahead is used to prevent matching of blank selectors
    pattern: /(?=\S)[^@;{}()]?(?:[^@;{}()]|&|#\{\$[-\w]+\})+(?=\s*\{(?:\}|\s|[^}]+[:{][^}]+))/m,
    inside: {
      parent: {
        pattern: /&/,
        alias: 'important',
      },
      placeholder: /%[-\w]+/,
      variable: /\$[-\w]+|#\{\$[-\w]+\}/,
    },
  },
});

Prism.languages.insertBefore('scss', 'atrule', {
  keyword: [
    /@(?:if|else(?: if)?|for|each|while|import|extend|debug|warn|mixin|include|function|return|content)/i,
    {
      pattern: /( +)(?:from|through)(?= )/,
      lookbehind: true,
    },
  ],
});

Prism.languages.scss.property = {
  pattern: /(?:[\w-]|\$[-\w]+|#\{\$[-\w]+\})+(?=\s*:)/i,
  inside: {
    variable: /\$[-\w]+|#\{\$[-\w]+\}/,
  },
};

Prism.languages.insertBefore('scss', 'important', {
  // var and interpolated vars
  variable: /\$[-\w]+|#\{\$[-\w]+\}/,
});

Prism.languages.insertBefore('scss', 'function', {
  placeholder: {
    pattern: /%[-\w]+/,
    alias: 'selector',
  },
  statement: {
    pattern: /\B!(?:default|optional)\b/i,
    alias: 'keyword',
  },
  boolean: /\b(?:true|false)\b/,
  null: /\bnull\b/,
  operator: {
    pattern: /(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|or|not)(?=\s)/,
    lookbehind: true,
  },
});

Prism.languages.scss['atrule'].inside.rest = Prism.languages.scss;
(function () {
  if (typeof self === 'undefined' || !self.Prism || !self.document) {
    return;
  }

  /**
   * Plugin name which is used as a class name for <pre> which is activating the plugin
   * @type {String}
   */
  var PLUGIN_NAME = 'line-numbers';

  /**
   * Regular expression used for determining line breaks
   * @type {RegExp}
   */
  var NEW_LINE_EXP = /\n(?!$)/g;

  /**
   * Resizes line numbers spans according to height of line of code
   * @param {Element} element <pre> element
   */
  var _resizeElement = function (element) {
    var codeStyles = getStyles(element);
    var whiteSpace = codeStyles['white-space'];

    if (whiteSpace === 'pre-wrap' || whiteSpace === 'pre-line') {
      var codeElement = element.querySelector('code');
      var lineNumbersWrapper = element.querySelector('.line-numbers-rows');
      var lineNumberSizer = element.querySelector('.line-numbers-sizer');
      var codeLines = codeElement.textContent.split(NEW_LINE_EXP);

      if (!lineNumberSizer) {
        lineNumberSizer = document.createElement('span');
        lineNumberSizer.className = 'line-numbers-sizer';

        codeElement.appendChild(lineNumberSizer);
      }

      lineNumberSizer.style.display = 'block';

      codeLines.forEach(function (line, lineNumber) {
        lineNumberSizer.textContent = line || '\n';
        var lineSize = lineNumberSizer.getBoundingClientRect().height;
        lineNumbersWrapper.children[lineNumber].style.height = lineSize + 'px';
      });

      lineNumberSizer.textContent = '';
      lineNumberSizer.style.display = 'none';
    }
  };

  /**
   * Returns style declarations for the element
   * @param {Element} element
   */
  var getStyles = function (element) {
    if (!element) {
      return null;
    }

    return window.getComputedStyle ? getComputedStyle(element) : element.currentStyle || null;
  };

  window.addEventListener('resize', function () {
    Array.prototype.forEach.call(document.querySelectorAll('pre.' + PLUGIN_NAME), _resizeElement);
  });

  Prism.hooks.add('complete', function (env) {
    if (!env.code) {
      return;
    }

    // works only for <code> wrapped inside <pre> (not inline)
    var pre = env.element.parentNode;
    var clsReg = /\s*\bline-numbers\b\s*/;
    if (
      !pre ||
      !/pre/i.test(pre.nodeName) ||
      // Abort only if nor the <pre> nor the <code> have the class
      (!clsReg.test(pre.className) && !clsReg.test(env.element.className))
    ) {
      return;
    }

    if (env.element.querySelector('.line-numbers-rows')) {
      // Abort if line numbers already exists
      return;
    }

    if (clsReg.test(env.element.className)) {
      // Remove the class 'line-numbers' from the <code>
      env.element.className = env.element.className.replace(clsReg, ' ');
    }
    if (!clsReg.test(pre.className)) {
      // Add the class 'line-numbers' to the <pre>
      pre.className += ' line-numbers';
    }

    var match = env.code.match(NEW_LINE_EXP);
    var linesNum = match ? match.length + 1 : 1;
    var lineNumbersWrapper;

    var lines = new Array(linesNum + 1);
    lines = lines.join('<span></span>');

    lineNumbersWrapper = document.createElement('span');
    lineNumbersWrapper.setAttribute('aria-hidden', 'true');
    lineNumbersWrapper.className = 'line-numbers-rows';
    lineNumbersWrapper.innerHTML = lines;

    if (pre.hasAttribute('data-start')) {
      pre.style.counterReset = 'linenumber ' + (parseInt(pre.getAttribute('data-start'), 10) - 1);
    }

    env.element.appendChild(lineNumbersWrapper);

    _resizeElement(pre);

    Prism.hooks.run('line-numbers', env);
  });

  Prism.hooks.add('line-numbers', function (env) {
    env.plugins = env.plugins || {};
    env.plugins.lineNumbers = true;
  });

  /**
   * Global exports
   */
  Prism.plugins.lineNumbers = {
    /**
     * Get node for provided line number
     * @param {Element} element pre element
     * @param {Number} number line number
     * @return {Element|undefined}
     */
    getLine: function (element, number) {
      if (element.tagName !== 'PRE' || !element.classList.contains(PLUGIN_NAME)) {
        return;
      }

      var lineNumberRows = element.querySelector('.line-numbers-rows');
      var lineNumberStart = parseInt(element.getAttribute('data-start'), 10) || 1;
      var lineNumberEnd = lineNumberStart + (lineNumberRows.children.length - 1);

      if (number < lineNumberStart) {
        number = lineNumberStart;
      }
      if (number > lineNumberEnd) {
        number = lineNumberEnd;
      }

      var lineIndex = number - lineNumberStart;

      return lineNumberRows.children[lineIndex];
    },
  };
})();
(function () {
  if (typeof self === 'undefined' || !self.Prism || !self.document) {
    return;
  }

  var callbacks = [];
  var map = {};
  var noop = function () {};

  Prism.plugins.toolbar = {};

  /**
   * Register a button callback with the toolbar.
   *
   * @param {string} key
   * @param {Object|Function} opts
   */
  var registerButton = (Prism.plugins.toolbar.registerButton = function (key, opts) {
    var callback;

    if (typeof opts === 'function') {
      callback = opts;
    } else {
      callback = function (env) {
        var element;

        if (typeof opts.onClick === 'function') {
          element = document.createElement('button');
          element.type = 'button';
          element.addEventListener('click', function () {
            opts.onClick.call(this, env);
          });
        } else if (typeof opts.url === 'string') {
          element = document.createElement('a');
          element.href = opts.url;
        } else {
          element = document.createElement('span');
        }

        element.textContent = opts.text;

        return element;
      };
    }

    callbacks.push((map[key] = callback));
  });

  /**
   * Post-highlight Prism hook callback.
   *
   * @param env
   */
  var hook = (Prism.plugins.toolbar.hook = function (env) {
    // Check if inline or actual code block (credit to line-numbers plugin)
    var pre = env.element.parentNode;
    if (!pre || !/pre/i.test(pre.nodeName)) {
      return;
    }

    // Autoloader rehighlights, so only do this once.
    if (pre.parentNode.classList.contains('code-toolbar')) {
      return;
    }

    // Create wrapper for <pre> to prevent scrolling toolbar with content
    var wrapper = document.createElement('div');
    wrapper.classList.add('code-toolbar');
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    // Setup the toolbar
    var toolbar = document.createElement('div');
    toolbar.classList.add('toolbar');

    if (document.body.hasAttribute('data-toolbar-order')) {
      callbacks = document.body
        .getAttribute('data-toolbar-order')
        .split(',')
        .map(function (key) {
          return map[key] || noop;
        });
    }

    callbacks.forEach(function (callback) {
      var element = callback(env);

      if (!element) {
        return;
      }

      var item = document.createElement('div');
      item.classList.add('toolbar-item');

      item.appendChild(element);
      toolbar.appendChild(item);
    });

    // Add our toolbar to the currently created wrapper of <pre> tag
    wrapper.appendChild(toolbar);
  });

  registerButton('label', function (env) {
    var pre = env.element.parentNode;
    if (!pre || !/pre/i.test(pre.nodeName)) {
      return;
    }

    if (!pre.hasAttribute('data-label')) {
      return;
    }

    var element, template;
    var text = pre.getAttribute('data-label');
    try {
      // Any normal text will blow up this selector.
      template = document.querySelector('template#' + text);
    } catch (e) {}

    if (template) {
      element = template.content;
    } else {
      if (pre.hasAttribute('data-url')) {
        element = document.createElement('a');
        element.href = pre.getAttribute('data-url');
      } else {
        element = document.createElement('span');
      }

      element.textContent = text;
    }

    return element;
  });

  /**
   * Register the toolbar with Prism.
   */
  Prism.hooks.add('complete', hook);
})();

(function () {
  if ((typeof self !== 'undefined' && !self.Prism) || !self.document || !Function.prototype.bind) {
    return;
  }

  var previewers = {
    // gradient must be defined before color and angle
    gradient: {
      create: (function () {
        // Stores already processed gradients so that we don't
        // make the conversion every time the previewer is shown
        var cache = {};

        /**
         * Returns a W3C-valid linear gradient
         * @param {string} prefix Vendor prefix if any ("-moz-", "-webkit-", etc.)
         * @param {string} func Gradient function name ("linear-gradient")
         * @param {string[]} values Array of the gradient function parameters (["0deg", "red 0%", "blue 100%"])
         */
        var convertToW3CLinearGradient = function (prefix, func, values) {
          // Default value for angle
          var angle = '180deg';

          if (/^(?:-?\d*\.?\d+(?:deg|rad)|to\b|top|right|bottom|left)/.test(values[0])) {
            angle = values.shift();
            if (angle.indexOf('to ') < 0) {
              // Angle uses old keywords
              // W3C syntax uses "to" + opposite keywords
              if (angle.indexOf('top') >= 0) {
                if (angle.indexOf('left') >= 0) {
                  angle = 'to bottom right';
                } else if (angle.indexOf('right') >= 0) {
                  angle = 'to bottom left';
                } else {
                  angle = 'to bottom';
                }
              } else if (angle.indexOf('bottom') >= 0) {
                if (angle.indexOf('left') >= 0) {
                  angle = 'to top right';
                } else if (angle.indexOf('right') >= 0) {
                  angle = 'to top left';
                } else {
                  angle = 'to top';
                }
              } else if (angle.indexOf('left') >= 0) {
                angle = 'to right';
              } else if (angle.indexOf('right') >= 0) {
                angle = 'to left';
              } else if (prefix) {
                // Angle is shifted by 90deg in prefixed gradients
                if (angle.indexOf('deg') >= 0) {
                  angle = 90 - parseFloat(angle) + 'deg';
                } else if (angle.indexOf('rad') >= 0) {
                  angle = Math.PI / 2 - parseFloat(angle) + 'rad';
                }
              }
            }
          }

          return func + '(' + angle + ',' + values.join(',') + ')';
        };

        /**
         * Returns a W3C-valid radial gradient
         * @param {string} prefix Vendor prefix if any ("-moz-", "-webkit-", etc.)
         * @param {string} func Gradient function name ("linear-gradient")
         * @param {string[]} values Array of the gradient function parameters (["0deg", "red 0%", "blue 100%"])
         */
        var convertToW3CRadialGradient = function (prefix, func, values) {
          if (values[0].indexOf('at') < 0) {
            // Looks like old syntax

            // Default values
            var position = 'center';
            var shape = 'ellipse';
            var size = 'farthest-corner';

            if (/\bcenter|top|right|bottom|left\b|^\d+/.test(values[0])) {
              // Found a position
              // Remove angle value, if any
              position = values.shift().replace(/\s*-?\d+(?:rad|deg)\s*/, '');
            }
            if (/\bcircle|ellipse|closest|farthest|contain|cover\b/.test(values[0])) {
              // Found a shape and/or size
              var shapeSizeParts = values.shift().split(/\s+/);
              if (
                shapeSizeParts[0] &&
                (shapeSizeParts[0] === 'circle' || shapeSizeParts[0] === 'ellipse')
              ) {
                shape = shapeSizeParts.shift();
              }
              if (shapeSizeParts[0]) {
                size = shapeSizeParts.shift();
              }

              // Old keywords are converted to their synonyms
              if (size === 'cover') {
                size = 'farthest-corner';
              } else if (size === 'contain') {
                size = 'clothest-side';
              }
            }

            return (
              func + '(' + shape + ' ' + size + ' at ' + position + ',' + values.join(',') + ')'
            );
          }
          return func + '(' + values.join(',') + ')';
        };

        /**
         * Converts a gradient to a W3C-valid one
         * Does not support old webkit syntax (-webkit-gradient(linear...) and -webkit-gradient(radial...))
         * @param {string} gradient The CSS gradient
         */
        var convertToW3CGradient = function (gradient) {
          if (cache[gradient]) {
            return cache[gradient];
          }
          var parts = gradient.match(
            /^(\b|\B-[a-z]{1,10}-)((?:repeating-)?(?:linear|radial)-gradient)/
          );
          // "", "-moz-", etc.
          var prefix = parts && parts[1];
          // "linear-gradient", "radial-gradient", etc.
          var func = parts && parts[2];

          var values = gradient
            .replace(/^(?:\b|\B-[a-z]{1,10}-)(?:repeating-)?(?:linear|radial)-gradient\(|\)$/g, '')
            .split(/\s*,\s*/);

          if (func.indexOf('linear') >= 0) {
            return (cache[gradient] = convertToW3CLinearGradient(prefix, func, values));
          } else if (func.indexOf('radial') >= 0) {
            return (cache[gradient] = convertToW3CRadialGradient(prefix, func, values));
          }
          return (cache[gradient] = func + '(' + values.join(',') + ')');
        };

        return function () {
          new Prism.plugins.Previewer(
            'gradient',
            function (value) {
              this.firstChild.style.backgroundImage = '';
              this.firstChild.style.backgroundImage = convertToW3CGradient(value);
              return !!this.firstChild.style.backgroundImage;
            },
            '*',
            function () {
              this._elt.innerHTML = '<div></div>';
            }
          );
        };
      })(),
      tokens: {
        gradient: {
          pattern: /(?:\b|\B-[a-z]{1,10}-)(?:repeating-)?(?:linear|radial)-gradient\((?:(?:rgb|hsl)a?\(.+?\)|[^\)])+\)/gi,
          inside: {
            function: /[\w-]+(?=\()/,
            punctuation: /[(),]/,
          },
        },
      },
      languages: {
        css: true,
        less: true,
        sass: [
          {
            lang: 'sass',
            before: 'punctuation',
            inside: 'inside',
            root: Prism.languages.sass && Prism.languages.sass['variable-line'],
          },
          {
            lang: 'sass',
            before: 'punctuation',
            inside: 'inside',
            root: Prism.languages.sass && Prism.languages.sass['property-line'],
          },
        ],
        scss: true,
        stylus: [
          {
            lang: 'stylus',
            before: 'func',
            inside: 'rest',
            root: Prism.languages.stylus && Prism.languages.stylus['property-declaration'].inside,
          },
          {
            lang: 'stylus',
            before: 'func',
            inside: 'rest',
            root: Prism.languages.stylus && Prism.languages.stylus['variable-declaration'].inside,
          },
        ],
      },
    },
    angle: {
      create: function () {
        new Prism.plugins.Previewer(
          'angle',
          function (value) {
            var num = parseFloat(value);
            var unit = value.match(/[a-z]+$/i);
            var max, percentage;
            if (!num || !unit) {
              return false;
            }
            unit = unit[0];

            switch (unit) {
              case 'deg':
                max = 360;
                break;
              case 'grad':
                max = 400;
                break;
              case 'rad':
                max = 2 * Math.PI;
                break;
              case 'turn':
                max = 1;
            }

            percentage = (100 * num) / max;
            percentage %= 100;

            this[(num < 0 ? 'set' : 'remove') + 'Attribute']('data-negative', '');
            this.querySelector('circle').style.strokeDasharray = Math.abs(percentage) + ',500';
            return true;
          },
          '*',
          function () {
            this._elt.innerHTML =
              '<svg viewBox="0 0 64 64">' + '<circle r="16" cy="32" cx="32"></circle>' + '</svg>';
          }
        );
      },
      tokens: {
        angle: /(?:\b|\B-|(?=\B\.))\d*\.?\d+(?:deg|g?rad|turn)\b/i,
      },
      languages: {
        css: true,
        less: true,
        markup: {
          lang: 'markup',
          before: 'punctuation',
          inside: 'inside',
          root: Prism.languages.markup && Prism.languages.markup['tag'].inside['attr-value'],
        },
        sass: [
          {
            lang: 'sass',
            inside: 'inside',
            root: Prism.languages.sass && Prism.languages.sass['property-line'],
          },
          {
            lang: 'sass',
            before: 'operator',
            inside: 'inside',
            root: Prism.languages.sass && Prism.languages.sass['variable-line'],
          },
        ],
        scss: true,
        stylus: [
          {
            lang: 'stylus',
            before: 'func',
            inside: 'rest',
            root: Prism.languages.stylus && Prism.languages.stylus['property-declaration'].inside,
          },
          {
            lang: 'stylus',
            before: 'func',
            inside: 'rest',
            root: Prism.languages.stylus && Prism.languages.stylus['variable-declaration'].inside,
          },
        ],
      },
    },
    color: {
      create: function () {
        new Prism.plugins.Previewer('color', function (value) {
          this.style.backgroundColor = '';
          this.style.backgroundColor = value;
          return !!this.style.backgroundColor;
        });
      },
      tokens: {
        color: {
          pattern: /\B#(?:[0-9a-f]{3}){1,2}\b|\b(?:rgb|hsl)\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)\B|\b(?:rgb|hsl)a\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*(?:0|0?\.\d+|1)\s*\)\B|\b(?:AliceBlue|AntiqueWhite|Aqua|Aquamarine|Azure|Beige|Bisque|Black|BlanchedAlmond|Blue|BlueViolet|Brown|BurlyWood|CadetBlue|Chartreuse|Chocolate|Coral|CornflowerBlue|Cornsilk|Crimson|Cyan|DarkBlue|DarkCyan|DarkGoldenRod|DarkGray|DarkGreen|DarkKhaki|DarkMagenta|DarkOliveGreen|DarkOrange|DarkOrchid|DarkRed|DarkSalmon|DarkSeaGreen|DarkSlateBlue|DarkSlateGray|DarkTurquoise|DarkViolet|DeepPink|DeepSkyBlue|DimGray|DodgerBlue|FireBrick|FloralWhite|ForestGreen|Fuchsia|Gainsboro|GhostWhite|Gold|GoldenRod|Gray|Green|GreenYellow|HoneyDew|HotPink|IndianRed|Indigo|Ivory|Khaki|Lavender|LavenderBlush|LawnGreen|LemonChiffon|LightBlue|LightCoral|LightCyan|LightGoldenRodYellow|LightGray|LightGreen|LightPink|LightSalmon|LightSeaGreen|LightSkyBlue|LightSlateGray|LightSteelBlue|LightYellow|Lime|LimeGreen|Linen|Magenta|Maroon|MediumAquaMarine|MediumBlue|MediumOrchid|MediumPurple|MediumSeaGreen|MediumSlateBlue|MediumSpringGreen|MediumTurquoise|MediumVioletRed|MidnightBlue|MintCream|MistyRose|Moccasin|NavajoWhite|Navy|OldLace|Olive|OliveDrab|Orange|OrangeRed|Orchid|PaleGoldenRod|PaleGreen|PaleTurquoise|PaleVioletRed|PapayaWhip|PeachPuff|Peru|Pink|Plum|PowderBlue|Purple|Red|RosyBrown|RoyalBlue|SaddleBrown|Salmon|SandyBrown|SeaGreen|SeaShell|Sienna|Silver|SkyBlue|SlateBlue|SlateGray|Snow|SpringGreen|SteelBlue|Tan|Teal|Thistle|Tomato|Turquoise|Violet|Wheat|White|WhiteSmoke|Yellow|YellowGreen)\b/i,
          inside: {
            function: /[\w-]+(?=\()/,
            punctuation: /[(),]/,
          },
        },
      },
      languages: {
        css: true,
        less: true,
        markup: {
          lang: 'markup',
          before: 'punctuation',
          inside: 'inside',
          root: Prism.languages.markup && Prism.languages.markup['tag'].inside['attr-value'],
        },
        sass: [
          {
            lang: 'sass',
            before: 'punctuation',
            inside: 'inside',
            root: Prism.languages.sass && Prism.languages.sass['variable-line'],
          },
          {
            lang: 'sass',
            inside: 'inside',
            root: Prism.languages.sass && Prism.languages.sass['property-line'],
          },
        ],
        scss: true,
        stylus: [
          {
            lang: 'stylus',
            before: 'hexcode',
            inside: 'rest',
            root: Prism.languages.stylus && Prism.languages.stylus['property-declaration'].inside,
          },
          {
            lang: 'stylus',
            before: 'hexcode',
            inside: 'rest',
            root: Prism.languages.stylus && Prism.languages.stylus['variable-declaration'].inside,
          },
        ],
      },
    },
    easing: {
      create: function () {
        new Prism.plugins.Previewer(
          'easing',
          function (value) {
            value =
              {
                linear: '0,0,1,1',
                ease: '.25,.1,.25,1',
                'ease-in': '.42,0,1,1',
                'ease-out': '0,0,.58,1',
                'ease-in-out': '.42,0,.58,1',
              }[value] || value;

            var p = value.match(/-?\d*\.?\d+/g);

            if (p.length === 4) {
              p = p.map(function (p, i) {
                return (i % 2 ? 1 - p : p) * 100;
              });

              this.querySelector('path').setAttribute(
                'd',
                'M0,100 C' + p[0] + ',' + p[1] + ', ' + p[2] + ',' + p[3] + ', 100,0'
              );

              var lines = this.querySelectorAll('line');
              lines[0].setAttribute('x2', p[0]);
              lines[0].setAttribute('y2', p[1]);
              lines[1].setAttribute('x2', p[2]);
              lines[1].setAttribute('y2', p[3]);

              return true;
            }

            return false;
          },
          '*',
          function () {
            this._elt.innerHTML =
              '<svg viewBox="-20 -20 140 140" width="100" height="100">' +
              '<defs>' +
              '<marker id="prism-previewer-easing-marker" viewBox="0 0 4 4" refX="2" refY="2" markerUnits="strokeWidth">' +
              '<circle cx="2" cy="2" r="1.5" />' +
              '</marker>' +
              '</defs>' +
              '<path d="M0,100 C20,50, 40,30, 100,0" />' +
              '<line x1="0" y1="100" x2="20" y2="50" marker-start="url(' +
              location.href +
              '#prism-previewer-easing-marker)" marker-end="url(' +
              location.href +
              '#prism-previewer-easing-marker)" />' +
              '<line x1="100" y1="0" x2="40" y2="30" marker-start="url(' +
              location.href +
              '#prism-previewer-easing-marker)" marker-end="url(' +
              location.href +
              '#prism-previewer-easing-marker)" />' +
              '</svg>';
          }
        );
      },
      tokens: {
        easing: {
          pattern: /\bcubic-bezier\((?:-?\d*\.?\d+,\s*){3}-?\d*\.?\d+\)\B|\b(?:linear|ease(?:-in)?(?:-out)?)(?=\s|[;}]|$)/i,
          inside: {
            function: /[\w-]+(?=\()/,
            punctuation: /[(),]/,
          },
        },
      },
      languages: {
        css: true,
        less: true,
        sass: [
          {
            lang: 'sass',
            inside: 'inside',
            before: 'punctuation',
            root: Prism.languages.sass && Prism.languages.sass['variable-line'],
          },
          {
            lang: 'sass',
            inside: 'inside',
            root: Prism.languages.sass && Prism.languages.sass['property-line'],
          },
        ],
        scss: true,
        stylus: [
          {
            lang: 'stylus',
            before: 'hexcode',
            inside: 'rest',
            root: Prism.languages.stylus && Prism.languages.stylus['property-declaration'].inside,
          },
          {
            lang: 'stylus',
            before: 'hexcode',
            inside: 'rest',
            root: Prism.languages.stylus && Prism.languages.stylus['variable-declaration'].inside,
          },
        ],
      },
    },

    time: {
      create: function () {
        new Prism.plugins.Previewer(
          'time',
          function (value) {
            var num = parseFloat(value);
            var unit = value.match(/[a-z]+$/i);
            if (!num || !unit) {
              return false;
            }
            unit = unit[0];
            this.querySelector('circle').style.animationDuration = 2 * num + unit;
            return true;
          },
          '*',
          function () {
            this._elt.innerHTML =
              '<svg viewBox="0 0 64 64">' + '<circle r="16" cy="32" cx="32"></circle>' + '</svg>';
          }
        );
      },
      tokens: {
        time: /(?:\b|\B-|(?=\B\.))\d*\.?\d+m?s\b/i,
      },
      languages: {
        css: true,
        less: true,
        markup: {
          lang: 'markup',
          before: 'punctuation',
          inside: 'inside',
          root: Prism.languages.markup && Prism.languages.markup['tag'].inside['attr-value'],
        },
        sass: [
          {
            lang: 'sass',
            inside: 'inside',
            root: Prism.languages.sass && Prism.languages.sass['property-line'],
          },
          {
            lang: 'sass',
            before: 'operator',
            inside: 'inside',
            root: Prism.languages.sass && Prism.languages.sass['variable-line'],
          },
        ],
        scss: true,
        stylus: [
          {
            lang: 'stylus',
            before: 'hexcode',
            inside: 'rest',
            root: Prism.languages.stylus && Prism.languages.stylus['property-declaration'].inside,
          },
          {
            lang: 'stylus',
            before: 'hexcode',
            inside: 'rest',
            root: Prism.languages.stylus && Prism.languages.stylus['variable-declaration'].inside,
          },
        ],
      },
    },
  };

  /**
   * Returns the absolute X, Y offsets for an element
   * @param {HTMLElement} element
   * @returns {{top: number, right: number, bottom: number, left: number}}
   */
  var getOffset = function (element) {
    var left = 0,
      top = 0,
      el = element;

    if (el.parentNode) {
      do {
        left += el.offsetLeft;
        top += el.offsetTop;
      } while ((el = el.offsetParent) && el.nodeType < 9);

      el = element;

      do {
        left -= el.scrollLeft;
        top -= el.scrollTop;
      } while ((el = el.parentNode) && !/body/i.test(el.nodeName));
    }

    return {
      top: top,
      right: innerWidth - left - element.offsetWidth,
      bottom: innerHeight - top - element.offsetHeight,
      left: left,
    };
  };

  var tokenRegexp = /(?:^|\s)token(?=$|\s)/;
  var activeRegexp = /(?:^|\s)active(?=$|\s)/g;
  var flippedRegexp = /(?:^|\s)flipped(?=$|\s)/g;

  /**
   * Previewer constructor
   * @param {string} type Unique previewer type
   * @param {function} updater Function that will be called on mouseover.
   * @param {string[]|string=} supportedLanguages Aliases of the languages this previewer must be enabled for. Defaults to "*", all languages.
   * @param {function=} initializer Function that will be called on initialization.
   * @constructor
   */
  var Previewer = function (type, updater, supportedLanguages, initializer) {
    this._elt = null;
    this._type = type;
    this._clsRegexp = RegExp('(?:^|\\s)' + type + '(?=$|\\s)');
    this._token = null;
    this.updater = updater;
    this._mouseout = this.mouseout.bind(this);
    this.initializer = initializer;

    var self = this;

    if (!supportedLanguages) {
      supportedLanguages = ['*'];
    }
    if (Prism.util.type(supportedLanguages) !== 'Array') {
      supportedLanguages = [supportedLanguages];
    }
    supportedLanguages.forEach(function (lang) {
      if (typeof lang !== 'string') {
        lang = lang.lang;
      }
      if (!Previewer.byLanguages[lang]) {
        Previewer.byLanguages[lang] = [];
      }
      if (Previewer.byLanguages[lang].indexOf(self) < 0) {
        Previewer.byLanguages[lang].push(self);
      }
    });
    Previewer.byType[type] = this;
  };

  /**
   * Creates the HTML element for the previewer.
   */
  Previewer.prototype.init = function () {
    if (this._elt) {
      return;
    }
    this._elt = document.createElement('div');
    this._elt.className = 'prism-previewer prism-previewer-' + this._type;
    document.body.appendChild(this._elt);
    if (this.initializer) {
      this.initializer();
    }
  };

  Previewer.prototype.isDisabled = function (token) {
    do {
      if (token.hasAttribute && token.hasAttribute('data-previewers')) {
        var previewers = token.getAttribute('data-previewers');
        return (previewers || '').split(/\s+/).indexOf(this._type) === -1;
      }
    } while ((token = token.parentNode));
    return false;
  };

  /**
   * Checks the class name of each hovered element
   * @param token
   */
  Previewer.prototype.check = function (token) {
    if (tokenRegexp.test(token.className) && this.isDisabled(token)) {
      return;
    }
    do {
      if (tokenRegexp.test(token.className) && this._clsRegexp.test(token.className)) {
        break;
      }
    } while ((token = token.parentNode));

    if (token && token !== this._token) {
      this._token = token;
      this.show();
    }
  };

  /**
   * Called on mouseout
   */
  Previewer.prototype.mouseout = function () {
    this._token.removeEventListener('mouseout', this._mouseout, false);
    this._token = null;
    this.hide();
  };

  /**
   * Shows the previewer positioned properly for the current token.
   */
  Previewer.prototype.show = function () {
    if (!this._elt) {
      this.init();
    }
    if (!this._token) {
      return;
    }

    if (this.updater.call(this._elt, this._token.textContent)) {
      this._token.addEventListener('mouseout', this._mouseout, false);

      var offset = getOffset(this._token);
      this._elt.className += ' active';

      if (offset.top - this._elt.offsetHeight > 0) {
        this._elt.className = this._elt.className.replace(flippedRegexp, '');
        this._elt.style.top = offset.top + 'px';
        this._elt.style.bottom = '';
      } else {
        this._elt.className += ' flipped';
        this._elt.style.bottom = offset.bottom + 'px';
        this._elt.style.top = '';
      }

      this._elt.style.left = offset.left + Math.min(200, this._token.offsetWidth / 2) + 'px';
    } else {
      this.hide();
    }
  };

  /**
   * Hides the previewer.
   */
  Previewer.prototype.hide = function () {
    this._elt.className = this._elt.className.replace(activeRegexp, '');
  };

  /**
   * Map of all registered previewers by language
   * @type {{}}
   */
  Previewer.byLanguages = {};

  /**
   * Map of all registered previewers by type
   * @type {{}}
   */
  Previewer.byType = {};

  /**
   * Initializes the mouseover event on the code block.
   * @param {HTMLElement} elt The code block (env.element)
   * @param {string} lang The language (env.language)
   */
  Previewer.initEvents = function (elt, lang) {
    var previewers = [];
    if (Previewer.byLanguages[lang]) {
      previewers = previewers.concat(Previewer.byLanguages[lang]);
    }
    if (Previewer.byLanguages['*']) {
      previewers = previewers.concat(Previewer.byLanguages['*']);
    }
    elt.addEventListener(
      'mouseover',
      function (e) {
        var target = e.target;
        previewers.forEach(function (previewer) {
          previewer.check(target);
        });
      },
      false
    );
  };
  Prism.plugins.Previewer = Previewer;

  Prism.hooks.add('before-highlight', function (env) {
    for (var previewer in previewers) {
      var languages = previewers[previewer].languages;
      if (env.language && languages[env.language] && !languages[env.language].initialized) {
        var lang = languages[env.language];
        if (Prism.util.type(lang) !== 'Array') {
          lang = [lang];
        }
        lang.forEach(function (lang) {
          var before, inside, root, skip;
          if (lang === true) {
            before = 'important';
            inside = env.language;
            lang = env.language;
          } else {
            before = lang.before || 'important';
            inside = lang.inside || lang.lang;
            root = lang.root || Prism.languages;
            skip = lang.skip;
            lang = env.language;
          }

          if (!skip && Prism.languages[lang]) {
            Prism.languages.insertBefore(inside, before, previewers[previewer].tokens, root);
            env.grammar = Prism.languages[lang];

            languages[env.language] = { initialized: true };
          }
        });
      }
    }
  });

  // Initialize the previewers only when needed
  Prism.hooks.add('after-highlight', function (env) {
    if (Previewer.byLanguages['*'] || Previewer.byLanguages[env.language]) {
      Previewer.initEvents(env.element, env.language);
    }
  });

  for (var previewer in previewers) {
    previewers[previewer].create();
  }
})();
(function () {
  var assign =
    Object.assign ||
    function (obj1, obj2) {
      for (var name in obj2) {
        if (obj2.hasOwnProperty(name)) obj1[name] = obj2[name];
      }
      return obj1;
    };

  function NormalizeWhitespace(defaults) {
    this.defaults = assign({}, defaults);
  }

  function toCamelCase(value) {
    return value.replace(/-(\w)/g, function (match, firstChar) {
      return firstChar.toUpperCase();
    });
  }

  function tabLen(str) {
    var res = 0;
    for (var i = 0; i < str.length; ++i) {
      if (str.charCodeAt(i) == '\t'.charCodeAt(0)) res += 3;
    }
    return str.length + res;
  }

  NormalizeWhitespace.prototype = {
    setDefaults: function (defaults) {
      this.defaults = assign(this.defaults, defaults);
    },
    normalize: function (input, settings) {
      settings = assign(this.defaults, settings);

      for (var name in settings) {
        var methodName = toCamelCase(name);
        if (
          name !== 'normalize' &&
          methodName !== 'setDefaults' &&
          settings[name] &&
          this[methodName]
        ) {
          input = this[methodName].call(this, input, settings[name]);
        }
      }

      return input;
    },

    /*
     * Normalization methods
     */
    leftTrim: function (input) {
      return input.replace(/^\s+/, '');
    },
    rightTrim: function (input) {
      return input.replace(/\s+$/, '');
    },
    tabsToSpaces: function (input, spaces) {
      spaces = spaces | 0 || 4;
      return input.replace(/\t/g, new Array(++spaces).join(' '));
    },
    spacesToTabs: function (input, spaces) {
      spaces = spaces | 0 || 4;
      return input.replace(new RegExp(' {' + spaces + '}', 'g'), '\t');
    },
    removeTrailing: function (input) {
      return input.replace(/\s*?$/gm, '');
    },
    // Support for deprecated plugin remove-initial-line-feed
    removeInitialLineFeed: function (input) {
      return input.replace(/^(?:\r?\n|\r)/, '');
    },
    removeIndent: function (input) {
      var indents = input.match(/^[^\S\n\r]*(?=\S)/gm);

      if (!indents || !indents[0].length) return input;

      indents.sort(function (a, b) {
        return a.length - b.length;
      });

      if (!indents[0].length) return input;

      return input.replace(new RegExp('^' + indents[0], 'gm'), '');
    },
    indent: function (input, tabs) {
      return input.replace(/^[^\S\n\r]*(?=\S)/gm, new Array(++tabs).join('\t') + '$&');
    },
    breakLines: function (input, characters) {
      characters = characters === true ? 80 : characters | 0 || 80;

      var lines = input.split('\n');
      for (var i = 0; i < lines.length; ++i) {
        if (tabLen(lines[i]) <= characters) continue;

        var line = lines[i].split(/(\s+)/g),
          len = 0;

        for (var j = 0; j < line.length; ++j) {
          var tl = tabLen(line[j]);
          len += tl;
          if (len > characters) {
            line[j] = '\n' + line[j];
            len = tl;
          }
        }
        lines[i] = line.join('');
      }
      return lines.join('\n');
    },
  };

  // Support node modules
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NormalizeWhitespace;
  }

  // Exit if prism is not loaded
  if (typeof Prism === 'undefined') {
    return;
  }

  Prism.plugins.NormalizeWhitespace = new NormalizeWhitespace({
    'remove-trailing': true,
    'remove-indent': true,
    'left-trim': true,
    'right-trim': true,
    /*'break-lines': 80,
	'indent': 2,
	'remove-initial-line-feed': false,
	'tabs-to-spaces': 4,
	'spaces-to-tabs': 4*/
  });

  Prism.hooks.add('before-sanity-check', function (env) {
    var Normalizer = Prism.plugins.NormalizeWhitespace;

    // Check settings
    if (env.settings && env.settings['whitespace-normalization'] === false) {
      return;
    }

    // Simple mode if there is no env.element
    if ((!env.element || !env.element.parentNode) && env.code) {
      env.code = Normalizer.normalize(env.code, env.settings);
      return;
    }

    // Normal mode
    var pre = env.element.parentNode;
    var clsReg = /\bno-whitespace-normalization\b/;
    if (
      !env.code ||
      !pre ||
      pre.nodeName.toLowerCase() !== 'pre' ||
      clsReg.test(pre.className) ||
      clsReg.test(env.element.className)
    )
      return;

    var children = pre.childNodes,
      before = '',
      after = '',
      codeFound = false;

    // Move surrounding whitespace from the <pre> tag into the <code> tag
    for (var i = 0; i < children.length; ++i) {
      var node = children[i];

      if (node == env.element) {
        codeFound = true;
      } else if (node.nodeName === '#text') {
        if (codeFound) {
          after += node.nodeValue;
        } else {
          before += node.nodeValue;
        }

        pre.removeChild(node);
        --i;
      }
    }

    if (!env.element.children.length || !Prism.plugins.KeepMarkup) {
      env.code = before + env.code + after;
      env.code = Normalizer.normalize(env.code, env.settings);
    } else {
      // Preserve markup for keep-markup plugin
      var html = before + env.element.innerHTML + after;
      env.element.innerHTML = Normalizer.normalize(html, env.settings);
      env.code = env.element.textContent;
    }
  });
})();
(function () {
  if (typeof self === 'undefined' || !self.Prism || !self.document) {
    return;
  }

  if (!Prism.plugins.toolbar) {
    console.warn('Copy to Clipboard plugin loaded before Toolbar plugin.');

    return;
  }

  var ClipboardJS = window.ClipboardJS || undefined;

  if (!ClipboardJS && typeof require === 'function') {
    ClipboardJS = require('clipboard');
  }

  var callbacks = [];

  if (!ClipboardJS) {
    var script = document.createElement('script');
    var head = document.querySelector('head');

    script.onload = function () {
      ClipboardJS = window.ClipboardJS;

      if (ClipboardJS) {
        while (callbacks.length) {
          callbacks.pop()();
        }
      }
    };

    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js';
    head.appendChild(script);
  }

  Prism.plugins.toolbar.registerButton('copy-to-clipboard', function (env) {
    var linkCopy = document.createElement('button');
    linkCopy.innerHTML = 'Copy';
    linkCopy.classList = 'btn-copy-code text-gray-500 text-xs leading-[1.6] !top-[16px] bg-transparent font-bold uppercase text-sm px-4 py-2 outline-none focus:outline-none dark:text-gray-200';

    if (!ClipboardJS) {
      callbacks.push(registerClipboard);
    } else {
      registerClipboard();
    }

    return linkCopy;

    function registerClipboard() {
      var clip = new ClipboardJS(linkCopy, {
        text: function () {
          return env.code;
        },
      });

      clip.on('success', function () {
        linkCopy.textContent = 'Copied!';

        resetText();
      });
      clip.on('error', function () {
        linkCopy.textContent = 'Press Ctrl+C to copy';

        resetText();
      });
    }

    function resetText() {
      setTimeout(function () {
        linkCopy.innerHTML = 'Copy';
      }, 5000);
    }
  });
})();
