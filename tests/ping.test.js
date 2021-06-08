const request = require('supertest');
const app = require('../app');

describe('/ping - GET', () => {
	it('Returns a 200 status', async () => {
		const response = await request(app).get('/ping');
		expect(response.statusCode).toBe(200);
	});
});
