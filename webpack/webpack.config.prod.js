const Path = require('path');
const Webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

let entry;

if (process.env.mode === 'demo') {
  entry = {
    'js/index': Path.resolve(__dirname, '../src/js/index.js'),
    'css/index': Path.resolve(__dirname, '../src/css/index.css'),
    'css/tailwind': Path.resolve(__dirname, '../src/scss/tailwind.scss'),
  };
} else {
  entry = {
    'js/index': Path.resolve(__dirname, '../src/js/index.js'),
    'css/index': Path.resolve(__dirname, '../src/scss/cdn.scss'),
  };
}

module.exports = merge(common, {
  mode: 'production',
  entry,
  devtool: 'source-map',
  stats: 'errors-only',
  bail: true,
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          map: {
            inline: false,
          },
        },
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new Webpack.optimize.ModuleConcatenationPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
});
