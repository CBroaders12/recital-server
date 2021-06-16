class InvalidRequestError extends Error {
	constructor(message) {
		super(message);
	}
}

module.exports = InvalidRequestError;
