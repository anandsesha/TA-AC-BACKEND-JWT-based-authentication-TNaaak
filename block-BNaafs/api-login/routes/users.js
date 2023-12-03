var express = require('express');
const User = require('../models/User');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// POST /api/users/register
router.post('/register', async (req, res, next) => {
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User already exists. Please log in.' });
    }

    var user = await User.create(req.body);
    console.log(user);
    // generate a token
    var token = await user.signToken();
    console.log(token); // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTZiZTcxZTUzYjI4ZjI1Y2RiNmQyZjEiLCJlbWFpbCI6ImFydmluZDRAeWFob28uY29tIiwiaWF0IjoxNzAxNTcwMzM0fQ.QVorfuc_z08aW6a6Ab7jKZxxwmJC6nWOe5Rnq6k5kAY
    res.status(201).json({ user: user.userJSON(token) });
  } catch (err) {
    next(err);
  }
});

// POST /api/users/login
router.post('/login', async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: 'Email and Password both required to login' });
  }
  try {
    var user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email not registered' });
    }
    var verifiedPassword = await user.verifyPassword(password); // returns True or False
    console.log(user, verifiedPassword);
    if (!verifiedPassword) {
      return res.status(400).json({ error: 'Password is invalid' });
    }

    // generate a token and send a response to client
    var token = await user.signToken();
    console.log(token);
    res.status(201).json({ user: user.userJSON(token) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
