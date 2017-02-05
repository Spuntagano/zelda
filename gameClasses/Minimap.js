var Minimap = IgeClass.extend({
  classId: 'Minimap',

  init: function () {
    var self = this;

    if (!ige.client.minimap) {
      ige.client.minimap = this;
      
      ige.ui.style('#minimap', {
        bottom: 25,
        right: 25,
        height: 150,
        width: 150,
        'backgroundColor': '#000',
        opacity: 0.7
      });

      ige.ui.style('.minimapDot', {
        'width': 5,
        'height': 5,
        'backgroundColor': '#f00'
      });

      self.minimap = new IgeUiElement()
        .id('minimap')
        .mount(ige.client.ui.uiScene);

      var minimapDots = {};
      new IgeInterval(function () {
        Object.keys(ige.client.players).map(function (key) {
          var x = ige.client.players[key].worldPosition().x / (config.tiles.count.x * config.tiles.size.x) * 100;
          var y = ige.client.players[key].worldPosition().y / (config.tiles.count.y * config.tiles.size.y) * 100;

          if (!minimapDots[key]) {
            minimapDots[key] = {};
          }

          minimapDots[key].alive = true;

          if (minimapDots[key].label) {
            minimapDots[key].label.left(x + '%');
            minimapDots[key].label.top(y + '%');
          } else {
            minimapDots[key].label = new IgeUiElement()
              .mount(self.minimap)
              .styleClass('minimapDot')
              .left(x + '%')
              .top(y + '%');
          }
        });

        Object.keys(minimapDots).map(function(key) {
          if (!minimapDots[key].alive) {
            minimapDots[key].label.destroy();
            delete minimapDots[key];
          } else {
            minimapDots[key].alive = false;
          }
        });
      }, config.tickRate);
    }

  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Minimap; }