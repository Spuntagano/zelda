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
          icon: killerEntity.icon,
          killed: killed.username,
          killedId: killed.id()
        });

        if (killerEntity.contactOptions.destroyOnKill) {
          killerEntity.destroy();
        }

        killerEntity.shotBy.killCount++;

        Object.keys(ige.server.players).map(function (key) {
          if (ige.server.players[key].id() === killed.id()) {
            var position = ige.server.players[key].worldPosition();
            new Corpse({position: position})
              .streamMode(1)
              .mount(ige.server.scene1);

            ige.server.playerRemoveHandler.playerRemove(key)
          }
        });

      }, config.tickRate*2);
    }
    
    killed.alive = false;
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlayerKilledHandler; }