var Sword = IgeEntityBox2d.extend({
  classId: 'Sword',

  init: function (data) {
    IgeEntityBox2d.prototype.init.call(this);

    this.box2dBody({
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
    });


    var self = this;
    
    this.data = data;
    this.drawBounds(true);
    this.depth(10);
    this.translateTo(this.data.playerPosition.x, this.data.playerPosition.y, this.data.playerPosition.z)

    if (ige.isServer) {
      this.addComponent(IgeVelocityComponent);
    }

    if (ige.isClient) {
      this.addComponent(IgeAnimationComponent);
      this.slashedBy = ige.client.players[this.data.slashedBy];
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
    this.rotation = this.data.playerRotation;
  },

  streamCreateData: function () {
    return this.data;
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

    IgeEntityBox2d.prototype.update.call(this, ctx, tickDelta);
  },

  /**
   * Called every frame by the engine when this entity is mounted to the
   * scenegraph.
   * @param ctx The canvas context to render to.
   */
  tick: function (ctx) {

    // Call the IgeEntity (super-class) tick() method
    IgeEntityBox2d.prototype.tick.call(this, ctx);
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Sword; }