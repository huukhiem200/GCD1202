var express = require('express');
var router = express.Router();

/* GET /admin page. */
router.get('/', function(req, res, next) {
  res.render('admin', { title: 'Welcome to Admin page' });
});
module.exports = router;
