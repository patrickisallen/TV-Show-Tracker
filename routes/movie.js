var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/User.js');
// var Movie = require('../models/Movie.js');
var MovieList = require('../models/MovieList.js');
var passport = require('passport');
require('../config/passport')(passport);

getToken = function (headers) {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) return parted[1];
      else return null;
    } else {
      return null;
    }
};

/* Get current user's MovieList */
router.get('/', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      // find user
      User.findOne({token: token}, function(err, user) {
        if(!user) return res.status(403).send({success: false, msg: 'Unauthorized.'});
        MovieList.findById(user.movielist, function(err, movielist) {
          // console.log(movielist.list);
          // res.send(movielist.list);
          res.status(200).send({success: true, data: movielist.list});
        });
      });
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

/* Get specific user's MovieList
  Non-secure (any user can access this) */
router.get('/profile/:uid', function(req, res) {
  var uid = req.params.uid;
  User.findById(uid, function(err, user) {
    if(!user) return res.status(403).send({success: false, msg: 'User not found.'});
    MovieList.findById(user.movielist, function(err, movielist) {
      res.status(200).send({success: true, data: movielist.list});
    });
  });
});

/* Remove movie from MovieList */
router.post('/remove/:movieid', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    var movieid = req.params.movieid;
    if(token) {
      // find user
      User.findOne({token: token}, function(err, user) {
        if(!user) return res.status(403).send({success: false, msg: 'Unauthorized.'});
        // remove the movie from MovieList
        MovieList.findById(user.movielist, function(err, movielist) {
          movielist.removeMovie(movieid);
          res.end();
        });
      });
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

/* Edit movie in MovieList */
router.post('/update/:movieid', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if(token) {
      // find user
      User.findOne({token: token}, function(err, user) {
        if(!user) return res.status(403).send({success: false, msg: 'Unauthorized.'});

        // update object

      });
      res.end();
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

/* SAVE MOVIE */
router.post('/', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      // find user
      User.findOne({token: token}, function(err, user) {
        if(!user) return res.status(403).send({success: false, msg: 'Unauthorized.'});

        // push to user's movielist
        MovieList.findByIdAndUpdate(user.movielist, {$push: {list: req.body} }, function(err, movielist) {
          if(err) console.log(err);
          // movielist.list.push(req.body);
          // movielist.sortList();
          // console.log(req.body);
        });
      });
      res.status(200).send({success: true, msg: 'Saved to MovieList.'})
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

module.exports = router;
