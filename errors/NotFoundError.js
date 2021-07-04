const GeneralError = require('./GeneralError');

class NotFoundError extends GeneralError {
	constructor(message) {
		super(message);
	}
}

module.exports = NotFoundError;
