var Corpse = GameEntity.extend({
  classId: 'Corpse',

  init: function (data) {
    var self = this;
    this.data = data || {};

    this.data.anchor = this.data.anchor || {
        up: {
          x: 5,
          y: -9
        },
        left: {
          x: 0,
          y: -5
        },
        right: {
          x: 6,
          y: -9
        },
        down: {
          x: 1,
          y: -9
        }
      };

    this.data.contactOptions = {
      owner: {
        clip: true,
        lethal: false
      },
      players: {
        clip: true,
        lethal: false
      },
      destroyOnKill: false
    };

    this.icon = './assets/textures/icons/corpse.png';
    this.data.rotation = 'down';

    if (ige.isClient) {
      this.addComponent(IgeAnimationComponent);
      this._characterTexture = new IgeCellSheet('./assets/textures/' + ige.client.players[self.data.shotBy].skin, 23, 8);

      this._characterTexture.on('loaded', function () {
        self.texture(self._characterTexture)
          .width(64)
          .height(64);

        self.animation.define('death', [184], 12, 0).cell(1);
        self.animation.select('death');

      }, false, true);
    }

    this.data.box2dBody = {
      type: 'dynamic',
      linearDamping: 0.0,
      angularDamping: 0.1,
      allowSleep: false,
      bullet: true,
      fixedRotation: false,
      fixtures: [{
        density: 1.0,
        friction: 0,
        restitution: 0.0001,
        shape: {
          type: 'rectangle'
        }
      }]
    };

    GameEntity.prototype.init.call(this, data);
  },

  streamCreateData: function () {
    return this.data;
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Corpse; }