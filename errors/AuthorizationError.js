const GeneralError = require('./GeneralError');

class AuthorizationError extends GeneralError {
	constructor(message) {
		super(message);
	}
}

module.exports = AuthorizationError;
