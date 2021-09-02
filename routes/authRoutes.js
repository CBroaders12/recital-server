const { Router } = require('express');
const { auth } = require('../controllers');

const authRouter = Router();

authRouter.use('/recitals', auth.recital);

module.exports = authRouter;
