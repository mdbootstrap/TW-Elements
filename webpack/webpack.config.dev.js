const Path = require('path');
const Webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const paths = require('../demo/paths.json');

// PLUGINS
plugins = [
  new Webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development'),
  }),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: Path.resolve(__dirname, '../demo/index.html'),
    inject: false,
  }),
  new CopyWebpackPlugin([
    {
      from: Path.resolve(__dirname, '../demo/dev'),
      to: 'dev',
    },
  ]),
];

paths.forEach((path) => {
  plugins.push(
    new HtmlWebpackPlugin({
      filename: path.fileName,
      template: Path.resolve(__dirname, path.pathToFile),
      inject: false,
    })
  );
});

module.exports = merge(common, {
  mode: 'development',
  entry: {
    'js/index': Path.resolve(__dirname, '../src/js/index.js'),
    'css/index': Path.resolve(__dirname, '../src/css/index.css'),
    'css/tailwind': Path.resolve(__dirname, '../src/scss/tailwind.scss'),
  },
  devtool: 'cheap-eval-source-map',
  devServer: {
    inline: true,
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.js$/,
        include: Path.resolve(__dirname, '../src'),
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          emitWarning: true,
        },
      },
      {
        test: /\.js$/,
        include: Path.resolve(__dirname, '../src'),
        loader: 'babel-loader',
      },
    ],
  },
});
