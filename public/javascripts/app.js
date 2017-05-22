/*
  ========== PAGE OBJ ==========
*/

let Page = {

  // LOADED INDEX PAGE
  index: function(data) {

    Page.update(data, 'artists', function() {
      $('[data-artist]').click(function() {
        let artist = $(this).data('artist');
        page('/artists/' + artist);
      });
    });

  },

  // LOADED ARTIST PAGE
  artist: function(data, ctx) {

    Page.update(data, 'albums', function() {
      $('[data-album]').click(function() {
        page('/artists/' + ctx.params.artist + '/' + $(this).data('album'));
      });
    });

  },

  // LOADED ALBUM PAGE
  album: function(data, ctx) {

    Page.update(data, 'tracks', function() {
      if (Page.current['track']) {
        $('[data-track="' + Page.current['track'] + '"]').css('background-color', 'rgba(0,0,0,.05)');
      }
      $('[data-track]').click(function() {
        Page.track(ctx.params.artist, ctx.params.album, $(this).data('track'));
        Page.current['list'] = [];
        $('[data-track]').each(function(index) {
          Page.current['list'].push($(this).data('track'));
        });
      });
    });

  },

  track: function(artist, album, track) {
    console.log('Now playing: ' + track);
    $('[data-track]').css('background-color', '');
    $('[data-track="' + track + '"]').css('background-color', 'rgba(0,0,0,.05)');
    Page.current['artist'] = artist;
    Page.current['album'] = album;
    Page.current['track'] = track;
    $('#jquery_jplayer_1').jPlayer('setMedia', {
      title: track,
      mp3: '/static-music/' + artist + '/' + album + '/' + track + '.mp3',
      m4a: '/static-music/' + artist + '/' + album + '/' + track + '.m4a',
      oga: '/static-music/' + artist + '/' + album + '/' + track + '.ogg'
    }).jPlayer('play');
    $('.jp-artist').empty().append(artist);
    $('.jp-album').empty().append(album);
    $('.image img').attr('src', '/static-music/' + artist + '/' + album + '/' + 'cover_compressed.jpg')
  },

  // PAGE UPDATE FUNC
  update: function(data, addClass, callback) {

    $('.player-body, .player-spacer, header').remove();
    $('.page-Music').removeClass('tracks artists albums').addClass(addClass).append(data);
    $('body').scrollTop(0);
    if (callback) {
      callback();
    }

  },
  current: [],
  cache: []

};

/*
  ========== ROUTER ==========
*/
page.base('/music');
page('/', index);
page('/artists', '/');
page('/artists/:artist', artist);
page('/artists/:artist/:album', album);
page();

/*
  ========== PAGE LOAD ==========
*/

$(document).ready(function() {
  /*
  window.onbeforeunload = function() {
      return true;
  };
  */
  $('#jquery_jplayer_1').jPlayer({
    ready: function(event) {
      console.log('Player ready coach!');
    },
    play: function(event) {
      $('.jp-audio').removeClass('disabled');
      $('.jp-play').removeClass('ion-play').addClass('ion-pause');
    },
    ended: function(event) {
      $('.jp-play').removeClass('ion-pause').addClass('ion-play');
      let index = Page.current['list'].indexOf(Page.current['track']);
      let next;
      if (index >= 0 && index < Page.current['list'].length - 1) {
        next = Page.current['list'][index + 1];
      } else {
        next = Page.current['list'][index - Page.current.list.length + 1]
      }
      Page.track(Page.current['artist'], Page.current['album'], next);
    },
    swfPath: '/javascripts/',
    supplied: 'mp3, m4a, oga',
    wmode: 'window',
    useStateClassSkin: true,
    autoBlur: false,
    smoothPlayBar: true,
    keyEnabled: true,
    remainingDuration: true,
    toggleDuration: true
  });

  $('.jp-play').click(function() {
    let button = $('.jp-play');
    if (button.hasClass('ion-play')) {
      button.removeClass('ion-play');
      button.addClass('ion-pause');
    } else {
      button.removeClass('ion-pause');
      button.addClass('ion-play');
    }
  });

  $('.jp-next').click(function() {
    let index = Page.current['list'].indexOf(Page.current['track']);
    let next;
    if (index >= 0 && index < Page.current['list'].length - 1) {
      next = Page.current['list'][index + 1];
    } else {
      next = Page.current['list'][index - Page.current.list.length + 1]
    }
    Page.track(Page.current['artist'], Page.current['album'], next);
  });

  $('.jp-previous').click(function() {
    let index = Page.current['list'].indexOf(Page.current['track']);
    let prev;
    if (index >= 0 && index < Page.current['list'].length - 1) {
      prev = Page.current['list'][index - 1];
    } else {
      prev = Page.current['list'][index - Page.current.list.length + 1]
    }
    Page.track(Page.current['artist'], Page.current['album'], prev);
  });

});

/*
  ========== ROUTER INIT ==========
*/

function index(ctx) {
  if (Page.cache['page-index']) {
    console.log('index page - loaded');
    Page.index(Page.cache['page-index']);
  } else {
    console.log('index page - requested');
    let req = $.ajax({
      url: '/api/artists',
      method: 'GET',
      dataType: 'html'
    }).done(function(data) {
      Page.cache['page-index'] = data;
      ctx.state.index = data;
      ctx.save();
      Page.index(data);
    });
  }
}

function artist(ctx) {
  let artist = ctx.params.artist;
  if (Page.cache['page-artist-' + artist]) {
    console.log(artist + ' page - loaded');
    Page.artist(Page.cache['page-artist-' + artist], ctx);
  } else {
    console.log(artist + ' page - requested');
    let req = $.ajax({
      url: '/api/artists/' + artist,
      method: 'GET',
      dataType: 'html'
    }).done(function(data) {
      Page.cache['page-artist-' + artist] = data;
      Page.artist(data, ctx);
    });
  }
}

function album(ctx) {
  let artist = ctx.params.artist;
  let album = ctx.params.album;
  if (Page.cache['page-album-' + artist + '-' + album]) {
    console.log(artist + ' — ' + album + ' ' + ' page - loaded');
    Page.album(Page.cache['page-album-' + artist + '-' + album], ctx);
  } else {
    console.log(artist + ' — ' + album + ' page - requested');
    let req = $.ajax({
      url: '/api/artists/' + artist + '/' + album,
      method: 'GET',
      dataType: 'html'
    }).done(function(data) {
      Page.cache['page-album-' + artist + '-' + album] = data;
      Page.album(data, ctx);
    });
  }
}
