const app = require('../app');
const request = require('supertest');

const { startTestDB, closeTestDB, registerUser } = require('./testHelpers');

const {
	validUser1,
	incorrectEmail,
	incorrectPassword,
	missingEmail,
	missingPassword,
} = require('./testData');

beforeAll(async () => {
	await startTestDB();
});

afterAll(async () => {
	await closeTestDB();
});

describe('/users/ping GET - check users endpoint', () => {
	it('returns 200 status', async () => {
		const response = await request(app).get('/users/ping');
		expect(response.statusCode).toBe(200);
	});
});

describe('/users/register POST - create new user', () => {
	it('Successful request - creates new user, returns 201 status and token', async () => {
		const response = await request(app)
			.post('/users/register')
			.send(validUser1);

		expect(response.statusCode).toBe(201);
		expect(response.body).toHaveProperty('token');
	});

	it('Missing email - returns 400 status and error message', async () => {
		const response = await request(app)
			.post('/users/register')
			.send(missingEmail);

		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty(
			'message',
			'Missing email or password'
		);
	});

	it('Missing password - returns 400 status and error message', async () => {
		const response = await request(app)
			.post('/users/register')
			.send(missingPassword);

		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty(
			'message',
			'Missing email or password'
		);
	});

	it('Email already in use - returns 400 status and error message', async () => {
		const response = await request(app)
			.post('/users/register')
			.send(validUser1);

		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty(
			'message',
			'Email is already registered'
		);
	});
});

describe('/users/login POST - log in user', () => {
	//Register a user for each test case
	beforeAll(async () => {
		await registerUser(validUser1);
	});

	it('Successful request - returns 200 status and token', async () => {
		const response = await request(app)
			.post('/users/login')
			.send(validUser1);

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty('token');
	});

	it('Incorrect email - returns 401 status and error message', async () => {
		const response = await request(app)
			.post('/users/login')
			.send(incorrectEmail);

		expect(response.statusCode).toBe(401);
		expect(response.body).toHaveProperty(
			'message',
			'Incorrect email or password'
		);
	});

	it('Incorrect password - returns 401 status and error message', async () => {
		const response = await request(app)
			.post('/users/login')
			.send(incorrectPassword);

		expect(response.statusCode).toBe(401);
		expect(response.body).toHaveProperty(
			'message',
			'Incorrect email or password'
		);
	});

	it('Missing password - returns 400 status and error message', async () => {
		const response = await request(app)
			.post('/users/login')
			.send(missingPassword);

		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty(
			'message',
			'Please provide email and password'
		);
	});

	it('Missing email - returns 400 status and error message', async () => {
		const response = await request(app)
			.post('/users/login')
			.send(missingEmail);
		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty(
			'message',
			'Please provide email and password'
		);
	});
});
