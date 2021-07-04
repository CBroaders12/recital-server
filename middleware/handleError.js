const { GeneralError } = require('../errors');
const { UniqueConstraintError } = require('sequelize/lib/errors');

const handleError = (err, req, res, next) => {
	console.log('****** IN ERROR HANDLER ******');
	console.error(err.stack);
	if (err instanceof GeneralError) {
		console.log(err.getCode());
		res.status(err.getCode()).json({
			status: 'error',
			message: err.message,
		});
	}
	if (err instanceof UniqueConstraintError) {
		res.status(400).json({
			status: 'error',
			message: 'Email is already registered',
		});
	}

	res.status(500).json({
		status: 'error',
		message: err.message,
	});
};

module.exports = handleError;
