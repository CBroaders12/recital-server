const models = require('../../models');
const { InvalidRequestError } = require('../../errors');
const { Router } = require('express');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userController = Router();

userController.post('/register', async (req, res, next) => {
	try {
		const { email, password } = req.body.user;

		if (!password || !email)
			throw new InvalidRequestError('Missing email or password');

		const newAdmin = await models.user.create({
			email,
			password: bcrypt.hashSync(password),
			role: 'admin',
		});

		const token = jwt.sign({ id: newAdmin.id }, process.env.JWT_SECRET, {
			expiresIn: '1d',
		});

		res.status(201).json({
			status: 'success',
			data: {
				token,
				email,
			},
		});
	} catch (error) {
		next(error);
	}
});

module.exports = userController;
