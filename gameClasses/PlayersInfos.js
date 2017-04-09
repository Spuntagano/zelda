var PlayersInfos = IgeClass.extend({
  classId: 'PlayersInfos',

  init: function () {
    
  },

  sync: function() {
    var playersInfos = {};

    Object.keys(ige.server.players).map(function(key){
      playersInfos[ige.server.players[key].id()] = {
        username: ige.server.players[key].username,
        killCount: ige.server.players[key].killCount,
        skin: ige.server.players[key].skin
      }
    });
    
    return playersInfos;
  }

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlayersInfos; }