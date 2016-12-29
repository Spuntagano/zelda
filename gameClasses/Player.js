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
        /*density: 1.0,
        friction: 0.5,
        restitution: 0.2,*/
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
			thrust: false,
      retroThrust: false,
      shoot: false,
      slash: false,
      bomb: false
		};

    this.rotation = 'Down';

		if (ige.isServer) {
			this.addComponent(IgeVelocityComponent)
		}

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
    
    var UP = Math.radians(0);
    var DOWN = Math.radians(180);
    var LEFT = Math.radians(-90);
    var RIGHT = Math.radians(90);

		/* CEXCLUDE */
		if (ige.isServer) {
			if (this.controls.left && !this.controls.slash && !this.controls.shoot && !this.controls.bomb) {
        this._box2dBody.SetLinearVelocity(new IgePoint3d(-4, 0, 0));
			}

			if (this.controls.right && !this.controls.slash && !this.controls.shoot && !this.controls.bomb) {
        this._box2dBody.SetLinearVelocity(new IgePoint3d(4, 0, 0));
      }

			if (this.controls.thrust && !this.controls.slash && !this.controls.shoot && !this.controls.bomb) {
        this._box2dBody.SetLinearVelocity(new IgePoint3d(0, -4, 0));
			}

      if (this.controls.retroThrust && !this.controls.slash && !this.controls.shoot && !this.controls.bomb) {
        this._box2dBody.SetLinearVelocity(new IgePoint3d(0, 4, 0));
      }

      if (!this.controls.retroThrust && !this.controls.thrust && !this.controls.right && !this.controls.left) {
        this._box2dBody.SetLinearVelocity(new IgePoint3d(0, 0, 0));
      }

		}
		/* CEXCLUDE */

		if (ige.isClient) {
			if (ige.input.actionState('left')) {
				if (!this.controls.left) {
					this.controls.left = true;
					ige.network.send('playerControlLeftDown');
				}
			} else {
				if (this.controls.left) {
					this.controls.left = false;
					ige.network.send('playerControlLeftUp');
				}
			}

			if (ige.input.actionState('right')) {
				if (!this.controls.right) {
					this.controls.right = true;
					ige.network.send('playerControlRightDown');
				}
			} else {
				if (this.controls.right) {
					this.controls.right = false;
					ige.network.send('playerControlRightUp');
				}
			}

			if (ige.input.actionState('thrust')) {
				if (!this.controls.thrust) {
					this.controls.thrust = true;
					ige.network.send('playerControlThrustDown');
				}
			} else {
				if (this.controls.thrust) {
					this.controls.thrust = false;
					ige.network.send('playerControlThrustUp');
				}
			}

      if (ige.input.actionState('retroThrust')) {
        if (!this.controls.thrust) {
          this.controls.retroThrust = true;
          ige.network.send('playerControlRetroThrustDown');
        }
      } else {
        if (this.controls.retroThrust) {
          this.controls.retroThrust = false;
          ige.network.send('playerControlRetroThrustUp');
        }
      }

      if (ige.input.actionState('shoot')) {
        if (!this.controls.shoot) {
          ige.network.send('playerControlShoot');
        }
      }

      if (ige.input.actionState('slash')) {
        if (!this.controls.slash) {
          ige.network.send('playerControlSlash');
        }
      }

      if (ige.input.actionState('bomb')) {
        if (!this.controls.bomb) {
          ige.network.send('playerControlBomb');
        }
      }
    }

		// Call the IgeEntity (super-class) tick() method
		IgeEntityBox2d.prototype.tick.call(this, ctx);
	},

  update: function (ctx, tickDelta) {

    var self = this,
      oldX = this._lastTranslate.x,
      oldY = this._lastTranslate.y * 2,
      currX = this.translate().x(),
      currY = this.translate().y() * 2,
      distX = currX - oldX,
      distY = currY - oldY,
      distance = Math.distance(
        oldX,
        oldY,
        currX,
        currY
      ),
      speed = 0.1,
      time = (distance / speed);

    this._lastTranslate = this._translate.clone();
    this.depth(this._translate.y);

    if (ige.isServer) {
      if (distX === 0 && distY === 0) {
      } else {
        if (Math.abs(distX) > Math.abs(distY)) {
          // Moving horizontal
          if (distX < 0) {
            // Moving left
            this.rotation = 'Left';
          } else {
            // Moving right
            this.rotation = 'Right';
          }
        } else {
          // Moving vertical
          if (distY < 0) {
            this.rotation = 'Up';
          } else {
            this.rotation = 'Down';
          }
        }
      }
    }

    if (ige.isClient) {
      if (distX === 0 && distY === 0) {
        if (this.controls.slash) {
          switch(this.rotation) {
            case 'Left':
              this.animation.select('slashLeft');
              break;
            case 'Up':
              this.animation.select('slashUp');
              break;
            case 'Down':
              this.animation.select('slashDown');
              break;
            case 'Right':
              this.animation.select('slashRight');
              break;
          }
        } else if (this.controls.shoot) {
          switch (this.rotation) {
            case 'Left':
              this.animation.select('shootLeft');
              break;
            case 'Up':
              this.animation.select('shootUp');
              break;
            case 'Down':
              this.animation.select('shootDown');
              break;
            case 'Right':
              this.animation.select('shootRight');
              break;
          }
        } else if (this.controls.bomb) {
          switch(this.rotation) {
            case 'Left':
              this.animation.select('stopLeft');
              break;
            case 'Up':
              this.animation.select('stopUp');
              break;
            case 'Down':
              this.animation.select('stopDown');
              break;
            case 'Right':
              this.animation.select('stopRight');
              break;
          }
        } else {
          switch(this.rotation) {
            case 'Left':
              this.animation.select('stopLeft');
              break;
            case 'Up':
              this.animation.select('stopUp');
              break;
            case 'Down':
              this.animation.select('stopDown');
              break;
            case 'Right':
              this.animation.select('stopRight');
              break;
          }
        }
        
      } else {
        // Set the animation based on direction

        if (Math.abs(distX) > Math.abs(distY)) {
          // Moving horizontal
          if (distX < 0) {
            // Moving left
            this.animation.select('walkLeft');
            this.rotation = 'Left';
          } else {
            // Moving right
            this.animation.select('walkRight');
            this.rotation = 'Right';
          }
        } else {
          // Moving vertical
          if (distY < 0) {
            this.animation.select('walkUp');
            this.rotation = 'Up';
          } else {
            this.animation.select('walkDown');
            this.rotation = 'Down';
          }
        }
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