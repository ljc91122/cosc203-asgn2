var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var BirdSchema = new Schema(

  {
    primary_name: String,
    english_name: String,
    scientific_name: String,
    order: String,
    family: String,
    other_names: [String],
    status: String,
    photo: {
        credit: String,
        source: String
    },
    size: {
        length: {
            value: Number,
            units: String
        },
        weight: {
          value: Number,
          units: String
        }
    }
},

{ collection : 'nzbird' }
);

// Virtual for author's URL
BirdSchema
.virtual('url')
.get(function () {
  return '/bird/' + this._id;
});

//Export model
module.exports = mongoose.model('nzbird', BirdSchema);