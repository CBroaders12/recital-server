const GeneralError = require('./GeneralError');

class NotFoundError extends GeneralError {
	constructor(message) {
		super(message);
		this.code = 404;
	}
}

module.exports = NotFoundError;
