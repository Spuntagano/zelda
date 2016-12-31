var config = {
	include: [
		{name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents'},
    {name: 'ContactHandler', path: './gameClasses/ContactHandler'},
    {name: 'GameEntityCreator', path: './gameClasses/GameEntityCreator'},
    {name: 'PlayerKilledHandler', path: './gameClasses/PlayerKilledHandler'},
    {name: 'GameEntity', path: './gameClasses/GameEntity'},
		{name: 'Player', path: './gameClasses/Player'},
    {name: 'Sword', path: './gameClasses/Sword'},
    {name: 'Bullet', path: './gameClasses/Bullet'},
    {name: 'Bomb', path: './gameClasses/Bomb'},
    {name: 'Explosion', path: './gameClasses/Explosion'},
    {name: 'tiledExample1', path: './maps/example'}
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }