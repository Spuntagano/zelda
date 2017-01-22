var Leaderboard = IgeClass.extend({
  classId: 'Leaderboard',

  init: function () {

    if (ige.isClient) {
      ige.ui.style('.leaderboardBox', {
        'right': 10,
        'width': 275,
        'backgroundColor': 'rgba(0,0,0,0.5)'
      });

      ige.ui.style('.leaderboardLabel', {
        'font': 'bold 16px Open Sans',
        'color': '#fff8c5'
      });
    }
  },

  generateLeaderboard: function () {

    Object.keys(ige.server.players).sort(function (a, b) {
      return ige.server.players[a].killCount - ige.server.players[b].killCount;
    });

    var leaderboardList = [];
    ige.server.leaderboardList = [];
    Object.keys(ige.server.players).map(function (key) {
      leaderboardList.push({
        username: ige.server.players[key].username,
        killCount: ige.server.players[key].killCount
      });
    });

    leaderboardList.sort(function (a, b) {
      return b.killCount - a.killCount;
    });

    for (var i = 0; i < 10; i++) {
      if (leaderboardList[i]) {
        ige.server.leaderboardList.push(leaderboardList[i]);
      }
    }

    return ige.server.leaderboardList;
  },

  displayLeaderboard: function() {
    if (ige.client.bob) {
      ige.client.bob.destroy();
    }

    ige.client.bob = new IgeUiElement()
      .styleClass('leaderboardBox')
      .top(5)
      .height(25 * ige.client.leaderboardList.length + 15)
      .mount(ige.client.ui.uiScene);

    ige.client.leaderboardList.map(function(player, index) {

      new IgeUiLabel()
        .value(player.username)
        .styleClass('leaderboardLabel')
        .width(100)
        .left(5)
        .top(25 * index)
        .mount(ige.client.bob);

      new IgeUiLabel()
        .value(player.killCount)
        .styleClass('leaderboardLabel')
        .width(100)
        .right(5)
        .top(25 * index)
        .mount(ige.client.bob);
    });
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Leaderboard; }