var PlayerKilledHandler = IgeClass.extend({
  classId: 'PlayerKilledHandler',

  init: function () {

    var self = this;
  },
  
  playerKilled: function(killerEntity, killed) {
    if (killed.alive) {
      new IgeTimeout(function () {
        
        ige.network.send('playerKilled', {
          killerId: killerEntity.shotBy.id(),
          icon: killerEntity.icon,
          killedId: killed.id()
        });

        if (killerEntity.contactOptions.destroyOnKill) {
          killerEntity.destroy();
        }

        killerEntity.shotBy.killCount++;
        killerEntity.shotBy.upgradePoints++;

        Object.keys(ige.server.players).map(function (key) {
          if (ige.server.players[key].id() === killed.id()) {
            ige.server.gameEntityCreator.createEntity(
              killerEntity.shotBy,
              {
                lifeSpan: 2000,
                entity: Corpse
              },
              {
                spawn: ige.server.players[key].worldPosition(),
                speed: {
                  x: 0,
                  y: 0
                },
                rotation: 'down',
                rotationZ: 0
              }
            );

            ige.server.playerRemoveHandler.playerRemove(key)
          }
        });

        ige.network.send('playersInfos', ige.server.playersInfos.sync());
      }, config.tickRate*2);
    }
    
    killed.alive = false;
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlayerKilledHandler; }