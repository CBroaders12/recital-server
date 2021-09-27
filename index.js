const app = require('./app');
const db = require('./db/models');

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync();
    app.listen(process.env.PORT, () => {
      console.log(
        `[SERVER]: Listening at http://localhost:${process.env.PORT}`
      );
    });
  } catch (error) {
    console.log('[SERVER]: Server crashed');
    console.error(error);
  }
};

startServer();
