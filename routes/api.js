var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();

function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path+'/'+file).isDirectory();
  });
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('missing param');
});

/*
  @artists => array
  returns @artists
*/
router.get('/artists', function(req, res, next) {
  let artists;
  let errors;
  try{
    artists = getDirectories('./public/static-music');
  } catch(err) {
    errors = true;
    if (err.code === 'ENOENT') {
      artists = 'Artists not found!'
      console.log(tracks);
      res.setHeader('Content-Type', 'application/json');
      res.status(404).send(JSON.stringify({ 'error': artists}, null, 3));
    } else {
      throw err;
      res.end();
    }
  }
  if(!errors){
    res.render('components/music-artists', { data: artists });
  }
});

/*
  @albums => array
  returns @albumns from artist
*/
router.get('/artists/:name', function(req, res, next) {
  let albums;
  let errors;
  try{
    albums = getDirectories('./public/static-music/' + req.params.name); // ret is an array
  } catch(err) {
    errors = true;
    if (err.code === 'ENOENT') {
      albums = 'Artist not found!'
      console.log(albums);
      res.setHeader('Content-Type', 'application/json');
      res.status(404).send(JSON.stringify({ 'error': albums}, null, 3));
    } else {
      throw err;
    }
  }
  if(!errors){
    res.render('components/music-albums', { data: albums, artistName: req.params.name });
  }
});

/*
  @tracks => array
  returns @tracks from @albums
*/
router.get('/artists/:name/:album', function(req, res, next) {
  let tracks;
  let errors;
  try{
    tracks = fs.readdirSync('./public/static-music/' + req.params.name + '/' + req.params.album).filter(function(elm){
      return elm.match(/.*\.(mp3)/ig);
    });
  } catch(err) {
    errors = true;
    if (err.code === 'ENOENT') {
      tracks = 'Artist/Album not found!'
      console.log(tracks);
      res.setHeader('Content-Type', 'application/json');
      res.status(404).send(JSON.stringify({ 'error': tracks}, null, 3));
    } else {
      throw err;
      res.end();
    }
  }
  if(!errors){
    res.render('components/music-tracks', { data: tracks, artistName: req.params.name, albumName: req.params.album });
  }
});


module.exports = router;
