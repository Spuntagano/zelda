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
    try {
      if (ige.server.players[clientId]) {
        ige.network.send('disconnect', ige.server.players[clientId].id());
        ige.server.playerRemoveHandler.playerRemove(clientId);
      }
    } catch (e) {
      ige.log(e);
    }
	},

	_onPlayerEntity: function (data, clientId) {
    try {
      if (!ige.server.players[clientId]) {
        ige.server.players[clientId] = new Player({
          position: {
            x: config.startingPosition.x || (Math.random() * (config.tiles.count.x - 2) + 1) * config.tiles.size.x,
            y: config.startingPosition.y || (Math.random() * (config.tiles.count.y - 2) + 1) * config.tiles.size.y,
            z: 0
          }
        });

        ige.server.players[clientId].username = data;

        Object.keys(ige.server.players).map(function (key) {
          ige.server.players[key].streamSync(Object.keys(ige.server.players));
        });

        ige.network.send('playerEntity', {id: ige.server.players[clientId].id()}, clientId);
        ige.network.send('leaderboard', ige.server.leaderboard.generateLeaderboard());
      }
    } catch(e) {
      ige.log(e);
    }
	},

  _onPlayerMove: function(data, clientId) {
    try {
      if (ige.server.players[clientId]) {
        ige.server.players[clientId].moving = data.moving;

        if (!ige.server.players[clientId].action) {
          ige.server.players[clientId].rotation = data.rotation;
          ige.server.players[clientId].movement = data.movement;
        }
      }
    } catch (e) {
      ige.log(e);
    }
  },

  _onPlayerAttack: function (data, clientId) {
    try {
      ige.server.gameEntityCreator.createGameEntity(
        clientId,
        ige.server.players[clientId].actions[data].attack.entity,
        ige.server.players[clientId].actions[data].attack.animationDuration,
        ige.server.players[clientId].actions[data].attack.lifeDuration,
        data,
        ige.server.players[clientId].actions[data].attack.instant,
        ige.server.players[clientId].actions[data].attack.cooldown
      );
    } catch(e) {
      ige.log(e);
    }
  }
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ServerNetworkEvents; }