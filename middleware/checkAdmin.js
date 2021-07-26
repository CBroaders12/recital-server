const { PermissionsError } = require('../errors');

const checkAdmin = (req, res, next) => {
	try {
		if (req.method === 'OPTIONS' || req.user.role === 'admin') {
			next();
		}
		throw new PermissionsError('Insufficient permissions');
	} catch (error) {
		next(error);
	}
};

module.exports = checkAdmin;
