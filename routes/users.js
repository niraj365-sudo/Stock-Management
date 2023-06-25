const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const config = require('../config/database')

//Register
router.post('/register',(req, res, next)=>{
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    })

    User.addUser(newUser)
    .then((user) => {
      res.json({ success: true, msg: 'Registration Successful' });
    })
    .catch((err) => {
      res.json({ success: false, msg: 'Registration failed' });
    });
})


// Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
  
    User.getUserByUsername(username)
      .then(user => {
        if (!user) {
          return res.json({ success: false, msg: 'User not found' });
        }
  
        User.comparePassword(password, user.password)
          .then(isMatch => {
            if (isMatch) {
              const token = jwt.sign(user.toJSON(), config.secret, {
                expiresIn: 604800, // 1 week
              });
  
              res.json({
                success: true,
                msg: 'Successfully Logged In',
                token: 'Bearer ' + token,
                user: {
                  id: user._id,
                  name: user.name,
                  username: user.username,
                  email: user.email,
                },
              });
            } else {
              return res.json({ success: false, msg: 'Wrong Password' });
            }
          })
          .catch(err => next(err));
      })
      .catch(err => next(err));
  });
  

//Profile
router.get('/profile', passport.authenticate('jwt', {session: false}) ,(req, res, next)=>{
    res.json({
        user: req.user
    })
})




module.exports = router