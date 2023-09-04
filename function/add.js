// add.js
const express = require('express');
const router = express.Router();

router.get('/add', (req, res) => {
  res.render('add');
});

module.exports = router;
