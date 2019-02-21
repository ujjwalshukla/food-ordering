'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

    */

      return queryInterface.bulkInsert('Restaurants', [{
        id:1,
        name: 'Restaurant1',
      }, {
        id:2,
        name: 'Restaurant2',
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
          */

      return queryInterface.bulkDelete('Restaurants', null, {});
  }
};
