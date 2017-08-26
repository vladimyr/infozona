const express = require('express');
const path = require('path');
const { port = process.env.PORT } = require('../package.json').config;

const app = express();
app.use('/api/calendar', require('./calendar'));
app.use('/', express.static(path.join(__dirname, '../dist')));
app.listen(port, () => console.log(`Server listening on port ${port}`));
