const app = require('../app');
const request = require('supertest');
const db = require('../models');

beforeAll(async () => {
	try {
		await db.sequelize.authenticate();
		await db.sequelize.sync({ force: true });
	} catch (error) {
		console.error();
	}
});

afterAll(async () => {
	try {
		await db.sequelize.close();
	} catch (error) {
		console.error(error);
	}
});

afterEach(async () => {
	await db.sequelize.truncate();
});

describe('Ping user route', () => {
	it('/user GET returns 200 - OK status', async () => {
		const response = await request(app).get('/users');
		expect(response.statusCode).toBe(200);
	});
});

describe('Register a new user', () => {
	const testUsers = {
		goodUser: {
			email: 'test@email.com',
			password: 'thisIsAPassword',
		},
		missingEmail: {
			password: 'thisIsAPassword',
		},
		missingPassword: {
			email: 'test1@email.com',
		},
	};

	it('Create a new user and return a token with a 201 - CREATED status', async () => {
		const response = await request(app)
			.post('/users/register')
			.send(testUsers.goodUser);

		expect(response.statusCode).toBe(201);
		expect(response.body).toHaveProperty('token');
	});

	it('Missing email returns a 400 - BAD REQUEST status and error message', async () => {
		const response = await request(app)
			.post('/users/register')
			.send(testUsers.missingEmail);

		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty(
			'message',
			'Missing email or password'
		);
	});

	it('Missing password returns a 400 - BAD REQUEST status and error message', async () => {
		const response = await request(app)
			.post('/users/register')
			.send(testUsers.missingPassword);

		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty(
			'message',
			'Missing email or password'
		);
	});

	// ! This does work, but doesn't pass
	it('Email already in use returns a 400 - BAD REQUEST status and error message', async () => {
		await request(app).post('/users/register').send(testUsers.goodUser);

		const response = await request(app)
			.post('/users/register')
			.send(testUsers.goodUser);

		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty(
			'message',
			'Email is already registered'
		);
	});
});
