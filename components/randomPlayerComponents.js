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
    var data = this.data;
    var color = data.color;
    var el = this.el;

    setTimeout(function () {
      el.setAttribute('bmfont-text', {
        color: color,
        text: 'Guest_' + getRandomInt(10000, 99999)
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
