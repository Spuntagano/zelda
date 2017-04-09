var Flame = GameEntity.extend({
  classId: 'Flame',

  init: function (data) {
    var self = this;
    this.data = data || {};

    this.data.bounds2d = this.data.bounds2d || {
      up: {
        x: 5,
        y: 15
      },
      left: {
        x: 5,
        y: 15
      },
      right: {
        x: 5,
        y: 15
      },
      down: {
        x: 5,
        y: 15
      }
    };

    this.data.contactOptions = {
      owner: {
        clip: true,
        lethal: true
      },
      players: {
        clip: true,
        lethal: true
      },
      destroyOnKill: false
    };
    
    this.icon = './assets/textures/icons/fire.png';

    if (ige.isClient) {
      this.shotBy = ige.client.players[this.data.shotBy];
      this._characterTexture = new IgeCellSheet('./assets/textures/flame.png', 1, 1);
      this._characterTexture.on('loaded', function () {
        self.texture(self._characterTexture)
          .width(32)
          .height(32)
      }, false, true);
    }

    this.data.box2dBody = {
      type: 'dynamic',
      linearDamping: 0.0,
      angularDamping: 0.1,
      allowSleep: false,
      bullet: true,
      fixedRotation: true,
      fixtures: [{
        density: 1.0,
        friction: 1000,
        restitution: 0.0001,
        shape: {
          type: 'rectangle'
        }
      }]
    };
    
    /* CEXCLUDE */
    if (ige.isServer) {
      if (this.data.data.charges > 0) {
        new IgeTimeout(function () {
          ige.server.gameEntityCreator.createEntity(
            self.shotBy,
            {
              lifeSpan: 7000,
              entity: Flame
            },
            {
              spawn: {
                x: self.worldPosition().x + self.data.data.offset[self.data.rotation].x,
                y: self.worldPosition().y + self.data.data.offset[self.data.rotation].y,
                z: 0
              },
              speed: {
                x: 0,
                y: 0
              },
              rotation: self.data.rotation,
              rotationZ: 0
            },
            {
              charges: self.data.data.charges - 1,
              offset: self.data.data.offset
            }
          );
        }, 300);
      }
    }
    /* CEXCLUDE */

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
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Flame; }