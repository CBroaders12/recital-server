module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(['user', 'admin']),
      allowNull: false,
      defaultValue: 'user',
    },
  });

  User.associate = (models) => {
    User.hasMany(models.recital, {
      onDelete: 'CASCADE',
    });
    User.hasMany(models.song);
  };

  return User;
};
