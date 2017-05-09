'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let baseConfig = {
  entry: [
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
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: path.join(__dirname, 'dist/index.html'),
      template: path.join(__dirname, 'client/index.html'),
      inject: true
    })
  ]
};

module.exports = env => {
  let config = Object.assign({}, baseConfig);
  if (env === 'dev') {
    config.devtool = 'eval';
    config.devServer = {
      contentBase: path.join(__dirname, "dist"),
      noInfo: true,
      proxy: {
        "/api": "http://localhost:3030"
      }
    }
  }
  return config;
};
