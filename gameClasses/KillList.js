var KillList = IgeClass.extend({
  classId: 'KillList',

  init: function () {
    var killMessageDisplayLength = 5*1000;
    
    
    ige.ui.style('.killBox', {
      'left': 10,
      'width': 1000,
      'font': 'bold 16px Open Sans',
      'color': '#000000'
    });
    
    new IgeInterval(function() {
      ige.client.killList.map(function(kill, index){
        if (kill.label) {
          kill.label.destroy();
        }

        if (new Date() - killMessageDisplayLength < kill.timestamp) {
          value = kill.killer + ' ' + kill.method + ' ' + kill.killed;
          kill.label = new IgeUiLabel()
            .value(value)
            .styleClass('killBox')
            .top(5 + 25 * index)
            .mount(ige.client.ui.uiScene);
        } else {
          ige.client.killList.splice(index, 1)
        }
      });
    }, config.tickRate);

  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = KillList; }