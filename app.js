// Package Imports
const Express = require('express');

const app = Express();

const controllers = require('./controllers');
const middleware = require('./middleware');
const middlewares = require('./middleware');

app.use(Express.json());
app.use(middlewares.cors);

app.use('/ping', controllers.ping);

app.use('/users', controllers.user);

// Registered User Routes
app.use(middlewares.authenticateToken);
app.use('/recitals', controllers.recital);

// Admin Routes
app.use(middlewares.checkAdmin);
app.use('/songs', controllers.song);

//handle errors last
app.use(middleware.handleError);

module.exports = app;
