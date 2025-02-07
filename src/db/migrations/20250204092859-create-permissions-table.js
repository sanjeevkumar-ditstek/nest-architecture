'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Create permissions table with the necessary columns.
     */
    await queryInterface.createTable('permissions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      module: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.BIGINT,
        allowNull: true,
        defaultValue: () => new Date().getTime(),
      },
      updatedAt: {
        type: Sequelize.BIGINT,
        allowNull: true,
        defaultValue: () => new Date().getTime(),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Drop permissions table.
     */
    await queryInterface.dropTable('permissions');
  }
};
