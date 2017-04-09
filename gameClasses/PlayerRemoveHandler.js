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
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlayerRemoveHandler; }