const models = require('../../models');

const { Router } = require('express');
const { InvalidRequestError, NotFoundError } = require('../../errors');

const songController = Router();

/**
 * POST /auth/songs
 * @summary Create a new song
 * @tags songs
 * @param {object} request.body.required - Song details
 * @return {object} 201 - Song created
 * @return {object} 400 - Invalid request error response
 * @return {object} 401 - Authorization error response
 */

/**
 * GET /auth/songs
 * @summary Get all song's made by a user
 * @tags songs
 * @return {object} 200 - List of user's songs
 * @return {object} 401 - Authorization error response
 * @return {object} 404 - Not Found error response
 */
songController
  .route('/')
  .post(async (req, res, next) => {
    try {
      const { title, composer, language, period } = req.body;
      const { id: userId } = req.user;

      if (!title || !composer || !language)
        throw new InvalidRequestError('Song missing required information');

      const newSong = await models.song.create({
        title,
        composer,
        language,
        period,
        userId,
      });

      res.status(201).json({
        status: 'success',
        data: {
          song: newSong,
        },
      });
    } catch (error) {
      next(error);
    }
  })
  .get(async (req, res, next) => {
    try {
      const { id: userId } = req.user;

      const userSongs = await models.song.findAll({
        where: {
          userId,
        },
      });

      res.status(200).json({
        status: 'success',
        data: {
          count: userSongs.length,
          songs: userSongs,
        },
      });
    } catch (error) {
      next(error);
    }
  });

/**
 * PATCH /auth/songs/{songId}
 * @summary Update a user's song
 * @tags songs
 * @param {object} request.body.required - Information to update
 * @param {number} songId.path.required - Id of the song
 * @return {object} 200 - Song updated
 * @return {object} 400 - Invalid request response
 * @return {object} 401 - Authorization error response
 * @return {object} 404 - Not found error response
 */

/**
 * DELETE /auth/songs/{songId}
 * @summary Delete a user's song
 * @tags songs
 * @param {number} songId.path.required - Id of the song
 * @return {object} 200 - Recital deleted
 * @return {object} 401 - Authorization error response
 * @return {object} 404 - Not found error response
 */

songController
  .route('/:songId')
  .patch(async (req, res, next) => {
    try {
      const { title, language, composer, period } = req.body;
      const { songId } = req.params;
      const { id: userId } = req.user;

      if (!song.title && !song.composer && !song.language && !song.period)
        throw new InvalidRequestError('Song missing required information');

      const [count, patchedSong] = await models.song.update(
        {
          title,
          composer,
          language,
          period,
        },
        {
          returning: true,
          where: {
            id: songId,
            userId,
          },
        }
      );

      if (count === 0)
        throw new NotFoundError('No song with given id found for user');

      res.status(200).json({
        status: 'success',
        data: {
          song: patchedSong[0],
        },
      });
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const { songId } = req.params;
      const { id: userId } = req.user;

      const toDestroy = await models.song.findOne({
        where: {
          id: songId,
          userId,
        },
      });

      if (!toDestroy) throw new NotFoundError('No song with given id found');

      await toDestroy.destroy();

      res.status(200).json({
        status: 'success',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  });

module.exports = songController;
