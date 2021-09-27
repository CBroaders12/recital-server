const models = require('../../db/models');
const { Router } = require('express');

const recitalController = Router();

recitalController.get('/', async (req, res, next) => {
  try {
    const { offset, limit } = req.query;

    const allRecitals = await models.recital.findAll({ limit, offset });

    res.status(200).json({
      status: 'success',
      data: {
        count: allRecitals.length,
        recitals: allRecitals,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = recitalController;
