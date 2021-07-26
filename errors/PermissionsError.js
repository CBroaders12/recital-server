const GeneralError = require('./GeneralError');

class PermissionsError extends GeneralError {
	constructor(message) {
		super(message);
		this.code = 403;
	}
}

module.exports = PermissionsError;
