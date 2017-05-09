'use strict';

const express = require('express');
const calendar = require('express').Router();
const path = require('path');
const app = express();
const getCalendar = require('./calendar');
const port = process.env.PORT || 3030;


calendar.get('/api/calendar', getCalendar);
app.use('/api/calendar', getCalendar),
app.use('/', express.static(path.join(__dirname, '../dist')))


app.listen(port);
console.log(`Server listening on port ${port}`);
