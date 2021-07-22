// Package Imports
const Express = require('express');

const app = Express();

const controllers = require('./controllers');
const middleware = require('./middleware');
const middlewares = require('./middleware');

app.use(Express.json());
app.use(middlewares.cors);

app.use('/ping', (req, res) => {
	res.status(200).send();
});

app.use('/users', controllers.user);
app.use('/recitals', middlewares.authenticateToken, controllers.recital);

// TODO: Add admin control to routes under here
app.use('/songs', middlewares.authenticateToken, controllers.song);

//handle errors last
app.use(middleware.handleError);

module.exports = app;
