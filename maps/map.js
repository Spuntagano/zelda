var grassLayer = [];
for (var i = 0; i < config.tiles.count.x; i++) {
  for (var j = 0; j < config.tiles.count.y; j++) {
    grassLayer.push(1);
  }
}

var wallLayer = [];
for (var i = 0; i < config.tiles.count.x; i++) {
  for (var j = 0; j < config.tiles.count.y; j++) {
    if (i === 0 || i === config.tiles.count.x - 1 || j === 0 || j === config.tiles.count.y -1) {
      wallLayer.push(2);
    } else {
      wallLayer.push(0);
    }
  }
}

var roadLayer = [];
for (var i = 0; i < config.tiles.count.x; i++) {
  for (var j = 0; j < config.tiles.count.y; j++) {
    if ((j === 15 || j === 16 || j === 17) && i > 7) {
      roadLayer.push(3);
    } else {
      roadLayer.push(0);
    }
  }
}

var map = {
  "height": config.tiles.count.y,
  "layers":[
    {
      "data": wallLayer,
      "height": config.tiles.count.y,
      "name":"wallLayer",
      "opacity":1,
      "type":"tilelayer",
      "visible":true,
      "width": config.tiles.count.x,
      "x":0,
      "y":0
    },
    {
      "data": roadLayer,
      "height": config.tiles.count.y,
      "name":"roadLayer",
      "opacity":1,
      "type":"tilelayer",
      "visible":true,
      "width": config.tiles.count.x,
      "x":0,
      "y":0
    },
    {
      "data": grassLayer,
      "height": config.tiles.count.y,
      "name":"grassLayer",
      "opacity":1,
      "type":"tilelayer",
      "visible":true,
      "width": config.tiles.count.x,
      "x":0,
      "y":0
    }],
  "tilesets":[
    {
      "firstgid":1,
      "image":"assets\/textures\/grass.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"grassSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },
    {
      "firstgid":2,
      "image":"assets\/textures\/block.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"treeSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },
    {
      "firstgid":3,
      "image":"assets\/textures\/road.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"roadSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    }],
  // "orientation":"isometric",
  "properties": {},
  "tileheight":config.tiles.size.y,
  "tilewidth":config.tiles.size.x,
  "version":1,
  "width": config.tiles.count.x
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = map; }