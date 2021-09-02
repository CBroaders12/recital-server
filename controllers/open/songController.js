const models = require('../../models');

const { Router } = require('express');
const { NotFoundError } = require('../../errors');
const { sequelize } = require('../../models');

const songController = Router();

songController.get('/', async (req, res, next) => {
	try {
		let {
			offset = 0,
			limit = 20,
			language,
			composer,
			author,
			title,
		} = req.query;

		// TODO: Refactor this for conciseness
		// Make search case insensitive
		const where = {};
		if (language) {
			where.language = sequelize.where(
				sequelize.fn('LOWER', sequelize.col('language')),
				'LIKE',
				`%${language.toLowerCase()}%`
			);
		}
		if (composer) {
			where.composer = sequelize.where(
				sequelize.fn('LOWER', sequelize.col('composer')),
				'LIKE',
				`%${composer.toLowerCase()}%`
			);
		}
		if (author) {
			where.author = sequelize.where(
				sequelize.fn('LOWER', sequelize.col('author')),
				'LIKE',
				`%${author.toLowerCase()}%`
			);
		}
		if (title) {
			where.title = sequelize.where(
				sequelize.fn('LOWER', sequelize.col('title')),
				'LIKE',
				`%${title.toLowerCase()}%`
			);
		}

		const songs = await models.song.findAll({
			where,
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
