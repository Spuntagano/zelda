var Bomb = IgeClass.extend({
  classId: 'Bomb',

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
      entity: Explosive,
      lifeSpan: 99999
    };

    this.cooldown = 5000;
    this.icon = './assets/textures/icons/bomb.png';

    this.animationLength = 4/8*1000;
  },

  0: function(player) {
    var self = this;

    ige.server.attacks.actionStart(player, 'bomb');
    new IgeTimeout(function() {
      ige.server.attacks.actionEnd(player);

      var rotationZ = ige.server.attacks.rotateZ[player.rotation];

      var location = {
        spawn: {
          x: player.worldPosition().x + self.offset[player.rotation].x,
          y: player.worldPosition().y + self.offset[player.rotation].y,
          z: player.worldPosition().z
        },
        rotationZ: 0,
        rotation: player.rotation,
        speed: {
          x: 40*Math.sin(rotationZ),
          y: -40*Math.cos(rotationZ)
        }
      };

      ige.server.gameEntityCreator.createEntity(
        player,
        self.attack,
        location
      );
    }, this.animationLength);
  },

  1: function(player) {
    var self = this;

    ige.server.attacks.actionStart(player, 'bomb');
    new IgeTimeout(function() {
      ige.server.attacks.actionEnd(player);

      for (var i = -1; i < 2; i++) {
        var rotationZ = ige.server.attacks.rotateZ[player.rotation] + i * Math.PI/8;

        var location = {
          spawn: {
            x: player.worldPosition().x + self.offset[player.rotation].x,
            y: player.worldPosition().y + self.offset[player.rotation].y,
            z: player.worldPosition().z
          },
          rotationZ: 0,
          rotation: player.rotation,
          speed: {
            x: 40*Math.sin(rotationZ),
            y: -40*Math.cos(rotationZ)
          }
        };

        ige.server.gameEntityCreator.createEntity(
          player,
          self.attack,
          location
        );
      }
    }, this.animationLength);
  }

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Bomb; }