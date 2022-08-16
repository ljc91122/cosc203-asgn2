var Bird = require('../models/bird')
var async = require('async')
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/data/images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '.png')
    }
  })
  

const upload = multer({ storage: storage })

const { body,validationResult } = require("express-validator");

// Query list of all bird and return as json.
exports.bird_list = function (req, res, next) {

    Bird.find()//{ "status": "Nationally Vulnerable"}
        .sort([['primary_name', 'ascending']])
        .exec(function (err, list_birds) {
            if (err) { return next(err); }
            // Successful, so render.
            //res.render('author_list', { title: 'Author List', author_list: list_birds });
            res.send(list_birds);
        })

};

//Query a specific bird
exports.bird_item = function (req, res, next) {

    Bird.findOne()//{ "status": "Nationally Vulnerable"}
        .where('_id').equals(req.params.id)
        //.select('primary_name photo')
        .exec(function (err, bird) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('bird', { bird: bird});
        })

};

//Update a specific bird - GET
exports.bird_update_get = function (req, res, next) {

    Bird.findOne()//{ "status": "Nationally Vulnerable"}
        .where('_id').equals(req.params.id)
        //.select('primary_name photo')
        .exec(function (err, bird) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('update', { bird: bird});
        })
};

//Update a specific bird - POST
exports.bird_update_post = function (req, res, next) {

    Bird.findOne()//{ "status": "Nationally Vulnerable"}
        .where('_id').equals(req.params.id)
        //.select('primary_name photo')
        .exec(function (err, bird) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('bird', { bird: bird});
        })

};


//Delete a specific bird - Get
exports.bird_delete_get = function (req, res, next) {

    Bird.findByIdAndRemove()//{ "status": "Nationally Vulnerable"}
        .where('_id').equals(req.params.id)
        //.select('primary_name photo')
        .exec(function (err, bird) {
            if (err) { return next(err); }
            // Successful, so render.
            res.redirect('/');
        })

};


//Create a bird - GET
exports.bird_create_get = function (req, res, next) {

    // Successful, so render.
    res.render('create', {});
};


//Create a bird - POST
exports.bird_create_post = [
    upload.single('birdpic'),
    function (req, res, next) {

    // Successful, so render.
    res.render('create', {});
}];