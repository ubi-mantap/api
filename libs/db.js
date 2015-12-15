'use strict';

const pgp = require('pg-promise')();
const connectionString = process.env.DATABASE_URL;

module.exports = pgp(connectionString);
