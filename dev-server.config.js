const path = require('path');
const urlJoin = require('url-join');
const ejs = require('ejs');
const request = require('pify')(require('request'), { multiArgs: true });
const interceptor = require('express-interceptor');
const { port = process.env.PORT } = require('./package.json').config;

const baseUrl = `http://localhost:${port}`;
const apiUrl = urlJoin(baseUrl, '/api/calendar');
const isHtml = contetType => /text\/html/.test(contetType);

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

function intercept(html, send) {
  // Fetch data.
  request.get(apiUrl)
    .then(([_, data]) => {
      // Inject preloaded data.
      send(ejs.render(html, { data }))
    })
}
