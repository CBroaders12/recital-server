const { Router } = require('express');
const { admin } = require('../controllers');

const adminRouter = Router();

adminRouter.use('/users', admin.user);
adminRouter.use('/recitals', admin.recital);
adminRouter.use('/songs', admin.song);

module.exports = adminRouter;
