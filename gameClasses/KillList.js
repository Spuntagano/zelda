var KillList = IgeClass.extend({
  classId: 'KillList',

  init: function () {
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
            .mount(ige.client.ui.uiScene);
        } else {
          ige.client.killList.splice(index, 1)
        }
      });
    }, 30);

  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = KillList; }