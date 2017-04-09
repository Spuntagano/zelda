var GameEntityCreator = IgeClass.extend({
  classId: 'GameEntityCreator',

  init: function() {
    var self = this;
  },

  createEntity: function(player, attack, location, data) {
    var entity = new attack.entity({rotation: location.rotation, rotationZ: location.rotationZ, speed: location.speed, spawn: location.spawn, shotBy: player.id(), data: data})
    ige.server.gameEntities[entity.id()] = entity;
    entity.lifeSpan(attack.lifeSpan);
    entity.shotBy = player;
  }

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = GameEntityCreator; }