
var express = require('express');
var router = express.Router();
var path = require("path");
var bird_controller = require('../controllers/birdController');

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});

// GET home page.
/*
router.get('/', function(req, res) {
  res.redirect('/catalog');
});
*/

router.get('/bird', function(req, res, next) {
  console.log(path.join(__dirname, '../public/bird.html'));
  console.log(req.query.foo);
  res.sendFile(path.join(__dirname, '../public/bird.html'));
});

router.get('/data', bird_controller.bird_list);

module.exports = router;
