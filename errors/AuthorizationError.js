const GeneralError = require('./GeneralError');

class AuthorizationError extends GeneralError {
	constructor(message) {
		super(message);
		this.code = 401;
	}
}

module.exports = AuthorizationError;
