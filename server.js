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
      .tiled.loadJson(map, function (layerArray, layersById) {

      ige.box2d.staticsFromMap(layersById.wallLayer);
    });

		this.players = {};
		this.implement(ServerNetworkEvents);
    this.gameEntityCreator = new GameEntityCreator();

		ige.addComponent(IgeNetIoComponent)
			.network.start(2000, function () {
				ige.start(function (success) {
					if (success) {
						ige.network.define('playerEntity', self._onPlayerEntity);
            ige.network.define('playerKilled', self._onPlayerKilled); 
            ige.network.define('playerDestroyed');

						ige.network.define('playerControl', self._onPlayerMove);
            ige.network.define('shoot', self._onPlayerShoot);
            ige.network.define('slash', self._onPlayerSlash);
            ige.network.define('bomb', self._onPlayerBomb);

            ige.network.define('actionStart');
            ige.network.define('actionEnd');

						ige.network.on('connect', self._onPlayerConnect);
						ige.network.on('disconnect', self._onPlayerDisconnect); 

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

            new Tree({position: {x: 10*32, y: 15*32, z: 0}})
              .streamMode(1)
              .mount(ige.server.scene1);

            new Tree({position: {x: 22.5*32, y: 15*32, z: 0}})
              .streamMode(1)
              .mount(ige.server.scene1);

            new Tree({position: {x: 10*32, y: 25*32, z: 0}})
              .streamMode(1)
              .mount(ige.server.scene1);

            new Tree({position: {x: 22.5*32, y: 25*32, z: 0}})
              .streamMode(1)
              .mount(ige.server.scene1);

            new Tree({position: {x: 10*32, y: 35*32, z: 0}})
              .streamMode(1)
              .mount(ige.server.scene1);

            new Tree({position: {x: 22.5*32, y: 35*32, z: 0}})
              .streamMode(1)
              .mount(ige.server.scene1);

            new Tree({position: {x: 10*32, y: 45*32, z: 0}})
              .streamMode(1)
              .mount(ige.server.scene1);

            new Tree({position: {x: 22.5*32, y: 45*32, z: 0}})
              .streamMode(1)
              .mount(ige.server.scene1);

            new House({position: {x: 16.5*32, y: 7*32, z: 0}})
              .streamMode(1)
              .mount(ige.server.scene1);
					}
				});
			});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Server; }