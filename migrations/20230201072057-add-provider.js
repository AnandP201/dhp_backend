'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('Users', 'iamType', {
        type: Sequelize.STRING,
        defaultValue: "localLogin"
    });
  },
  down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('Users', 'iamType');
  }
};
