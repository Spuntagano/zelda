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

  _onPlayerMove: function(data, clientId) {
    if (ige.server.players[clientId]) {
      ige.server.players[clientId].moving = data.moving;

      if (!ige.server.players[clientId].action) {
        ige.server.players[clientId].rotation = data.rotation;
      }
    }
  },

  _onPlayerSlash: function (data, clientId) {
    ige.server.gameEntityCreator.createGameEntity(data, clientId, Sword, 10/20*1000, 10/20*1000, 'slash', true);
  },

  _onPlayerShoot: function (data, clientId) {
    ige.server.gameEntityCreator.createGameEntity(data, clientId, Bullet, 4/8*1000, 1000, 'shoot', false);
  },

  _onPlayerBomb: function (data, clientId) {
    ige.server.gameEntityCreator.createGameEntity(data, clientId, Bomb, 4/8*1000, 99999, 'bomb', false);
  }
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ServerNetworkEvents; }