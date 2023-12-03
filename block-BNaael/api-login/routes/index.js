var express = require('express');
const auth = require('../middlewares/auth');
var router = express.Router();

/* GET home page. */
// /api/
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET - /api/protected - jwt.verify() added on middleware in auth.js
router.get('/protected', auth.verifyToken, async (req, res, next) => {
  res.json({ access: 'Protected Resource' });
});

// GET - /api/dashboard - jwt.verify() added on middleware in auth.js
router.get('/dashboard', auth.verifyToken, async (req, res, next) => {
  console.log(req.user); // we have the logged in user info here inside dashboard page
  res.json({ access: 'You are now accessing the Protected Dashboard' });
});

module.exports = router;
