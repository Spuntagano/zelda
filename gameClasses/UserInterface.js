var UserInterface = IgeClass.extend({
  classId: 'UserInterface',

  init: function () {
    var self = this;

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

  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = UserInterface; }