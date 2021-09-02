const { Router } = require('express');
const { open } = require('../controllers');

const openRouter = Router();

openRouter.use('/ping', open.ping);
openRouter.use('/users', open.user);
openRouter.use('/songs', open.song);

module.exports = openRouter;
