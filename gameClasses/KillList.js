var KillList = IgeClass.extend({
  classId: 'KillList',

  init: function () {
    var self = this;

    this.killList = [];
    this.killMessageDisplayLength = 5*1000;
    this.container = {};
    this.elements = {};
    this.redraw = false;
    
    ige.ui.style('.killBox', {
      'left': 10,
      'width': 275,
      'backgroundColor': 'rgba(0,0,0,0.5)'
    });

    ige.ui.style('.killLabel', {
      'font': 'bold 16px Open Sans',
      'color': '#fff8c5'
    });
    
    new IgeInterval(function() {
      self.killList.map(function(kill, index) {
        if (!(new Date() - self.killMessageDisplayLength < kill.timestamp)) {
          self.killList.splice(index, 1);
          self.redraw = true;
        }
      });

      if (self.redraw) {
        self.draw();
        self.redraw = false;
      }

    }, config.tickRate);
  },

  draw: function() {
      var self = this;
    
      if (typeof this.container.destroy === 'function') {
        this.container.destroy();
      }
    
      this.container = new IgeUiElement()
        .top(5)
        .left(5)
        .mount(ige.client.ui.uiScene);

      this.killList.map(function(kill, index){
        self.elements[index] = new IgeUiElement()
          .styleClass('killBox')
          .top(5 + 45 * index)
          .mount(self.container);

        new IgeUiLabel()
          .value(kill.killer)
          .styleClass('killLabel')
          .width(100)
          .left(5)
          .mount(self.elements[index]);

        new IgeUiElement()
          .width(32)
          .height(32)
          .left(115)
          .mount(self.elements[index])
          .backgroundImage(new IgeTexture(kill.icon));

        new IgeUiLabel()
          .value(kill.killed)
          .styleClass('killLabel')
          .width(100)
          .right(5)
          .mount(self.elements[index]);
    });
  },

  add: function(kill) {
    this.killList.push({
      killer: ige.client.players[kill.killerId].username,
      icon: kill.icon,
      killed: ige.client.players[kill.killedId].username,
      timestamp: kill.timestamp
    });
    this.redraw = true;
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = KillList; }