var MAP_HEIGHT = 50;
var MAP_WIDTH = 50;

var grassLayer = [];
for (var i = 0; i < MAP_WIDTH; i++) {
  for (var j = 0; j < MAP_HEIGHT; j++) {
    grassLayer.push(1);
  }
}

var wallLayer = [];
for (var i = 0; i < MAP_WIDTH; i++) {
  for (var j = 0; j < MAP_HEIGHT; j++) {
    if (i === 0 || i === MAP_WIDTH - 1 || j === 0 || j === MAP_HEIGHT -1) {
      wallLayer.push(2);
    } else {
      wallLayer.push(0);
    }
  }
}

var roadLayer = [];
for (var i = 0; i < MAP_WIDTH; i++) {
  for (var j = 0; j < MAP_HEIGHT; j++) {
    if ((j === 15 || j === 16 || j === 17) && i > 7) {
      roadLayer.push(3);
    } else {
      roadLayer.push(0);
    }
  }
}

var map = {
  "height": MAP_HEIGHT,
  "layers":[
    {
      "data": wallLayer,
      "height": MAP_HEIGHT,
      "name":"wallLayer",
      "opacity":1,
      "type":"tilelayer",
      "visible":true,
      "width": MAP_WIDTH,
      "x":0,
      "y":0
    },
    {
      "data": roadLayer,
      "height": MAP_HEIGHT,
      "name":"roadLayer",
      "opacity":1,
      "type":"tilelayer",
      "visible":true,
      "width": MAP_WIDTH,
      "x":0,
      "y":0
    },
    {
      "data": grassLayer,
      "height": MAP_HEIGHT,
      "name":"grassLayer",
      "opacity":1,
      "type":"tilelayer",
      "visible":true,
      "width": MAP_WIDTH,
      "x":0,
      "y":0
    }],
  "tilesets":[
    {
      "firstgid":1,
      "image":"assets\/textures\/grass.png",
      "imageheight":32,
      "imagewidth":32,
      "margin":0,
      "name":"grassSheet",
      "properties": {},
      "spacing":0,
      "tileheight":32,
      "tilewidth":32
    },
    {
      "firstgid":2,
      "image":"assets\/textures\/block.png",
      "imageheight":32,
      "imagewidth":32,
      "margin":0,
      "name":"treeSheet",
      "properties": {},
      "spacing":0,
      "tileheight":32,
      "tilewidth":32
    },
    {
      "firstgid":3,
      "image":"assets\/textures\/road.png",
      "imageheight":32,
      "imagewidth":32,
      "margin":0,
      "name":"roadSheet",
      "properties": {},
      "spacing":0,
      "tileheight":32,
      "tilewidth":32
    }],
  // "orientation":"isometric",
  "properties": {},
  "tileheight":32,
  "tilewidth":32,
  "version":1,
  "width": MAP_WIDTH
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = map; }