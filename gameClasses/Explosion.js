var Explosion = IgeEntityBox2d.extend({
  classId: 'Explosion',

  init: function (data) {
    IgeEntityBox2d.prototype.init.call(this);

    var self = this;

    this.drawBounds(true);
    this.depth(11);
    this.data = data;
    this.translateTo(this.data.position.x, this.data.position.y, this.data.position.z);

    if (ige.isServer) {
      this.addComponent(IgeVelocityComponent);
    }

    if (ige.isClient) {
      this.addComponent(IgeAnimationComponent);

      this.shotBy = ige.client.players[this.data.shotBy];
      this._characterTexture = new IgeCellSheet('./assets/textures/explosion.png', 9, 1);
      this._characterTexture.on('loaded', function () {
        self.texture(self._characterTexture)
          .width(96)
          .height(96);

        self.animation.define('explode', [1, 2, 3, 4, 5, 6, 7, 8], 12, -1)
          .animation.select('explode');
      }, false, true);
    }

    this.box2dBody({
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
    });
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
    IgeEntityBox2d.prototype.tick.call(this, ctx);
  },

  destroy: function () {
    IgeEntityBox2d.prototype.destroy.call(this);
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Explosion; }