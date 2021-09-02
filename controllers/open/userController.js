const models = require('../../models');
const { AuthorizationError, InvalidRequestError } = require('../../errors');
const { Router } = require('express');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userController = Router();

/**
 * A user
 * @typedef User
 * @property email.required - User email
 * @property password.required - User password
 */

/**
 * GET /users/ping
 * @summary Check user route is up
 * @tags ping
 * @tags users
 * @return {object} 200 - Success response
 */
userController.get('/ping', (req, res) => {
	res.status(200).json({
		status: 'success',
		data: null,
	});
});

/**
 * POST /users/register
 * @summary Register a new user
 * @tags users
 * @param {User} request.body.required - user info
 * @return {object} 200 - User registered with token
 * @return {object} 400 - Invalid request response
 */
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

/**
 * POST /users/login
 * @summary Login an existing user
 * @tags users
 * @param {User} request.body.required - User info
 * @return {object} 200 - User logged in with token
 * @return {object} 400 - Invalid request response
 */
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
				status: 'success',
				data: {
					token,
					email,
				},
			});
		} else {
			throw new AuthorizationError('Incorrect email or password');
		}
	} catch (error) {
		next(error);
	}
});

module.exports = userController;
