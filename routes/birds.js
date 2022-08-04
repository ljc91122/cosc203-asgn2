var express = require('express');
var router = express.Router();
var path = require("path");

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  console.log(path.join(__dirname, '../public/bird.html'));
  res.sendFile(path.join(__dirname, '../public/bird.html'));
});

/*
router.get('/', function(req, res, next) {
  res.send('this is a response');
});*/

router.get('/cool', function(req, res, next) {
  res.send('You are so cool');
});

module.exports = router;
