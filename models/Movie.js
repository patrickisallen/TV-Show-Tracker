var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
    original_name: String,
    id: Number,
    name: String,
    vote_average: Number,
    poster_path: String,
    description: String,
    first_air_date: { type: Date },
    popularity: Number,
    year: Number,
    updated_date: { type: Date, default: Date.now },
  });

  module.exports = mongoose.model('Movie', MovieSchema);