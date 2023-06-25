const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const config = require('../config/database')

//User Schema
const UserSchema =new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = module.exports = mongoose.model('User', UserSchema)

module.exports.getUserById = (id, cb) =>{
    return User.findById(id).exec()
}

module.exports.getUserByUsername = (username, cb) =>{
    const query = {username:username}
    return User.findOne(query).exec()
}

module.exports.addUser = (newUser) => {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10)
        .then((salt) => bcrypt.hash(newUser.password, salt))
        .then((hash) => {
          if (!hash) {
            throw new Error('Failed to hash password');
          }
          newUser.password = hash;
          return newUser.save();
        })
        .then((user) => resolve(user))
        .catch((err) => reject(err));
    });
  };

  module.exports.comparePassword = function(candidatePassword, hash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(candidatePassword, hash)
        .then(isMatch => resolve(isMatch))
        .catch(err => reject(err));
    });
  };