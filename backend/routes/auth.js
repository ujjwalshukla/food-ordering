var express = require('express');
var router  = express.Router();
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redis = require('./../helper/redis');


var db = require("./../models");


router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    db.User.create({
      username: username,
      password: hash
    }).then((result) => {
      console.log("User created: ", result);
      redis.addUsers(result.id, result.username);
      res.json({
        sucess: true,
        message: "user created!"
      });
    }).catch((result) => {
      res.status(401).json({
        sucess: false,
        token: null,
        err: 'User Exists!'
      });
    })
  });
});

/* This is SUPER important! This is the route that the client will be passing the entered credentials for verification to. If the credentials match, then the server sends back a json response with a valid json web token for the client to use for identification. */
router.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  console.log("User submitted: ", username, password);

  db.User.findOne(
    {
      where: { username: username }
    })
    .then((user) => {
      console.log("User Found: ", user);
      if (user === null) {
        res.status(401).json({
          sucess: false,
          token: null,
          err: 'Invalid Credentials'
        });
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          console.log("Valid!");

          let token = jwt.sign(
            {
              username: user.username,
              userId: user.id
            },
            'super secret',
            { expiresIn: 129600 }); // Signing the token

          res.json({
            sucess: true,
            err: null,
            userId: user.id,
            token
          });
        }
        else {
          console.log("Entered Password and Hash do not match!");
          res.status(401).json({
            sucess: false,
            token: null,
            err: 'Entered Password and Hash do not match!'
          });
        }
      });
    })
});

module.exports = router;
