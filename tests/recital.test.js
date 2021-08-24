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

describe('/auth/recitals/ping GET - check recital endpoint', () => {
	it('returns 200 status', async () => {
		const token = await loginUser(validUser1);
		const response = await request(app)
			.get('/auth/recitals/ping')
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(200);
	});

	it('Missing or invalid token - returns 401 status and error message', async () => {
		const response = await request(app).get('/auth/recitals/ping');

		expect(response.statusCode).toBe(401);
		expect(response.body.data).toHaveProperty(
			'message',
			'Missing or invalid token'
		);
	});
});

describe('/auth/recitals POST - create a new recital for user', () => {
	it('Successful request - returns 201 and the recital object', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.post('/auth/recitals')
			.set('Authorization', `Bearer ${token}`)
			.send({ recital: validRecital });

		expect(response.statusCode).toBe(201);
		expect(response.body).toHaveProperty('recital');
	});

	it('Missing or invalid token - returns 401 status and error message', async () => {
		const response = await request(app)
			.post('/auth/recitals')
			.send({ recital: validRecital });

		expect(response.statusCode).toBe(401);
		expect(response.body.data).toHaveProperty(
			'message',
			'Missing or invalid token'
		);
	});

	it('Missing recital name - returns 400 status and error message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.post('/auth/recitals')
			.set('Authorization', `Bearer ${token}`)
			.send({ recital: missingRecitalName });

		expect(response.statusCode).toBe(400);
		expect(response.body.data).toHaveProperty(
			'message',
			'Recital name must be provided'
		);
	});
});

describe("/auth/recitals GET - return all of a user's recitals", () => {
	it("Successful request - returns 200 status and array of user's recitals", async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.get('/auth/recitals')
			.set('Authorization', token);

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty('recitals');
		expect(response.body).toHaveProperty('count');
	});

	it('Missing or invalid token - returns 401 status and error message', async () => {
		const response = await request(app).get('/auth/recitals');

		expect(response.statusCode).toBe(401);
		expect(response.body.data).toHaveProperty(
			'message',
			'Missing or invalid token'
		);
	});
});

describe('/auth/recitals/{recitalId} PUT - replace recital with given recitalId', () => {
	it('Successful request - returns 200 status and recital object', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.put('/auth/recitals/1')
			.set('Authorization', token)
			.send({ recital: replacementRecital });

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty('recital');
	});

	it('Missing required fields - returns 400 status and error message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.put('/auth/recitals/1')
			.set('Authorization', token)
			.send({ recital: missingRecitalName });

		expect(response.statusCode).toBe(400);
		expect(response.body.data).toHaveProperty(
			'message',
			'Recital name must be provided'
		);
	});

	it('Invalid recitalId - returns 404 status and error message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.put('/auth/recitals/2')
			.set('Authorization', token)
			.send({ recital: replacementRecital });

		expect(response.statusCode).toBe(404);
		expect(response.body.data).toHaveProperty(
			'message',
			'No recital with given id found for user'
		);
	});

	it('Missing or invalid token - returns 401 status and error message', async () => {
		const response = await request(app)
			.put('/auth/recitals/1')
			.send({ recital: missingRecitalName });

		expect(response.statusCode).toBe(401);
		expect(response.body.data).toHaveProperty(
			'message',
			'Missing or invalid token'
		);
	});
});

describe('/auth/recitals/{recitalId} PATCH - update recital with given recitalId', () => {
	it('Successful request - returns 200 status and recital object', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.patch('/auth/recitals/1')
			.set('Authorization', token)
			.send({ recital: patchRecital });

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty('recital');
		expect(response.body.recital.name).toBe(replacementRecital.name);
	});

	it('No info to update provided - returns 400 status and error message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.patch('/auth/recitals/1')
			.set('Authorization', token)
			.send({ recital: emptyRecital });

		expect(response.statusCode).toBe(400);
		expect(response.body.data).toHaveProperty(
			'message',
			'No information provided'
		);
	});

	it('Invalid recitalId - returns 404 status and error message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.patch('/auth/recitals/2')
			.set('Authorization', token)
			.send({ recital: patchRecital });

		expect(response.statusCode).toBe(404);
		expect(response.body.data).toHaveProperty(
			'message',
			'No recital with given id found for user'
		);
	});

	it('Missing or invalid token - returns 401 status and error message', async () => {
		const response = await request(app)
			.patch('/auth/recitals/1')
			.send({ recital: missingRecitalName });

		expect(response.statusCode).toBe(401);
		expect(response.body.data).toHaveProperty(
			'message',
			'Missing or invalid token'
		);
	});
});

describe('recitals/{recitalId} GET - return recital with given recitalId', () => {
	it('Successful request - returns 200 status and recital object', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.get('/auth/recitals/1')
			.set('Authorization', token);

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty('recital');
	});

	it('Missing or invalid token - returns 401 status and error message', async () => {
		const response = await request(app).get('/auth/recitals/1');

		expect(response.statusCode).toBe(401);
		expect(response.body.data).toHaveProperty(
			'message',
			'Missing or invalid token'
		);
	});

	it('Invalid recitalId - returns 404 status and error message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.get('/auth/recitals/2')
			.set('Authorization', token);

		expect(response.statusCode).toBe(404);
		expect(response.body.data).toHaveProperty(
			'message',
			'No recital with given id found for user'
		);
	});
});

describe('/auth/recitals/{recitalId} DELETE - delete recital with given recitalId', () => {
	it('Successful request - returns 204 status and success message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.delete('/auth/recitals/1')
			.set('Authorization', token);

		expect(response.statusCode).toBe(204);
	});

	it('Missing or invalid token - returns 401 and error message', async () => {
		const response = await request(app).delete('/auth/recitals/1');

		expect(response.statusCode).toBe(401);
		expect(response.body.data).toHaveProperty(
			'message',
			'Missing or invalid token'
		);
	});

	it('Invalid recitalId - returns 404 status and error message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.delete('/auth/recitals/2')
			.set('Authorization', token);

		expect(response.statusCode).toBe(404);
		expect(response.body.data).toHaveProperty(
			'message',
			'No recital with given id found for user'
		);
	});
});
