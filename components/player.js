var playerName;  // Store playerName as a global because otherwise in some
                 // circumstances (e.g. on page unload), we can't access it.

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

AFRAME.registerComponent('random-player-id', {
  dependencies: ['bmfont-text'],

  schema: {
    color: {default: 'white', type: 'string'}
  },

  update: function () {
    var firebase = $('a-scene')[0].systems.firebase;

    var data = this.data;
    var color = data.color;
    var el = this.el;

    setTimeout(function () {
      playerName = 'Guest_' + getRandomInt(10000, 99999);

      el.setAttribute('bmfont-text', {
        color: color,
        text: playerName
      });

      firebase.database.child('chat').push({
        'player': playerName,
        'text': '[has entered the room]',
        'time': Date.now()
      });
    });
  }
});

AFRAME.registerComponent('random-color', {
  dependencies: ['material'],

  update: function () {
    var el = this.el;

    setTimeout(function () {
      el.setAttribute('material', {
        color: '#'+Math.floor(Math.random()*16777215).toString(16)
      });
    });
  }
});

AFRAME.registerComponent('chat', {
  init: function (e) {
    var firebase = $('a-scene')[0].systems.firebase;
    var msgs = [];

    // Enter key handler
    document.onkeypress = function (e) {
      if (e.keyCode == 13) {
        var text = $('#chatInput').val();
        if (text != '') {
          $('#chatInput').val('');
          setTimeout(function () {
            firebase.database.child('chat').push({
              'player': playerName,
              'text': text,
              'time': Date.now()
            });
          }, 200);
        }

        if ($('#chatInput').css('visibility') == 'visible') {
          $('#chatWidget').hide();
          $('#chatInput').css({'visibility': 'hidden'}).blur();
          $('#player')[0].play();
        } else {
          $('#chatWidget').show();
          $('#chatInput').css({'visibility': 'visible'}).focus();
          $('#player')[0].pause();
        }
      }
    };

    // Exit handler
    $(window).unload(function () {
      firebase.database.child('chat').push({
        'player': playerName,
        'text': '[has left the room]',
        'time': Date.now()
      });
    })

    // Firebase event handler
    firebase.database
      .child('chat')
      .orderByChild('time')
      .limitToLast(5)
      .on('child_added', function (msg) {
        msgs.push(msg.val());

        msgTexts = msgs.sort(function(a, b) {
                         // Sort by time, ascending.
                         var x = a.time; var y = b.time;
                         return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                       })
                       .slice(-5)
                       .map(function (m) { return m['player'] + ": " + m['text']; })
                       .join('<br>');

        $('#chatMessages')
          .html(msgTexts)
          .scrollTop($('#chatMessages')[0].scrollHeight);

        $('#chatWidget').show();
        setTimeout(function () {
          if ($('#chatInput').css('visibility') != 'visible') {
            $('#chatWidget').hide();
          }
        }, 10000);
      });
  }
});
