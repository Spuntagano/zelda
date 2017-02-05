var Player = IgeEntityBox2d.extend({
	classId: 'Player',

	init: function (data) {
		IgeEntityBox2d.prototype.init.call(this);

		var self = this;
    this.data = data || {};
    this.depth(1);
    this.category('Player');

    /* CEXCLUDE */
    if (ige.isServer) {
      this.streamMode(2);
      this.mount(ige.server.scene1);
    }
    /* CEXCLUDE */

    this.data.anchor = this.data.anchor || {
        up: {
          x: 5,
          y: -9
        },
        left: {
          x: 0,
          y: -5
        },
        right: {
          x: 6,
          y: -9
        },
        down: {
          x: 1,
          y: -9
        }
      };

    this.bounds2d(32, 48);
    this.anchor(this.data.anchor.down.x, this.data.anchor.down.y);
    this.killCount = 0;

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
    this.translateTo(this.data.position.x, this.data.position.y, this.data.position.z);

		this.moving = false;
    this.lastMoving = false;
    this.action = '';
    this.rotation = 'down';
    this.lastRotation = 'down';
    this.movement = 'down';
    this.lastMovement = 'down';
    this.alive = true;
    this.cooldown = {};

    this.speed = {
      left: new IgePoint3d(-4, 0, 0),
      right: new IgePoint3d(4, 0, 0),
      up: new IgePoint3d(0, -4, 0),
      down: new IgePoint3d(0, 4, 0),
      leftUp: new IgePoint3d(-4, -4, 0),
      upRight: new IgePoint3d(4, -4, 0),
      rightDown: new IgePoint3d(4, 4, 0),
      downLeft: new IgePoint3d(-4, 4, 0)
    };

    this.actions = {
      slash: {
        anim: {
          left: 'slashLeft',
          right: 'slashRight',
          up: 'slashUp',
          down: 'slashDown'
        },
        attack: {
          cooldown: 0,
          animationDuration: 8/20*1000,
          lifeDuration: 8/20*1000,
          entity: Sword,
          instant: true
        }
      },
      shoot: {
        anim: {
          left: 'shootLeft',
          right: 'shootRight',
          up: 'shootUp',
          down: 'shootDown'
        },
        attack: {
          animationDuration: 4/8*1000,
          lifeDuration: 1000,
          cooldown: 2000,
          entity: Bullet,
          instant: false
        }
      },
      bomb: {
        anim: {
          left: 'bombLeft',
          right: 'bombRight',
          up: 'bombUp',
          down: 'bombDown'
        },
        attack: {
          animationDuration: 4/8*1000,
          lifeDuration: 99999,
          cooldown: 5000,
          entity: Bomb,
          instant: false
        }
      },
      stop: {
        anim: {
          left: 'stopLeft',
          right: 'stopRight',
          up: 'stopUp',
          down: 'stopDown'
        }
      },
      walk: {
        anim: {
          left: 'walkLeft',
          right: 'walkRight',
          up: 'walkUp',
          down: 'walkDown'
        }
      },
      death: {
        anim: {
          left: 'deathLeft',
          right: 'deathRight',
          up: 'deathUp',
          down: 'deathDown'
        }
      }
    };

    Object.keys(this.actions).map(function(key) {
      if (self.actions[key].attack) {
        self.cooldown[key] = new Date().getTime() - self.actions[key].attack.cooldown;
      }
    });

		if (ige.isClient) {
      this.addComponent(IgeAnimationComponent);
      this._characterTexture = new IgeCellSheet('./assets/textures/link.png', 23, 8);

      this._characterTexture.on('loaded', function () {
        self.texture(self._characterTexture)
          .width(64)
          .height(64);

        self.animation.define(self.actions.walk.anim.down, [85, 86, 87, 88, 89, 90, 91, 92], 12, -1)
          .animation.define(self.actions.walk.anim.left, [62, 63, 64, 65, 66, 67, 68, 69], 12, -1)
          .animation.define(self.actions.walk.anim.right, [16, 17, 18, 19, 20, 21, 22, 23], 12, -1)
          .animation.define(self.actions.walk.anim.up, [39, 40, 41, 42, 43, 44, 45, 46], 12, -1)
          .animation.define(self.actions.stop.anim.down, [85], 12, 0)
          .animation.define(self.actions.stop.anim.left, [62], 12, 0)
          .animation.define(self.actions.stop.anim.right, [16], 12, 0)
          .animation.define(self.actions.stop.anim.up, [39], 12, 0)
          .animation.define(self.actions.slash.anim.down, [70, 71, 72, 73, 74, 75, 79, 80, 81, 85], 20, 0)
          .animation.define(self.actions.slash.anim.left, [47, 48, 49, 50, 51, 52, 56, 57, 58, 62], 20, 0)
          .animation.define(self.actions.slash.anim.right, [1, 2, 3, 4, 5, 6, 10, 11, 12, 16], 20, 0)
          .animation.define(self.actions.slash.anim.up, [24, 25, 26, 27, 28, 29, 33, 34, 35, 39], 20, 0)
          .animation.define(self.actions.shoot.anim.down, [82, 83, 84, 85], 8, 0)
          .animation.define(self.actions.shoot.anim.left, [59, 60, 61, 62], 8, 0)
          .animation.define(self.actions.shoot.anim.right, [13, 14, 15, 16], 8, 0)
          .animation.define(self.actions.shoot.anim.up, [36, 37, 38, 39], 8, 0)
          .animation.define(self.actions.bomb.anim.down, [162], 12, 0)
          .animation.define(self.actions.bomb.anim.left, [139], 12, 0)
          .animation.define(self.actions.bomb.anim.right, [93], 12, 0)
          .animation.define(self.actions.bomb.anim.up, [116], 12, 0)
          .animation.define(self.actions.death.anim.down, [184], 12, 0)
          .animation.define(self.actions.death.anim.left, [184], 12, 0)
          .animation.define(self.actions.death.anim.right, [184], 12, 0)
          .animation.define(self.actions.death.anim.up, [184], 12, 0)
          .cell(1);

      }, false, true);
		}
	},

  streamCreateData: function () {
    return this.data;
  },

	tick: function (ctx) {
    var self = this;

    /* CEXCLUDE */
		if (ige.isServer) {
      if (this.moving && !this.action) {
        this._box2dBody.SetLinearVelocity(this.speed[this.movement]);
      } else {
        this._box2dBody.SetLinearVelocity(new IgePoint3d(0, 0, 0));
      }

      if (this.moving !== this.lastMoving || this.rotation !== this.lastRotation || this.movement !== this.lastMovement) {
        ige.network.send('playerControl', {id: this.id(), rotation: this.rotation, moving: this.moving, movement: this.movement});
      }

      this.lastMoving = this.moving;
      this.lastRotation = this.rotation;
      this.lastMovement = this.movement;
		}
    /* CEXCLUDE */

		if (ige.isClient && ige.client.id === this.id()) {
      
      var moving = true;
      var rotation = this.rotation;
      var movement = this.movement;
			if (ige.input.actionState('left')) {
        rotation = 'left';
        movement = 'left';

        if (ige.input.actionState('up')) {
          movement = 'leftUp';
        }

        if (ige.input.actionState('down')) {
          movement = 'downLeft';
        }

			} else if (ige.input.actionState('right'))  {
        rotation = 'right';
        movement = 'right';

        if (ige.input.actionState('up')) {
          movement = 'upRight';
        }

        if (ige.input.actionState('down')) {
          movement = 'rightDown';
        }

			} else if (ige.input.actionState('up')) {
        rotation = 'up';
        movement = 'up';

        if (ige.input.actionState('right')) {
          movement = 'upRight';
        }

        if (ige.input.actionState('left')) {
          movement = 'leftUp';
        }

      } else if (ige.input.actionState('down')) {
        rotation = 'down';
        movement = 'down';

        if (ige.input.actionState('left')) {
          movement = 'downLeft';
        }

        if (ige.input.actionState('right')) {
          movement = 'rightDown';
        }

      } else {
        moving = false;
      }

      if (moving !== this.moving || rotation !== this.rotation || movement !== this.movement) {
        ige.network.send('playerControl', {rotation: rotation, moving: moving, movement: movement});
      }

      Object.keys(this.actions).map(function(key) {
        if (self.actions[key].attack) {
          if (ige.input.actionState(key) && (new Date().getTime() > self.cooldown[key] + self.actions[key].attack.cooldown)) {
            ige.network.send('attack', key);
          }
        }
      });
    }

		IgeEntityBox2d.prototype.tick.call(this, ctx);
	},

  update: function (ctx, tickDelta) {
    if (ige.isClient) {
      if (this.action) {
        this.animation.select(this.actions[this.action].anim[this.rotation]);
      } else if (this.moving) {
        this.animation.select(this.actions.walk.anim[this.rotation]);
      } else {
        this.animation.select(this.actions.stop.anim[this.rotation]);
      }

      this.anchor(this.data.anchor[this.rotation].x, this.data.anchor[this.rotation].y);
    }

    IgeEntityBox2d.prototype.update.call(this, ctx, tickDelta);
  },

  destroy: function () {
    if (this._characterTexture) {
      this._characterTexture.destroy();
    }
    /* CEXCLUDE */
    if (ige.isServer) {
      this.streamDestroy();
    }
    /* CEXCLUDE */
    
    IgeEntityBox2d.prototype.destroy.call(this);
  }
  
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Player; }