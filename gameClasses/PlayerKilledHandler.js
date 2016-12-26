var PlayerKilledHandler = IgeClass.extend({
  classId: 'PlayerKilledHandler',

  init: function () {

    var self = this;
  },
  
  playerKilled: function(killer, method, killed, socketId) {
    ige.network.send('playerKilled', {
      killer: killer.username,
      method: method,
      killed: killed.username,
      killedId: killed.id()
    });
    
    killed.destroy();
    delete ige.server.players[socketId];
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlayerKilledHandler; }