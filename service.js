'use strict';

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.status(200).send('ok');
});

const server = app.listen(4000, () => {
  // const port = server.address().port;
  // console.log(`App listening on port: ${port}`);
});

module.exports = server;
