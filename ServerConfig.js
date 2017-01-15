var config = {
	include: [
    {name: 'config', path: './assets/js/config'},
		{name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents'},
    {name: 'ContactHandler', path: './gameClasses/ContactHandler'},
    {name: 'GameEntityCreator', path: './gameClasses/GameEntityCreator'},
    {name: 'StaticEntities', path: './gameClasses/StaticEntities'},
    {name: 'PlayerKilledHandler', path: './gameClasses/PlayerKilledHandler'},
    {name: 'GameEntity', path: './gameClasses/GameEntity'},
    {name: 'StaticEntity', path: './gameClasses/StaticEntity'},
    {name: 'StaticEntities', path: './gameClasses/StaticEntities'},
		{name: 'Player', path: './gameClasses/Player'},
    {name: 'Sword', path: './gameClasses/Sword'},
    {name: 'Bullet', path: './gameClasses/Bullet'},
    {name: 'Bomb', path: './gameClasses/Bomb'},
    {name: 'Explosion', path: './gameClasses/Explosion'},
    {name: 'Tree', path: './gameClasses/Tree'},
    {name: 'House', path: './gameClasses/House'},
    {name: 'map', path: './maps/map'}
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }