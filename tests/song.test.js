const request = require('supertest');
const app = require('../app');
const {
	startTestDB,
	registerUser,
	closeTestDB,
	loginUser,
	createAdmin,
} = require('./testHelpers');

const testData = {
	testUser: {
		email: 'test@email.com',
		password: 'IAmAPassword',
	},
	testAdmin: {
		email: 'admin@email.com',
		password: 'AdminPassword',
	},
};

beforeAll(async () => {
	await startTestDB();
	await registerUser(testData.testUser);
	await createAdmin(testData.testAdmin);
});

afterAll(async () => {
	await closeTestDB();
});

describe('/songs/ping GET - check song endpoint', () => {
	it('returns 200 status', async () => {
		const {
			body: { token },
		} = await loginUser(testData.testAdmin);

		const response = await request(app)
			.get('/songs/ping')
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(200);
	});

	it('Missing or invalid token - returns 401 status and error message', async () => {
		const response = await request(app).get('/songs/ping');

		expect(response.statusCode).toBe(401);
		expect(response.body).toHaveProperty(
			'message',
			'Missing or invalid token'
		);
	});

	it('Missing admin access - returns 403 status and error message', async () => {
		const {
			body: { token },
		} = await loginUser(testData.testUser);

		const response = await request(app)
			.get('/songs/ping')
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(403);
		expect(response.body).toHaveProperty(
			'message',
			'Insufficient permissions'
		);
	});
});

describe('/songs/ POST - add song endpoint', () => {
	it.todo('Successful request - returns 201 status and song object');

	it.todo(
		'Missing required information - returns 400 status and error message'
	);

	it.todo('Missing or invalid token - returns 401 status and error message');

	it.todo('Missing admin access - returns 403 status and error message');
});

describe('/songs/{songId} PATCH - update song endpoint', () => {
	it.todo('Successful request - returns 200 status and song object');

	it.todo('Missing or invalid token - returns 401 status and error message');

	it.todo('Missing admin access - returns 403 status and error message');
});

describe('/songs/{songId} DELETE - delete song endpoint', () => {
	it.todo('Successful request - returns 204 status and success message');

	it.todo('Invalid songId - returns 404 status and error message');

	it.todo('Missing or invalid token - returns 401 status and error message');

	it.todo('Missing admin access - returns 403 status and error message');
});
