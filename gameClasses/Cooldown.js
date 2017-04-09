var Cooldown = IgeClass.extend({
  classId: 'Cooldown',

  init: function () {

    if (!ige.isClient) {
      return;
    }

    var self = this;
    this.label = {};
    this.element = {};
    this.bg = {};
    this.points = {};

    ige.ui.style('.pointsBox', {
      'bottom': 20,
      'width': 20,
      'height': 20,
      'left': 370,
      'font': 'bold 16px Open Sans',
      'color': '#fff8c5',
      'backgroundColor': 'rgba(0,0,0,0.5)'
    });

    ige.ui.style('.cooldownBox', {
      'bottom': 10,
      'width': 45,
      'backgroundColor': 'rgba(0,0,0,0.5)'
    });

    ige.ui.style('.cooldownLabel', {
      'font': 'bold 16px Open Sans',
      'color': '#fff8c5',
      'width': 45,
      'paddingLeft': 19
    });
    
    ige.client.attacks.attacks.map(function(attack, index) {
      self.element[attack] = new IgeUiElement()
        .styleClass('cooldownBox')
        .left(400 + 45 * index)
        .mount(ige.client.ui.uiScene);

      self.label[attack] = new IgeUiLabel()
          .styleClass('cooldownLabel')
          .left(0)
          .mount(self.element[attack]);

      self.bg[attack] = new IgeUiLabel()
          .width(32)
          .height(32)
          .left(5)
          .mount(self.element[attack]);
    });

    self.points = new IgeUiLabel()
      .styleClass('pointsBox')
      .mount(ige.client.ui.uiScene);

    var cooldown = 0;
    new IgeInterval(function () {
      if (!ige.client.players[ige.client.id]) {
        return;
      }
      
      ige.client.attacks.attacks.map(function(attack) {
        cooldown = Math.floor((ige.client.players[ige.client.id].cooldown[attack] + ige.client[attack].cooldown - new Date().getTime()) / 1000);

        self.points.value(ige.client.players[ige.client.id].upgradePoints);
        self.bg[attack].backgroundImage(new IgeTexture(ige.client[attack].icon));

        self.label[attack]
          .value((cooldown >= 0) ? cooldown : '')
          .backgroundColor((cooldown >= 0) ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)')
      });
    }, config.tickRate);
  },

  isOnCooldown: function(player, action) {
    if (ige.isClient) {
      return !(player && !player.action && (new Date().getTime() > player.cooldown[action] + ige.client[action].cooldown));
    }
    /* CEXCLUDE */
    if (ige.isServer) {
      return !(player && !player.action && (new Date().getTime() > player.cooldown[action] + ige.server[action].cooldown));
    }
    /* CEXCLUDE */
  }

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Cooldown; }