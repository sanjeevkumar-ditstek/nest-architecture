'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('userRoles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      // userId
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users', // Reference to users table
          key: 'id',      // Reference to the 'id' column in users table
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      // roleId
      roleId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'roles', // Reference to roles table
          key: 'id',      // Reference to the 'id' column in roles table
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      // permissionId
      permissionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'permissions', // Reference to permissions table
          key: 'id',            // Reference to the 'id' column in permissions table
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('userRoles');
  }
};
