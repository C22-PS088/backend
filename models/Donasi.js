module.exports = (sequelize, DataTypes) => {
  const Donasi = sequelize.define('Donasi', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nama: {
      allowNull: false,
      type: DataTypes.STRING
    },
    deskripsi: {
      type: DataTypes.TEXT
    },
    gambar: {
      type: DataTypes.STRING
    },
    lokasi: {
      allowNull: false,
      type: DataTypes.STRING
    },
    kontak: {
      allowNull: false,
      type: DataTypes.STRING
    },
    website: {
      allowNull: false,
      type: DataTypes.STRING
    },
    rekening: {
      allowNull: false,
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'donasi'
  });

  Donasi.associate = models => {
    Donasi.belongsToMany(models.Satwa, {
      through: 'Satwa_donasi',
      foreignkey: 'DonasiId'
    });
  };

  return Donasi;
};
