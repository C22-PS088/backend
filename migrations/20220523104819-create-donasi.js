'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('donasi', {
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
      deskripsi: {
        type: Sequelize.TEXT
      },
      logo: {
        type: Sequelize.STRING
      },
      gambar: {
        type: Sequelize.STRING
      },
      lokasi: {
        type: Sequelize.STRING
      },
      kontak: {
        type: Sequelize.STRING
      },
      website: {
        type: Sequelize.STRING
      },
      rekening: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('donasi');
  }
};
