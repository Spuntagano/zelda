var House = IgeEntityBox2d.extend({
  classId: 'House',

  init: function (data) {
    IgeEntityBox2d.prototype.init.call(this);
    
    var self = this;
    this.data = data;
    this.bounds2d(128, 188);

    this.box2dBody({
      type: 'static',
      linearDamping: 0.0,
      angularDamping: 0.1,
      allowSleep: false,
      bullet: false,
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
    
    this.translateTo(this.data.position.x, this.data.position.y, this.data.position.z);

    if (ige.isClient) {
      this._characterTexture = new IgeCellSheet('./assets/textures/house.png', 1, 1);
      this._characterTexture.on('loaded', function () {
        self.texture(self._characterTexture)
          .width(128)
          .height(188)
      }, false, true);
    }
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

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = House; }