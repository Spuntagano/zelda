var ServerNetworkEvents = {
	/**
	 * Is called when the network tells us a new client has connected
	 * to the server. This is the point we can return true to reject
	 * the client connection if we wanted to.
	 * @param data The data object that contains any data sent from the client.
	 * @param clientId The client id of the client that sent the message.
	 * @private
	 */
	_onPlayerConnect: function (socket) {
		// Don't reject the client connection
		return false;
	},

	_onPlayerDisconnect: function (clientId) {
		if (ige.server.players[clientId]) {
			ige.server.players[clientId].destroy();
			delete ige.server.players[clientId];
		}
	},

	_onPlayerEntity: function (data, clientId) {
		if (!ige.server.players[clientId]) {
			ige.server.players[clientId] = new Player(clientId)
				.streamMode(1)
				.mount(ige.server.scene1);

      ige.server.players[clientId].username = data;

			// Tell the client to track their player entity
			ige.network.send('playerEntity', ige.server.players[clientId].id(), clientId);

      new IgeTimeout(function() {
        Object.keys(ige.server.players).map(function(key) {
          ige.server.players[key].streamForceUpdate();
        });
      }, 30);
		}
	},

	_onPlayerLeftDown: function (data, clientId) {
    if (ige.server.players[clientId]) {
      ige.server.players[clientId].controls.left = true;
    }
	},

	_onPlayerLeftUp: function (data, clientId) {
    if (ige.server.players[clientId]) {
      ige.server.players[clientId].controls.left = false;
    }
	},

	_onPlayerRightDown: function (data, clientId) {
    if (ige.server.players[clientId]) {
      ige.server.players[clientId].controls.right = true;
    }
	},

	_onPlayerRightUp: function (data, clientId) {
    if (ige.server.players[clientId]) {
      ige.server.players[clientId].controls.right = false;
    }
	},

	_onPlayerThrustDown: function (data, clientId) {
    if (ige.server.players[clientId]) {
      ige.server.players[clientId].controls.thrust = true;
    }
	},

	_onPlayerThrustUp: function (data, clientId) {
    if (ige.server.players[clientId]) {
      ige.server.players[clientId].controls.thrust = false;
    }
	},

  _onPlayerRetroThrustDown: function (data, clientId) {
    if (ige.server.players[clientId]) {
      ige.server.players[clientId].controls.retroThrust = true;
    }
  },

  _onPlayerRetroThrustUp: function (data, clientId) {
    if (ige.server.players[clientId]) {
      ige.server.players[clientId].controls.retroThrust = false;
    }
  },

  _onPlayerSlash: function (data, clientId) {
    if (ige.server.players[clientId]) {
      if (!ige.server.players[clientId].controls.slash) {
        ige.server.players[clientId]._box2dBody.SetLinearVelocity(new IgePoint3d(0, 0, 0));
        var playerPosition = ige.server.players[clientId].worldPosition();
        var playerRotation = ige.server.players[clientId].rotation;
        var slashOffsetX = 0;
        var slashOffsetY = 0;

        Object.keys(ige.server.players).map(function (key) {

          switch (playerRotation) {
            case 'Up':
              slashOffsetX = 0;
              slashOffsetY = 10;
              break;
            case 'Right':
              slashOffsetX = -5;
              slashOffsetY = 5;
              break;
            case 'Left':
              slashOffsetX = 0;
              slashOffsetY = 4;
              break;
            case 'Down':
              slashOffsetX = 0;
              slashOffsetY = 8;
              break;
          }

        });
        playerPosition.x += slashOffsetX;
        playerPosition.y += slashOffsetY;
        
        var sword = new Sword({playerPosition: playerPosition, playerRotation: playerRotation, slashedBy: ige.server.players[clientId].id()})
          .streamMode(1)
          .mount(ige.server.scene1);

        sword.slashedBy = ige.server.players[clientId];

        ige.network.send('playerControlSlash', ige.server.players[clientId].id());
        ige.server.players[clientId].controls.slash = true;
        new IgeTimeout(function () {
          sword.destroy();
          ige.server.players[clientId].controls.slash = false;
          ige.network.send('playerControlSlashOff', ige.server.players[clientId].id());
        }, (9 / 20 * 1000 + 10));
      }
    }
  },

  _onPlayerShoot: function (data, clientId) {
    if (ige.server.players[clientId]) {
      if (!ige.server.players[clientId].controls.shoot) {
        ige.server.players[clientId]._box2dBody.SetLinearVelocity(new IgePoint3d(0, 0, 0));

        ige.server.players[clientId].controls.shoot = true;
        ige.network.send('playerControlShoot', ige.server.players[clientId].id());
        new IgeTimeout(function () {
          var rotation = ige.server.players[clientId].rotation;
          var position = ige.server.players[clientId].worldPosition();

          var bulletOffsetX = 0;
          var bulletOffsetY = 0;
          var bulletVelocityX = 0;
          var bulletVelocityY = 0;

          switch (rotation) {
            case 'Up':
              bulletVelocityY = -40;
              bulletOffsetY = -30;
              break;
            case 'Left':
              bulletVelocityX = -40;
              bulletOffsetX = -30;
              break;
            case 'Right':
              bulletVelocityX = 40;
              bulletOffsetX = 30;
              break;
            case 'Down':
              bulletVelocityY = 40;
              bulletOffsetY = 30;
              break;
          }

          position.x = position.x + bulletOffsetX;
          position.y = position.y + bulletOffsetY;

          var bullet = new Bullet({position: position, rotation: rotation, shotBy: ige.server.players[clientId].id()})
            .streamMode(1)
            .lifeSpan(1000)
            .mount(ige.server.scene1);

          bullet._box2dBody.SetLinearVelocity(new IgePoint3d(bulletVelocityX, bulletVelocityY, 0));

          bullet.shotBy = ige.server.players[clientId];

          ige.server.players[clientId].controls.shoot = false;
          ige.network.send('playerControlShootOff', ige.server.players[clientId].id());
        }, (4 / 8 * 1000 + 4));
      }
    }
  },

  _onPlayerBomb: function (data, clientId) {
    if (ige.server.players[clientId]) {
      if (!ige.server.players[clientId].controls.bomb) {
        ige.server.players[clientId]._box2dBody.SetLinearVelocity(new IgePoint3d(0, 0, 0));

        ige.server.players[clientId].controls.bomb = true;
        ige.network.send('playerControlBomb', ige.server.players[clientId].id());
        new IgeTimeout(function () {
          var rotation = ige.server.players[clientId].rotation;
          var position = ige.server.players[clientId].worldPosition();

          var bulletOffsetX = 0;
          var bulletOffsetY = 0;
          var bulletVelocityX = 0;
          var bulletVelocityY = 0;

          switch (rotation) {
            case 'Up':
              bulletVelocityY = -40;
              bulletOffsetY = -30;
              break;
            case 'Left':
              bulletVelocityX = -40;
              bulletOffsetX = -30;
              break;
            case 'Right':
              bulletVelocityX = 40;
              bulletOffsetX = 30;
              break;
            case 'Down':
              bulletVelocityY = 40;
              bulletOffsetY = 30;
              break;
          }

          position.x = position.x + bulletOffsetX;
          position.y = position.y + bulletOffsetY;

          var bomb = new Bomb({position: position, shotBy: ige.server.players[clientId].id()})
            .streamMode(1)
            .mount(ige.server.scene1);

          new IgeTimeout(function() {
            bomb._box2dBody.SetLinearVelocity(new IgePoint3d(0, 0, 0));
            
            new IgeTimeout(function() {
              var explosion = new Explosion({position: bomb.worldPosition(), shotBy: ige.server.players[clientId].id()})
                .streamMode(1)
                .lifeSpan(10*30)
                .mount(ige.server.scene1);
              
              explosion.shotBy = ige.server.players[clientId];

              bomb.destroy();
            }, 2000);
          }, 200);

          bomb._box2dBody.SetLinearVelocity(new IgePoint3d(bulletVelocityX, bulletVelocityY, 0));

          bomb.shotBy = ige.server.players[clientId];

          ige.server.players[clientId].controls.bomb = false;
          ige.network.send('playerControlBombOff', ige.server.players[clientId].id());
        }, (4 / 8 * 1000 + 4));
      }
    }
  }
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ServerNetworkEvents; }