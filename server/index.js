const express = require('express');
const fallback = require('express-history-spa-fallback').default;
const morgan = require('morgan');
const helmet = require('helmet');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const { parse: parseUrl } = require('url');
const { port = process.env.PORT } = require('../package.json').config;
const fetchCalendar = require('./calendar/');

const isDev = process.env.NODE_ENV === 'development';
const template = ejs.compile(fs.readFileSync(
  path.join(__dirname, isDev ? '../client/index.html' : '../dist/index.html'),
  'utf8'
));
const static = express.static(
  path.join(__dirname, '../dist'),
  { index: false }
);

const app = express();
app.use(helmet());
app.use(morgan(isDev ? 'dev' : 'short'));
app.use(language);
app.use('/api/calendar', calendar);
app.use(static);
app.use(fallback(index));
app.use((err, req, res, next) => {
  console.error(err.message);
  console.error(err.stack);
  res.status(500);
});
app.listen(port, () => console.log(`Server listening on port ${port}`));

function index(req, res) {
  fetchCalendar({ lang: req.lang })
    .then(cal => {
      const html = template({ data: JSON.stringify(cal) });
      res.send(html)
    })
    .catch(err => next(err));
}

function calendar(req, res) {
  fetchCalendar({ lang: req.lang })
    .then(cal => res.json(cal))
    .catch(err => next(err));
}

function language(req, res, next) {
  const { query = {} } = parseUrl(req.url, true);
  req.lang = query.lang;
  next();
}
