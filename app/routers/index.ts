import express = require('express');

var indexRouter = express.Router();
// GET home page.
indexRouter.get('/', (req, res) => {
  res.send('Hello world!');
});

export { indexRouter }