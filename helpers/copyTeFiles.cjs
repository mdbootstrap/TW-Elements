const fs = require("fs-extra");

try {
  fs.copySync(
    "dist/js/tw-elements.umd.min.js",
    "site/static/js/tw-elements.umd.min.js"
  );
  console.log("Successfully copied tw-elements.umd.min.js");
} catch (err) {
  console.log("Failed to copy tw-elements.umd.min.js");
}

try {
  fs.copySync("dist/plugin.cjs", "site/static/js/plugin.cjs");
  console.log("Successfully copied plugin.cjs");
} catch (err) {
  console.log("Failed to copy plugin.cjs");
}
