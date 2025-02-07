'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Create the roles table with the necessary columns.
     */
    await queryInterface.createTable('roles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      role: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
     * Drop the roles table.
     */
    await queryInterface.dropTable('roles');
  }
};
