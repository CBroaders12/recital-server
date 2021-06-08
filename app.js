// Package Imports
const Express = require('express');

const app = Express();

const controllers = require('./controllers');

app.use(Express.json());

app.use('/ping', (req, res) => {
	res.status(200).send();
});

app.use('/users', controllers.user);

module.exports = app;
