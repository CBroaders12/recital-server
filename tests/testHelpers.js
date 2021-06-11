const request = require('supertest');
const db = require('../models');
const app = require('../app');

const helpers = {};

helpers.startTestDB = async () => {
	try {
		await db.sequelize.authenticate();
		await db.sequelize.sync({ force: true });
	} catch (error) {
		console.error();
	}
};

helpers.closeTestDB = async () => {
	try {
		await db.sequelize.close();
	} catch (error) {
		console.error(error);
	}
};

helpers.truncateTables = async () => {
	try {
		await db.sequelize.truncate({ cascade: true });
	} catch (error) {
		console.error(error);
	}
};

helpers.registerUser = async (testUser) => {
	const response = await request(app).post('/users/register').send(testUser);

	return response;
};

helpers.loginUser = async (testUser) => {
	const response = await request(app).post('/users/login').send(testUser);

	return response;
};

module.exports = helpers;
