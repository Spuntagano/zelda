var PlayerKilledHandler = IgeClass.extend({
  classId: 'PlayerKilledHandler',

  init: function () {

    var self = this;
  },
  
  playerKilled: function(killerEntity, killed) {
    ige.network.send('playerKilled', {
      killer: killerEntity.shotBy.username,
      method: killerEntity.killVerb,
      killed: killed.username,
      killedId: killed.id()
    });

    if (killerEntity.options.destroyOnKill) {
      killerEntity.destroy();
    }

    killed.destroy();
    Object.keys(ige.server.players).map(function (key) {
      if (ige.server.players[key].id() === killed.id()) {
        killed.destroy();
        delete ige.server.players[key];
      }
    });
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlayerKilledHandler; }