const models = require('../../models');

const { Router } = require('express');
const { InvalidRequestError, NotFoundError } = require('../../errors');

const songController = Router();

songController.get('/ping', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: null,
  });
});

songController.post('/', async (req, res, next) => {
  try {
    const { title, composer, language } = req.body;
    const { id: userId } = req.user;

    if (!title || !composer || !language)
      throw new InvalidRequestError('Song missing required information');

    const newSong = await models.song.create({
      title,
      composer,
      language,
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
});

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
