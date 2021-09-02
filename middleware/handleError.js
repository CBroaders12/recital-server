const { GeneralError } = require('../errors');
const { UniqueConstraintError } = require('sequelize/lib/errors');
const JsonWebTokenError = require('jsonwebtoken/lib/JsonWebTokenError');

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
	if (err instanceof JsonWebTokenError) {
		return res.status(401).json({
			status: 'error',
			message: err.message,
		});
	}
	console.error(err);
	return res.status(500).json({
		status: 'error',
		message: 'Server Error',
	});
};

module.exports = handleError;
