(function($) {
  Drupal.behaviors.video_508 = {
    attach: function(context, settings) {
      if ($.type(settings.video_508) !== 'undefined' && $.type(settings.video_508.instances) !== 'undefined') {
        for (html_id in settings.video_508.instances) {
          $('#' + html_id, context).once('video_508-processed', function() {
            add_instance_buttons(settings.doi_gov_video.instances[html_id]);
          });
        }
      }
    }
  };

  var add_instance_buttons = function (instance) {

    if(instance.buttons.transcript)
    {
      jwplayer(instance.html_id).addButton(
        instance.buttons.transcript.icon,
        instance.buttons.transcript.label,
        function(){
          $('.field--name-field-video-transcript').toggleClass('transcript-hidden');
        },
        'transcript'
      );
    }
    jwplayer(instance.html_id).addButton(
      instance.buttons.download.icon,
      instance.buttons.download.label,
      function(){
        window.location.href = instance.url;
        ga('send', 'event', 'Video Downloads', $('.pane-node-title h1').text(), window.location.pathname);
      },
      'download'
    );

    if(instance.youtube) {
      jwplayer(instance.html_id).addButton(
        instance.buttons.youtube.icon,
        instance.buttons.youtube.label,
        function(){
          window.location.href = instance.youtube
        },
        'youtube'
      );
    }
  };
})(jQuery);
