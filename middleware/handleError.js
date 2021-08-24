const { GeneralError } = require('../errors');
const { UniqueConstraintError } = require('sequelize/lib/errors');

const handleError = (err, req, res, next) => {
	if (err instanceof GeneralError) {
		return res.status(err.getCode()).json({
			status: 'fail',
			data: {
				message: err.message,
			},
		});
	}
	if (err instanceof UniqueConstraintError) {
		return res.status(400).json({
			status: 'fail',
			data: {
				message: 'Email is already registered',
			},
		});
	}

	return res.status(500).json({
		status: 'error',
		message: err.message,
	});
};

module.exports = handleError;
