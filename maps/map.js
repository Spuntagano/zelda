var grassLayer = [];
for (var i = 0; i < config.tiles.count.x; i++) {
  for (var j = 0; j < config.tiles.count.y; j++) {
    grassLayer.push(1);
  }
}

var edgeLayer = [];
for (var i = 0; i < config.tiles.count.x; i++) {
  for (var j = 0; j < config.tiles.count.y; j++) {

    if (i > 1 && j > 1 && i < config.tiles.count.x - 2 && j < config.tiles.count.y - 2) {
      if (i === config.tiles.count.x - 3 && j === config.tiles.count.y - 3) {
        edgeLayer.push(14);
      } else if (i === config.tiles.count.x - 3 && j === 2) {
        edgeLayer.push(15);
      } else if (i === 2 && j === 2) {
        edgeLayer.push(16);
      } else if (i === 2 && j === config.tiles.count.y - 3) {
        edgeLayer.push(17);
      } else if (i === 2) {
        edgeLayer.push(7);
      } else if (i === config.tiles.count.x - 3) {
        edgeLayer.push(9);
      } else if (j === 2) {
        edgeLayer.push(6);
      } else if (j === config.tiles.count.y - 3) {
        edgeLayer.push(8);
      } else {
        edgeLayer.push(0);
      }
    } else {
      edgeLayer.push(0);
    }
  }
}

var wallLayer = [];
for (var i = 0; i < config.tiles.count.x; i++) {
  for (var j = 0; j < config.tiles.count.y; j++) {
    if (i > 0 && j > 0 && i < config.tiles.count.x - 1 && j < config.tiles.count.y - 1) {
      if (i === config.tiles.count.x - 2 && j === config.tiles.count.y - 2) {
        wallLayer.push(18);
      } else if (i === config.tiles.count.x - 2 && j === 1) {
        wallLayer.push(19);
      } else if (i === 1 && j === 1) {
        wallLayer.push(20);
      } else if (i === 1 && j === config.tiles.count.y - 2) {
        wallLayer.push(21);
      } else if (i === 1) {
        wallLayer.push(3);
      } else if (i === config.tiles.count.x - 2) {
        wallLayer.push(5);
      } else if (j === 1) {
        wallLayer.push(2);
      } else if (j === config.tiles.count.y - 2) {
        wallLayer.push(4);
      } else {
        wallLayer.push(0);
      }
    } else {
      wallLayer.push(0);
    }
  }
}

var waterEdgeLayer = [];
for (var i = 0; i < config.tiles.count.x; i++) {
  for (var j = 0; j < config.tiles.count.y; j++) {
    if (i === config.tiles.count.x - 1 && j === config.tiles.count.y - 1) {
      waterEdgeLayer.push(22);
    } else if (i === config.tiles.count.x - 1 && j === 0) {
      waterEdgeLayer.push(23);
    } else if (i === 0 && j === 0) {
      waterEdgeLayer.push(24);
    } else if (i === 0 && j === config.tiles.count.y - 1) {
      waterEdgeLayer.push(25);
    } else if (i === 0) {
      waterEdgeLayer.push(11);
    } else if (i === config.tiles.count.x - 1) {
      waterEdgeLayer.push(13);
    } else if (j === 0) {
      waterEdgeLayer.push(10);
    } else if (j === config.tiles.count.y - 1) {
      waterEdgeLayer.push(12);
    } else {
      waterEdgeLayer.push(0);
    }
  }
}

var map = {
  "height": config.tiles.count.y,
  "layers":[
    {
      "data": edgeLayer,
      "height": config.tiles.count.y,
      "name":"edgeLayer",
      "opacity":1,
      "type":"tilelayer",
      "visible":true,
      "width": config.tiles.count.x,
      "x":0,
      "y":0
    },
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
      "data": waterEdgeLayer,
      "height": config.tiles.count.y,
      "name":"waterEdgeLayer",
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
      "image":"assets\/textures\/cliff-left.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"cliffLeftSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },
    {
      "firstgid":3,
      "image":"assets\/textures\/cliff-up.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"cliffUpSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },
    {
      "firstgid":4,
      "image":"assets\/textures\/cliff-right.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"cliffRightSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },
    {
      "firstgid":5,
      "image":"assets\/textures\/cliff-down.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"cliffDownSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },

    {
      "firstgid":6,
      "image":"assets\/textures\/edge-left.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"edgeLeftSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },
    {
      "firstgid":7,
      "image":"assets\/textures\/edge-up.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"edgeUpSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },
    {
      "firstgid":8,
      "image":"assets\/textures\/edge-right.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"edgeRightSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },
    {
      "firstgid":9,
      "image":"assets\/textures\/edge-down.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"edgeDownSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },

    {
      "firstgid":10,
      "image":"assets\/textures\/water-edge-left.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"waterEdgeLeftSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },
    {
      "firstgid":11,
      "image":"assets\/textures\/water-edge-up.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"waterEdgeUpSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },
    {
      "firstgid":12,
      "image":"assets\/textures\/water-edge-right.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"waterEdgeRightSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },
    {
      "firstgid":13,
      "image":"assets\/textures\/water-edge-down.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"waterEdgeDownSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },

    {
      "firstgid":14,
      "image":"assets\/textures\/edge-bottom-right.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"edgeBottomRightSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },
    {
      "firstgid":15,
      "image":"assets\/textures\/edge-bottom-left.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"edgeBottomLeftSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },
    {
      "firstgid":16,
      "image":"assets\/textures\/edge-top-left.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"edgeTopLeftSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },
    {
      "firstgid":17,
      "image":"assets\/textures\/edge-top-right.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"edgeTopRightSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },

    {
      "firstgid":18,
      "image":"assets\/textures\/cliff-bottom-right.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"cliffBottomRightSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },
    {
      "firstgid":19,
      "image":"assets\/textures\/cliff-bottom-left.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"cliffBottomLeftSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },
    {
      "firstgid":20,
      "image":"assets\/textures\/cliff-top-left.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"cliffTopLeftSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },
    {
      "firstgid":21,
      "image":"assets\/textures\/cliff-top-right.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"cliffTopRightSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },

    {
      "firstgid":22,
      "image":"assets\/textures\/water-edge-bottom-right.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"waterEdgeBottomRightSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },
    {
      "firstgid":23,
      "image":"assets\/textures\/water-edge-bottom-left.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"waterEdgeBottomLeftSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },
    {
      "firstgid":24,
      "image":"assets\/textures\/water-edge-top-left.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"waterEdgeTopLeftSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },
    {
      "firstgid":25,
      "image":"assets\/textures\/water-edge-top-right.png",
      "imageheight":config.tiles.size.y,
      "imagewidth":config.tiles.size.x,
      "margin":0,
      "name":"waterEdgeTopRightSheet",
      "properties": {},
      "spacing":0,
      "tileheight":config.tiles.size.y,
      "tilewidth":config.tiles.size.x
    },

  ],
  // "orientation":"isometric",
  "properties": {},
  "tileheight":config.tiles.size.y,
  "tilewidth":config.tiles.size.x,
  "version":1,
  "width": config.tiles.count.x
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = map; }