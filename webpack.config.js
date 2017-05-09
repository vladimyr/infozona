'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const defaultPort = require('./package.json').config.port;

const port = process.env.PORT || defaultPort;

let baseConfig = {
  entry: [
    'bootstrap-loader',
    path.join(__dirname, './client/style.scss'),
    path.join(__dirname, './client/main.js')
  ],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: 'babel-loader',
      exclude: path.join(__dirname, 'node_modules')
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        use: ['css-loader'],
        fallback: 'style-loader'
      })
    }, {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        use: ['css-loader', 'sass-loader'],
        fallback: 'style-loader'
      })
    }, {
      test: /bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
      use: 'imports-loader?jQuery=jquery'
    }, {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'url-loader',
      query: {
        limit: 10000,
        name: '[name].[ext]?[hash]'
      }
    }, {
      test: /\.(woff2?|svg)$/,
      loader: 'url-loader',
      query: { limit: 10000 }
    }, {
      test: /\.(ttf|eot)$/,
      use: 'file-loader'
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: path.join(__dirname, 'dist/index.html'),
      template: path.join(__dirname, 'client/index.html'),
      inject: true
    }),
    new ExtractTextPlugin('style.css')
  ]
};

const devConfig = (() => {
  const dev = {
    devtool: 'eval',
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      noInfo: true,
      proxy: {
        '/api': `http://localhost:${port}`
      }
    }
  };
  return Object.assign(dev, baseConfig);
})();

module.exports = env => env === 'dev' ? devConfig : baseConfig;
