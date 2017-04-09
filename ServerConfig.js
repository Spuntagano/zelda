var config = {
	include: [
    {name: 'config', path: './assets/js/config'},
		{name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents'},
    {name: 'ContactHandler', path: './gameClasses/ContactHandler'},
    {name: 'GameEntityCreator', path: './gameClasses/GameEntityCreator'},
    {name: 'StaticEntities', path: './gameClasses/StaticEntities'},
    {name: 'Cooldown', path: './gameClasses/Cooldown'},
    {name: 'Api', path: './gameClasses/Api'},
    {name: 'Attacks', path: './gameClasses/Attacks'},
    {name: 'Shoot', path: './gameClasses/Shoot'},
    {name: 'Slash', path: './gameClasses/Slash'},
    {name: 'Bomb', path: './gameClasses/Bomb'},
    {name: 'Fire', path: './gameClasses/Fire'},
    {name: 'PlayerKilledHandler', path: './gameClasses/PlayerKilledHandler'},
    {name: 'PlayerRemoveHandler', path: './gameClasses/PlayerRemoveHandler'},
    {name: 'PlayersInfos', path: './gameClasses/PlayersInfos'},
    {name: 'PositionHandler', path: './gameClasses/PositionHandler'},
    {name: 'GameEntity', path: './gameClasses/GameEntity'},
    {name: 'StaticEntity', path: './gameClasses/StaticEntity'},
    {name: 'StaticEntities', path: './gameClasses/StaticEntities'},
		{name: 'Corpse', path: './gameClasses/Corpse'},
    {name: 'Player', path: './gameClasses/Player'},
    {name: 'Sword', path: './gameClasses/Sword'},
    {name: 'Bullet', path: './gameClasses/Bullet'},
    {name: 'Flame', path: './gameClasses/Flame'},
    {name: 'Explosive', path: './gameClasses/Explosive'},
    {name: 'Explosion', path: './gameClasses/Explosion'},
    {name: 'Tree', path: './gameClasses/Tree'},
    {name: 'House', path: './gameClasses/House'},
    {name: 'map', path: './maps/map'}
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }