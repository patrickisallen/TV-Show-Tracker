var mongoose = require('mongoose');
var connection = mongoose.createConnection('mongodb://localhost/movie-tracker')
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(connection);

module.exports = autoIncrement;
