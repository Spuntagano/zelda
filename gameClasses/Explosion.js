var Explosion = GameEntity.extend({
  classId: 'Explosion',

  init: function (data) {
    var self = this;
    this.data = data;

    this.data.options = {
      lethal: 'players',
      clip: 'all',
      destroyOnKill: false
    };

    this.killVerb = 'bombed';

    if (ige.isClient) {
      this.addComponent(IgeAnimationComponent);

      this._characterTexture = new IgeCellSheet('./assets/textures/explosion.png', 9, 1);
      this._characterTexture.on('loaded', function () {
        self.texture(self._characterTexture)
          .width(48)
          .height(48);

        self.animation.define('explode', [1, 2, 3, 4, 5, 6, 7, 8], 12, -1)
          .animation.select('explode');
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

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Explosion; }