module.exports = (sequelize, DataTypes) => {
	const Song = sequelize.define('song', {
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
		compositionYear: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		originalKey: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		catalogueNumber: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		period: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		from: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	});

	Song.associate = (models) => {
		Song.belongsToMany(models.recital, { through: models.recital_song });
	};

	return Song;
};
