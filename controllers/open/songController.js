const models = require('../../models');

const { Router } = require('express');
const { NotFoundError } = require('../../errors');
const { sequelize } = require('../../models');

const songController = Router();

/**
 * GET /songs
 * @summary Get all songs
 * @tags songs
 * @param {number} limit.query - Number of songs to get (default 20)
 * @param {number} offset.query - Id of song to start after (default 0)
 * @param {string} title.query - Song title
 * @param {string} composer.query - Composer name
 * @param {string} author.query - Author name
 * @param {string} language.query - Original language
 * @return {object} 200 - Success response
 * @return {object} 404 - Not found response
 * @example response - 200 - example response
 * {
 * 	status: "success",
 * 	data: {
 * 		count: 1,
 * 		songs: [
 * 			{
 * 				id: 117,
        		title: "Du bist die Ruh",
       			composer: "Franz Schubert",
        		author: "Friedrich Rückert",
        		language: "German",
        		composition_year: 1823,
				original_key: "E-flat major",
				catalogue_number: "D. 776",
				period: "Romantic",
				from: null
 * 			}
 * 		]
 * 	}
 * }
 */
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
