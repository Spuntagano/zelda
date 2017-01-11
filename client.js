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

		this.implement(ClientNetworkEvents);
    this.players = {};
    this.ui = new UserInterface();
    this.killList = [];
    this.username = '';
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

    // Ask the engine to start
    ige.start(function (success) {
      // Check if the engine started successfully
      if (success) {

        self.ui.submitBtn.on('mouseUp', function(e) {
          ige.network.stop(function(){});
          ige.network.start(config.url + ':' + config.port, function () {
            // Setup the network command listeners
            ige.network.define('playerEntity', self._onPlayerEntity);
            ige.network.define('playerKilled', self._onPlayerKilled);
            ige.network.define('playerControl', self._onPlayerMove);
            ige.network.define('actionStart', self._onPlayerActionStart);
            ige.network.define('actionEnd', self._onPlayerActionEnd);
            ige.network.define('disconnect', self._onPlayerDisconnect);

            // Setup the network stream handler
            ige.network.addComponent(IgeStreamComponent)
              .stream.renderLatency(80) // Render the simulation 160 milliseconds in the past
            // Create a listener that will fire whenever an entity
            // is created because of the incoming stream data
              .stream.on('entityCreated', function (entity) {
              if (entity._classId === 'Player') {
                self.players[entity.id()] = entity;
              }
            });

            ige.input.mapAction('left', ige.input.key.left);
            ige.input.mapAction('right', ige.input.key.right);
            ige.input.mapAction('up', ige.input.key.up);
            ige.input.mapAction('down', ige.input.key.down);
            ige.input.mapAction('shoot', ige.input.key.space);
            ige.input.mapAction('slash', ige.input.key.q);
            ige.input.mapAction('bomb', ige.input.key.e);

            var contactHandler = new ContactHandler();
            ige.box2d.contactListener(contactHandler.contactBegin(), contactHandler.contactEnd(), contactHandler.contactPreSolver());

            ige.network.send('playerEntity', self.ui.usernameTextBox.value());
            self.username = self.ui.usernameTextBox.value();
            self.ui.hideLogin();

            new Minimap();
            new KillList();

            //ige.network.debugMax(10);
            //ige.network.debug(true);
          });
        });
      }
		});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }