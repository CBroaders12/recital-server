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

	Recital.associate = (models) => {
		Recital.belongsToMany(models.song, {
			through: models.recital_song,
		});
	};

	return Recital;
};
