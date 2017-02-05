var Api = IgeClass.extend({
  classId: 'Api',

  init: function() {
    var self = this;
  },

  /* CEXCLUDE */
  start: function() {
    var http = require('http');
    var server = http.createServer(function (request, response) {
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.setHeader('Access-Control-Request-Method', '*');
      response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
      response.setHeader('Access-Control-Allow-Headers', '*');
      response.setHeader('Content-Type', 'application/json');
      response.writeHead(200);
      if ( request.method === 'OPTIONS' ) {
        response.end();
        return;
      }
      response.end(JSON.stringify({players: Object.keys(ige.server.players).length}));
    });

    server.listen(8000);
  },
  /* CEXCLUDE */
  
  call: function() {
    var serverTag = document.getElementById('server');

    while (serverTag.hasChildNodes()) {
      serverTag.removeChild(serverTag.lastChild);
    }

    config.servers.map(function(server, index) {
      var apiRequest = new Request(server.api.url + ':' + server.api.port);

      var optionTag = document.createElement("option");
      var optionTagName = document.createTextNode(server.name);

      optionTag.setAttribute('value', index);
      optionTag.appendChild(optionTagName);
      serverTag.appendChild(optionTag);

      fetch(apiRequest)
        .then(function(response) {
          return response.json()
        }).then(function(response) {
        serverTag.getElementsByTagName('option')[index].text += ' (' + response.players + ' Connected)';
      }).catch(function() {
        serverTag.getElementsByTagName('option')[index].setAttribute('disabled', 'disabled');
      })
    });
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Api; }