var Sword = GameEntity.extend({
  classId: 'Sword',

  init: function (data) {
    var self = this;
    this.data = data;

    this.data.offset = this.data.offset || {
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

    this.data.bounds2d = this.data.bounds2d || {
      up: {
        x:72,
        y:-36
      },
      left: {
        x:-36,
        y:72
      },
      right: {
        x:36,
        y:72
      },
      down: {
        x:72,
        y:36
      }
    };

    this.data.anchor = this.data.anchor || {
      up: {
        x: 0,
        y: 30
      },
      left: {
        x: 23,
        y: -7
      },
      right: {
        x: -30,
        y: 0
      },
      down: {
        x: -5,
        y: -25
      }
    };

    this.data.contactOptions = {
      owner: {
        clip: true,
        lethal: false
      },
      players: {
        clip: true,
        lethal: true
      },
      destroyOnKill: false
    };

    this.killVerb = 'slashed';

    if (ige.isClient) {
      this.addComponent(IgeAnimationComponent);
      this._characterTexture = new IgeCellSheet('./assets/textures/sword.png', 12, 4);

      this._characterTexture.on('loaded', function () {
        self.texture(self._characterTexture)
          .width(144)
          .height(144);

        self.animation.define('swordDown', [37, 38, 39, 40, 41, 42, 46, 47, 48, 48], 20, 0)
          .animation.define('swordLeft', [25, 26, 27, 28, 29, 30, 34, 35, 36, 36], 20, 0)
          .animation.define('swordUp', [13, 14, 15, 16, 17, 18, 22, 23, 24, 24], 20, 0)
          .animation.define('swordRight', [1, 2, 3, 4, 5, 6, 10, 11, 12, 12], 20, 0)
          .cell(1);

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
  },


  update: function (ctx, tickDelta) {

    if (ige.isClient) {
      switch (this.data.rotation) {
        case 'left':
          this.animation.select('swordLeft');
          break;
        case 'up':
          this.animation.select('swordUp');
          break;
        case 'down':
          this.animation.select('swordDown');
          break;
        case 'right':
          this.animation.select('swordRight');
          break;
      }
    }

    GameEntity.prototype.update.call(this, ctx, tickDelta);
  },

  /**
   * Called every frame by the engine when this entity is mounted to the
   * scenegraph.
   * @param ctx The canvas context to render to.
   */
  tick: function (ctx) {

    // Call the IgeEntity (super-class) tick() method
    GameEntity.prototype.tick.call(this, ctx);
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Sword; }