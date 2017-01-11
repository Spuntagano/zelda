var Minimap = IgeClass.extend({
  classId: 'Minimap',

  init: function () {
    var minimapEls = [];
    new IgeInterval(function() {
      minimapEls.map(function(el) {
        el.destroy();
      });

      minimapEls = [];
      Object.keys(ige.client.players).map(function(key) {
        var x = ige.client.players[key].worldPosition().x / (50 * 32) * 100;
        var y = ige.client.players[key].worldPosition().y / (50 * 32) * 100;

        minimapEls.push(new IgeUiElement()
          .mount(ige.client.ui.minimap)
          .styleClass('minimapDot')
          .left(x + '%')
          .top(y + '%'));
      });
    }, 30);

  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Minimap; }