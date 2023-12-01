/*
--------------------------------------------------------------------------
TW Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

If you would like to purchase a COMMERCIAL, non-AGPL license for TWE, please check out our pricing: https://tw-elements.com/pro/
--------------------------------------------------------------------------
*/

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
