class GeneralError extends Error {
	constructor(message) {
		super(message);
		this.code = 400;
	}

	getCode() {
		return this.code;
	}
}

module.exports = GeneralError;
