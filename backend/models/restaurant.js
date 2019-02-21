'use strict';
module.exports = (sequelize, DataTypes) => {
  var Restaurant = sequelize.define('Restaurant', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.Restaurant.hasMany(models.Item);
      }
    },
    timestamps: false
  });
  return Restaurant;
};