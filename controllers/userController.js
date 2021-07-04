const models = require('../models');
const { UniqueConstraintError } = require('sequelize/lib/errors');
const {
	AuthorizationError,
	InvalidRequestError,
	GeneralError,
} = require('../errors');
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
		const { email, password } = req.body;

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
		console.log('******* ERROR CAUGHT ********');
		if (error instanceof GeneralError) console.log(error.getCode());
		next(error);
	}
});

userController.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) throw new Error('Credentials missing');

		const user = await models.user.findOne({
			where: {
				email,
			},
		});

		if (user === null) throw new AuthorizationError('No user found');

		if (bcrypt.compareSync(password, user.password)) {
			const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
				expiresIn: '1d',
			});
			res.status(200).json({
				token,
			});
		} else {
			throw new AuthorizationError('Incorrect password');
		}
	} catch (error) {
		if (error.message === 'Credentials missing') {
			res.status(400).json({
				message: 'Please provide email and password',
			});
		} else if (error instanceof AuthorizationError) {
			res.status(401).json({
				message: 'Incorrect email or password',
			});
		} else {
			res.status(500).send();
		}
	}
});

module.exports = userController;
