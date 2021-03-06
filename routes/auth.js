var mongoose = require('mongoose');
var passport = require('passport');
var settings = require('../config/settings');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/User");
var MovieList = require("../models/MovieList")

router.post('/register', function(req, res) {
    if (!req.body.username || !req.body.email || !req.body.password) {
      res.json({success: false, msg: 'Please pass username and password.'});
    } else {
      var newMovieList = new MovieList();

      var newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        movielist: newMovieList._id,
        token: ""
      });

      // save the movielist
      newMovieList.save(function(err) {
        if (err) console.log(err);
      });

      // save the user
      newUser.save(function(err) {
        if (err) {
          return res.json({success: false, msg: 'Username already exists.'});
        }
        res.json({success: true, msg: 'Successful created new user.'});
      });
    }
  });

  router.post('/login', function(req, res) {
    User.findOne({username: req.body.username}, function(err, user) {
      if (err) console.log(err);
      if (!user) {
        res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.sign(user.toJSON(), settings.secret);

            // save token into user
            user.saveToken(token);

            // return the information including token as JSON
            res.json({success: true, token: 'JWT ' + token});
          } else {
            res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        });
      }
    });
  });

  module.exports = router;
