const { Router } = require('express');

const { auth } = require('../controllers');

const authRouter = Router();

authRouter.use('/recitals', auth.recital);
authRouter.use('/songs', auth.song);

module.exports = authRouter;
