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
        if (contact.igeEntityA().classId() === 'Player' && contact.igeEntityB().classId() === 'Bullet') {
          self.playerShot(contact.igeEntityA(), contact.igeEntityB(), contact);
        } else if (contact.igeEntityA().classId() === 'Bullet' && contact.igeEntityB().classId() === 'Player') {
          self.playerShot(contact.igeEntityB(), contact.igeEntityA(), contact);
        } else if (contact.igeEntityA().classId() === 'Player' && contact.igeEntityB().classId() === 'Sword') {
          self.playerSlashed(contact.igeEntityA(), contact.igeEntityB(), contact);
        } else if (contact.igeEntityA().classId() === 'Sword' && contact.igeEntityB().classId() === 'Player') {
          self.playerSlashed(contact.igeEntityB(), contact.igeEntityA(), contact);
        } else if (contact.igeEntityA().classId() === 'Player' && contact.igeEntityB().classId() === 'Player') {
          contact.SetEnabled(false);
        }
      }
    }
  },

  playerShot: function(player, bullet, contact) {

    //can't KYS
    if (player.id() === bullet.shotBy.id()) {
      contact.SetEnabled(false);
      return;
    }

    if (ige.isServer) {
      Object.keys(ige.server.players).map(function (key) {
        if (ige.server.players[key].id() === player.id()) {
          ige.server.playerKilledHandler.playerKilled(bullet.shotBy, 'shot', player, key);
        }
      });
      bullet.destroy();
    }
  },

  playerSlashed: function(player, sword, contact) {

    //can't KYS
    if (player.id() === sword.slashedBy.id()) {
      contact.SetEnabled(false);
      return;
    }

    if (ige.isServer) {
      Object.keys(ige.server.players).map(function (key) {
        if (ige.server.players[key].id() === player.id()) {
          ige.server.playerKilledHandler.playerKilled(sword.slashedBy, 'slashed', player, key);
        }
      });
    }
  },

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ContactHandler; }