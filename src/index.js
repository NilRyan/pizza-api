const app = require('./app');
const sequelize = require('./db/index');

const port = process.env.PORT || 3001;

async function assertDatabaseConnectionOk() {
  try {
    await sequelize.sync({ force: true });
    await sequelize.authenticate();
    /* eslint-disable no-console */
    console.log('Database connection OK!');
    /* eslint-disable no-console */
  } catch (error) {
    /* eslint-disable no-console */
    console.log('Unable to connect to the database:');
    console.log(error.message);
    /* eslint-disable no-console */
    process.exit(1);
  }
}

async function init() {
  await assertDatabaseConnectionOk();

  app.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`Listening: http://localhost:${port}`);
    /* eslint-enable no-console */
  });
}

init();
