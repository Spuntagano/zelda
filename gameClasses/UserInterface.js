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



    ige.ui.style('.killBox', {
      'left': 10,
      'width': 1000,
      'font': 'bold 16px Open Sans',
      'color': '#000000'
    });

    new IgeInterval(function(){
      ige.client.killList.map(function(kill, index){
        if (kill.label) {
          kill.label.unMount();
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