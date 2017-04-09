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
    this.gameEntities = {};
    this.staticEntities = {};
		this.implement(ServerNetworkEvents);
    this.gameEntityCreator = new GameEntityCreator();
    this.attacks = new Attacks();
    this.shoot = new Shoot();
    this.bomb = new Bomb();
    this.slash = new Slash();
    this.fire = new Fire();
    this.cooldown = new Cooldown();
    this.playersInfos = new PlayersInfos();
    this.api = new Api();
    
    this.api.start();

		ige.addComponent(IgeNetIoComponent)
			.network.start(2000, function () {
				ige.start(function (success) {
					if (success) {
						ige.network.define('playerEntity', self._onPlayerEntity);
            ige.network.define('playerPosition', self._onPlayerPosition);
            ige.network.define('playerKilled', self._onPlayerKilled); 
            ige.network.define('playerDestroyed');

						ige.network.define('playerControl', self._onPlayerMove);
            ige.network.define('attack', self._onPlayerAttack);
            ige.network.define('upgrade', self._onPlayerUpgrade);

            ige.network.define('actionStart');
            ige.network.define('actionEnd');
            ige.network.define('disconnect');
            ige.network.define('playersInfos');

            ige.network.on('connect', self._onPlayerConnect);
						ige.network.on('disconnect', self._onPlayerDisconnect); 

						ige.network.addComponent(IgeStreamComponent)
							.stream.sendInterval(config.tickRate) // Send a stream update once every 30 milliseconds
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
            self.playerRemoveHandler = new PlayerRemoveHandler();

						self.vp1 = new IgeViewport()
							.id('vp1')
							.autoSize(true)
							.scene(self.mainScene)
							.drawBounds(true)
							.mount(ige);

            new StaticEntities();
            new PositionHandler();
            self.attacks = new Attacks();
					}
				});
			});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Server; }