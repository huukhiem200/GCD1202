var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome to Cloud Computing' });
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Welcome to Login page' });
});
module.exports = router;
