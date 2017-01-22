var KillList = IgeClass.extend({
  classId: 'KillList',

  init: function () {
    var killMessageDisplayLength = 5*1000;
    
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
      ige.client.killList.map(function(kill, index){
        if (kill.label) {
          kill.label.destroy();
        }

        if (new Date() - killMessageDisplayLength < kill.timestamp) {
          kill.label = new IgeUiElement()
            .styleClass('killBox')
            .top(5 + 45 * index)
            .mount(ige.client.ui.uiScene);

          new IgeUiLabel()
            .value(kill.killer)
            .styleClass('killLabel')
            .width(100)
            .left(5)
            .mount(kill.label);

          new IgeUiElement()
            .width(32)
            .height(32)
            .left(115)
            .mount(kill.label)
            .backgroundImage(new IgeTexture(kill.icon));

          new IgeUiLabel()
            .value(kill.killed)
            .styleClass('killLabel')
            .width(100)
            .right(5)
            .mount(kill.label);

        } else {
          ige.client.killList.splice(index, 1)
        }
      });
    }, config.tickRate);

  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = KillList; }