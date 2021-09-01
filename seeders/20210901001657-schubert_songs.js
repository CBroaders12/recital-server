'use strict';
const fs = require('fs');

const songsFile = fs.readFileSync(`${__dirname}/../data/songs.json`);
const songs = JSON.parse(songsFile, (key, value) => {
	return value === '' ? null : value;
});

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert('songs', songs);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('songs', null);
	},
};
