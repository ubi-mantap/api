'use strict';

const fs = require('fs');

const logger = require('../libs/logger');

module.exports = function factory(db) {
  const models = {};

  fs
    .readdirSync(__dirname)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .map(file => file.split('.')[0])
    .forEach(modelName => {
      logger.debug(`[Models] Including ${modelName} model...`);
      models[modelName] = require(`./${modelName}`)(db);
    });

  return models;
};
