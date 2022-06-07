'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('satwa', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama: {
        allowNull: false,
        type: Sequelize.STRING
      },
      nama_saintifik: {
        type: Sequelize.STRING
      },
      lokasi: {
        type: Sequelize.STRING
      },
      gambar_lokasi: {
        type: Sequelize.STRING
      },
      populasi: {
        type: Sequelize.STRING
      },
      funfact: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('satwa');
  }
};
