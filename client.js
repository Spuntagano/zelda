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

    /*
    this.gameTexture = {};
    this.gameTexture.grassSheet = new IgeCellSheet('../assets/textures/tiles/tilea2.png', 8, 4);

    this.textureMap1 = new IgeTextureMap()
      .depth(0)
      .tileWidth(40)
      .tileHeight(40)
      .gridSize(10, 10)
      .translateTo(0, 0, 0)
      .autoSection(10)
      //.translateTo(300, 300, 0)
      .mount(self.ui.mainScene);

    var texIndex = self.textureMap1.addTexture(self.gameTexture.grassSheet);

    // Generate some random data, large amounts of it
    for (var x = -30; x < 30; x++) {
      for (var y = -30; y < 30; y++) {
        var rand = Math.ceil(Math.random() * 4);
        self.textureMap1.paintTile(x, y, texIndex, rand);
      }
    }
*/
    // Load the Tiled map data and handle the return data
    ige.addComponent(IgeTiledComponent)
      .tiled.loadJson(tiledExample1 /* you can also use a url: 'maps/example.js'*/, function (layerArray, layersById) {
      // The return data from the tiled component are two arguments,
      // the first is an array of IgeTextureMap instances, each one
      // representing one of the Tiled map's layers. The ID of each
      // instance is the same as the name assigned to the Tiled
      // layer it represents. The second argument contains the same
      // instances but each instance is stored in a property that is
      // named after the layer it represents so instead of having to
      // loop the array you can simply pick the layer you want via
      // the name assigned to it like layersById['layer name']

      // We can add all our layers to our main scene by looping the
      // array or we can pick a particular layer via the layersById
      // object. Let's give an example:
      var i;

      for (i = 0; i < layerArray.length; i++) {
        // Before we mount the layer we will adjust the size of
        // the layer's tiles because Tiled calculates tile width
        // based on the line from the left-most point to the
        // right-most point of a tile whereas IGE calculates the
        // tile width as the length of one side of the tile square.
        layerArray[i]
          /*.tileWidth(100)
          .tileHeight(50)*/
          .autoSection(20)
          //.isometricMounts(false)
          .depth(0)
          .mount(self.ui.mainScene);
      }

      ige.box2d.staticsFromMap(layersById.DirtLayer);
    });

    // Ask the engine to start
    ige.start(function (success) {
      // Check if the engine started successfully
      if (success) {

        self.ui.submitBtn.on('mouseUp', function(e) {
          ige.network.stop(function(){});
          ige.network.start(config.url + ':' + config.port, function () {
            // Setup the network command listeners
            ige.network.define('playerEntity', self._onPlayerEntity); // Defined in ./gameClasses/ClientNetworkEvents.js
            ige.network.define('playerKilled', self._onPlayerKilled); // Defined in ./gameClasses/ClientNetworkEvents.js
            ige.network.define('playerControlSlash', self._onPlayerControlSlash); // Defined in ./gameClasses/ClientNetworkEvents.js
            ige.network.define('playerControlSlashOff', self._onPlayerControlSlashOff); // Defined in ./gameClasses/ClientNetworkEvents.js
            ige.network.define('playerControlShoot', self._onPlayerControlShoot); // Defined in ./gameClasses/ClientNetworkEvents.js
            ige.network.define('playerControlShootOff', self._onPlayerControlShootOff); // Defined in ./gameClasses/ClientNetworkEvents.js

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
            ige.input.mapAction('thrust', ige.input.key.up);
            ige.input.mapAction('retroThrust', ige.input.key.down);
            ige.input.mapAction('shoot', ige.input.key.space);
            ige.input.mapAction('slash', ige.input.key.q);

            var contactHandler = new ContactHandler();
            ige.box2d.contactListener(contactHandler.contactBegin(), contactHandler.contactEnd(), contactHandler.contactPreSolver());

            ige.network.send('playerEntity', self.ui.usernameTextBox.value());
            self.ui.hideLogin();

            //ige.network.debugMax(10);
            //ige.network.debug(true);
          });
        });
      }
		});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }