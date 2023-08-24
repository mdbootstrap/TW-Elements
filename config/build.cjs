const fs = require("fs-extra");
const { EOL } = require("os");
const shell = require("shelljs");
const version = require("../package.json").version;
const intro = require("./intro.cjs");

if (process.env.mode === "demo") {
  distName = "dist-demo";
} else {
  distName = "dist";
}

if (process.env.mode === "demo") {
  // demo build
  fs.copy(`./src/demo-files`, `./${distName}`, (err) => {
    if (err) throw err;
  });
} else {
  // add disclaimer to js files
  const umdJsWithDisclaimer =
    intro(version) +
    fs.readFileSync(`./${distName}/js/tw-elements.umd.min.js`, {
      encoding: "utf-8",
    });

  fs.writeFileSync(
    `./${distName}/js/tw-elements.umd.min.js`,
    umdJsWithDisclaimer,
    {
      encoding: "utf-8",
    }
  );

  const esJsWithDisclaimer =
    intro(version) +
    fs.readFileSync(`./${distName}/js/tw-elements.es.min.js`, {
      encoding: "utf-8",
    });

  fs.writeFileSync(
    `./${distName}/js/tw-elements.es.min.js`,
    esJsWithDisclaimer,
    {
      encoding: "utf-8",
    }
  );

  // build index.min.css from tailwind.scss
  shell.exec(
    `npx tailwindcss -i ./src/scss/tailwind.scss -o ./${distName}/css/tw-elements.min.css --minify`
  );

  // add disclaimer to css file
  const cssWithDisclaimer =
    intro(version) +
    fs.readFileSync(`./${distName}/css/tw-elements.min.css`, {
      encoding: "utf-8",
    });

  fs.writeFileSync(`./${distName}/css/tw-elements.min.css`, cssWithDisclaimer, {
    encoding: "utf-8",
  });

  // build
  fs.copy(`./src/files/package.json`, `./${distName}/package.json`, (err) => {
    if (err) throw err;

    // package.json version update
    const contentApp = fs.readFileSync(`./${distName}/package.json`, {
      encoding: "utf-8",
    });
    const lines = contentApp.split(/\r?\n/g);
    const versionIndex = lines.findIndex((line) => line.match(/version/));
    lines[versionIndex] = `  "version": "${version}",`;
    fs.writeFileSync(`./${distName}/package.json`, lines.join(EOL), {
      encoding: "utf-8",
    });
  });

  fs.copy(`./src/files/index.html`, `./${distName}/index.html`, (err) => {
    if (err) throw err;
  });
  fs.copy(`./src/files/README.md`, `./${distName}/README.md`, (err) => {
    if (err) throw err;
  });
  fs.copy(`./src/js/plugin.cjs`, `./${distName}/plugin.cjs`, (err) => {
    if (err) throw err;
  });
  fs.copy(`./src/js`, `./${distName}/src/js`, (err) => {
    if (err) throw err;
  });
  fs.copy(`./src/scss`, `./${distName}/src/scss`, (err) => {
    if (err) throw err;
  });
}
