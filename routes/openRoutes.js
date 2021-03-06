const { Router } = require('express');
const { open } = require('../controllers');

const openRouter = Router();

openRouter.use('/health', open.ping);
openRouter.use('/users', open.user);

module.exports = openRouter;
