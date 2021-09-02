const { Router } = require('express');

const pingController = Router();

pingController.get('/', (req, res) => {
	res.status(200).json({
		status: 'success',
		data: null,
	});
});

module.exports = pingController;
