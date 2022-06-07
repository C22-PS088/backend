'use strict';

var bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash('atmin', salt);

    await queryInterface.bulkInsert('user', [{
      nama: 'Administrator',
      username: 'atmin',
      password: hashPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // await queryInterface.bulkInsert('donasi', [{
    //   nama: 'Donasi 1',
    //   deskripsi: 'Deskripsi donasi 1',
    //   logo: null,
    //   gambar: null,
    //   lokasi: 'Lokasi donasi 1',
    //   kontak: 'Kontak donasi 1',
    //   website: 'Website donasi 1',
    //   rekening: 'Rekening donasi 1',
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // }, {
    //   nama: 'Donasi 2',
    //   deskripsi: 'Deskripsi donasi 2',
    //   logo: null,
    //   gambar: null,
    //   lokasi: 'Lokasi donasi 2',
    //   kontak: 'Kontak donasi 2',
    //   website: 'Website donasi 2',
    //   rekening: 'Rekening donasi 2',
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // }]);

    // await queryInterface.bulkInsert('satwa', [{
    //   nama: 'Satwa 1',
    //   nama_saintifik: 'Satwa 1 saintifik',
    //   lokasi: 'Malang',
    //   gambar_lokasi: null,
    //   populasi: null,
    //   funfact: '',
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // },
    // {
    //   nama: 'Satwa 2',
    //   nama_saintifik: 'Satwa 2 saintifik',
    //   lokasi: 'Ngalam',
    //   gambar_lokasi: null,
    //   populasi: '49',
    //   funfact: '',
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // },
    // {
    //   nama: 'Satwa 3',
    //   nama_saintifik: 'Satwa 3 saintifik',
    //   lokasi: 'Malang',
    //   gambar_lokasi: null,
    //   populasi: '77',
    //   funfact: '',
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // }]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user');
    // await queryInterface.bulkDelete('donasi');
    // await queryInterface.bulkDelete('satwa');
  }
};
