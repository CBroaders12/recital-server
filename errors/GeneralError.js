class GeneralError extends Error {
	constructor(message) {
		super(message);
	}

	getCode() {
		if (this instanceof AuthorizationError) {
			return 401;
		}
		if (this instanceof NotFoundError) {
			return 404;
		}
		if (this instanceof InvalidRequestError) {
			return 400;
		}
		return 500;
	}
}

module.exports = GeneralError;
