'use strict';
module.exports = (sequelize, DataTypes) => {
  var OrderItem = sequelize.define('OrderItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    quantity: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.OrderItem.belongsTo(models.User);
        models.OrderItem.belongsTo(models.Item);
        models.OrderItem.belongsTo(models.Order);
      }
    },
    timestamps: false
  });
  return OrderItem;
};