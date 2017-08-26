const express = require('express');
const { join } = require('path');
const { port = process.env.PORT } = require('../package.json').config;

const app = express();
app.use('/api/calendar', require('./calendar'));
app.use('/', express.static(join(__dirname, '../dist')));
app.use('*', (_, res) => res.sendFile(join(__dirname, '../dist/index.html')));

app.listen(port, () => console.log(`Server listening on port ${port}`));
