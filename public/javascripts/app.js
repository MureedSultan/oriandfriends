$(document).ready(function(){

  $("#jquery_jplayer_1").jPlayer({
		ready: function (event) {
			$(this).jPlayer("setMedia", {
				title: "Bubble",
				m4a: "/music/Bobby%20Trill/Go%20Dawgs/1.m4a",
				oga: "/music/Bobby%20Trill/Go%20Dawgs/1.ogg"
			});
		},
		swfPath: "../../dist/jplayer",
		supplied: "m4a, oga",
		wmode: "window",
		useStateClassSkin: true,
		autoBlur: false,
		smoothPlayBar: true,
		keyEnabled: true,
		remainingDuration: true,
		toggleDuration: true
	})

  $('.jp-play').click(function(){
      let button = $(this);
      if(button.hasClass('ion-play')){
        button.removeClass('ion-play')
        button.addClass('ion-pause')
      } else {
        button.removeClass('ion-pause')
        button.addClass('ion-play')
      }
  })

})
