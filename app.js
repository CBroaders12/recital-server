// Package Imports
const Express = require('express');

const app = Express();

const controllers = require('./controllers');
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
