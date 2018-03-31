var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieListSchema = new Schema({
  list: [{
    _id: Number,
    original_name: String,
    title: String,
    episodes_watched: Number,
    status: String,
    rating: Number
  }]
});

module.exports = mongoose.model('MovieList', MovieListSchema);
