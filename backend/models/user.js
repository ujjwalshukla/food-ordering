'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'id'
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    }

  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.User.hasMany(models.Order, {foreignKey: 'order_owner', sourceKey: 'id'});
        models.User.hasMany(models.OrderItem);

      }
    },
    timestamps: false
  });
  return User;
};