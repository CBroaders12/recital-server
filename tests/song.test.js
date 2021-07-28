const request = require('supertest');
const app = require('../app');
const {
	startTestDB,
	registerUser,
	closeTestDB,
	loginUser,
	createAdmin,
	badPermissionsRequest,
} = require('./testHelpers');

const {
	users: { validUser1, adminUser },
	songs: { validSong, validSongWithSet, missingTitle, patchSong },
} = require('./testData');

beforeAll(async () => {
	await startTestDB();
	await registerUser(validUser1);
	await createAdmin(adminUser);
});

afterAll(async () => {
	await closeTestDB();
});

describe('/songs/ping GET - check song endpoint', () => {
	const testPath = '/songs/ping';

	it('returns 200 status', async () => {
		const token = await loginUser(adminUser);

		const response = await request(app)
			.get(testPath)
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(200);
	});

	it('Missing or invalid token - returns 401 status and error message', async () => {
		const response = await request(app).get(testPath);

		expect(response.statusCode).toBe(401);
		expect(response.body).toHaveProperty(
			'message',
			'Missing or invalid token'
		);
	});

	it('Missing admin access - returns 403 status and error message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.get(testPath)
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(403);
		expect(response.body).toHaveProperty(
			'message',
			'Insufficient permissions'
		);
	});
});

describe('/songs/ POST - add song endpoint', () => {
	const testPath = '/songs';

	it('Successful request - returns 201 status and song object', async () => {
		const token = await loginUser(adminUser);

		const response = await request(app)
			.post(testPath)
			.set('Authorization', `Bearer ${token}`)
			.send(validSong);

		expect(response.statusCode).toBe(201);
		expect(response.body).toHaveProperty('song');
	});

	it('Missing required information - returns 400 status and error message', async () => {
		const token = await loginUser(adminUser);

		const response = await request(app)
			.post(testPath)
			.set('Authorization', `Bearer ${token}`)
			.send(missingTitle);

		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty(
			'message',
			'Song missing required information'
		);
	});

	it('Missing or invalid token - returns 401 status and error message', async () => {
		const response = await request(app).post(testPath).send(validSong);

		expect(response.statusCode).toBe(401);
		expect(response.body).toHaveProperty(
			'message',
			'Missing or invalid token'
		);
	});

	it('Missing admin access - returns 403 status and error message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.post('/song')
			.set('Authorization', `Bearer ${token}`)
			.send(validSongWithSet);

		expect(response.statusCode).toBe(403);
		expect(response.body).toHaveProperty(
			'message',
			'Insufficient permissions'
		);
	});
});

describe('/songs/{songId} PATCH - update song endpoint', () => {
	const testPath = '/songs/1';

	it('Successful request - returns 200 status and song object', async () => {
		const token = await loginUser(adminUser);

		const response = await request(app)
			.patch(testPath)
			.set('Authorization', `Bearer ${token}`)
			.send(patchSong);

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty('song');
	});

	it('Missing or invalid token - returns 401 status and error message', async () => {
		const response = await request(app).patch(testPath).send(patchSong);

		expect(response.statusCode).toBe(401);
		expect(response.body).toHaveProperty(
			'message',
			'Missing or invalid token'
		);
	});

	it('Missing admin access - returns 403 status and error message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.patch(testPath)
			.set('Authorization', `Bearer ${token}`)
			.send(patchSong);

		expect(response.statusCode).toBe(403);
		expect(response.body).toHaveProperty(
			'message',
			'Insufficient permissions'
		);
	});
});

describe('/songs/{songId} DELETE - delete song endpoint', () => {
	it.todo('Successful request - returns 204 status and success message');

	it.todo('Invalid songId - returns 404 status and error message');

	it.todo('Missing or invalid token - returns 401 status and error message');

	it.todo('Missing admin access - returns 403 status and error message');
});
