const mongoose = require('mongoose');

//TODO: is bluebird necessary?
mongoose.Promise = require('bluebird');

const userSchema = new mongoose.Schema({

  // username: {type: String, required: true, unique: true},
  name: {type: String, required: true, unique: false},
  password: {type: String, required: true, unique: false},

});

const User = mongoose.model('User', userSchema);
module.exports = User;
