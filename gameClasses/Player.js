var Player = IgeEntityBox2d.extend({
	classId: 'Player',

	init: function () {
		IgeEntityBox2d.prototype.init.call(this);

		var self = this;

		this.drawBounds(true);
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
    this.translateTo(1000, 1000, 0);

		// Rotate to point upwards
		this.controls = {
			left: false,
			right: false,
			up: false,
      down: false
		};

    this.action = '';
    this.rotation = 'Down';

		if (ige.isClient) {
      this.addComponent(IgeAnimationComponent);
      this._characterTexture = new IgeCellSheet('./assets/textures/link.png', 23, 4);

      this._characterTexture.on('loaded', function () {
        self.texture(self._characterTexture)
          .width(64)
          .height(64);
          //.dimensionsFromCell();

        self.animation.define('walkDown', [85, 86, 87, 88, 89, 90, 91, 92], 12, -1)
          .animation.define('walkLeft', [62, 63, 64, 65, 66, 67, 68, 69], 12, -1)
          .animation.define('walkRight', [16, 17, 18, 19, 20, 21, 22, 23], 12, -1)
          .animation.define('walkUp', [39, 40, 41, 42, 43, 44, 45, 46], 12, -1)
          .animation.define('stopDown', [85], 12, 0)
          .animation.define('stopLeft', [62], 12, 0)
          .animation.define('stopRight', [16], 12, 0)
          .animation.define('stopUp', [39], 12, 0)
          .animation.define('slashDown', [70, 71, 72, 73, 74, 75, 79, 80, 81, 85], 20, 0)
          .animation.define('slashLeft', [47, 48, 49, 50, 51, 52, 56, 57, 58, 62], 20, 0)
          .animation.define('slashRight', [1, 2, 3, 4, 5, 6, 10, 11, 12, 16], 20, 0)
          .animation.define('slashUp', [24, 25, 26, 27, 28, 29, 33, 34, 35, 39], 20, 0)
          .animation.define('shootDown', [82, 83, 84, 85], 8, 0)
          .animation.define('shootLeft', [59, 60, 61, 62], 8, 0)
          .animation.define('shootRight', [13, 14, 15, 16], 8, 0)
          .animation.define('shootUp', [36, 37, 38, 39], 8, 0)
          .cell(1);

      }, false, true);
		}

    this._lastTranslate = this._translate.clone();

		// Define the data sections that will be included in the stream
		this.streamSections(['transform', 'score']);
	},

	/**
	 * Override the default IgeEntity class streamSectionData() method
	 * so that we can check for the custom1 section and handle how we deal
	 * with it.
	 * @param {String} sectionId A string identifying the section to
	 * handle data get / set for.
	 * @param {*=} data If present, this is the data that has been sent
	 * from the server to the client for this entity.
	 * @return {*}
	 */
	streamSectionData: function (sectionId, data) {
		// Check if the section is one that we are handling
		if (sectionId === 'score') {
			// Check if the server sent us data, if not we are supposed
			// to return the data instead of set it
			if (data) {
				// We have been given new data!
				this._score = data;
			} else {
				// Return current data
				return this._score;
			}
		} else {
			// The section was not one that we handle here, so pass this
			// to the super-class streamSectionData() method - it handles
			// the "transform" section by itself
			return IgeEntityBox2d.prototype.streamSectionData.call(this, sectionId, data);
		}
	},

	/**
	 * Called every frame by the engine when this entity is mounted to the
	 * scenegraph.
	 * @param ctx The canvas context to render to.
	 */
	tick: function (ctx) {
    var changed = false;
    
		if (ige.isServer) {
			if (this.controls.left && !this.action) {
        this._box2dBody.SetLinearVelocity(new IgePoint3d(-4, 0, 0));
        if (this.rotation !== 'left') {
          this.rotation = 'left';
          changed = true;
        }
			}

			if (this.controls.right && !this.action) {
        this._box2dBody.SetLinearVelocity(new IgePoint3d(4, 0, 0));
        if (this.rotation !== 'right') {
          this.rotation = 'right';
          changed = true;
        }
      }

			if (this.controls.up && !this.action) {
        this._box2dBody.SetLinearVelocity(new IgePoint3d(0, -4, 0));
        if (this.rotation !== 'up') {
          this.rotation = 'up';
          changed = true;
        }
			}

      if (this.controls.down && !this.action) {
        this._box2dBody.SetLinearVelocity(new IgePoint3d(0, 4, 0));
        if (this.rotation !== 'down') {
          this.rotation = 'down';
          changed = true;
        }
      }

      if (!this.controls.down && !this.controls.up && !this.controls.right && !this.controls.left) {
        this._box2dBody.SetLinearVelocity(new IgePoint3d(0, 0, 0));
      }

      if (changed) {
        ige.network.send('playerControl', {id: this.id(), rotation: this.rotation});
      }
		}

		if (ige.isClient && !this.action) {
			if (ige.input.actionState('left')) {
				if (!this.controls.left) {
					this.controls.left = true;
          changed = true;
				}
			} else {
				if (this.controls.left) {
					this.controls.left = false;
          changed = true;
				}
			}

			if (ige.input.actionState('right')) {
				if (!this.controls.right) {
					this.controls.right = true;
          changed = true;
				}
			} else {
				if (this.controls.right) {
					this.controls.right = false;
          changed = true;
				}
			}

			if (ige.input.actionState('up')) {
				if (!this.controls.up) {
					this.controls.up = true;
          changed = true;
				}
			} else {
				if (this.controls.up) {
					this.controls.up = false;
          changed = true;
				}
			}

      if (ige.input.actionState('down')) {
        if (!this.controls.down) {
          this.controls.down = true;
          changed = true;
        }
      } else {
        if (this.controls.down) {
          this.controls.down = false;
          changed = true;
        }
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
    }

    if (changed) {
      ige.network.send('playerControl', this.controls);
    }

		IgeEntityBox2d.prototype.tick.call(this, ctx);
	},

  update: function (ctx, tickDelta) {
    if (this.action) {
      this._box2dBody.SetLinearVelocity(new IgePoint3d(0, 0, 0));
    }

    var oldX = this._lastTranslate.x,
        oldY = this._lastTranslate.y * 2,
        currX = this.translate().x(),
        currY = this.translate().y() * 2,
        distX = currX - oldX,
        distY = currY - oldY;
    
    this._lastTranslate = this._translate.clone();

    if (ige.isClient) {
    switch(this.rotation) {
      case 'left':
        switch (this.action) {
          case 'slash':
            this.animation.select('slashLeft');
            break;
          case 'shoot':
            this.animation.select('shootLeft');
            break;
          case 'bomb':
            this.animation.select('stopLeft');
            break;
          default:
            if (distX === 0 && distY === 0) {
              this.animation.select('stopLeft');
            } else {
              this.animation.select('walkLeft');
            }
            break;
        }
        break;
      case 'up':
        switch (this.action) {
          case 'slash':
            this.animation.select('slashIp');
            break;
          case 'shoot':
            this.animation.select('shootUp');
            break;
          case 'bomb':
            this.animation.select('stopUp');
            break;
          default:
            if (distX === 0 && distY === 0) {
              this.animation.select('stopUp');
            } else {
              this.animation.select('walkUp');
            }
            break;
        }
        break;
      case 'down':
        switch (this.action) {
          case 'slash':
            this.animation.select('slashDown');
            break;
          case 'shoot':
            this.animation.select('shootDown');
            break;
          case 'bomb':
            this.animation.select('stopDown');
            break;
          default:
            if (distX === 0 && distY === 0) {
              this.animation.select('stopDown');
            } else {
              this.animation.select('walkDown');
            }
            break;
        }
        break;
      case 'right':
        switch (this.action) {
          case 'slash':
            this.animation.select('slashRight');
            break;
          case 'shoot':
            this.animation.select('shootRight');
            break;
          case 'bomb':
            this.animation.select('stopRight');
            break;
          default:
            if (distX === 0 && distY === 0) {
              this.animation.select('stopRight');
            } else {
              this.animation.select('walkRight');
            }
            break;
        }
        break;
      }
    }

    IgeEntityBox2d.prototype.update.call(this, ctx, tickDelta);
  },

  destroy: function () {
    // Destroy the texture object
    if (this._characterTexture) {
      this._characterTexture.destroy();
    }
    
    // Call the super class
    IgeEntityBox2d.prototype.destroy.call(this);
  }
  
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Player; }