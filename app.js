var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

//Added routes for said APIs
var movie = require('./routes/movie');
var auth = require('./routes/auth');
var user = require('./routes/user');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, 'build')));

//added APIs
app.use('/api/movie', movie);
app.use('/api/auth', auth);
app.use('/user', user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('Something broke :(');
});

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/movie-tracker', { promiseLibrary: require('bluebird') })
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

module.exports = app;
