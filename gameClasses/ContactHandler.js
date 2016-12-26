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
        } else if (contact.igeEntityA().classId() === 'Bullet') {
          self.bulletContact(contact.igeEntityB(), contact.igeEntityA());
        } else if (contact.igeEntityB().classId() === 'Bullet') {
          self.bulletContact(contact.igeEntityA(), contact.igeEntityB());
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

  bulletContact: function(entity, bullet) {
    if (ige.isServer) {
    }
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ContactHandler; }