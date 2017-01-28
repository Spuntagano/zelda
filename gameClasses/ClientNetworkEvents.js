var ClientNetworkEvents = {
	/**
	 * Is called when a network packet with the "playerEntity" command
	 * is received by the client from the server. This is the server telling
	 * us which entity is our player entity so that we can track it with
	 * the main camera!
	 * @param data The data object that contains any data sent from the server.
	 * @private
	 */
	_onPlayerEntity: function (data) {
    ige.client.id = data.id;
    
    data.players.map(function(player) {
      if (ige.client.players[player.id]) {
        ige.client.players[player.id].translateTo(player.x, player.y, player.z);
        ige.client.players[player.id].rotation = player.rotation;
      }
    });
    
		if (ige.$(data.id)) {
			ige.client.ui.vp1.camera.trackTranslate(ige.$(data.id), 0);
		} else {
			// The client has not yet received the entity via the network
			// stream so lets ask the stream to tell us when it creates a
			// new entity and then check if that entity is the one we
			// should be tracking!
			var self = this;
			self._eventListener = ige.network.stream.on('entityCreated', function (entity) {
				if (entity.id() === data.id) {
					// Tell the camera to track out player entity
					ige.client.ui.vp1.camera.trackTranslate(ige.$(data.id), 0);

					// Turn off the listener for this event now that we
					// have found and started tracking our player entity
					ige.network.stream.off('entityCreated', self._eventListener, function (result) {
						if (!result) {
							this.log('Could not disable event listener!', 'warning');
						}
					});
				}
			});
		}
	},

  _onPlayerDisconnect: function(data) {
    delete ige.client.players[data];
  },

  _onPlayerKilled: function (data) {
    ige.client.killList.push({
      killer: data.killer,
      icon: data.icon,
      killed: data.killed,
      timestamp: new Date()
    });

    if (ige.client.id === data.killedId) {
      new IgeTimeout(function() {
        document.getElementById('login').style.display = 'block';
      }, 1000);
    }

    ige.client.players[data.killedId].action = 'death';
    delete ige.client.players[data.killedId]
  },

  _onPlayerMove: function(data) {
    if (ige.client.players[data.id]) {
      ige.client.players[data.id].rotation = data.rotation;
      ige.client.players[data.id].movement = data.movement;
      ige.client.players[data.id].moving = data.moving;
    }
  },

  _onPlayerActionStart: function (data) {
    ige.client.players[data.id].action = data.action;
    ige.client.players[data.id].cooldown[data.action] = new Date().getTime();
  },

  _onPlayerActionEnd: function (data) {
    ige.client.players[data.id].action = '';
  },

  _leaderboard: function (data) {
    ige.client.leaderboardList = data;
    ige.client.leaderboard.displayLeaderboard();
  }
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ClientNetworkEvents; }