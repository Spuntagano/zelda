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

  _onPlayerPosition: function (data) {

    data.players.map(function(player) {
      if (ige.client.players[player.id]) {
        ige.client.players[player.id].translateTo(player.x, player.y, player.z);
        ige.client.players[player.id].rotation = player.rotation;
      }
    });

    data.gameEntities.map(function(gameEntity) {
      if (ige.client.gameEntities[gameEntity.id]) {
        ige.client.gameEntities[gameEntity.id].translateTo(gameEntity.x, gameEntity.y, gameEntity.z);
        ige.client.gameEntities[gameEntity.id].rotation = gameEntity.rotation;
      }
    });
  },

  _onPlayerDisconnect: function(data) {
    delete ige.client.players[data];
  },

  _onPlayerKilled: function (data) {
    ige.client.killList.add({
      killerId: data.killerId,
      icon: data.icon,
      killedId: data.killedId,
      timestamp: new Date()
    });

    ige.client.players[data.killerId].upgradePoints++;

    if (ige.client.id === data.killedId) {
      ige.client.api.call();
      new IgeTimeout(function() {
        document.getElementById('login').style.display = 'block';
      }, 1000);
    }

    ige.client.players[data.killedId].action = 'death';
    new IgeTimeout(function() {
      if (ige.client.players[data.killedId]) {
        ige.client.players[data.killedId].destroy();
        delete ige.client.players[data.killedId];
      }
    }, config.tickRate*2)
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

  _playersInfos: function (data) {
    Object.keys(data).map(function(key) {
      Object.keys(data[key]).map(function(keykey) {
        if (ige.client.players[key]) {
          ige.client.players[key][keykey] = data[key][keykey];
        }
      });
    });
  }
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ClientNetworkEvents; }