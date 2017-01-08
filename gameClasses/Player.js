var Player = IgeEntityBox2d.extend({
	classId: 'Player',

	init: function () {
		IgeEntityBox2d.prototype.init.call(this);

		var self = this;
    this.depth(1);

    this.box2dBody({
      type: 'dynamic',
      linearDamping: 0.0,
      angularDamping: 0.1,
      allowSleep: false,
      bullet: false,
      fixedRotation: true,
      fixtures: [{
        density: 1.0,
        friction: 0.5,
        restitution: 0.2,
        shape: {
          type: 'rectangle'
        }
      }]
    });
    
    this.username = '';
    this.translateTo(17*32, 13*32, 0);

		this.moving = false;
    this.lastMoving = false;
    this.action = '';
    this.rotation = 'down';

    this.speed = {
      left: new IgePoint3d(-4, 0, 0),
      right: new IgePoint3d(4, 0, 0),
      up: new IgePoint3d(0, -4, 0),
      down: new IgePoint3d(0, 4, 0)
    };

    this.anim = {
      slash: {
        left: 'slashLeft',
        right: 'slashRight',
        up: 'slashUp',
        down: 'slashDown'
      },
      shoot: {
        left: 'shootLeft',
        right: 'shootRight',
        up: 'shootUp',
        down: 'shootDown'
      },
      bomb: {
        left: 'stopLeft',
        right: 'stopRight',
        up: 'stopUp',
        down: 'stopDown'
      },
      stop: {
        left: 'stopLeft',
        right: 'stopRight',
        up: 'stopUp',
        down: 'stopDown'
      },
      walk: {
        left: 'walkLeft',
        right: 'walkRight',
        up: 'walkUp',
        down: 'walkDown'
      }
    };

		if (ige.isClient) {
      this.addComponent(IgeAnimationComponent);
      this._characterTexture = new IgeCellSheet('./assets/textures/link.png', 23, 4);

      this._characterTexture.on('loaded', function () {
        self.texture(self._characterTexture)
          .width(32)
          .height(32);
          //.dimensionsFromCell();

        self.animation.define(self.anim.walk.down, [85, 86, 87, 88, 89, 90, 91, 92], 12, -1)
          .animation.define(self.anim.walk.left, [62, 63, 64, 65, 66, 67, 68, 69], 12, -1)
          .animation.define(self.anim.walk.right, [16, 17, 18, 19, 20, 21, 22, 23], 12, -1)
          .animation.define(self.anim.walk.up, [39, 40, 41, 42, 43, 44, 45, 46], 12, -1)
          .animation.define(self.anim.stop.down, [85], 12, 0)
          .animation.define(self.anim.stop.left, [62], 12, 0)
          .animation.define(self.anim.stop.right, [16], 12, 0)
          .animation.define(self.anim.stop.up, [39], 12, 0)
          .animation.define(self.anim.slash.down, [70, 71, 72, 73, 74, 75, 79, 80, 81, 85], 20, 0)
          .animation.define(self.anim.slash.left, [47, 48, 49, 50, 51, 52, 56, 57, 58, 62], 20, 0)
          .animation.define(self.anim.slash.right, [1, 2, 3, 4, 5, 6, 10, 11, 12, 16], 20, 0)
          .animation.define(self.anim.slash.up, [24, 25, 26, 27, 28, 29, 33, 34, 35, 39], 20, 0)
          .animation.define(self.anim.shoot.down, [82, 83, 84, 85], 8, 0)
          .animation.define(self.anim.shoot.left, [59, 60, 61, 62], 8, 0)
          .animation.define(self.anim.shoot.right, [13, 14, 15, 16], 8, 0)
          .animation.define(self.anim.shoot.up, [36, 37, 38, 39], 8, 0)
          .cell(1);

      }, false, true);
		}

    this.scaleTo(2, 2, 0);
	},

	tick: function (ctx) {
		if (ige.isServer) {

      if (this.moving && !this.action) {
        this._box2dBody.SetLinearVelocity(this.speed[this.rotation]);
      } else {
        this._box2dBody.SetLinearVelocity(new IgePoint3d(0, 0, 0));
      }

      if (this.moving !== this.lastMoving || this.rotation !== this.lastRotation) {
        changed = true;
      }

      if (changed) {
        ige.network.send('playerControl', {id: this.id(), rotation: this.rotation, moving: this.moving});
      }

      this.lastMoving = this.moving;
      this.lastRotation = this.rotation;
		}

		if (ige.isClient && ige.client.id === this.id()) {
      
      var moving = true;
      var changed = false;
      var rotation = this.rotation;
			if (ige.input.actionState('left')) {
        rotation = 'left';
			} else if (ige.input.actionState('right'))  {
        rotation = 'right';
			} else if (ige.input.actionState('up')) {
        rotation = 'up';
      } else if (ige.input.actionState('down')) {
        rotation = 'down';
      } else {
        moving = false;
      }

      if (moving !== this.moving || rotation !== this.rotation) {
        changed = true;
      }

      if (ige.input.actionState('shoot')) {
        ige.network.send('shoot');
      }

      if (ige.input.actionState('slash')) {
        ige.network.send('slash');
      }

      if (ige.input.actionState('bomb')) {
        ige.network.send('bomb');
      }

      if (changed) {
        ige.network.send('playerControl', {rotation: rotation, moving: moving});
      }
    }

		IgeEntityBox2d.prototype.tick.call(this, ctx);
	},

  update: function (ctx, tickDelta) {
    if (ige.isClient) {
      if (this.action) {
        this.animation.select(this.anim[this.action][this.rotation]);
      } else if (this.moving) {
        this.animation.select(this.anim.walk[this.rotation]);
      } else {
        this.animation.select(this.anim.stop[this.rotation]);
      }
    }

    IgeEntityBox2d.prototype.update.call(this, ctx, tickDelta);
  },

  destroy: function () {
    if (this._characterTexture) {
      this._characterTexture.destroy();
    }
    
    IgeEntityBox2d.prototype.destroy.call(this);
  }
  
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Player; }