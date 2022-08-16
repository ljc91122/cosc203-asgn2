
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

router.get('/bird/create', bird_controller.bird_create_get);
router.post('/bird/create', bird_controller.bird_create_post);

router.get('/bird/:id', bird_controller.bird_item);

router.get('/data', bird_controller.bird_list);


router.get('/bird/:id/update', bird_controller.bird_update_get);
router.post('/bird/:id/update', bird_controller.bird_update_post);

router.get('/bird/:id/delete', bird_controller.bird_delete_get);



module.exports = router;
