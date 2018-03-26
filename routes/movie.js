var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/User.js');
var Movie = require('../models/Movie.js');
var MovieList = require('../models/MovieList.js');
var passport = require('passport');
require('../config/passport')(passport);

getToken = function (headers) {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

/* GET ALL MOVIES */
router.get('/', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      Movie.find(function (err, movies) {
        if (err) return next(err);
        res.json(movies);
      });
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });

/* GET by specified ID */
/*
router.get('/GETBYID', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  var searchString = req.query.selected_id;
  if (token) {
    Movie.find({ id: searchString},function (err, movies) {
        if (err) return next(err);
        res.json(movies);
    });
} else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
}
});*/

/* SEARCH MOVIES */
router.get('/search', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    var searchString = req.query.title;
    if (token) {
        Movie.find( { name: searchString},function (err, movies) {
            if (err) return next(err);
            res.json(movies);
        });
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
        // push to user's movielist
        MovieList.findByIdAndUpdate({_uid: user.movielist}, {$push: {list: req.body}});
      });
      // Movie.create(req.body, function (err, post) {
      //   if (err) return next(err);
      //   res.json(post);
      // });
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });

module.exports = router;
