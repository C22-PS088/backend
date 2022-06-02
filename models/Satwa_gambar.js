module.exports = (sequelize, DataTypes) => {
  const Satwa_gambar = sequelize.define('Satwa_gambar', {
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
    gambar: {
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
    tableName: 'satwa_gambar'
  });

  Satwa_gambar.associate = models => {
    Satwa_gambar.belongsTo(models.Satwa, {
      foreignKey: {
        name: 'SatwaId',
        type: DataTypes.INTEGER,
      }
    });
  };

  return Satwa_gambar;
};
