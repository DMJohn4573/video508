(function ($) {
  Drupal.behaviors.video_508_videojs = {
    attach: function (context, settings) {

      function getCookie(name) {
        var value = '; ' + document.cookie;
        var parts = value.split('; ' + name + '=');
        if (parts.length === 2) {
          return parts.pop().split(';').shift();
        }
      }

      function setCookie(name, value, days) {
        var expires = '';
        if (days) {
          var date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = '; expires=' + date.toUTCString();
        } else {
          expires = '';
        }

        document.cookie = name + '=' + value + expires + '; path=/';
      }

      if ($.type(settings.video_508_videojs) !== 'undefined' && $.type(settings.video_508_videojs.instances) !== 'undefined') {
        for (player_id in settings.video_508_videojs.instances) {
          var player = videojs(player_id + '-video', {
            aspectRatio: '16:9',
            fluid: true
          });

          player.dock({});

          player.social({
            url: window.location.href,
            embedCode: '<iframe src="' + settings.video_508_videojs.instances[player_id].files.src + '" width="480" height="306" frameborder="0" scrolling="auto" allowfullscreen></iframe>',
            displayAfterVideo: false,
            buttonParent: 'shelf',
            services: {
              'facebook': true,
              'google': true,
              'twitter': true,
              'tumblr': true,
              'pinterest': true,
              'linkedin': false
            }
          });

          player.ga({
            'eventCategory': '508 Video',
            'eventsToTrack': ['start', 'end', 'play', 'pause', 'percentsPlayed', 'fullscreen'],
            'eventLabel': window.location.href,
            'percentsPlayedInterval': 25
          });

          $('#' + player_id + '-video', context).once('video_508_videojs', function () {
            add_instance_buttons(settings.video_508_videojs.instances[player_id]);
          });

          if ($.type(settings.video_508_videojs.instances[player_id].files.ad_src) !== 'undefined' &&
            settings.video_508_videojs.instances[player_id].files.ad_src.length > 0 &&
            settings.video_508_videojs.instances[player_id].files.ad_src !== (window.location.protocol + "//" + window.location.hostname + "/")) {
            var Button = videojs.getComponent('Button');
            var AudioDescriptionButton = videojs.extend(Button, {
              constructor: function () {
                Button.apply(this, arguments);
                this.addClass('vjs-icon-audio-description');
                this.addClass('vjs-off');
                this.controlText('Turn On Audio Description');
              },
              handleClick: function () {
                var player = videojs(player_id + '-video');
                var currentSource = player.src();
                var currentTime = player.currentTime();
                var isPaused = player.paused();
                // if the current source isn't AD, make it AD
                if (currentSource != settings.video_508_videojs.instances[player_id].files.ad_src) {
                  this.addClass('vjs-audio-description-button-control-focus');
                  this.removeClass('vjs-off');
                  this.addClass('vjs-on');
                  this.controlText('Turn Off Audio Description');
                  if (typeof window.ga !== 'undefined') {
                    ga('send', 'event', '508 Video', 'audio description on', window.location.href, $('.pane-node-title h1').text());
                  }
                  setCookie('AD', true, 1);
                  setCookie('adStartTime', new Date(), 1);
                  player.src({
                    type: "video/mp4",
                    src: settings.video_508_videojs.instances[player_id].files.ad_src
                  });
                  player.currentTime(currentTime);
                  player.handleTechSeeked_();
                  if (!isPaused) {
                    player.play();
                    player.handleTechSeeked_();
                  }
                  // current source is AD, toggle to previous video resolution switcher source
                } else {
                  this.removeClass('vjs-audio-description-button-control-focus');
                  this.removeClass('vjs-on');
                  this.addClass('vjs-off');
                  this.controlText('Turn On Audio Description');
                  var diff = Math.abs(Date.parse(new Date()) - Date.parse(getCookie('adStartTime')));
                  setCookie('AD', false, 1);
                  document.cookie = "adStartTime=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                  if (typeof window.ga !== 'undefined') {
                    ga('send', 'event', '508 Video', 'audio description off', window.location.href, $('.pane-node-title h1').text());
                    ga('send', 'event', 'Accessibility', 'AudioDescriptionDuration', diff);
                  }
                  player.src({
                    type: "video/mp4",
                    src: settings.video_508_videojs.instances[player_id].files.src
                  });
                  player.currentTime(currentTime);
                  player.handleTechSeeked_();
                  if (!isPaused) {
                    player.play();
                    player.handleTechSeeked_();
                  }
                }
              }
            });
            videojs.registerComponent('AudioDescriptionButton', AudioDescriptionButton);
            player.getChild('controlBar').addChild('AudioDescriptionButton', {}, 9);
          }

          // Captions 508 fix
          player.on('ready', function() {

            var player = this,
                SL = player.getChild('SocialOverlay'),
                CB = player.getChild('ControlBar'),
                BPB = player.getChild('BigPlayButton'),
                closeButton = SL.getChild('CloseButton');
            window.PL = player;
            window.CB = CB;
            window.BPB = BPB;

            // Custom text for parts of the for Share dialog.
            closeButton.setAttribute('title', 'Close sharing screen and return to video');
            closeButton.controlText('Close sharing screen and return to video');
            // This is a workaround to show the Control Bar which is hidden
            // before the video is played for the first time.
            player.hasStarted(1);
            // At the same time the above hides the Big Play Button, so we need
            // to add a special class which is removed when the video is played
            player.addClass('vjs-enforce-big-button');
            player.on('play', function(){
              this.removeClass('vjs-enforce-big-button');
            });

            var SubsCapsButton = player.getChild('controlBar').getChild('SubsCapsButton'),
              mc = SubsCapsButton.menu.children(),
              events = ['click', 'tap', 'keydown', 'touch'],
              formatCapTitle = function (flag) {
                return 'Turn ' + (flag ? 'on' : 'off') + ' captions';
              };
            SubsCapsButton.controlText(formatCapTitle(mc[1].isSelected_));

            mc[1].on(events, function (event) {
              SubsCapsButton.controlText(formatCapTitle(true));
            });
            mc[2].on(events, function (event) {
              SubsCapsButton.controlText(formatCapTitle(false));
            });
          });

          // these selectors have been updated, but they will continue to not work b/c event propogation has been disabled by the videojs library
          $('.vjs-subs-caps-button .vjs-menu-item:contains("captions off")').click(function () {
            ga('send', 'event', '508 Video', 'captions off', window.location.href, $('.pane-node-title h1').text());
          });
          $('.vjs-subs-caps-button .vjs-menu-item:contains("English")').click(function () {
            ga('send', 'event', '508 Video', 'captions on', window.location.href, $('.pane-node-title h1').text());
          });
          $('.vjs-social-share-links a').each(function () {
            $(this).click(function () {
              ga('send', 'event', '508 Video', 'Share on ' + $(this).find('.vjs-control-text').text(), window.location.href, $('.pane-node-title h1').text());
            });
          });
        }
      }
    }
  };

  var add_instance_buttons = function (instance) {

    if (instance.buttons.transcript) {
      $('#' + instance.player_id + '-video div.vjs-dock-shelf').append('<button class="vjs-transcript-control vjs-button" type="button" aria-live="polite" aria-disabled="false" title="' + instance.buttons.transcript.label + '"><span class="">Transcript</span></button>');
      $('.vjs-transcript-control').click(function () {
        $('.video-508--transcript').toggleClass('video-508--transcript--hidden');
      });
    }

    $('#' + instance.player_id + '-video div.vjs-dock-shelf').append('<button class="vjs-download-control vjs-button" type="button" aria-live="polite" aria-disabled="false" title="' + instance.buttons.download.label + '"><span class="">Download</span></button>');

    $('.vjs-download-control').click(function () {
      window.location.href = instance.url;
      ga('send', 'event', '508 Video', 'download', instance.url, $('.pane-node-title h1').text());
    });

    if (instance.youtube) {
      $('#' + instance.player_id + '-video div.vjs-dock-shelf').append('<button class="vjs-youtube-control vjs-button" type="button" aria-live="polite" aria-disabled="false" title="' + instance.buttons.youtube.label + '"><span class="">YouTube</span></button>');

      $('.vjs-youtube-control').click(function () {
        window.location.href = instance.youtube;
        ga('send', 'event', '508 Video', 'youtube', instance.youtube, $('.pane-node-title h1').text());
      });
    }

    $('#' + instance.player_id + '-video div.vjs-dock-shelf').append('<a class="vjs-brand-control vjs-button" href="' + instance.logo.link + '"><img src="' + instance.logo.file + '" alt="' + instance.logo.label + '"></a>');
  };
})(jQuery);
