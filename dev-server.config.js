const path = require('path');
const { parse } = require('url');
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
  app.use(language);
  app.use(interceptor((req, res) => ({
    isInterceptable() {
      return isHtml(res.get('Content-Type'));
    },
    intercept(html, send) {
      const qs = { lang: req.lang };
      // Fetch data.
      request.get(apiUrl, { qs })
        .then(([_, data]) => {
          // Inject preloaded data.
          send(ejs.render(html, { data }))
        })
    }
  })));
}

function language(req, res, next) {
  const { query = {} } = parse(req.url, true);
  req.lang = query.lang;
  next();
}

