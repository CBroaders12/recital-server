module.exports = (sequelize, DataTypes) => {
	const Recital = sequelize.define('recital', {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		date: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		location: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	});

	return Recital;
};
