const app = require('../app');
const request = require('supertest');

const {
	startTestDB,
	closeTestDB,
	truncateTables,
	registerUser,
} = require('./testHelpers');

beforeAll(async () => {
	await startTestDB();
});

afterAll(async () => {
	await closeTestDB();
});

// Test data
const testUsers = {
	goodUser: {
		email: 'test@email.com',
		password: 'thisIsAPassword',
	},
	incorrectEmail: {
		email: 'jest@email.com',
		password: 'thisIsAPassword',
	},
	incorrectPassword: {
		email: 'test@email.com',
		password: 'thisIsNotAPassword',
	},
	missingEmail: {
		password: 'thisIsAPassword',
	},
	missingPassword: {
		email: 'test1@email.com',
	},
};

describe('/users/ping GET - check users endpoint', () => {
	it('returns 200 status', async () => {
		const response = await request(app).get('/users/ping');
		expect(response.statusCode).toBe(200);
	});
});

describe('/users/register POST - create new user', () => {
	afterEach(async () => {
		await truncateTables();
	});

	it('Successful request - creates new user, returns 201 status and token', async () => {
		const response = await request(app)
			.post('/users/register')
			.send(testUsers.goodUser);

		expect(response.statusCode).toBe(201);
		expect(response.body).toHaveProperty('token');
	});

	it('Missing email - returns 400 status and error message', async () => {
		const response = await request(app)
			.post('/users/register')
			.send(testUsers.missingEmail);

		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty(
			'message',
			'Missing email or password'
		);
	});

	it('Missing password - returns 400 status and error message', async () => {
		const response = await request(app)
			.post('/users/register')
			.send(testUsers.missingPassword);

		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty(
			'message',
			'Missing email or password'
		);
	});

	it('Email already in use - returns 400 status and error message', async () => {
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

describe('/users/login POST - log in user', () => {
	//Register a user for each test case
	beforeAll(async () => {
		await registerUser(testUsers.goodUser);
	});

	it('Successful request - returns 200 status and token', async () => {
		const response = await request(app)
			.post('/users/login')
			.send(testUsers.goodUser);

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty('token');
	});

	it('Incorrect email - returns 401 status and error message', async () => {
		const response = await request(app)
			.post('/users/login')
			.send(testUsers.incorrectEmail);

		expect(response.statusCode).toBe(401);
		expect(response.body).toHaveProperty(
			'message',
			'Incorrect email or password'
		);
	});

	it('Incorrect password - returns 401 status and error message', async () => {
		const response = await request(app)
			.post('/users/login')
			.send(testUsers.incorrectPassword);

		expect(response.statusCode).toBe(401);
		expect(response.body).toHaveProperty(
			'message',
			'Incorrect email or password'
		);
	});

	it('Missing password - returns 400 status and error message', async () => {
		const response = await request(app)
			.post('/users/login')
			.send(testUsers.missingPassword);

		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty(
			'message',
			'Please provide email and password'
		);
	});

	it('Missing email - returns 400 status and error message', async () => {
		const response = await request(app)
			.post('/users/login')
			.send(testUsers.missingEmail);
		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty(
			'message',
			'Please provide email and password'
		);
	});
});
