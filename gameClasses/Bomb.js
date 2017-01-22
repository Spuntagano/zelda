var Bomb = GameEntity.extend({
  classId: 'Bomb',

  init: function (data) {
    var self = this;
    this.data = data;

    this.data.speed = this.data.speed || {
      up: {
        x: 0,
        y: -40
      },
      left: {
        x: -40,
        y: 0
      },
      right: {
        x: 40,
        y: 0
      },
      down: {
        x: 0,
        y: 40
      }
    };

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
          x: 24,
          y: 24
        },
        left: {
          x: 24,
          y: 24
        },
        right: {
          x: 24,
          y: 24
        },
        down: {
          x: 24,
          y: 24
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
    
    this.icon = './assets/textures/icons/bomb.png';

    this.data.box2dBody = {
      type: 'dynamic',
      linearDamping: 0.0,
      angularDamping: 0.1,
      allowSleep: false,
      bullet: true,
      fixedRotation: true,
      fixtures: [{
        density: 1.0,
        friction: 0,
        restitution: 0.0001,
        shape: {
          type: 'rectangle'
        }
      }]
    };
    
    if (ige.isClient) {
      this._characterTexture = new IgeCellSheet('./assets/textures/bomb.png', 4, 1);
      this._characterTexture.on('loaded', function () {
        self.texture(self._characterTexture)
          .width(32)
          .height(32)
      }, false, true);
    }

    
    if (ige.isServer) {
      new IgeTimeout(function () {
        self._box2dBody.SetLinearVelocity(new IgePoint3d(0, 0, 0));

        new IgeTimeout(function () {
          var explosion = new Explosion({
            position: self.worldPosition(),
            shotBy: self.data.shotBy
          }).streamMode(1)
            .lifeSpan(10 * 30)
            .mount(ige.server.scene1);
          
          explosion.shotBy = self.shotBy;

          self.destroy();
        }, config.bomb.timeBeforeExplose);
      }, config.bomb.timeBeforeStop);
    }

    GameEntity.prototype.init.call(this, data);
  },

  streamCreateData: function () {
    return this.data;
  },

  /**
   * Called every frame by the engine when this entity is mounted to the
   * scenegraph.
   * @param ctx The canvas context to render to.
   */
  tick: function (ctx) {
    
    // Call the IgeEntity (super-class) tick() method
    GameEntity.prototype.tick.call(this, ctx);
  },

  destroy: function () {
    GameEntity.prototype.destroy.call(this);
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Bomb; }