const { Router } = require('express');

const pingController = Router();

/**
 * GET /ping
 * @summary Check server is up
 * @tags ping
 * @return {object} 200 - Success response
 */
pingController.get('/', (req, res) => {
	res.status(200).json({
		status: 'success',
		data: null,
	});
});

module.exports = pingController;
