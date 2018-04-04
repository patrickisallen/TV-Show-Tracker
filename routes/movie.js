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

/* Remove movie from MovieList */
router.post('/remove/:movieid', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    var movieid = req.params.movieid;
    if(token) {
      // find user
      User.findOne({token: token}, function(err, user) {
        if(!user) return res.status(403).send({success: false, msg: 'Unauthorized.'});
        // remove the movie from MovieList
        MovieList.findByIdAndUpdate(user.movielist,  {$pull: {list: {_id: movieid}}}, function(err, movielist) {
          if(err) console.log(err);
          res.send({success: true, msg: 'Remove from MovieList.'});
        });
      });
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

/* Edit movie in MovieList */
router.post('/update/:movieid', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    var movieid = req.params.movieid;
    if(token) {
      // find user
      User.findOne({token: token}, function(err, user) {
        if(!user) return res.status(403).send({success: false, msg: 'Unauthorized.'});
        // update movie in MovieList
        MovieList.findOneAndUpdate({_id: user.movielist, 'list._id': movieid}, {$set: {
          'list.$.episodes_watched': req.body.episodes_watched,
          'list.$.status': req.body.status,
          'list.$.rating': req.body.rating
        }}, function(err, movie) {
          if(err) console.log(err);
          // console.log(movie);
          res.send({success: true, msg: 'Updated MovieList.'});
        });
      });
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

/* Save movie to user's MovieList */
router.post('/', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      // find user
      User.findOne({token: token}, function(err, user) {
        if(!user) return res.status(403).send({success: false, msg: 'Unauthorized.'});
        // push to user's movielist
        MovieList.findByIdAndUpdate(user.movielist, {$push: {list: req.body} }, function(err, movielist) {
          if(err) console.log(err);
          res.send({success: true, msg: 'Saved to MovieList.'});
        });
      });
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

/* Get movie in MovieList */
router.get('/:movieid', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      // find user
      User.findOne({token: token}, function(err, user) {
        if(!user) return res.status(403).send({success: false, msg: 'Unauthorized.'});
        // find movie in user's movielist
        MovieList.findOne({_id: user.movielist, 'list._id': movieid}, function(err, movielist) {
          if(err) console.log(err);
          if(!movielist) res.send({success: true, inmovielist: false});
          else res.send({success: true, inmovielist: true});
        });
      });
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

module.exports = router;
