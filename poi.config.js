const path = require('path');
const devServer = require('./dev-server.config');

const rules = [{
  test: /bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
  use: 'imports-loader?jQuery=jquery'
}];

module.exports = (options) => ({
  entry: [
    require.resolve('bootstrap-loader'),
    './client/style.scss',
    './client/main.js'
  ],
  extractCSS: true, // required by bootstrap-loader
  html: {
    template: `!!html-loader!${ path.join(__dirname, 'client/index.html') }`,
    inject: true
  },
  webpack(config) {
    config.module.rules.push(...rules);
    return config;
  },
  sourceMap: options.mode === 'development',
  devServer
});
