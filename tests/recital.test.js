const request = require('supertest');
const app = require('../app');
const {
	startTestDB,
	closeTestDB,
	registerUser,
	loginUser,
	createAdmin,
} = require('./testHelpers');

const {
	users: { validUser1, adminUser },
	recitals: {
		validRecital,
		missingRecitalName,
		patchRecital,
		replacementRecital,
		emptyRecital,
	},
	songs: { validSong },
} = require('./testData');

beforeAll(async () => {
	await startTestDB();
	await registerUser(validUser1);
	await createAdmin(adminUser);
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
		expect(response.body.status).toBe('success');
		expect(response.body.data).toBeNull();
	});

	it('Missing or invalid token - returns 401 status and error message', async () => {
		const response = await request(app).get('/auth/recitals/ping');

		expect(response.statusCode).toBe(401);
		expect(response.body.status).toBe('fail');
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
		expect(response.body.status).toBe('success');
		expect(response.body.data).toHaveProperty('recital');
	});

	it('Missing or invalid token - returns 401 status and error message', async () => {
		const response = await request(app)
			.post('/auth/recitals')
			.send({ recital: validRecital });

		expect(response.statusCode).toBe(401);
		expect(response.body.status).toBe('fail');
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
		expect(response.body.status).toBe('fail');
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
		expect(response.body.data).toHaveProperty('recitals');
		expect(response.body.data).toHaveProperty('count');
	});

	it('Missing or invalid token - returns 401 status and error message', async () => {
		const response = await request(app).get('/auth/recitals');

		expect(response.statusCode).toBe(401);
		expect(response.body.status).toBe('fail');
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
		expect(response.body.status).toBe('success');
		expect(response.body.data.recital).toHaveProperty(
			'name',
			replacementRecital.name
		);
	});

	it('Missing required fields - returns 400 status and error message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.put('/auth/recitals/1')
			.set('Authorization', token)
			.send({ recital: missingRecitalName });

		expect(response.statusCode).toBe(400);
		expect(response.body.status).toBe('fail');
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
		expect(response.body.status).toBe('fail');
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
		expect(response.body.status).toBe('fail');
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
		expect(response.body.status).toBe('success');
		expect(response.body.data).toHaveProperty('recital');
		expect(response.body.data.recital).toHaveProperty(
			'name',
			replacementRecital.name
		);
	});

	it('No info to update provided - returns 400 status and error message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.patch('/auth/recitals/1')
			.set('Authorization', token)
			.send({ recital: emptyRecital });

		expect(response.statusCode).toBe(400);
		expect(response.body.status).toBe('fail');
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
		expect(response.body.status).toBe('fail');
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
		expect(response.body.status).toBe('fail');
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
		expect(response.body.status).toBe('success');
		expect(response.body.data).toHaveProperty('recital');
	});

	it('Missing or invalid token - returns 401 status and error message', async () => {
		const response = await request(app).get('/auth/recitals/1');

		expect(response.statusCode).toBe(401);
		expect(response.body.status).toBe('fail');
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
		expect(response.body.status).toBe('fail');
		expect(response.body.data).toHaveProperty(
			'message',
			'No recital with given id found for user'
		);
	});
});

describe('/auth/recitals/{recitalId} DELETE - delete recital with given recitalId', () => {
	it('Successful request - returns 200 status and success message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.delete('/auth/recitals/1')
			.set('Authorization', token);

		expect(response.statusCode).toBe(200);
		expect(response.body.status).toBe('success');
		expect(response.body.data).toBeNull();
	});

	it('Missing or invalid token - returns 401 status and error message', async () => {
		const response = await request(app).delete('/auth/recitals/1');

		expect(response.statusCode).toBe(401);
		expect(response.body.status).toBe('fail');
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
		expect(response.body.status).toBe('fail');
		expect(response.body.data).toHaveProperty(
			'message',
			'No recital with given id found for user'
		);
	});
});

describe('/auth/recitals/{recitalId}/songs/{songId} POST - Add song of songId to recital of recitalId', () => {
	const testPath = (recitalId, songId) =>
		`/auth/recitals/${recitalId}/songs/${songId}`;

	it('Successful request - returns 200 status and recital object with songs', async () => {
		const token = await loginUser(validUser1);
		const adminToken = await loginUser(adminUser);

		await request(app)
			.post('/admin/songs')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({ song: validSong });

		await request(app)
			.post('/auth/recitals')
			.set('Authorization', `Bearer ${token}`)
			.send({ recital: validRecital });

		const response = await request(app)
			.post(testPath(2, 1))
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(200);
		expect(response.body.status).toBe('success');
		expect(response.body.data).toHaveProperty('recital');
		expect(response.body.data.recital.songs[0]).toMatchObject(validSong);
	});

	it('Missing or invalid token - returns 401 status and error message', async () => {
		const response = await request(app).post(testPath(2, 1));

		expect(response.statusCode).toBe(401);
		expect(response.body.status).toBe('fail');
		expect(response.body.data).toHaveProperty(
			'message',
			'Missing or invalid token'
		);
	});

	it('Invalid recitalId - returns 404 status and error message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.post(testPath(10, 1))
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(404);
		expect(response.body.status).toBe('fail');
		expect(response.body.data).toHaveProperty(
			'message',
			'No recital with given id found for user'
		);
	});

	it('Invalid songId - returns 404 status and error message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.post(testPath(2, 10))
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(404);
		expect(response.body.status).toBe('fail');
		expect(response.body.data).toHaveProperty(
			'message',
			'No song with given id found'
		);
	});
});

describe('/auth/recitals/{recitalId}/songs/{songId} DELETE - Delete song of songId from recital of recitalId', () => {
	const testPath = (recitalId, songId) =>
		`/recitals/${recitalId}/songs/${songId}`;

	it.todo(
		'Successful request - returns 200 status and recital object with songs'
	);
	it.todo('Missing or invalid token - returns 401 status and error message');
	it.todo('Invalid recitalId - returns 404 status and error message');
	it.todo('Invalid songId - returns 404 status and error message');
});
