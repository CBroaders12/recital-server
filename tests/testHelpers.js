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
	const response = await request(app)
		.post('/users/register')
		.send({ user: testUser });

	return response.body.data.token;
};

helpers.loginUser = async (testUser) => {
	const response = await request(app)
		.post('/users/login')
		.send({ user: testUser });

	return response.body.data.token;
};

helpers.createAdmin = async (newAdmin) => {
	const response = await request(app)
		.post('/users/admin')
		.send({ user: newAdmin });

	return response.body.data.token;
};

helpers.sendInvalidTokenRequest = async (reqPath, reqBody = null) => {
	const response = await request(app).post(reqPath).send(reqBody);

	expect(response.statusCode).toBe(401);
	expect(response.body.status).toBe('fail');
	expect(response.body.data).toHaveProperty(
		'message',
		'Missing or invalid token'
	);
};

module.exports = helpers;
