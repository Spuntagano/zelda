var Attacks = IgeClass.extend({
  classId: 'Attacks',

  init: function() {
    var self = this;

    this.rotateZ = {
      up: 0,
      left: 3*Math.PI/2,
      right: Math.PI/2,
      down: Math.PI
    };

    this.attacks = ['slash', 'shoot', 'bomb', 'fire'];
  },

  attack: function(player, data) {
    var self = this;

    if (ige.server.cooldown.isOnCooldown(player, data)) {
      return;
    }
    
    ige.server[data][player.upgrade[data]](player);
  },

  actionStart: function(player, action) {
    player.cooldown[action] = new Date().getTime();

    ige.network.send('actionStart', {id: player.id(), action: action});
    player.action = action;
  },

  actionEnd: function(player) {
    ige.network.send('actionEnd', {id: player.id()});
    player.action = '';
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Attacks; }