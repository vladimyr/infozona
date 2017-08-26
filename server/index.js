const express = require('express');
const ejs = require('ejs');
const { readFileSync } = require('fs');
const { join } = require('path');
const { port = process.env.PORT } = require('../package.json').config;
const calendar = require('./calendar/');
const { fetchCalendar } = calendar;

const index = join(__dirname, '../dist/index.html');
const dist = join(__dirname, '../dist');
const static = express.static(dist, { index: false });
const render = ejs.compile(readFileSync(index, 'utf8'));

const app = express();
app.set('view engine', 'ejs');
app.use('/api/calendar', calendar);
app.use('/index.html', homepage);
app.use(static);
app.use('*', homepage);

app.listen(port, () => console.log(`Server listening on port ${port}`));

function homepage(req, res) {
  fetchCalendar()
    .then(cal => {
      const html = render({ data: JSON.stringify(cal) });
      res.send(html)
    });
}
