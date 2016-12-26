if (config.env === 'production') {
  var igeRoot = './';
  var jsPath = '/assets/js/game.js'
} else {
  var igeRoot = '/ige/engine/';
  var jsPath = '/ige/engine/loader.js';
}

var scriptTag = document.createElement('script');
scriptTag.src = jsPath;
document.getElementsByTagName('body')[0].appendChild(scriptTag);