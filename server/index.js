const express = require('express');
const ejs = require('ejs');
const { readFileSync } = require('fs');
const { join } = require('path');
const { parse } = require('url');
const { port = process.env.PORT } = require('../package.json').config;
const fetchCalendar = require('./calendar/');

const index = join(__dirname, '../dist/index.html');
const dist = join(__dirname, '../dist');
const static = express.static(dist, { index: false });
const render = ejs.compile(readFileSync(index, 'utf8'));

const app = express();
app.use(language);
app.use('/api/calendar', calendar);
app.use('/index.html', homepage);
app.use(static);
app.use('*', homepage);
app.use((err, req, res, next) => {
  console.error(err.message);
  console.error(err.stack);
  res.status(500);
});
app.listen(port, () => console.log(`Server listening on port ${port}`));

function homepage(req, res) {
  fetchCalendar({ lang: req.lang })
    .then(cal => {
      const html = render({ data: JSON.stringify(cal) });
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
  const { query = {} } = parse(req.url, true);
  req.lang = query.lang;
  next();
}
