require('dotenv').config();

module.exports = {
	development: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DEV_DB,
		host: process.env.DB_HOST,
		dialect: 'postgres',
	},
	test: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.TEST_DB,
		host: process.env.DB_HOST,
		dialect: 'postgres',
		logging: false,
	},
	production: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.PROD_DB,
		host: process.env.DB_HOST,
		dialect: 'postgres',
	},
};
