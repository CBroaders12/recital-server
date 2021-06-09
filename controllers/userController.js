const models = require('../models');
const {
	UniqueConstraintError,
	ValidationError,
} = require('sequelize/lib/errors');
const { AuthorizationError } = require('../errors');
const { Router } = require('express');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userController = Router();

// Ping user route
userController.get('/', (req, res) => {
	res.status(200).send();
});

userController.post('/register', async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!password) throw new ValidationError('Password missing');

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
		if (error instanceof UniqueConstraintError) {
			res.status(400).json({
				message: 'Email is already registered',
			});
		} else if (error instanceof ValidationError) {
			res.status(400).json({
				message: 'Missing email or password',
			});
		} else {
			console.error(error.message);
			res.status(500).send();
		}
	}
});

// TODO: Login new user
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
