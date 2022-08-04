var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var BirdSchema = new Schema(

  /*
  {
    first_name: {type: String, required: true, maxLength: 100},
    family_name: {type: String, required: true, maxLength: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }*/

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