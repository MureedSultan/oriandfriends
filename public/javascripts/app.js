// the "notfound" implements a catch-all
// with page('*', notfound). Here we have
// no catch-all, so page.js will redirect
// to the location of paths which do not
// match any of the following routes
//
page.base('/music');
page('/', index);
page('/artists', '/');
page('/artists/:artist', artist);
page('/artists/:artist/:album', album);
page();


$(document).ready(function(){

  $('#jquery_jplayer_1').jPlayer({
		ready: function (event) {
			$(this).jPlayer('setMedia', {
				title: '1',
				m4a: '/static-music/Bobby%20Trill/Go%20Dawgs/1.m4a',
				oga: '/static-music/Bobby%20Trill/Go%20Dawgs/1.ogg'
			});
		},
    play: function (event) {
      $('.jp-play').removeClass('ion-play').addClass('ion-pause');
    },
		swfPath: '../../dist/jplayer',
		supplied: 'm4a, oga',
		wmode: 'window',
		useStateClassSkin: true,
		autoBlur: false,
		smoothPlayBar: true,
		keyEnabled: true,
		remainingDuration: true,
		toggleDuration: true
	});

  $('.jp-play').click(function(){
    let button = $('.jp-play');
    if(button.hasClass('ion-play')){
      button.removeClass('ion-play');
      button.addClass('ion-pause');
    } else {
      button.removeClass('ion-pause');
      button.addClass('ion-play');
    }
  });

});

// ============================ FUNC

function index() {
    console.log('index page');
    let req = $.ajax({
      url: '/api/artists',
      method: 'GET',
      dataType: 'html'
    }).done(function(data){
      $('.player-body').empty().removeClass('artist tracks').addClass('artists').html(data);
      $('[data-artist]').click(function(){
        page('/artists/'+$(this).data('artist'))
      });
    });
}

function artist(ctx) {
    console.log(ctx.params.artist + ' Page');
    let req = $.ajax({
      url: '/api/artists/'+ctx.params.artist,
      method: 'GET',
      dataType: 'html'
    }).done(function(data){
      $('.player-body').empty().removeClass('artists tracks').addClass('artist').html(data);
      $('[data-album]').click(function(){
        page('/artists/'+ctx.params.artist+'/'+$(this).data('album'))
      });
    });
}

function album(ctx) {
    console.log(ctx.params.album + ' Page');
    console.log(ctx.params.artist + ' Page');
    let req = $.ajax({
      url: '/api/artists/'+ctx.params.artist+'/'+ctx.params.album,
      method: 'GET',
      dataType: 'html'
    }).done(function(data){
      $('.player-body').empty().removeClass('artists artist').addClass('tracks').html(data);
      $('[data-track]').click(function(){
        let track = $(this).data('track');
        $('#jquery_jplayer_1').jPlayer('setMedia', {
          title: '2',
          m4a: '/static-music/'+ctx.params.artist+'/'+ctx.params.album+'/'+track+'.m4a',
          oga: '/static-music/'+ctx.params.artist+'/'+ctx.params.album+'/'+track+'.ogg'
        })
        $('#jquery_jplayer_1').jPlayer('play');
      });
    });
}
