const { Router } = require('express');
const controllers = require('../controllers');

const authRouter = Router();

authRouter.use('/recitals', controllers.recital);

module.exports = authRouter;
