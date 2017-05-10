var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('missing param');
});

router.get('/about', function(req, res, next) {
  res.send('about page');
});

router.get('/gallery', function(req, res, next) {
  res.send('gallery');
});

router.get('/artists', function(req, res, next) {
  res.send('artists list');
});

router.get('/artist/:name', function(req, res, next) {
  res.send('artist page ' + req.params.name);
});

router.get('/artist/:name/:album', function(req, res, next) {
  res.send('artist page ' + req.params.name + ' ' + req.params.album);
});


module.exports = router;
