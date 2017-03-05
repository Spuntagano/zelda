var ContactHandler = IgeClass.extend({
  classId: 'ContactHandler',

  init: function () {

    var self = this;

    self.contactBegin = function () {
      return function (contact) {};
    };
    self.contactEnd = function () {
      return function (contact) {};
    };
    self.contactPreSolver = function () {
      return function(contact) {
        if (contact.igeBothCategories('Player')) {
          contact.SetEnabled(false);
          return;
        }
        
        var gameEntity = contact.igeEntityByCategory('GameEntity');
        if (gameEntity) {
          var otherEntity = contact.igeOtherEntity(gameEntity);

          if (otherEntity.category() === 'Player') {
            if (gameEntity.shotBy && gameEntity.shotBy.id() === otherEntity.id()) {
              if (gameEntity.contactOptions.owner.clip) {
                contact.SetEnabled(false);
              }

              if (gameEntity.contactOptions.owner.lethal) {
                /* CEXCLUDE */
                if (ige.isServer) {
                  ige.server.playerKilledHandler.playerKilled(gameEntity, otherEntity);
                }
                /* CEXCLUDE */
              }
              return;
            }

            if (gameEntity.contactOptions.players.clip) {
              contact.SetEnabled(false);
            }

            if (gameEntity.contactOptions.players.lethal) {
              /* CEXCLUDE */
              if (ige.isServer) {
                ige.server.playerKilledHandler.playerKilled(gameEntity, otherEntity);
              }
              /* CEXCLUDE */
            }
            
            return;
          }

          if (otherEntity.category() === 'GameEntity') { 
            contact.SetEnabled(false);
            return;
          }

          contact.SetEnabled(false);
        }
      };
    }
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ContactHandler; }