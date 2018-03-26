var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Movie = require('../models/Movie.js');
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

/* SEARCH MOVIES */
router.get('/search', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    var searchString = req.query.title;
    if (token) {
        Movie.find({'title': searchString},function (err, movies) {
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
      Movie.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
      });
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });

module.exports = router;