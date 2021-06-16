const models = require('../models');
const { InvalidRequestError } = require('../errors');

const { Router } = require('express');

const recitalController = Router();

recitalController.get('/ping', (req, res) => {
	res.status(200).send();
});

recitalController.post('/', async (req, res) => {
	try {
		const { name, date, location, description } = req.body;
		const { id: organizerId } = req.user;

		if (!name) throw new InvalidRequestError('Name not provided');

		const newRecital = await models.recital.create({
			name,
			date,
			location,
			description,
			organizerId,
		});

		res.status(201).json({
			recital: newRecital,
		});
	} catch (error) {
		if (error instanceof InvalidRequestError) {
			res.status(400).json({
				message: 'Recital name must be provided',
			});
		} else {
			res.status(500).send();
		}
	}
});

module.exports = recitalController;
