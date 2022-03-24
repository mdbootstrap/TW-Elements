const Path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const packageVersion = require('../package.json').version;

let distName, filesToCopy;

if (process.env.mode === 'demo') {
  distName = 'dist-demo';
} else {
  distName = 'dist';
}

if (process.env.mode === 'demo') {
  filesToCopy = [
    { from: Path.resolve(__dirname, '../demo/index.html') },
    { from: Path.resolve(__dirname, '../demo/sites'), to: 'sites' },
    { from: Path.resolve(__dirname, '../demo/dev'), to: 'dev' },
    { from: Path.resolve(__dirname, '../src/img'), to: 'img' },
  ];
} else {
  filesToCopy = [
    { from: Path.resolve(__dirname, '../src/index.html') },
    { from: Path.resolve(__dirname, '../src/img'), to: 'img' },
    { from: Path.resolve(__dirname, '../src/js'), to: 'src/js' },
    { from: Path.resolve(__dirname, '../src/scss'), to: 'src/scss' },
    { from: Path.resolve(__dirname, '../src/files/README.md') },
    {
      from: Path.resolve(__dirname, '../src/files/package.json'),
      transform(content) {
        return content.toString().replace('<packageVersion>', packageVersion);
      },
    },
  ];
}

module.exports = {
  entry: {
    'js/index': Path.resolve(__dirname, '../src/js/index.js'),
    'css/index': Path.resolve(__dirname, '../src/scss/index.scss'),
  },
  output: {
    path: Path.join(__dirname, `../${distName}`),
    filename: '[name].min.js',
  },
  plugins: [
    new CopyWebpackPlugin(filesToCopy),
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].min.css',
    }),
  ],
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          },
        },
      },
      {
        test: /\.s?css/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
};
