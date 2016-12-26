var Server = IgeClass.extend({
	classId: 'Server',
	Server: true,

	init: function (options) {
		var self = this;

    ige.addComponent(IgeBox2dComponent)
      .box2d.createWorld()
      .box2d.start();

    // Load the Tiled map data and handle the return data
    ige.addComponent(IgeTiledComponent)
      .tiled.loadJson(tiledExample1, function (layerArray, layersById) {

      // Create static box2d objects from the dirt layer
      ige.box2d.staticsFromMap(layersById.DirtLayer);
    });

		this.players = {};
		this.implement(ServerNetworkEvents);

		ige.addComponent(IgeNetIoComponent)
			.network.start(2000, function () {
				ige.start(function (success) {
					if (success) {
						ige.network.define('playerEntity', self._onPlayerEntity);
            ige.network.define('playerKilled', self._onPlayerKilled); // Defined in ./gameClasses/ClientNetworkEvents.js
            ige.network.define('playerDestroyed', self._onPlayerDestroyed); // Defined in ./gameClasses/ClientNetworkEvents.js

						ige.network.define('playerControlLeftDown', self._onPlayerLeftDown);
						ige.network.define('playerControlRightDown', self._onPlayerRightDown);
						ige.network.define('playerControlThrustDown', self._onPlayerThrustDown);
            ige.network.define('playerControlRetroThrustDown', self._onPlayerRetroThrustDown);
            ige.network.define('playerControlShoot', self._onPlayerShoot);
            ige.network.define('playerControlShootOff', self._onPlayerShootOff);

						ige.network.define('playerControlLeftUp', self._onPlayerLeftUp);
						ige.network.define('playerControlRightUp', self._onPlayerRightUp);
						ige.network.define('playerControlThrustUp', self._onPlayerThrustUp);
            ige.network.define('playerControlRetroThrustUp', self._onPlayerRetroThrustUp);
            ige.network.define('playerControlSlash', self._onPlayerSlash);
            ige.network.define('playerControlSlashOff', self._onPlayerSlashOff);

						ige.network.on('connect', self._onPlayerConnect); // Defined in ./gameClasses/ServerNetworkEvents.js
						ige.network.on('disconnect', self._onPlayerDisconnect); // Defined in ./gameClasses/ServerNetworkEvents.js

						ige.network.addComponent(IgeStreamComponent)
							.stream.sendInterval(30) // Send a stream update once every 30 milliseconds
							.stream.start(); // Start the stream

						ige.network.acceptConnections(true);

						self.mainScene = new IgeScene2d()
							.id('mainScene');

						self.scene1 = new IgeScene2d()
							.id('scene1')
							.mount(self.mainScene);

            var contactHandler = new ContactHandler();
            ige.box2d.contactListener(contactHandler.contactBegin(), contactHandler.contactEnd(), contactHandler.contactPreSolver());

            self.playerKilledHandler = new PlayerKilledHandler();

						self.vp1 = new IgeViewport()
							.id('vp1')
							.autoSize(true)
							.scene(self.mainScene)
							.drawBounds(true)
							.mount(ige);
					}
				});
			});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Server; }