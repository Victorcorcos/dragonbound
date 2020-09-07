// Usage: Add this to your Bookmarks and click on it after entering a room
//
// This function will perform a sound (DragonBound Beep) if someone enters in your 1v1 room.

javascript: (function() {
  function sound(wavFile) {
    wavFile = wavFile || 'https://dragonbound.net/static/audio/bpush1.ogg';
    if (navigator.appName === 'Microsoft Internet Explorer') {
      var e = document.createElement('BGSOUND');
      e.src = wavFile;
      e.loop = 1;
      document.body.appendChild(e);
      document.body.removeChild(e);
    } else {
      var e = document.createElement('AUDIO');
      var src1 = document.createElement('SOURCE');
      src1.type = 'audio/wav';
      src1.src = wavFile;
      e.appendChild(src1);
      e.play();
    }
  };

  var polling = function() {
    var interval = 1000;

    function pollingBlock() {
      if ($('#RoomWatchers')[0].style.display === 'none') {
        sound('https://dragonbound.net/static/audio/broker.mp3');
      }
      if ($('#playerInRoom1')[0].style.display === 'block') {
        sound('https://dragonbound.net/static/audio/bpush1.ogg');
      }
      if ($('#playerInRoom1 .roomPlayerReady')[0].style.display === '') {
        return sound('https://dragonbound.net/static/audio/login.mp3');
      }
      setTimeout(pollingBlock, interval);
    };
    pollingBlock();
  };

  polling();
})()
