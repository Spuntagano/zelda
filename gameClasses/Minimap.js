var Minimap = IgeClass.extend({
  classId: 'Minimap',

  init: function () {
    var self = this;

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
    
    var minimapEls = [];
    new IgeInterval(function() {
      minimapEls.map(function(el) {
        el.destroy();
      });

      minimapEls = [];
      Object.keys(ige.client.players).map(function(key) {
        var x = ige.client.players[key].worldPosition().x / (config.tiles.count.x * config.tiles.size.x) * 100;
        var y = ige.client.players[key].worldPosition().y / (config.tiles.count.y * config.tiles.size.y) * 100;

        minimapEls.push(new IgeUiElement()
          .mount(self.minimap)
          .styleClass('minimapDot')
          .left(x + '%')
          .top(y + '%'));
      });
    }, config.tickRate);

  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Minimap; }