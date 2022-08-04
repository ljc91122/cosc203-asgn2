var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Genre = new Schema(
  {
    name: {type: String, required: true, maxLength: 100, minLength: 3}
  }
);

// Virtual for book's URL
Genre
.virtual('url')
.get(function () {
  return '/catalog/genre/' + this._id;
});

//Export model
module.exports = mongoose.model('Genre', Genre);