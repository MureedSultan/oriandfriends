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
            $(this).jPlayer('setMedia', {
                title: 'Eyes',
                mp3: '/static-music/Bobby%20Trill/Go%20Dawgs/Ears.mp3',
                m4a: '/static-music/Bobby%20Trill/Go%20Dawgs/Ears.m4a',
                oga: '/static-music/Bobby%20Trill/Go%20Dawgs/Ears.ogg'
            });
        },
        play: function(event) {
            $('.jp-play').removeClass('ion-play').addClass('ion-pause');
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

});

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
            $('[data-track]').click(function() {
                let track = $(this).data('track');
                let artist = ctx.params.artist;
                let album = ctx.params.album;
                $('#jquery_jplayer_1').jPlayer('setMedia', {
                    title: '2',
                    mp3: '/static-music/' + artist + '/' + album + '/' + track + '.mp3',
                    m4a: '/static-music/' + artist + '/' + album + '/' + track + '.m4a',
                    oga: '/static-music/' + artist + '/' + album + '/' + track + '.ogg'
                });
                $('#jquery_jplayer_1').jPlayer('play');
            });
        });

    },

    // PAGE UPDATE FUNC
    update: function(data, addClass, callback) {

        $('.player-body, .player-spacer, header').remove();
        $('.page-Music').removeClass('tracks artists albums').addClass(addClass).append(data);
        $('body').scrollTop(0);
        if (callback) {
            callback();
        }

    }

};

/*
  ========== ROUTER INIT ==========
*/

function index(ctx) {
    if (ctx.state.index) {
        console.log('index page - loaded');
        Page.index(ctx.state.index);
    } else {
        console.log('index page - requested');
        let req = $.ajax({
            url: '/api/artists',
            method: 'GET',
            dataType: 'html'
        }).done(function(data) {
            ctx.state.index = data;
            ctx.save();
            Page.index(data);
        });
    }
}

function artist(ctx) {
    if (ctx.state.artist) {
        console.log('artist page - loaded');
        Page.artist(ctx.state.artist, ctx);
    } else {
        let artist = ctx.params.artist;
        console.log(artist + ' page - requested');
        let req = $.ajax({
            url: '/api/artists/' + artist,
            method: 'GET',
            dataType: 'html'
        }).done(function(data) {
            ctx.state.artist = data;
            ctx.save();
            Page.artist(data, ctx);
        });
    }
}

function album(ctx) {
    if (ctx.state.album) {
        console.log('album page - loaded');
        Page.album(ctx.state.album, ctx);
    } else {
        console.log('album page - requested');
        let artist = ctx.params.artist;
        let album = ctx.params.album;
        let req = $.ajax({
            url: '/api/artists/' + artist + '/' + album,
            method: 'GET',
            dataType: 'html'
        }).done(function(data) {
            ctx.state.album = data;
            ctx.save();
            Page.album(data, ctx);
        });
    }

}
