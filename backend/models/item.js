'use strict';
module.exports = (sequelize, DataTypes) => {
  var item = sequelize.define('Item', {
    name: DataTypes.STRING,
    cost: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.Item.belongsTo(models.Restaurant);
        models.Item.hasMany(models.OrderItem);
      }
    },
    timestamps: false
  });
  return item;
};