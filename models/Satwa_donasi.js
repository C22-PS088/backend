module.exports = (sequelize, DataTypes) => {
  const Satwa_donasi = sequelize.define('Satwa_donasi', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    SatwaId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'satwa',
        key: 'id'
      },
    },
    DonasiId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'donasi',
        key: 'id'
      },
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'satwa_donasi'
  });

  Satwa_donasi.associate = models => {
    Satwa_donasi.belongsTo(models.Satwa, {
      foreignKey: {
        name: 'SatwaId',
        type: DataTypes.INTEGER,
      }
    });
    Satwa_donasi.belongsTo(models.Donasi, {
      foreignKey: {
        name: 'DonasiId',
        type: DataTypes.INTEGER,
      }
    });
  };

  return Satwa_donasi;
};
