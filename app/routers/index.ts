import express = require('express');

var indexRouter = express.Router();
// GET home page.
indexRouter.get('/', (req, res) => {
  res.status(200).json({ api_version: "1.0", endpoints: ["/auth", "/users", "/games", "/messages"] });
});

export { indexRouter }