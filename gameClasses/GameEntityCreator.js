var GameEntityCreator = IgeClass.extend({
  classId: 'GameEntityCreator',

  init: function() {
    var self = this;

    self.createGameEntity = function(clientId, Entity, animationLength, lifespan, action, instant, cooldown) {
      if (ige.server.players[clientId] && !ige.server.players[clientId].action &&
        (new Date().getTime() > ige.server.players[clientId].cooldown[action] + cooldown)
      ) {
        ige.server.players[clientId].action = action;
        ige.network.send('actionStart', {id: ige.server.players[clientId].id(), action: action});

        ige.server.players[clientId].cooldown[action] = new Date().getTime();

        if (instant) {
          self.createEntity(clientId, Entity, lifespan);
        }

        new IgeTimeout(function () {
          if (!instant) {
            self.createEntity(clientId, Entity, lifespan);
          }

          ige.server.players[clientId].action = '';
          ige.network.send('actionEnd', {id: ige.server.players[clientId].id(), action: action});
        }, (animationLength));
      }
    }
  },

  createEntity: function(clientId, Entity, lifespan) {
    var rotation = ige.server.players[clientId].rotation;
    var position = ige.server.players[clientId].worldPosition();

    var entity = new Entity({rotation: rotation, position: position, shotBy: ige.server.players[clientId].id()})
      .streamMode(1)
      .lifeSpan(lifespan)
      .mount(ige.server.scene1);

    entity.shotBy = ige.server.players[clientId];
  }

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = GameEntityCreator; }