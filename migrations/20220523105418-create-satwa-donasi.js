'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('satwa_donasi', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      SatwaId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'satwa',
          key: 'id'
        }
      },
      DonasiId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'donasi',
          key: 'id'
        }
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('satwa_donasi');
  }
};
