var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const User = require('../models/User');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// POST on /api/v5/users/register
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
    // we are not generating a token for registration - JUST FOR LOGIN we will
    // var token = await user.signToken();
    // console.log(token); // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTZiZTcxZTUzYjI4ZjI1Y2RiNmQyZjEiLCJlbWFpbCI6ImFydmluZDRAeWFob28uY29tIiwiaWF0IjoxNzAxNTcwMzM0fQ.QVorfuc_z08aW6a6Ab7jKZxxwmJC6nWOe5Rnq6k5kAY
    // res.status(201).json({ user: user.userJSON(token) });
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
});

// POST /api/v5/users/login
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
      return res
        .status(400)
        .json({ error: 'User with this Email is not registered' });
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

router.get('/protected', auth.verifyToken, async (req, res, next) => {
  res.json({ access: 'This is a protected resource' });
});

module.exports = router;
