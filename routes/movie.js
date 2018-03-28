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
      User.findOne({token: token}, function(err, user) {
        if(!user) return res.status(403).send({success: false, msg: 'Unauthorized.'});
        MovieList.findOne({_id: user.movielist}, function(err, movielist) {
          console.log(movielist.list)
          res.send(movielist.list);
        });
      });
      // res.end();
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });

/* GET by specified ID */
// router.get('/search/:movieId', passport.authenticate('jwt', { session: false}), function(req, res) {
//   var token = getToken(req.headers);
//   var searchString = req.query.selected_id;
//   if (token) {
//     // Movie.find({ id: searchString},function (err, movies) {
//     //     if (err) return next(err);
//     //     res.json(movies);
//     // });
//   } else {
//       return res.status(403).send({success: false, msg: 'Unauthorized.'});
//   }
// });

/* SEARCH MOVIES */
// router.get('/search', passport.authenticate('jwt', { session: false}), function(req, res) {
//     var token = getToken(req.headers);
//     var searchString = req.query.title;
//     if (token) {
//         // Movie.find( { name: searchString},function (err, movies) {
//         //     if (err) return next(err);
//         //     res.json(movies);
//         // });
//     } else {
//         return res.status(403).send({success: false, msg: 'Unauthorized.'});
//     }
// });

/* Remove MOVIE */
router.post('/remove/:movieId', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if(token) {
      // find user
      User.findOne({token: token}, function(err, user) {
        if(!user) return res.status(403).send({success: false, msg: 'Unauthorized.'});
        // TODO: redirect to login

        // update object

      });
      res.end();
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

/* EDIT MOVIE */
router.post('/update/:movieId', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if(token) {
      // find user
      User.findOne({token: token}, function(err, user) {
        if(!user) return res.status(403).send({success: false, msg: 'Unauthorized.'});
        // TODO: redirect to login

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
        // TODO: redirect to login

        // push to user's movielist
        MovieList.findByIdAndUpdate(user.movielist, {$push: {list: req.body} }, function(err, movielist) {
          if(err) console.log(err);
          // movielist.list.push(req.body);
          // movielist.sortList();
          // console.log(req.body);
        });
      });
      // Movie.create(req.body, function (err, post) {
      //   if (err) return next(err);
      //   res.json(post);
      // });
      res.end();
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });

module.exports = router;
