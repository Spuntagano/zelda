var Tree = StaticEntity.extend({
  classId: 'Tree',

  init: function (data) {

    this.data = data;
    this.data.spritePath = './assets/textures/tree.png';
    this.data.width = 128;
    this.data.height = 160;
    StaticEntity.prototype.init.call(this, data);

  },

  streamCreateData: function () {
    return this.data;
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Tree; }