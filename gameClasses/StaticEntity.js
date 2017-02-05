var StaticEntity = IgeEntityBox2d.extend({
  classId: 'StaticEntity',

  init: function (data) {
    IgeEntityBox2d.prototype.init.call(this);

    var self = this;
    this.data = data;
    this.bounds2d(this.data.width, this.data.height);
    this.category('StaticEntity');

    /* CEXCLUDE */
    if (ige.isServer) {
      this.mount(ige.server.scene1);
    }
    /* CEXCLUDE */
    
    if (ige.isClient) {
      this.mount(ige.client.ui.scene1);
    }

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
      this._characterTexture = new IgeCellSheet(this.data.spritePath, 1, 1);
      this._characterTexture.on('loaded', function () {
        self.texture(self._characterTexture)
          .width(self.data.width)
          .height(self.data.height)
      }, false, true);
    }
  },

  streamCreateData: function () {
    return this.data;
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = StaticEntity; }