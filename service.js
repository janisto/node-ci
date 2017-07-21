'use strict';

const express = require('express');

const app = express();

const other = () => {
  return true;
};

app.get('/', (req, res) => {
  res.status(200).send('ok');
});

const server = app.listen(4000, () => {
  // const port = server.address().port;
  // console.log('App listening on port %s', port);
});

module.exports = server;
