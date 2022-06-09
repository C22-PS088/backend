module.exports = (sequelize, DataTypes) => {
  const Transaksi = sequelize.define('Transaksi', {
    id: {
      primaryKey: true,
      type: DataTypes.STRING
    },
    DonasiId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING
    },
    midtrans_response: {
      type: DataTypes.TEXT
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'transaksi'
  });

  Transaksi.associate = models => {
    Transaksi.belongsTo(models.Donasi, {
      foreignKey: {
        name: 'DonasiId',
        type: DataTypes.INTEGER,
      }
    });
  };

  return Transaksi;
};
