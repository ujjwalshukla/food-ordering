'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Items', [{
        id:1,
        name: 'dish1',
        cost: 30,
        RestaurantId: 1
      }, {
        id:2,
        name: 'dish2',
        cost: 30,
        RestaurantId: 1
      }, {
        id:3,
        name: 'dish3',
        cost: 30,
        RestaurantId: 2
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
    return queryInterface.bulkDelete('Items', null, {});

  }
};
