'use strict';

const express = require('express');
const path = require('path');
const app = express();
const getCalendar = require('./calendar');
const defaultPort = require('../package.json').config.port;
const port = process.env.PORT || defaultPort;


app.use('/api/calendar', getCalendar),
app.use('/', express.static(path.join(__dirname, '../dist')))


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
