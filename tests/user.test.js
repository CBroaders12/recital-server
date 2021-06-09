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

describe('Ping user route', () => {
	it('/user GET returns 200 - OK status', async () => {
		const response = await request(app).get('/users');
		expect(response.statusCode).toBe(200);
	});
});

describe('Register a new user', () => {
	afterEach(async () => {
		try {
			await db.sequelize.truncate();
		} catch (error) {
			console.error(error);
		}
	});

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

describe('Login an existing user', () => {
	//Register a user for each test case
	beforeAll(async () => {
		await request(app).post('/users/register').send(testUsers.goodUser);
		console.log('******* USER REGISTERED *******');
	});

	it('Login in existing user and return 200 status and token', async () => {
		const response = await request(app)
			.post('/users/login')
			.send(testUsers.goodUser);

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty('token');
	});

	it('Incorrect email returns 401 - UNAUTHORIZED with message', async () => {
		const response = await request(app)
			.post('/users/login')
			.send(testUsers.incorrectEmail);

		expect(response.statusCode).toBe(401);
		expect(response.body).toHaveProperty(
			'message',
			'Incorrect email or password'
		);
	});

	it('Incorrect password returns 401 - UNAUTHORIZED with message', async () => {
		const response = await request(app)
			.post('/users/login')
			.send(testUsers.incorrectPassword);

		expect(response.statusCode).toBe(401);
		expect(response.body).toHaveProperty(
			'message',
			'Incorrect email or password'
		);
	});

	it('Missing password returns 400 - BAD REQUEST with message', async () => {
		const response = await request(app)
			.post('/users/login')
			.send(testUsers.missingPassword);

		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty(
			'message',
			'Please provide email and password'
		);
	});

	it('Missing email returns 400 - BAD REQUEST with message', async () => {
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
