const models = require('../../models');
const { Router } = require('express');

const songController = Router();

songController.get('/', async (req, res, next) => {
  try {
    const { offset = 0, limit = 20 } = req.query;

    const allSongs = await models.song.findAll({ limit, offset });

    res.status(200).json({
      status: 'success',
      data: {
        count: allSongs.length,
        songs: allSongs,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = songController;
