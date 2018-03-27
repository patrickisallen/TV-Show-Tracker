var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var autoIncrement = require('./AutoIncrement.js')

var UserSchema = new Schema({
  username: {
      type: String,
      unique: true,
      required: true
  },
  email: {
      type: String,
      unique: true,
      required: true
  },
  password: {
      type: String,
      required: true
  },
  movielist: {
      type: Schema.ObjectId,
      required: true
  },
  token: String
});

UserSchema.virtual('url')

UserSchema.get(function () {
    return '/user/' + this._id;
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

UserSchema.methods.saveToken = function (token) {
  var user = this;
  user.token = token;
  user.save(function(err) {
    if(err) console.log(err);
  });
};

var options = {
    model: 'User',
    startAt: 10000000,
    incrementBy: 1
};
UserSchema.plugin(autoIncrement.plugin, options);

module.exports = mongoose.model('User', UserSchema);
