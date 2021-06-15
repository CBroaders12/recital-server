const models = require('../models');

const { Router } = require('express');

const recitalController = Router();

recitalController.get('/ping', (req, res) => {
	res.status(200).send();
});

module.exports = recitalController;
