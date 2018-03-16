var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieListSchema = new Schema({
  list: [{
      isbn: String,
      title: String,
      progress: String,
      status: String,
      rating: Number
    }]
});

module.exports = mongoose.model('MovieList', MovieListSchema);
