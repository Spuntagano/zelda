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

    ige.ui.style('#killBoxContainer', {
      'backgroundColor': '#ffffff',
      'borderColor': '#212121',
      'borderWidth': 1,
      'right': 0,
      'top': 0,
      'width': '30%',
      'height': 30,
      'font': '12px Open S    ans',
      'color': '#000000'
    });

    ige.ui.style('#killBox', {
      'left': '10%',
      'right': '10%'
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
      .mount(self.uiScene);

    self.killBoxContainer = new IgeUiElement()
      .id('killBoxContainer')
      .mount(self.uiScene);

    self.killBox = new IgeUiLabel()
      .id('killBox')
      .mount(self.killBoxContainer);



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

  },

  hideLogin: function() {
    this.login.unMount();
  },

  displayLogin: function() {
    this.login.mount(this.uiScene)
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = UserInterface; }