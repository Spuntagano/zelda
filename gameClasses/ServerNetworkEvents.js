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
      ige.network.send('disconnect', ige.server.players[clientId].id());
			delete ige.server.players[clientId];
		}
	},

	_onPlayerEntity: function (data, clientId) {
		if (!ige.server.players[clientId]) {
			ige.server.players[clientId] = new Player({
        position: {
          x: config.startingPosition.x || (Math.random()*(config.tiles.count.x - 2) + 1)*config.tiles.size.x,
          y: config.startingPosition.y || (Math.random()*(config.tiles.count.y - 2) + 1)*config.tiles.size.y,
          z: 0
        }})
				.streamMode(1)
				.mount(ige.server.scene1);

      ige.server.players[clientId].username = data;

			// Tell the client to track their player entity
			ige.network.send('playerEntity', ige.server.players[clientId].id(), clientId);

      new IgeTimeout(function() {
        Object.keys(ige.server.players).map(function(key) {
          ige.server.players[key].streamForceUpdate();
        });
      }, config.tickRate);
		}
	},

  _onPlayerMove: function(data, clientId) {
    if (ige.server.players[clientId]) {
      ige.server.players[clientId].moving = data.moving;

      if (!ige.server.players[clientId].action) {
        ige.server.players[clientId].rotation = data.rotation;
        ige.server.players[clientId].movement = data.movement;
      }
    }
  },

  _onPlayerSlash: function (data, clientId) {
    ige.server.gameEntityCreator.createGameEntity(data, clientId, Sword, config.sword.animationDuration, config.sword.lifeDuration, 'slash', true);
  },

  _onPlayerShoot: function (data, clientId) {
    ige.server.gameEntityCreator.createGameEntity(data, clientId, Bullet, config.arrow.animationDuration, config.arrow.lifeDuration, 'shoot', false);
  },

  _onPlayerBomb: function (data, clientId) {
    ige.server.gameEntityCreator.createGameEntity(data, clientId, Bomb, config.bomb.animationDuration, config.bomb.lifeDuration, 'bomb', false);
  }
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ServerNetworkEvents; }