const models = require('../models');

const { Router } = require('express');
const { InvalidRequestError } = require('../errors');

const songController = Router();

songController.get('/ping', (req, res) => {
	res.status(200).send();
});

songController.post('/', async (req, res, next) => {
	try {
		const song = req.body;

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

module.exports = songController;
