'use strict';
module.exports = (sequelize, DataTypes) => {
  var Order = sequelize.define('Order', {
    shared: DataTypes.BOOLEAN,
    order_status: DataTypes.BOOLEAN,
    order_owner: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // models.Order.belongsToMany(models.Item, {through: 'OrderItem', unique: false});

        // associations can be defined here
        models.Order.hasMany(models.OrderItem);
        models.Order.belongsTo(models.User, {foreignKey: 'order_owner', targetKey: 'id'});

      }
    },
    timestamps: false
  });
  return Order;
};