const models = require('../models');
const { InvalidRequestError, NotFoundError } = require('../errors');

const { Router } = require('express');

const recitalController = Router();

recitalController.get('/ping', (req, res) => {
	res.status(200).send();
});

recitalController
	.route('/')
	.post(async (req, res, next) => {
		try {
			const { name, date, location, description } = req.body;
			const { id: organizerId } = req.user;

			if (!name)
				throw new InvalidRequestError('Recital name must be provided');

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
			next(error);
		}
	})
	.get(async (req, res, next) => {
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
			next(error);
		}
	});

recitalController
	.route('/:recitalId')
	.put(async (req, res, next) => {
		try {
			const { name, date, location, description } = req.body;
			const { id: organizerId } = req.user;
			const { recitalId } = req.params;

			if (!name)
				throw new InvalidRequestError('Recital name must be provided');

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
				throw new NotFoundError(
					'No recital with given id found for user'
				);

			res.status(200).json({
				recital: updatedRecital,
			});
		} catch (error) {
			next(error);
		}
	})
	.patch(async (req, res, next) => {
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
				throw new NotFoundError(
					'No recital with given id found for user'
				);

			res.status(200).json({
				recital: patchedRecital[0],
			});
		} catch (error) {
			next(error);
		}
	})
	.get(async (req, res, next) => {
		try {
			const { recitalId } = req.params;
			const { id: organizerId } = req.user;

			const recital = await models.recital.findOne({
				where: {
					id: recitalId,
					organizerId,
				},
			});

			if (!recital)
				throw new NotFoundError(
					'No recital with given id found for user'
				);

			res.status(200).json({
				recital,
			});
		} catch (error) {
			next(error);
		}
	})
	.delete(async (req, res, next) => {
		try {
			const { recitalId } = req.params;
			const { id: organizerId } = req.user;

			const toDestroy = await models.recital.findOne({
				where: {
					id: recitalId,
					organizerId,
				},
			});

			if (!toDestroy)
				throw new NotFoundError(
					'No recital with given id found for user'
				);

			await toDestroy.destroy();

			res.status(204).send();
		} catch (error) {
			next(error);
		}
	});

module.exports = recitalController;
