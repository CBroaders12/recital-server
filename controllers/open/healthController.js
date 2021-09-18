const { Router } = require('express');

const healthController = Router();

/**
 * GET /health
 * @summary Check server is up
 * @tags health
 * @return {object} 200 - Success response
 */
healthController.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: null,
  });
});

module.exports = healthController;
