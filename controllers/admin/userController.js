const models = require('../../db/models');
const { InvalidRequestError, NotFoundError } = require('../../errors');
const { Router } = require('express');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userController = Router();

userController.get('/', async (req, res, next) => {
  try {
    let { offset = 0, limit = 20 } = req.query;

    let allUsers = await models.user.findAll({
      limit,
      offset,
      attributes: {
        exclude: ['password'],
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        count: allUsers.length,
        users: allUsers,
      },
    });
  } catch (error) {
    next(error);
  }
});

// TODO: Add password reset path
userController.route('/:userId').delete(async (req, res, next) => {
  try {
    const { userId } = req.params;

    const toDelete = await models.findOne({
      where: {
        id: userId,
      },
    });

    if (!toDelete) throw new NotFoundError('No user with given id found');

    await toDelete.destroy();

    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
});

userController.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;

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
