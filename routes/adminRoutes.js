const { Router } = require('express');
const { admin } = require('../controllers');

const adminRouter = Router();

adminRouter.use('/songs', admin.song);
adminRouter.use('/users', admin.user);

module.exports = adminRouter;
