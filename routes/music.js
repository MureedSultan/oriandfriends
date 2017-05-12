var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('music', { title: 'Music' });
});

router.get('/artists', function(req, res, next) {
  res.render('music', { title: 'Music' });
});
router.get('/artists/:name', function(req, res, next) {
  res.render('music', { title: 'Music' });
});
router.get('/artists/:name/:album', function(req, res, next) {
  res.render('music', { title: 'Music' });
});

module.exports = router;
