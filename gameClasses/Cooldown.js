var Cooldown = IgeClass.extend({
  classId: 'Cooldown',

  init: function () {
    
    var self = this;
    this.label = {};

    ige.ui.style('.cooldownBox', {
      'left': 10,
      'width': 70,
      'backgroundColor': 'rgba(0,0,0,0.5)'
    });

    ige.ui.style('.cooldownLabel', {
      'font': 'bold 16px Open Sans',
      'color': '#fff8c5'
    });

    new IgeInterval(function() {

      if (ige.client.players[ige.client.id]) {

        var cooldown = -1;
        var i = 0;
        Object.keys(ige.client.players[ige.client.id].actions).map(function(key) {
          if (ige.client.players[ige.client.id].actions[key].attack) {
            cooldown = Math.floor((ige.client.players[ige.client.id].cooldown[key] + ige.client.players[ige.client.id].actions[key].attack.cooldown - new Date().getTime()) / 1000);

            if (self.label[key]) {
              self.label[key].destroy();
            }
            
            if (cooldown >= 0) {

              self.label[key] = new IgeUiElement()
                .styleClass('cooldownBox')
                .bottom(100 + 45 * i)
                .mount(ige.client.ui.uiScene);

              new IgeUiElement()
                .width(32)
                .height(32)
                .left(10)
                .mount(self.label[key])
                .backgroundImage(new IgeTexture(new ige.client.players[ige.client.id].actions[key].attack.entity().icon));

              new IgeUiLabel()
                .value(cooldown)
                .styleClass('cooldownLabel')
                .left(45)
                .mount(self.label[key]);

              i++;
            }
          }
        });
      }
      
    }, config.tickRate);

  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Cooldown; }