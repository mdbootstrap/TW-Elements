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

// add disclaimer to js file

const jsWithDisclaimer =
  intro() +
  fs.readFileSync(`./${distName}/js/index.min.js`, {
    encoding: "utf-8",
  });

fs.writeFileSync(`./${distName}/js/index.min.js`, jsWithDisclaimer, {
  encoding: "utf-8",
});

// build index.min.css from tailwind.scss

shell.exec(
  `npx tailwindcss -i ./src/scss/tailwind.scss -o ./${distName}/css/index.min.css --minify`
);

// to creat .map file

shell.exec(
  `sass ./${distName}/css/index.min.css ./${distName}/css/index.min.css --style compressed`
);

// add disclaimer to css file

const cssWithDisclaimer =
  intro() +
  fs.readFileSync(`./${distName}/css/index.min.css`, {
    encoding: "utf-8",
  });

fs.writeFileSync(`./${distName}/css/index.min.css`, cssWithDisclaimer, {
  encoding: "utf-8",
});

// copy files

fs.copy(`./src/img`, `./${distName}/img`, (err) => {
  if (err) throw err;
});

if (process.env.mode === "demo") {
  // demo build

  fs.copy(`./demo/dev`, `./${distName}/dev`, (err) => {
    if (err) throw err;
  });
  fs.copy(`./src/demo-files`, `./${distName}`, (err) => {
    if (err) throw err;
  });
  fs.copy(`./index.html`, `./${distName}/index.html`, (err) => {
    if (err) throw err;
  });
  fs.copy(`./demo/sites`, `./${distName}/sites`, (err) => {
    if (err) throw err;
  });
} else {
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
  fs.mkdir("dist/types");
  fs.appendFile(
    "dist/types/index.d.ts",
    "declare module 'tw-elements'",
    (err) => {
      if (err) throw err;
    }
  );
}
