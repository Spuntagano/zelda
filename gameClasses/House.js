var House = StaticEntity.extend({
  classId: 'House',

  init: function (data) {
    
    this.data = data || {};
    this.data.spritePath = './assets/textures/house.png';
    this.data.width = 128;
    this.data.height = 188;
    StaticEntity.prototype.init.call(this, data);

  },

  streamCreateData: function () {
    return this.data;
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = House; }