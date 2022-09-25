const { models } = require('../../../../../db');

async function execute() {
  return models.orders.findAll({
    include: {
      all: true,
      nested: true,
    },
  });
}

module.exports = {
  execute,
};
