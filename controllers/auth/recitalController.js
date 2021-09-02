const models = require('../../models');
const { InvalidRequestError, NotFoundError } = require('../../errors');

const { Router } = require('express');
const { sequelize } = require('../../models');

const recitalController = Router();

recitalController.get('/ping', (req, res) => {
	res.status(200).json({
		status: 'success',
		data: null,
	});
});

/**
 * A recital
 * @typedef Recital
 * @property {string} name.required - Name of the recital
 * @property {Date} date - Date of the recital
 * @property {string} location - Location of recital
 * @property {string} description - Additional info
 */

/**
 * POST /auth/recitals
 * @summary Create a new recital
 * @tags recitals
 * @param {Recital} request.body.required - Recital details
 * @return {object} 200 - Recital created
 * @return {object} 400 - Invalid request response
 * @return {object} 401 - Authorization error response
 */

/**
 * GET /auth/recitals
 * @summary Get all user's recitals
 * @tags recitals
 * @return {object} 200 - Success response
 * @return {object} 401 - Authorization error response
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
 * PATCH /auth/recitals/{recitalId}
 * @summary Update information of a selected recital
 * @param {Recital} request.body.required - Updated recital info
 * @param {number} recitalId.path - Recital id
 * @return {object} 200 - Recital updated
 * @return {object} 400 - Invalid request response
 * @return {object} 401 - Authorization error response
 * @return {object} 404 - Not found error response
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
 * DELETE a song with a given songId from a recital
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
				include: {
					model: models.song,
					as: 'songs',
					through: {
						attributes: [],
					},
				},
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
				include: {
					model: models.song,
					as: 'songs',
					through: {
						attributes: [],
					},
				},
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

recitalController
	.route('/:recitalId/songs')
	.get(async (req, res, next) => {
		try {
			const { recitalId } = req.params;
			const { id: organizerId } = req.user;

			const targetRecital = await models.recital.findOne({
				where: {
					organizerId,
					id: recitalId,
				},
				include: {
					model: models.song,
					as: 'songs',
					through: {
						attributes: ['order'],
					},
				},
				order: [[models.song, models.recital_song, 'order', 'asc']],
			});

			if (!targetRecital)
				throw new NotFoundError(
					'No recital with given id found for user'
				);

			const recitalSongs = targetRecital.songs;

			res.status(200).json({
				status: 'success',
				data: {
					count: recitalSongs.length,
					songs: recitalSongs,
				},
			});
		} catch (error) {
			next(error);
		}
	})
	.put(async (req, res, next) => {
		try {
			const { recitalId } = req.params;
			const { id: organizerId } = req.user;
			const { songs } = req.body;

			const targetRecital = await models.recital.findOne({
				where: {
					organizerId,
					id: recitalId,
				},
				include: {
					model: models.song,
					as: 'songs',
					through: {
						attributes: ['order'],
					},
				},
			});

			if (!targetRecital)
				throw new NotFoundError(
					'No recital with given id found for user'
				);
			if (targetRecital.songs.length !== songs.length)
				throw new InvalidRequestError(
					'Number of songs sent does not match number in recital'
				);

			for (const song of songs) {
				const existingSong = await targetRecital.getSongs({
					where: { id: song.id },
				});
				await targetRecital.addSong(existingSong, {
					through: {
						order: song.recital_song.order,
					},
				});
			}

			const recitalSongs = await targetRecital.getSongs({
				order: [[sequelize.col('recital_song.order'), 'asc']],
			});

			res.status(200).json({
				status: 'success',
				data: {
					songs: recitalSongs,
				},
			});
		} catch (error) {
			next(error);
		}
	});

module.exports = recitalController;
