const request = require('supertest');
const db = require('../models');
const app = require('../app');

const helpers = {};

helpers.startTestDB = async () => {
	await db.sequelize.sync({ force: true });
};

helpers.closeTestDB = async () => {
	await db.sequelize.close();
};

helpers.registerUser = async (testUser) => {
	const response = await request(app).post('/users/register').send(testUser);

	return response.body.token;
};

helpers.loginUser = async (testUser) => {
	const response = await request(app).post('/users/login').send(testUser);

	return response.body.token;
};

helpers.createAdmin = async (newAdmin) => {
	const response = await request(app).post('/users/admin').send(newAdmin);

	return response.body.token;
};

module.exports = helpers;
