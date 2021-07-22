const request = require('supertest');
const app = require('../app');
const {
	startTestDB,
	registerUser,
	closeTestDB,
	loginUser,
} = require('./testHelpers');

const testData = {
	testUser: {
		email: 'test@email.com',
		password: 'IAmAPassword',
	},
};

beforeAll(async () => {
	await startTestDB();
	await registerUser(testData.testUser);
});

afterAll(async () => {
	await closeTestDB();
});

describe('/songs/ping GET - check song endpoint', () => {
	it('returns 200 status', async () => {
		const {
			body: { token },
		} = await loginUser(testData.testUser);

		const response = await request(app)
			.get('/songs/ping')
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(200);
	});

	it.todo('Missing or invalid token - returns 401 status and error message');

	it.todo('Missing admin access - returns 403 status and error message');
});

describe('/songs/ POST - add song endpoint', () => {
	it.todo('Successful request - returns 201 status and song object');

	it.todo(
		'Missing required information - returns 400 status and error message'
	);

	it.todo('Missing or invalid token - returns 401 status and error message');

	it.todo('Missing admin access - returns 403 status and error message');
});
