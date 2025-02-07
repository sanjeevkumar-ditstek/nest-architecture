'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Create base table for your BaseModel with createdAt and updatedAt as BIGINT.
     */
    await queryInterface.createTable('base', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
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
     * Drop base table.
     */
    await queryInterface.dropTable('base');
  }
};
