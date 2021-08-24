const request = require('supertest');
const app = require('../app');
const {
	startTestDB,
	registerUser,
	closeTestDB,
	loginUser,
	createAdmin,
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

describe('/admin/songs/ping GET - check song endpoint', () => {
	const testPath = '/admin/songs/ping';

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
		expect(response.body.data).toHaveProperty(
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
		expect(response.body.data).toHaveProperty(
			'message',
			'Insufficient permissions'
		);
	});
});

describe('admin/songs POST - add song endpoint', () => {
	const testPath = '/admin/songs';

	it('Successful request - returns 201 status and song object', async () => {
		const token = await loginUser(adminUser);

		const response = await request(app)
			.post(testPath)
			.set('Authorization', `Bearer ${token}`)
			.send({ song: validSong });

		expect(response.statusCode).toBe(201);
		expect(response.body).toHaveProperty('song');
	});

	it('Missing required information - returns 400 status and error message', async () => {
		const token = await loginUser(adminUser);

		const response = await request(app)
			.post(testPath)
			.set('Authorization', `Bearer ${token}`)
			.send({ song: missingTitle });

		expect(response.statusCode).toBe(400);
		expect(response.body.data).toHaveProperty(
			'message',
			'Song missing required information'
		);
	});

	it('Missing or invalid token - returns 401 status and error message', async () => {
		const response = await request(app)
			.post(testPath)
			.send({ song: validSong });

		expect(response.statusCode).toBe(401);
		expect(response.body.data).toHaveProperty(
			'message',
			'Missing or invalid token'
		);
	});

	it('Missing admin access - returns 403 status and error message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.post(testPath)
			.set('Authorization', `Bearer ${token}`)
			.send({ song: validSongWithSet });

		expect(response.statusCode).toBe(403);
		expect(response.body.data).toHaveProperty(
			'message',
			'Insufficient permissions'
		);
	});
});

describe('/admin/songs/{songId} PATCH - update song endpoint', () => {
	const testPath = '/admin/songs';

	it('Successful request - returns 200 status and song object', async () => {
		const token = await loginUser(adminUser);

		const response = await request(app)
			.patch(testPath + '/1')
			.set('Authorization', `Bearer ${token}`)
			.send({ song: patchSong });

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty('song');
	});

	it('Invalid songId - returns 404 status and error message', async () => {
		const token = await loginUser(adminUser);

		const response = await request(app)
			.patch(testPath + '/100')
			.set('Authorization', `Bearer ${token}`)
			.send({ song: patchSong });

		expect(response.statusCode).toBe(404);
		expect(response.body.data).toHaveProperty(
			'message',
			'No song with given id found'
		);
	});

	it('Missing or invalid token - returns 401 status and error message', async () => {
		const response = await request(app)
			.patch(testPath + '/1')
			.send({ song: patchSong });

		expect(response.statusCode).toBe(401);
		expect(response.body.data).toHaveProperty(
			'message',
			'Missing or invalid token'
		);
	});

	it('Missing admin access - returns 403 status and error message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.patch(testPath + '/1')
			.set('Authorization', `Bearer ${token}`)
			.send({ song: patchSong });

		expect(response.statusCode).toBe(403);
		expect(response.body.data).toHaveProperty(
			'message',
			'Insufficient permissions'
		);
	});
});

describe('/admin/songs/{songId} DELETE - delete song endpoint', () => {
	const testPath = '/admin/songs';

	it('Successful request - returns 204 status and success message', async () => {
		const token = await loginUser(adminUser);

		const response = await request(app)
			.delete(testPath + '/1')
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(204);
	});

	it('Invalid songId - returns 404 status and error message', async () => {
		const token = await loginUser(adminUser);

		const response = await request(app)
			.delete(testPath + '/100')
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(404);
		expect(response.body.data).toHaveProperty(
			'message',
			'No song with given id found'
		);
	});

	it('Missing or invalid token - returns 401 status and error message', async () => {
		const response = await request(app).delete(testPath + '/1');

		expect(response.statusCode).toBe(401);
		expect(response.body.data).toHaveProperty(
			'message',
			'Missing or invalid token'
		);
	});

	it('Missing admin access - returns 403 status and error message', async () => {
		const token = await loginUser(validUser1);

		const response = await request(app)
			.delete(testPath + '/1')
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(403);
		expect(response.body.data).toHaveProperty(
			'message',
			'Insufficient permissions'
		);
	});
});
