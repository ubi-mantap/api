'use strict';

const pg = require('pg');
const connectionString = process.env.DATABASE_URL;

const logger = require('./logger');

module.exports = {};
module.exports.init = function init(callback) {
  pg.connect(connectionString, (err, client, done) => {
    if (err) {
      logger.error('[DB] Cannot connect!', err);
      return;
    }

    logger.info('[DB] Connection initiated.');

    function destroyClient() {
      logger.info('[DB] Destroying client...');
      done();
      process.exit(0);
    }

    process.on('SIGTERM', destroyClient);
    process.on('SIGINT', destroyClient);

    return callback(client);
  });
};
