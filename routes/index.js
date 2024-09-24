var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome to Cloud Computing' });
});
// router.get('/admin', function(req, res, next) {
//   res.render('admin', { title: 'Welcome to Admin page' });
// });
module.exports = router;
