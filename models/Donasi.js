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
    logo: {
      type: DataTypes.STRING
    },
    gambar: {
      type: DataTypes.STRING
    },
    lokasi: {
      type: DataTypes.STRING
    },
    kontak: {
      type: DataTypes.STRING
    },
    website: {
      type: DataTypes.STRING
    },
    rekening: {
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
    Donasi.hasMany(models.Transaksi, {
      foreignKey: 'DonasiId'
    });
  };

  return Donasi;
};
