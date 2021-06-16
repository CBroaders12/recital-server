// Package Imports
const Express = require('express');

const app = Express();

const controllers = require('./controllers');
const middlewares = require('./middleware');

app.use(Express.json());
app.use(middlewares.cors);

app.use('/ping', (req, res) => {
	res.status(200).send();
});

app.use('/users', controllers.user);
app.use('/recitals', middlewares.authenticateToken, controllers.recital);

module.exports = app;
