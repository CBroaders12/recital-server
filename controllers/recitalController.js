const models = require('../models');
const { InvalidRequestError, NotFoundError } = require('../errors');

const { Router } = require('express');

const recitalController = Router();

recitalController.get('/ping', (req, res) => {
	res.status(200).send();
});

recitalController
	.route('/')
	.post(async (req, res) => {
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
	})
	.get(async (req, res) => {
		try {
			const { id: organizerId } = req.user;

			const recitals = await models.recital.findAll({
				where: {
					organizerId,
				},
			});

			res.status(200).json({
				recitals,
				count: recitals.length,
			});
		} catch (error) {
			res.status(500).send();
		}
	});

recitalController
	.route('/:recitalId')
	.put(async (req, res) => {
		try {
			const { name, date, location, description } = req.body;
			const { id: organizerId } = req.user;
			const { recitalId } = req.params;

			if (!name) throw new InvalidRequestError('Name must be provided');

			const [count, updatedRecital] = await models.recital.update(
				{
					name,
					date,
					location,
					description,
				},
				{
					returning: true,
					where: {
						id: recitalId,
						organizerId,
					},
				}
			);

			if (count === 0)
				throw new NotFoundError('No recital with id found');

			res.status(200).json({
				recital: updatedRecital,
			});
		} catch (error) {
			if (error instanceof NotFoundError) {
				res.status(404).json({
					message: 'No recital with given id found for user',
				});
			} else if (error instanceof InvalidRequestError) {
				res.status(400).json({
					message: 'Recital name must be provided',
				});
			} else {
				console.error(error);
				res.status(500).send();
			}
		}
	})
	.patch(async (req, res) => {
		try {
			const { recitalId } = req.params;
			const { id: organizerId } = req.user;
			const { name, location, date, description } = req.body;

			// only include info to patch without deleting other data
			let patchRecital = {};
			name ? (patchRecital.name = name) : null;
			location ? (patchRecital.location = location) : null;
			date ? (patchRecital.date = date) : null;
			description ? (patchRecital.description = description) : null;

			if (Object.keys(patchRecital).length === 0)
				throw new InvalidRequestError('No information provided');

			const [count, patchedRecital] = await models.recital.update(
				patchRecital,
				{
					returning: true,
					where: {
						id: recitalId,
						organizerId,
					},
				}
			);

			if (count === 0)
				throw new NotFoundError('No recital with id found');

			res.status(200).json({
				recital: patchedRecital[0],
			});
		} catch (error) {
			if (error instanceof NotFoundError) {
				res.status(404).json({
					message: 'No recital with given id found for user',
				});
			} else if (error instanceof InvalidRequestError) {
				res.status(400).json({
					message: 'No information provided',
				});
			} else {
				console.error(error);
				res.status(500).send();
			}
		}
	});

module.exports = recitalController;
