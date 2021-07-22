const models = require('../models');

const { Router } = require('express');

const songController = Router();

songController.get('/ping', (req, res) => {
	res.status(200).send();
});

songController.post('/', async (req, res, next) => {
	try {
		res.status(500).send();
	} catch (error) {
		next(error);
	}
});

module.exports = songController;
