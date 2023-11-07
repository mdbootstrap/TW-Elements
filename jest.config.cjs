module.exports = {
  verbose: true,
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/src/js/autoinit",
    "/src/js/base-component.js",
    "/src/js/util/*",
    "/src/js/dom/*",
    "/test",
  ],
  coverageDirectory: "test/coverage",
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },
};
