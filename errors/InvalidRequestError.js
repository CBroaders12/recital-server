const GeneralError = require('./GeneralError');

class InvalidRequestError extends GeneralError {
	constructor(message) {
		super(message);
	}
}

module.exports = InvalidRequestError;
