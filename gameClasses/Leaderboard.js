var Leaderboard = IgeClass.extend({
  classId: 'Leaderboard',

  init: function () {
    var self = this;
    this.container = {};
    this.leaderboardList = [];
    this.leaderboardLength = 10;

    ige.ui.style('.leaderboardBox', {
      'right': 10,
      'width': 275,
      'backgroundColor': 'rgba(0,0,0,0.5)'
    });

    ige.ui.style('.leaderboardLabel', {
      'font': 'bold 16px Open Sans',
      'color': '#fff8c5'
    });
    
    new IgeInterval(function() {
      var redraw = false;
      newLeaderboardList = self.generateLeaderboard();

      if (newLeaderboardList.length !== self.leaderboardList.length) {
        redraw = true;
      }

      for (var i = 0; i < self.leaderboardList.length; i++) {
        if (!_.isEqual(self.leaderboardList[i], newLeaderboardList[i])) {
          redraw = true;
        }
      }

      self.leaderboardList = newLeaderboardList;


      if (redraw) {
        self.draw();
      }

    }, config.tickRate);
  },

  generateLeaderboard: function () {
    var leaderboardList = [];
    Object.keys(ige.client.players).map(function (key) {
      leaderboardList.push({
        username: ige.client.players[key].username,
        killCount: ige.client.players[key].killCount
      });
    });

    leaderboardList.sort(function (a, b) {
      return b.killCount - a.killCount;
    });

    return leaderboardList;
  },

  draw: function() {
    var self = this;

    if (typeof this.container.destroy === 'function') {
      this.container.destroy();
    }

    this.container = new IgeUiElement()
      .styleClass('leaderboardBox')
      .top(5)
      .height(25 * this.leaderboardList.length + 15)
      .mount(ige.client.ui.uiScene);

    this.leaderboardList.map(function (player, index) {
      if (index < self.leaderboardLength) {
        new IgeUiLabel()
          .value(player.username)
          .styleClass('leaderboardLabel')
          .width(100)
          .left(5)
          .top(25 * index)
          .mount(self.container);

        new IgeUiLabel()
          .value(player.killCount)
          .styleClass('leaderboardLabel')
          .width(100)
          .right(5)
          .top(25 * index)
          .mount(self.container);
      }
    });
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Leaderboard; }