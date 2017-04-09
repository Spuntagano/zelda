var Client = IgeClass.extend({
	classId: 'Client',

	init: function () {
		var self = this;

    if (config.env !== 'production') {
      ige.addComponent(IgeEditorComponent);
    }
    ige.createFrontBuffer(true);
		ige.addComponent(IgeNetIoComponent);
    ige.addComponent(IgeBox2dComponent)
      .box2d.createWorld()
      .box2d.start();

    ige.client = this;
    
		this.implement(ClientNetworkEvents);
    this.ui = new UserInterface();
    this.api = new Api();
    
    this.api.call();
    
    this.players = {};
    this.gameEntities = {};
    this.staticEntities = {};
    this.username = '';
    this.attacks = new Attacks();
    this.shoot = new Shoot();
    this.bomb = new Bomb();
    this.slash = new Slash();
    this.fire = new Fire();

    // Load the Tiled map data and handle the return data
    ige.addComponent(IgeTiledComponent)
      .tiled.loadJson(map, function (layerArray, layersById) {
      for (var i = 0; i < layerArray.length; i++) {
        layerArray[i]
          .autoSection(20)
          .depth(0)
          .mount(self.ui.mainScene);
      }
      ige.box2d.staticsFromMap(layersById.wallLayer);
    });

    this.ui.vp1.camera.panTo(new IgePoint3d(config.initialCameraPosition.x, config.initialCameraPosition.y, 0), 0);
    if (config.showHitbox) {
      ige.box2d.enableDebug(self.ui.scene1);
    }

    new StaticEntities();
    self.leaderboard = new Leaderboard();
    self.cooldown = new Cooldown();

    new Minimap();
    self.killList = new KillList();

    // Ask the engine to start
    ige.start(function (success) {
      // Check if the engine started successfully
      if (success) {

        document.getElementById('login').onsubmit = function(e) {
          e.preventDefault();

          if (ige.network._io) {
            ige.network._io.disconnect('Client requested disconnect');
          }
          ige.network._state = 0;
          ige.network._initDone = false;
          new IgeTimeout(function() {
            self.connect(e);
          }, 0);
        }
      }
		});
	},

  connect: function(e) {
    var self = this;

    ige.network.start(config.servers[e.target.server.value].server.url + ':' + config.servers[e.target.server.value].server.port, function () {

      Object.keys(self.players).map(function(key) {
        self.players[key].destroy();
        delete self.players[key];
      });

      Object.keys(self.gameEntities).map(function(key) {
        self.gameEntities[key].destroy();
        delete self.gameEntities[key];
      });

      Object.keys(self.staticEntities).map(function(key) {
        self.staticEntities[key].destroy();
        delete self.staticEntities[key];
      });
      
      // Setup the network command listeners
      ige.network.define('playerEntity', self._onPlayerEntity);
      ige.network.define('playerPosition', self._onPlayerPosition);
      ige.network.define('playerKilled', self._onPlayerKilled);
      ige.network.define('playerControl', self._onPlayerMove);
      ige.network.define('actionStart', self._onPlayerActionStart);
      ige.network.define('actionEnd', self._onPlayerActionEnd);
      ige.network.define('disconnect', self._onPlayerDisconnect);
      ige.network.define('playersInfos', self._playersInfos);

      // Setup the network stream handler
      ige.network.addComponent(IgeStreamComponent)
        .stream.renderLatency(config.renderLatency) // Render the simulation 160 milliseconds in the past
      // Create a listener that will fire whenever an entity
      // is created because of the incoming stream data
        .stream.on('entityCreated', function (entity) {
        if (entity._category === 'Player') {
          self.players[entity.id()] = entity;
        }

        if (entity._category === 'GameEntity') {
          self.gameEntities[entity.id()] = entity;
        }

        if (entity._category === 'StaticEntity') {
          self.staticEntities[entity.id()] = entity;
        }
      });

      ige.input.mapAction('left', ige.input.key.left);
      ige.input.mapAction('right', ige.input.key.right);
      ige.input.mapAction('up', ige.input.key.up);
      ige.input.mapAction('down', ige.input.key.down);
      ige.input.mapAction('shoot', ige.input.key.space);
      ige.input.mapAction('slash', ige.input.key.q);
      ige.input.mapAction('bomb', ige.input.key.w);
      ige.input.mapAction('fire', ige.input.key.e);
      ige.input.mapAction('upgradeSlash', ige.input.key[1]);
      ige.input.mapAction('upgradeShoot', ige.input.key[2]);
      ige.input.mapAction('upgradeBomb', ige.input.key[3]);
      ige.input.mapAction('upgradeFire', ige.input.key[4]);

      var contactHandler = new ContactHandler();
      ige.box2d.contactListener(contactHandler.contactBegin(), contactHandler.contactEnd(), contactHandler.contactPreSolver());

      e.target.style.display = 'none';
      ige.network.send('playerEntity', { username: e.target.username.value, skin: e.target.skin.value });
    });
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }