var PlayerKilledHandler = IgeClass.extend({
  classId: 'PlayerKilledHandler',

  init: function () {

    var self = this;
  },
  
  playerKilled: function(killerEntity, killed) {
    if (killed.alive) {
      new IgeTimeout(function () {
        ige.network.send('playerKilled', {
          killer: killerEntity.shotBy.username,
          method: killerEntity.killVerb,
          killed: killed.username,
          killedId: killed.id()
        });

        if (killerEntity.contactOptions.destroyOnKill) {
          killerEntity.destroy();
        }

        new IgeTimeout(function () {
          killed.destroy();
        }, 2000);

        Object.keys(ige.server.players).map(function (key) {
          if (ige.server.players[key].id() === killed.id()) {
            delete ige.server.players[key];
          }
        });
      }, config.tickRate*2);
    }
    
    killed.alive = false;
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlayerKilledHandler; }