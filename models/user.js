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
			type: DataTypes.ENUM(['User', 'Admin']),
			allowNull: false,
			defaultValue: 'User',
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
