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
    ige.client.id = data;
    
		if (ige.$(data)) {
			ige.client.ui.vp1.camera.trackTranslate(ige.$(data), 0);
		} else {
			// The client has not yet received the entity via the network
			// stream so lets ask the stream to tell us when it creates a
			// new entity and then check if that entity is the one we
			// should be tracking!
			var self = this;
			self._eventListener = ige.network.stream.on('entityCreated', function (entity) {
				if (entity.id() === data) {
					// Tell the camera to track out player entity
					ige.client.ui.vp1.camera.trackTranslate(ige.$(data), 0);

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
      method: data.method,
      killed: data.killed,
      timestamp: new Date()
    });

    if (ige.client.id === data.killedId) {
      ige.client.ui.displayLogin();
    }
    delete ige.client.players[data.killedId]
  },

  _onPlayerMove: function(data) {
    if (ige.client.players[data.id]) {
      ige.client.players[data.id].rotation = data.rotation;
      ige.client.players[data.id].moving = data.moving;
    }
  },

  _onPlayerActionStart: function (data) {
    ige.client.players[data.id].action = data.action;
  },

  _onPlayerActionEnd: function (data) {
    ige.client.players[data.id].action = '';
  }
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ClientNetworkEvents; }