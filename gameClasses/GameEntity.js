var GameEntity = IgeEntityBox2d.extend({
  classId: 'GameEntity',

  init: function (data) {
    IgeEntityBox2d.prototype.init.call(this);

    var self = this;
    this.depth(11);
    this.data = data || {};
    this.category('GameEntity');

    this.data.rotation = this.data.rotation || 'down';
    
    this.data.position = this.data.position || {
      x:0, 
      y:0,
      z:0
    };

    this.data.speed = this.data.speed || {
        up: {
          x: 0,
          y: 0
        },
        left: {
          x: 0,
          y: 0
        },
        right: {
          x: 0,
          y: 0
        },
        down: {
          x: 0,
          y: 0
        }
      };

    this.data.offset = this.data.offset || {
        up: {
          x: 0,
          y: 0
        },
        left: {
          x: 0,
          y: 0
        },
        right: {
          x: 0,
          y: 0
        },
        down: {
          x: 0,
          y: 0
        }
      };

    this.data.anchor = this.data.anchor || {
        up: {
          x: 0,
          y: 0
        },
        left: {
          x: 0,
          y: 0
        },
        right: {
          x: 0,
          y: 0
        },
        down: {
          x: 0,
          y: 0
        }
      };

    this.data.entityRotation = this.data.entityRotation || {
        up: 0,
        left: 0,
        right: 0,
        down: 0
      };

    this.contactOptions = this.data.contactOptions || {
        owner: {
          clip: false,
          lethal: false
        },
        players: {
          clip: false,
          lethal: false
        },
        destroyOnKill: false
    };

    if (this.data.bounds2d) {
      this.bounds2d(this.data.bounds2d[this.data.rotation].x, this.data.bounds2d[this.data.rotation].y);
    }
    this.anchor(this.data.anchor[this.data.rotation].x, this.data.anchor[this.data.rotation].y);

    this.box2dBody(this.data.box2dBody);
    this.translateTo(this.data.position.x + this.data.offset[this.data.rotation].x, this.data.position.y + this.data.offset[this.data.rotation].y, this.data.position.z);
    this.rotateTo(0, 0, Math.radians(this.data.entityRotation[this.data.rotation]));

    if (ige.isClient) {
      this.shotBy = ige.client.players[this.data.shotBy];
    }

    if (ige.isServer) {
      this._box2dBody.SetLinearVelocity(new IgePoint3d(this.data.speed[this.data.rotation].x, this.data.speed[this.data.rotation].y, 0));
    }
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
    if (ige.isServer) {
      this.streamDestroy();
      delete ige.server.gameEntities[this.id()];
    }

    if (ige.isClient) {
      delete ige.client.gameEntities[this.id()];
    }
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = GameEntity; }