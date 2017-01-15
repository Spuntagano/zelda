var igeClientConfig = {
	include: [
		/* Your custom game JS scripts */
		'./gameClasses/ClientNetworkEvents.js',
    './gameClasses/GameEntity.js',
    './gameClasses/StaticEntity.js',
    './gameClasses/GameEntityCreator.js',
		'./gameClasses/Player.js',
    './gameClasses/Bullet.js',
    './gameClasses/Bomb.js',
    './gameClasses/Explosion.js',
    './gameClasses/Tree.js',
    './gameClasses/House.js',
    './gameClasses/Sword.js',
    './gameClasses/UserInterface.js',
    './gameClasses/ContactHandler.js',
    './gameClasses/Minimap.js',
    './gameClasses/KillList.js',
    './maps/map.js',
		/* Standard game scripts */
		'./client.js',
		'./index.js'
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }