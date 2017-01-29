var PositionHandler = IgeClass.extend({
  classId: 'PositionHandler',

  init: function() {
    var self = this;

    new IgeInterval(function () {
      var gameEntities = [];
      var players = [];

      Object.keys(ige.server.gameEntities).map(function (key) {
        var pos = ige.server.gameEntities[key].worldPosition();
        var posObject = {
          id: ige.server.gameEntities[key].id(),
          x: pos.x,
          y: pos.y,
          z: pos.z,
          rotation: ige.server.gameEntities[key].rotation
        };
        gameEntities.push(posObject)
      });

      Object.keys(ige.server.players).map(function (key) {
        var pos = ige.server.players[key].worldPosition();
        var posObject = {
          id: ige.server.players[key].id(),
          x: pos.x,
          y: pos.y,
          z: pos.z,
          rotation: ige.server.players[key].rotation
        };
        players.push(posObject)
      });

      ige.network.send('playerPosition', {players: players, gameEntities: gameEntities});
    }, config.tickRate);
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PositionHandler; }