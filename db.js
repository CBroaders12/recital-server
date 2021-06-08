require('dotenv').config();

const { Sequelize } = require('sequelize');

const db = new Sequelize(process.env.DEV_DB_URL, {
	dialect: 'postgres',
});

const testDB = new Sequelize(process.env.TEST_DB_URL, {
	dialect: 'postgres',
});

module.exports = {
	db,
	testDB,
};
