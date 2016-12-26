var Sword = IgeEntity.extend({
  classId: 'Sword',

  init: function (rotation) {
    IgeEntity.prototype.init.call(this);

    var self = this;

    this.drawBounds(true);
    this.depth(10);

    if (ige.isServer) {
      this.addComponent(IgeVelocityComponent);
    }

    if (ige.isClient) {
      this.addComponent(IgeAnimationComponent);
      this._characterTexture = new IgeCellSheet('./assets/textures/sword.png', 12, 4);

      this._characterTexture.on('loaded', function () {
        self.texture(self._characterTexture)
          .width(144)
          .height(144);
          //.dimensionsFromCell();

        self.animation.define('swordDown', [37, 38, 39, 40, 41, 42, 46, 47, 48, 48], 20, 0)
          .animation.define('swordLeft', [25, 26, 27, 28, 29, 30, 34, 35, 36, 36], 20, 0)
          .animation.define('swordUp', [13, 14, 15, 16, 17, 18, 22, 23, 24, 24], 20, 0)
          .animation.define('swordRight', [1, 2, 3, 4, 5, 6, 10, 11, 12, 12], 20, 0)
          .cell(1);

      }, false, true);
    }

    this._lastTranslate = this._translate.clone();
    this.shotBy = {};
    this.rotation = rotation;

  },

  streamCreateData: function () {
    return this.rotation;
  },


  update: function (ctx, tickDelta) {

    if (ige.isClient) {
      switch (this.rotation) {
        case 'Left':
          this.animation.select('swordLeft');
          break;
        case 'Up':
          this.animation.select('swordUp');
          break;
        case 'Down':
          this.animation.select('swordDown');
          break;
        case 'Right':
          this.animation.select('swordRight');
          break;
      }
    }

    IgeEntity.prototype.update.call(this, ctx, tickDelta);
  },

  /**
   * Called every frame by the engine when this entity is mounted to the
   * scenegraph.
   * @param ctx The canvas context to render to.
   */
  tick: function (ctx) {

    // Call the IgeEntity (super-class) tick() method
    IgeEntity.prototype.tick.call(this, ctx);
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Sword; }