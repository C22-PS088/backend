module.exports = (sequelize, DataTypes) => {
  const Satwa = sequelize.define('Satwa', {
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
    nama_saintifik: {
      type: DataTypes.STRING
    },
    lokasi: {
      type: DataTypes.STRING
    },
    gambar_lokasi: {
      type: DataTypes.STRING
    },
    populasi: {
      type: DataTypes.STRING
    },
    funfact: {
      type: DataTypes.TEXT
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'satwa'
  });

  Satwa.associate = models => {
    Satwa.hasMany(models.Satwa_gambar, {
      foreignKey: 'SatwaId'
    });
    Satwa.belongsToMany(models.Donasi, {
      through: 'Satwa_donasi',
      foreignKey: 'SatwaId'
    });
  };

  return Satwa;
};
