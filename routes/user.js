var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/User.js');
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
          res.send(movielist.list);
          // res.send({success: true, movielist: movielist.list});
        });
      });
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

/* Get specific user's MovieList
  Non-secure (any user can access this) */
router.get('/:uid', function(req, res) {
  var uid = req.params.uid;
  User.findById(uid, function(err, user) {
    if(!user) return res.status(403).send({success: false, msg: 'User not found.'});
    MovieList.findById(user.movielist, function(err, movielist) {
      res.send(movielist.list);
      // res.send({success: true, movielist: movielist.list});
    });
  });
});

module.exports = router;
