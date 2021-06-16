const jwt = require('jsonwebtoken');
const { AuthorizationError } = require('../errors');
const models = require('../models');

const validateToken = async (req, res, next) => {
	if (req.method === 'OPTIONS') {
		next();
	}
	try {
		if (!req.headers.authorization)
			throw new AuthorizationError('No token provided');

		const { authorization } = req.headers;

		const token = authorization.includes('Bearer')
			? authorization.split(' ')[1]
			: authorization;

		const payload = jwt.verify(token, process.env.JWT_SECRET);

		if (!payload) throw new AuthorizationError('Invalid token');

		const user = await models.user.findOne({
			where: { id: payload.id },
		});
		req.user = user;
		next();
	} catch (error) {
		if (error instanceof AuthorizationError) {
			res.status(401).json({
				message: 'Missing or invalid token',
			});
		} else {
			res.status(500).send();
		}
	}
};

module.exports = validateToken;
