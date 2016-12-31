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
        var isPlayer = self.isPlayer(contact);

        if (isPlayer) {
          if (isPlayer.entity.classId() === 'Player') {
            contact.SetEnabled(false);
          }

          if (isPlayer.entity.options && isPlayer.entity.shotBy) {
            switch (isPlayer.entity.options.clip) {
              case 'all':
                contact.SetEnabled(false);
                break;
              case 'players':
                contact.SetEnabled(false);
                break;
              case 'owner':
                if (isPlayer.entity.shotBy.id() === isPlayer.player.id()) {
                  contact.SetEnabled(false);
                }
                break;
              default:
                break;
            }

            switch (isPlayer.entity.options.lethal) {
              case 'players':
                if (ige.server) {
                  ige.server.playerKilledHandler.playerKilled(isPlayer.entity, isPlayer.player);
                }
                break;
              case 'playersExceptOwner':
                if (isPlayer.entity.shotBy.id() !== isPlayer.player.id()) {
                  if (ige.server) {
                    ige.server.playerKilledHandler.playerKilled(isPlayer.entity, isPlayer.player);
                  }
                }
                break;
              default:
                break;
            }
          }
        } else {
          if (contact.igeEntityA().options) {
            if (contact.igeEntityA().options.clip === 'all') {
              contact.SetEnabled(false);
            }
          } else if (contact.igeEntityB().options) {
            if (contact.igeEntityB().options.clip === 'all') {
              contact.SetEnabled(false);
            }
          }
        }
      };
    }
  },

  isPlayer: function (contact) {
    if (contact.igeEntityA().classId() === 'Player') {
      return {
        player: contact.igeEntityA(),
        entity: contact.igeEntityB()
      }
    }
    if (contact.igeEntityB().classId() === 'Player') {
      return {
        player: contact.igeEntityB(),
        entity: contact.igeEntityA()
      }
    }
    return false;
  }

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ContactHandler; }