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

MovieListSchema.methods.sortList = function() {
  var movielist = this
  // console.log(movielist);
  var list = movielist.list;
  list.sort(compare);
  movielist.list = list;
  movielist.save(function(err) {
    if(err) console.log(err);
  });
};

function compare(a, b) {
  if (a.title < b.title) return -1;
  if (a.title > b.title) return 1;
  return 0;
};

module.exports = mongoose.model('MovieList', MovieListSchema);
