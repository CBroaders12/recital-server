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
	});

	User.associate = (models) => {
		User.hasMany(models.recital, {
			foreignKey: 'organizerId',
			onDelete: 'CASCADE',
		});
	};

	return User;
};
