const models = require('../models');
const { AuthorizationError, InvalidRequestError } = require('../errors');
const { Router } = require('express');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userController = Router();

// Ping user route
userController.get('/ping', (req, res) => {
	res.status(200).send();
});

userController.post('/register', async (req, res, next) => {
	try {
		const { email, password } = req.body.user;

		if (!password || !email)
			throw new InvalidRequestError('Missing email or password');

		const newUser = await models.user.create({
			email,
			password: bcrypt.hashSync(password),
		});

		const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
			expiresIn: '1d',
		});

		res.status(201).json({
			token,
		});
	} catch (error) {
		next(error);
	}
});

userController.post('/login', async (req, res, next) => {
	try {
		const { email, password } = req.body.user;

		if (!email || !password)
			throw new InvalidRequestError('Please provide email and password');

		const user = await models.user.findOne({
			where: {
				email,
			},
		});

		if (user === null)
			throw new AuthorizationError('Incorrect email or password');

		if (bcrypt.compareSync(password, user.password)) {
			const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
				expiresIn: '1d',
			});
			res.status(200).json({
				token,
			});
		} else {
			throw new AuthorizationError('Incorrect email or password');
		}
	} catch (error) {
		next(error);
	}
});

// TODO: Move this to an admin controller
userController.post('/admin', async (req, res, next) => {
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
			token,
		});
	} catch (error) {
		next(error);
	}
});

module.exports = userController;
