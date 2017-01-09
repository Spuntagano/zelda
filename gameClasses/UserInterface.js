var UserInterface = IgeClass.extend({
  classId: 'UserInterface',

  init: function () {
    var self = this;

    ige.ui.style('#login', {
      top: '40%',
      left: '40%',
      right: '40%',
      height: 200,
      width: '20%',
      'backgroundColor': '#ffffff'
    });

    ige.ui.style('#usernameTextBox', {
      'backgroundColor': '#ffffff',
      'borderColor': '#212121',
      'borderWidth': 1,
      'right': '10%',
      'height': 30,
      'left': '10%',
      'top': 60,
      'font': '12px Open Sans',
      'color': '#000000'
    });

    ige.ui.style('#minimap', {
      bottom: 25,
      right: 25,
      height: 150,
      width: 150,
      'backgroundColor': '#000',
      opacity: 0.7
    });

    ige.ui.style('#submitBtn', {
      'right': '10%',
      'height': 30,
      'left': '10%',
      'top': 100,
      'backgroundColor': '#ccc'
    });

    self.mainScene = new IgeScene2d()
      .id('mainScene');

    self.vp1 = new IgeViewport()
      .id('vp1')
      .autoSize(true)
      .scene(self.mainScene)
      .drawBounds(false)
      .mount(ige);

    self.scene1 = new IgeScene2d()
      .id('scene1')
      .mount(self.mainScene);

    self.uiScene = new IgeScene2d()
      .id('uiScene')
      .ignoreCamera(true)
      .depth(100)
      .mount(self.mainScene);



    self.login = new IgeUiElement()
      .id('login')
      .value((ige.client) ? ige.client.username : '')
      .mount(self.uiScene);

    self.usernameTextBox = new IgeUiTextBox()
      .id('usernameTextBox')
      .value('')
      .placeHolder('Username')
      .placeHolderColor('#989898')
      .mount(self.login);

    self.submitBtn = new IgeUiButton()
      .id('submitBtn')
      .value('Submit')
      .mount(self.login);

    self.minimap = new IgeUiElement()
      .id('minimap')
      .mount(self.uiScene);

    ige.ui.style('.killBox', {
      'left': 10,
      'width': 1000,
      'font': 'bold 16px Open Sans',
      'color': '#000000'
    });

    ige.ui.style('.minimapDot', {
      'width': 5,
      'height': 5,
      'backgroundColor': '#f00'
    });

    var minimapEls = [];
    new IgeInterval(function() {
      ige.client.killList.map(function(kill, index){
        if (kill.label) {
          kill.label.destroy();
        }

        if (new Date() - 5*1000 < kill.timestamp) {
          value = kill.killer + ' ' + kill.method + ' ' + kill.killed;
          kill.label = new IgeUiLabel()
            .value(value)
            .styleClass('killBox')
            .top(5 + 25 * index)
            .mount(self.uiScene);
        } else {
          ige.client.killList.splice(index, 1)
        }
      });

      minimapEls.map(function(el) {
        el.destroy();
      });

      minimapEls = [];
      var minimapDots = [];
      Object.keys(ige.client.players).map(function(key) {
        var x = ige.client.players[key].worldPosition().x / (50 * 32) * 100;
        var y = ige.client.players[key].worldPosition().y / (50 * 32) * 100;

        minimapDots.push({
          x: x + '%',
          y: y + '%'
        });
      });

      minimapDots.map(function(position) {
        minimapEls.push(new IgeUiElement()
          .mount(self.minimap)
          .styleClass('minimapDot')
          .left(position.x)
          .top(position.y));
      });
    }, 30);

  },

  hideLogin: function() {
    this.login.unMount();
  },

  displayLogin: function() {
    this.login.mount(this.uiScene)
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = UserInterface; }