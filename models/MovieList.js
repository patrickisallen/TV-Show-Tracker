var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieListSchema = new Schema({
  list: [{
    original_name: String,
    id: Number,
    title: String,
    episodes_watched: Number,
    status: String,
    rating: Number
  }]
});

module.exports = mongoose.model('MovieList', MovieListSchema);
