var Player = IgeEntityBox2d.extend({
  classId: 'Bullet',

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
      this.shotBy = ige.client.players[this.data.shotBy];
      this._characterTexture = new IgeCellSheet('./assets/textures/arrow.png', 1, 1);
      this._characterTexture.on('loaded', function () {
        self.texture(self._characterTexture)
          .width(10)
          .height(30)
      }, false, true);
    }

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

    switch(this.data.rotation) {
      case 'Up':
        this.rotateTo(0, 0, Math.radians(0));
        break;
      case 'Left':
        this.rotateTo(0, 0, Math.radians(270));
        break;
      case 'Right':
        this.rotateTo(0, 0, Math.radians(90));
        break;
      case 'Down':
        this.rotateTo(0, 0, Math.radians(180));
        break;
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
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Player; }