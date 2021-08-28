const models = require('../models');
const { InvalidRequestError, NotFoundError } = require('../errors');

const { Router } = require('express');

const recitalController = Router();

recitalController.get('/ping', (req, res) => {
	res.status(200).json({
		status: 'success',
		data: null,
	});
});

/**
 * CREATE a new recital
 * GET all recitals from a user
 */

recitalController
	.route('/')
	.post(async (req, res, next) => {
		try {
			const { name, date, location, description } = req.body.recital;
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
				status: 'success',
				data: {
					recital: newRecital,
				},
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
				status: 'success',
				data: {
					recitals,
					count: recitals.length,
				},
			});
		} catch (error) {
			next(error);
		}
	});

/**
 * UPDATE, REPLACE, GET, and DELETE a recital with a given recitalId
 */

recitalController
	.route('/:recitalId')
	.put(async (req, res, next) => {
		try {
			const { name, date, location, description } = req.body.recital;
			const { id: organizerId } = req.user;
			const { recitalId } = req.params;

			if (!name)
				throw new InvalidRequestError('Recital name must be provided');

			const [count, updatedRecitals] = await models.recital.update(
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
				status: 'success',
				data: {
					recital: updatedRecitals[0],
				},
			});
		} catch (error) {
			next(error);
		}
	})
	.patch(async (req, res, next) => {
		try {
			const { recitalId } = req.params;
			const { id: organizerId } = req.user;
			const { name, location, date, description } = req.body.recital;

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
				status: 'success',
				data: {
					recital: patchedRecital[0],
				},
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
				status: 'success',
				data: {
					recital,
				},
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

			res.status(200).json({
				status: 'success',
				data: null,
			});
		} catch (error) {
			next(error);
		}
	});

/**
 * ADD a song with a given songId to a recital
 */

recitalController
	.route('/:recitalId/songs/:songId')
	.post(async (req, res, next) => {
		try {
			const { recitalId, songId } = req.params;
			const { id: organizerId } = req.user;

			const targetRecital = await models.recital.findOne({
				where: {
					id: recitalId,
					organizerId,
				},
				include: models.song,
			});

			if (!targetRecital)
				throw new NotFoundError(
					'No recital with given id found for user'
				);

			let existingSongs = targetRecital.songs.map((song) => song.id);
			if (existingSongs.includes(parseInt(songId)))
				throw new InvalidRequestError(
					'Selected song is already part of recital'
				);

			const targetSong = await models.song.findOne({
				where: {
					id: songId,
				},
			});

			if (!targetSong)
				throw new NotFoundError('No song with given id found');

			await models.recital_song.create({
				recitalId,
				songId,
				order: targetRecital.songs.length,
			});

			targetRecital.songs.push(targetSong);

			res.status(200).json({
				status: 'success',
				data: {
					recital: targetRecital,
				},
			});
		} catch (error) {
			next(error);
		}
	})
	.delete(async (req, res, next) => {
		try {
			const { songId, recitalId } = req.params;
			const { id: organizerId } = req.user;

			const targetRecital = await models.recital.findOne({
				where: {
					id: recitalId,
					organizerId,
				},
				include: models.song,
			});

			if (!targetRecital)
				throw new NotFoundError(
					'No recital with given id found for user'
				);

			const toDestroy = await models.recital_song.findOne({
				where: {
					songId,
					recitalId,
				},
			});

			if (!toDestroy)
				throw new NotFoundError(
					'No song with given id found on given recital'
				);

			await toDestroy.destroy();

			let responseRecital = await models.recital.findOne({
				where: {
					id: recitalId,
					organizerId,
				},
				include: models.song,
			});

			res.status(200).json({
				status: 'success',
				data: {
					recital: responseRecital,
				},
			});
		} catch (error) {
			next(error);
		}
	});

module.exports = recitalController;
