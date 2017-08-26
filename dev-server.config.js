const path = require('path');
const urlJoin = require('url-join');
const request = require('pify')(require('request'), { multiArgs: true });
const interceptor = require('express-interceptor');
const { port = process.env.PORT } = require('./package.json').config;

const baseUrl = `http://localhost:${port}`;
const apiUrl = urlJoin(baseUrl, '/api/calendar');
const isHtml = contetType => /text\/html/.test(contetType);
const script = (code = '') => `<script>${code.trim()}</script>`;

module.exports = {
  contentBase: path.join(__dirname, "dist"),
  noInfo: true,
  proxy: {
    '/api': baseUrl,
  },
  setup
}

function setup(app) {
  app.use(interceptor((req, res) => ({
    intercept,
    isInterceptable() {
      return isHtml(res.get('Content-Type'));
    }
  })));
}

function intercept(body, send) {
  // Fetch data.
  request.get(apiUrl)
    .then(([_, json]) => {
      // Inject preloaded data.
      const data = script(`window.__PRELOADED_DATA__ = ${json};`);
      return body.replace('<body>', `<body>${data}`);
    })
    .then(body => send(body));
}
