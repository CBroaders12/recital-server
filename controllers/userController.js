const models = require('../models');
const {
	UniqueConstraintError,
	ValidationError,
} = require('sequelize/lib/errors');
const { Router } = require('express');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userController = Router();

// Ping user route
userController.get('/', (req, res) => {
	res.status(200).send();
});

// TODO: Register new user
userController.post('/register', async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!password) throw new ValidationError('Password missing');

		const newUser = await models.user.create({
			email,
			password: bcrypt.hashSync(password),
		});

		const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);

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

module.exports = userController;
