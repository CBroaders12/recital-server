// Package Imports
const Express = require('express');
const ExpressJSDocSwagger = require('express-jsdoc-swagger');

const swaggerOptions = {
	info: {
		version: '1.0.0',
		title: 'RecitaList',
		description: 'An API for singers to create recitals and find music',
	},
	baseDir: __dirname,
	filesPattern: './controllers/**/*.js',
	swaggerUIPath: '/api-docs',
	exposeSwaggerUI: true,
};

const app = Express();

ExpressJSDocSwagger(app)(swaggerOptions);

const routes = require('./routes');
const middlewares = require('./middleware');

app.use(Express.json());
app.use(middlewares.cors);

// Open Routes
app.use('/', routes.open);

// Authorized Routes
app.use(middlewares.authenticateToken);
app.use('/auth', routes.auth);

// Admin Routes
app.use('/admin', middlewares.checkAdmin, routes.admin);

//handle errors last
app.use(middlewares.handleError);

module.exports = app;
