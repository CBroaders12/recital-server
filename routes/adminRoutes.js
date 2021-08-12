const { Router } = require('express');
const controllers = require('../controllers');

const adminRouter = Router();

adminRouter.use('/songs', controllers.song);

module.exports = adminRouter;
