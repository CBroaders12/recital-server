module.exports = (sequelize, DataTypes) => {
	const RecitalSong = sequelize.define('recital_song', {
		order: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	});

	return RecitalSong;
};
