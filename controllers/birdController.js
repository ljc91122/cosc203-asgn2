var Bird = require('../models/bird')
var async = require('async')
const multer  = require('multer')

const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/data/images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg')
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

            Bird.find()//{ "status": "Nationally Vulnerable"}
            .distinct('status')
            //.select('primary_name photo')
            .exec(function (err, statuses) {
                if (err) { return next(err); }
                // Successful, so render.
                res.render('update', { statuses: statuses, bird: bird});
            })
        })
};

//Update a specific bird - POST
exports.bird_update_post = [upload.single('birdpic'),
    
    function (req, res, next) {

    Bird.findOne()//{ "status": "Nationally Vulnerable"}
        .where('_id').equals(req.params.id)
        //.select('primary_name photo')
        .exec( async function (err, bird) {
            if (err) { return next(err); }

            
            // Validate and sanitize fields.
            body('primary_name').trim().isLength({ min: 1 }).escape().withMessage('Bird primary name must be specified!');
            //body('psw').trim().isLength({ min: 3 }).escape().withMessage('Password must be longer than 3!'),
            
        
            // Extract the validation errors from a request.
            const errors = validationResult(req);
             
            // Create Author object with escaped and trimmed data

            if (req.body.primary_name != null)
                bird.primary_name = req.body.primary_name;

            if (req.body.english_name != null)
                bird.english_name = req.body.english_name;

            if (req.body.scientific_name != null)
                bird.scientific_name = req.body.scientific_name;

            if (req.body.order != null)
                bird.order = req.body.order;

            if (req.body.family != null)
                bird.family = req.body.family;

            if (req.body.status != null)
                bird.status = req.body.status;

            if (req.body.length != null)
                bird.size.length.value = Number(req.body.length);
            
            if (req.body.weight != null)
                bird.size.weight.value = Number(req.body.weight);

            if (req.file != null)
            {
                //delete the original picture
                await unlinkAsync('public/' + bird.photo.source)
                //update the new picture
                bird.photo.source = 'data/images/' + req.file.filename;
                console.log(req.file.path);
            }
        
             if (!errors.isEmpty()) {
                 // There are errors. Render form again with sanitized values/errors messages.
                 res.send(errors.array()[0].msg);
                 return;
             }
             else {
                 // Data from form is valid.
        
                 // Save bird.
                 bird.save(function (err) {
                     if (err) { return next(err); }
                     // Successful - redirect to new author record.
                     //res.sendFile(path.join(__dirname, '../public/welcome.html'));
                     //todo
                     res.redirect(`/bird/${bird._id}`);
                 });
        
              }
            })   
}];


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

    Bird.find()//{ "status": "Nationally Vulnerable"}
    .distinct('status')
    //.select('primary_name photo')
    .exec(function (err, statuses) {
        if (err) { return next(err); }
        // Successful, so render.
        res.render('create', { statuses: statuses});
    })
};


//Create a bird - POST
exports.bird_create_post = [
    upload.single('birdpic'),
    // Validate and sanitize fields.
    body('primary_name').trim().isLength({ min: 1 }).escape().withMessage('Bird primary name must be specified!'),
    //body('psw').trim().isLength({ min: 3 }).escape().withMessage('Password must be longer than 3!'),
    function (req, res, next) {
    

    // Extract the validation errors from a request.
    const errors = validationResult(req);
     
    // Create Author object with escaped and trimmed data
    var bird = new Bird(
         {
            primary_name: req.body.primary_name,
            english_name: req.body.english_name,
            scientific_name: req.body.scientific_name,
            other_names: [],
            order: req.body.order,
            family: req.body.family,
            status: req.body.status,
            size: {length: {value: Number(req.body.length), units: "cm"}, weight: {value: Number(req.body.weight), units: "g"}},
            photo: {credit: "Anonymous", source: 'data/images/' + req.file.filename}
         }
     );

     if (!errors.isEmpty()) {
         // There are errors. Render form again with sanitized values/errors messages.
         res.send(errors.array()[0].msg);
         return;
     }
     else {
         // Data from form is valid.

         // Save bird.
         bird.save(function (err) {
             if (err) { return next(err); }
             // Successful - redirect to new author record.
             //res.sendFile(path.join(__dirname, '../public/welcome.html'));
             //todo
             res.redirect(`/bird/${bird._id}`);
         });

      }
    }   
];