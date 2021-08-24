const models = require('../models');

const { Router } = require('express');
const { InvalidRequestError, NotFoundError } = require('../errors');

const songController = Router();

songController.get('/ping', (req, res) => {
	res.status(200).send();
});

songController.post('/', async (req, res, next) => {
	try {
		const { song } = req.body;

		if (
			!song.title ||
			!song.composer ||
			!song.author ||
			!song.language ||
			!song.compositionYear ||
			!song.originalKey ||
			!song.catalogueNumber ||
			!song.period
		)
			throw new InvalidRequestError('Song missing required information');

		const newSong = await models.song.create(song);

		res.status(201).json({
			song: newSong,
		});
	} catch (error) {
		next(error);
	}
});

songController
	.route('/:songId')
	.patch(async (req, res, next) => {
		try {
			const { song } = req.body;
			const { songId } = req.params;

			if (
				!song.title &&
				!song.composer &&
				!song.author &&
				!song.language &&
				!song.compositionYear &&
				!song.originalKey &&
				!song.catalogueNumber &&
				!song.period
			)
				throw new InvalidRequestError(
					'Song missing required information'
				);

			const [count, patchedSong] = await models.song.update(song, {
				returning: true,
				where: {
					id: songId,
				},
			});

			if (count === 0)
				throw new NotFoundError('No song with given id found');

			res.status(200).json({
				song: patchedSong[0],
			});
		} catch (error) {
			next(error);
		}
	})
	.delete(async (req, res, next) => {
		try {
			const { songId } = req.params;

			const toDestroy = await models.song.findOne({
				where: {
					id: songId,
				},
			});

			if (!toDestroy)
				throw new NotFoundError('No song with given id found');

			await toDestroy.destroy();

			res.status(204).send();
		} catch (error) {
			next(error);
		}
	});

module.exports = songController;
