
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

// router.get('/bird', function(req, res, next) {
//   console.log(req.query.bird_name);
//   res.sendFile(path.join(__dirname, '../public/bird.html'));
// });

router.get('/bird/:bird_name', bird_controller.bird_item);

router.get('/data', bird_controller.bird_list);

module.exports = router;
