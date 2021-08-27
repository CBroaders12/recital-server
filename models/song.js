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
			author: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			language: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			composition_year: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			original_key: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			catalogue_number: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			period: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			from: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{ timestamps: false }
	);

	Song.associate = (models) => {
		Song.belongsToMany(models.recital, { through: models.recital_song });
	};

	return Song;
};
