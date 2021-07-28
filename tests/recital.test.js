const request = require('supertest');
const app = require('../app');
const {
	startTestDB,
	closeTestDB,
	registerUser,
	loginUser,
} = require('./testHelpers');

const {
	users: { validUser1 },
	recitals: {
		validRecital,
		missingRecitalName,
		patchRecital,
		replacementRecital,
		emptyRecital,
	},
} = require('./testData');

beforeAll(async () => {
	await startTestDB();
	await registerUser(validUser1);
});

afterAll(async () => {
	await closeTestDB();
});

describe('/recitals/ping GET - check recital endpoint', () => {
	it('returns 200 status', async () => {
		const token = await loginUser(validUser1);
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
	it('Successful request - returns 201 and the recital object', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.post('/recitals')
			.set('Authorization', `Bearer ${token}`)
			.send(validRecital);

		expect(response.statusCode).toBe(201);
		expect(response.body).toHaveProperty('recital');
	});

	it('Missing or invalid token - returns 401 status and error message', async () => {
		const response = await request(app)
			.post('/recitals')
			.send(validRecital);

		expect(response.statusCode).toBe(401);
		expect(response.body).toHaveProperty(
			'message',
			'Missing or invalid token'
		);
	});

	it('Missing recital name - returns 400 status and error message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.post('/recitals')
			.set('Authorization', `Bearer ${token}`)
			.send(missingRecitalName);

		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty(
			'message',
			'Recital name must be provided'
		);
	});
});

describe("/recitals GET - return all of a user's recitals", () => {
	it("Successful request - returns 200 status and array of user's recitals", async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.get('/recitals')
			.set('Authorization', token);

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty('recitals');
		expect(response.body).toHaveProperty('count');
	});

	it('Missing or invalid token - returns 401 status and error message', async () => {
		const response = await request(app).get('/recitals');

		expect(response.statusCode).toBe(401);
		expect(response.body).toHaveProperty(
			'message',
			'Missing or invalid token'
		);
	});
});

describe('/recitals/{recitalId} PUT - replace recital with given recitalId', () => {
	it('Successful request - returns 200 status and recital object', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.put('/recitals/1')
			.set('Authorization', token)
			.send(replacementRecital);

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty('recital');
	});

	it('Missing required fields - returns 400 status and error message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.put('/recitals/1')
			.set('Authorization', token)
			.send(missingRecitalName);

		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty(
			'message',
			'Recital name must be provided'
		);
	});

	it('Invalid recitalId - returns 404 status and error message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.put('/recitals/2')
			.set('Authorization', token)
			.send(replacementRecital);

		expect(response.statusCode).toBe(404);
		expect(response.body).toHaveProperty(
			'message',
			'No recital with given id found for user'
		);
	});

	it('Missing or invalid token - returns 401 status and error message', async () => {
		const response = await request(app)
			.put('/recitals/1')
			.send(missingRecitalName);

		expect(response.statusCode).toBe(401);
		expect(response.body).toHaveProperty(
			'message',
			'Missing or invalid token'
		);
	});
});

describe('/recitals/{recitalId} PATCH - update recital with given recitalId', () => {
	it('Successful request - returns 200 status and recital object', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.patch('/recitals/1')
			.set('Authorization', token)
			.send(patchRecital);

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty('recital');
		expect(response.body.recital.name).toBe(replacementRecital.name);
	});

	it('No info to update provided - returns 400 status and error message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.patch('/recitals/1')
			.set('Authorization', token)
			.send(emptyRecital);

		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty(
			'message',
			'No information provided'
		);
	});

	it('Invalid recitalId - returns 404 status and error message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.patch('/recitals/2')
			.set('Authorization', token)
			.send(patchRecital);

		expect(response.statusCode).toBe(404);
		expect(response.body).toHaveProperty(
			'message',
			'No recital with given id found for user'
		);
	});

	it('Missing or invalid token - returns 401 status and error message', async () => {
		const response = await request(app)
			.patch('/recitals/1')
			.send(missingRecitalName);

		expect(response.statusCode).toBe(401);
		expect(response.body).toHaveProperty(
			'message',
			'Missing or invalid token'
		);
	});
});

describe('recitals/{recitalId} GET - return recital with given recitalId', () => {
	it('Successful request - returns 200 status and recital object', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.get('/recitals/1')
			.set('Authorization', token);

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty('recital');
	});

	it('Missing or invalid token - returns 401 status and error message', async () => {
		const response = await request(app).get('/recitals/1');

		expect(response.statusCode).toBe(401);
		expect(response.body).toHaveProperty(
			'message',
			'Missing or invalid token'
		);
	});

	it('Invalid recitalId - returns 404 status and error message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.get('/recitals/2')
			.set('Authorization', token);

		expect(response.statusCode).toBe(404);
		expect(response.body).toHaveProperty(
			'message',
			'No recital with given id found for user'
		);
	});
});

describe('/recitals/{recitalId} DELETE - delete recital with given recitalId', () => {
	it('Successful request - returns 204 status and success message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.delete('/recitals/1')
			.set('Authorization', token);

		expect(response.statusCode).toBe(204);
	});

	it('Missing or invalid token - returns 401 and error message', async () => {
		const response = await request(app).delete('/recitals/1');

		expect(response.statusCode).toBe(401);
		expect(response.body).toHaveProperty(
			'message',
			'Missing or invalid token'
		);
	});

	it('Invalid recitalId - returns 404 status and error message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.delete('/recitals/2')
			.set('Authorization', token);

		expect(response.statusCode).toBe(404);
		expect(response.body).toHaveProperty(
			'message',
			'No recital with given id found for user'
		);
	});
});
