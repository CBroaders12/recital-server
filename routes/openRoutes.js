const { Router } = require('express');
const controllers = require('../controllers');

const openRouter = Router();

openRouter.use('/ping', controllers.ping);
openRouter.use('/users', controllers.user);

module.exports = openRouter;
