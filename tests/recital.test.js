const request = require('supertest');
const app = require('../app');
const {
	startTestDB,
	closeTestDB,
	truncateTables,
	registerUser,
	loginUser,
} = require('./testHelpers');

const testData = {
	testUser: {
		email: 'test@email.com',
		password: 'IAmAPassword',
	},
	validRecital: {
		name: 'Test Recital',
		date: '2021-09-01',
		location: 'Test Location',
		description: 'I am but a humble test',
	},
	missingName: {
		date: '2021-09-01',
		location: 'Test Location',
		description: "I am bad request. Don't use me",
	},
	replacementRecital: {
		name: 'Another Recital',
		date: '2021-12-01',
		location: 'Somewhere',
		description: 'We had to change the recital',
	},
	patchRecital: {
		date: '2021-09-05',
		description: 'We only had to change the date',
	},
	emptyRecital: {},
};

beforeAll(async () => {
	await startTestDB();
	await registerUser(testData.testUser);
});

afterAll(async () => {
	await truncateTables();
	await closeTestDB();
});

describe('/recitals/ping GET - check recital endpoint', () => {
	it('returns 200 status', async () => {
		const {
			body: { token },
		} = await loginUser(testData.testUser);
		const response = await request(app)
			.get('/recitals/ping')
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(200);
	});

	it('Missing or invalid token - returns 401 status and error message', async () => {
		const response = await request(app).get('/recitals/ping');

		expect(response.statusCode).toBe(401);
		expect(response.body).toHaveProperty(
			'message',
			'Missing or invalid token'
		);
	});
});

describe('/recitals POST - create a new recital for user', () => {
	it.todo(
		'Successful request - returns 201 and the recital object' /*, async () => {
		const response = await request(app)
			.post('/recitals')
			.send(testData.validRecital);

		expect(response.statusCode).toBe(201);
		expect(response.body).toHaveProperty('recital');
	}*/
	);
	it.todo('Missing or invalid token - returns 401 status and error message');
	it.todo('Missing recital name - returns 400 status and error message');
});

describe("/recitals GET - return all of a user's recitals", () => {
	it.todo(
		"Successful request - returns 200 status and array of user's recitals"
	);
	it.todo('Missing or invalid token - returns 401 status and error message');
});

describe('/recitals/{recitalId} PUT - replace recital with given recitalId', () => {
	it.todo('Successful request - returns 200 status and recital object');
	it.todo('Missing required fields - returns 400 status and error message');
	it.todo('Invalid recitalId - returns 404 status and error message');
	it.todo('Missing or invalid token - returns 401 status and error message');
});

describe('/recitals/{recitalId} PATCH - update recital with given recitalId', () => {
	it.todo('Successful request - returns 200 status and recital object');
	it.todo(
		'No info to update provided - returns 400 status and error message'
	);
	it.todo('Invalid recitalId - returns 404 status and error message');
	it.todo('Missing or invalid token - returns 401 status and error message');
});

describe('recitals/{recitalId} GET - return recital with given recitalId', () => {
	it.todo('Successful request - returns 200 status and recital object');
	it.todo('Missing or invalid token - returns 401 status and error message');
	it.todo('Invalid recitalId - returns 404 status and error message');
});

describe('/recitals/{recitalId} DELETE - delete recital with given recitalId', () => {
	it.todo('Successful request - returns 204 status and success message');
	it.todo('Missing or invalid token - returns 401 and error message');
	it.todo('Invalid recitalId - returns 404 status and error message');
});
