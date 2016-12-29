var igeClientConfig = {
	include: [
		/* Your custom game JS scripts */
		'./gameClasses/ClientNetworkEvents.js',
		'./gameClasses/Player.js',
    './gameClasses/Bullet.js',
    './gameClasses/Bomb.js',
    './gameClasses/Explosion.js',
    './gameClasses/Sword.js',
    './gameClasses/UserInterface.js',
    './gameClasses/ContactHandler.js',
    './maps/example.js',
		/* Standard game scripts */
		'./client.js',
		'./index.js'
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }