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

// TODO: Flesh out for reusable testing including errors
/**
 * @param {string} reqPath endpoint where the request is to be send
 * @param {number} expectedStatusCode expected HTTP status code
 * @param {'success'|'fail'|'error'} expectedStatus expected response status
 * @param {string[]|null} expectedData expected keys on response data object
 * @param {string} [token] Authorization token for the request
 * @param {*} [reqBody] body of the request to be sent
 */
helpers.testPostEndpoint = async (
	reqPath,
	expectedStatusCode,
	expectedStatus,
	expectedData,
	token = null,
	reqBody = null
) => {
	const response = await request(app)
		.post(reqPath)
		.set('Authorization', `Bearer ${token}`)
		.send(reqBody);

	expect(response.statusCode).toBe(expectedStatusCode);
	expect(response.body.status).toBe(expectedStatus);
	if (expectedData === null) expect(response.body.data).toBeNull();
	else expect(response.body.data).toHaveProperty(expectedData);
};

/**
 * @param {string} reqPath endpoint where request is to be sent
 * @param {number} expectedStatusCode expected HTTP status code
 * @param {'success'|'fail'|'error'} expectedStatus expected status of response
 * @param {string[] | null} expectedData expected keys on response data object
 * @param {string} [token] Authorization token for the request
 */
helpers.testGetEndpoint = async (
	reqPath,
	expectedStatusCode,
	expectedStatus,
	expectedData,
	token = null
) => {
	const response = token
		? await request(app)
				.get(reqPath)
				.set('Authorization', `Bearer ${token}`)
		: await request(app).get(reqPath);

	expect(response.statusCode).toBe(expectedStatusCode);
	expect(response.body.status).toBe(expectedStatus);
	if (expectedData === null) {
		expect(response.body.data).toBeNull();
	} else {
		expect(response.body.data).toHaveProperty(expectedData);
	}
};

module.exports = helpers;
