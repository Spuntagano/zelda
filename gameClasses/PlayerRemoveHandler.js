var PlayerRemoveHandler = IgeClass.extend({
  classId: 'PlayerRemoveHandler',

  init: function () {

    var self = this;
  },

  playerRemove: function(clientId) {
    if (ige.server.players[clientId]) {
      ige.server.players[clientId].destroy();
      delete ige.server.players[clientId];
    }
    ige.network.send('leaderboard', ige.server.leaderboard.generateLeaderboard());
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlayerRemoveHandler; }