const models = require('../../models');

const { Router } = require('express');
const { NotFoundError } = require('../../errors');

const songController = Router();

songController.get('/', async (req, res, next) => {
	try {
		const { offset = 0, limit = 20 } = req.query;

		const songs = await models.song.findAll({
			offset,
			limit,
		});

		if (songs.length === 0)
			throw new NotFoundError('No songs found for given query');

		res.status(200).json({
			status: 'success',
			data: {
				count: songs.length,
				songs,
			},
		});
	} catch (error) {
		next(error);
	}
});

module.exports = songController;
