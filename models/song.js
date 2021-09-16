module.exports = (sequelize, DataTypes) => {
  const Song = sequelize.define(
    'song',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      composer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      language: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      period: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      underscored: true,
    }
  );

  Song.associate = (models) => {
    Song.belongsToMany(models.recital, { through: models.recital_song });
    Song.belongsTo(models.user);
  };

  return Song;
};
