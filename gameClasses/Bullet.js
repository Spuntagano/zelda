var Bullet = GameEntity.extend({
  classId: 'Bullet',

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
        lethal: false
      },
      players: {
        clip: true,
        lethal: true
      },
      destroyOnKill: true
    };
    
    this.lifeSpan(1000);
    this.icon = './assets/textures/icons/bow.png';

    if (ige.isClient) {
      this.shotBy = ige.client.players[this.data.shotBy];
      this._characterTexture = new IgeCellSheet('./assets/textures/arrow.png', 1, 1);
      this._characterTexture.on('loaded', function () {
        self.texture(self._characterTexture)
          .width(10)
          .height(30)
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

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Bullet; }