var Bird = require('../models/bird')
var async = require('async')

const { body,validationResult } = require("express-validator");

// Display list of all Authors.
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
