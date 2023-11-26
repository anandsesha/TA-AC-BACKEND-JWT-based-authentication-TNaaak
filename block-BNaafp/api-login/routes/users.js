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
    var user = await User.create(req.body);
    console.log(user);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
});

// POST /api/users/login
router.post('/login', async (req, res, next) => {
  var { email, password } = req.body;
  if (!email && !password) {
    return res.status(400).json({ error: 'Email/Password required to login' });
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
  } catch (err) {
    next(err);
  }
});

module.exports = router;
