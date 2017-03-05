var Slash = IgeClass.extend({
  classId: 'Slash',

  init: function() {
    var self = this;

    this.offset = {
      up: {
        x: 0,
        y: -30
      },
      left: {
        x: -30,
        y: 0
      },
      right: {
        x: 30,
        y: 0
      },
      down: {
        x: 0,
        y: 30
      }
    };

    this.attack = {
      entity: Sword,
      lifeSpan: 8/20*1000
    };

    this.animationLength = 8/20*1000;
    this.dashLength = 150;
  },

  0: function(player) {
    var self = this;

    ige.server.attacks.actionStart(player, 'slash');

    var location = {
      spawn: {
        x: player.worldPosition().x + self.offset[player.rotation].x,
        y: player.worldPosition().y + self.offset[player.rotation].y,
        z: player.worldPosition().z
      },
      rotationZ: 0,
      rotation: player.rotation,
      speed: {
        x: 0,
        y: 0
      }
    };

    ige.server.gameEntityCreator.createEntity(
      player,
      self.attack,
      location
    );

    new IgeTimeout(function() {
      ige.server.attacks.actionEnd(player);
    }, this.animationLength);
  },

  1: function(player) {
    var self = this;

    ige.server.attacks.actionStart(player, 'dash');
    new IgeTimeout(function() {
      ige.server.attacks.actionStart(player, 'slash');

      player.translateTo(
        player.worldPosition().x,
        player.worldPosition().y,
        player.worldPosition().z
      );

      var location = {
        spawn: {
          x: player.worldPosition().x + self.offset[player.rotation].x,
          y: player.worldPosition().y + self.offset[player.rotation].y,
          z: player.worldPosition().z
        },
        rotationZ: 0,
        rotation: player.rotation,
        speed: {
          x: 0,
          y: 0
        }
      };

      ige.server.gameEntityCreator.createEntity(
        player,
        self.attack,
        location
      );

      new IgeTimeout(function() {
        ige.server.attacks.actionEnd(player);
      }, self.animationLength);
    }, this.dashLength);
  }

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Slash; }