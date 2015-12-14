'use strict';

const fs = require('fs');

const logger = require('../libs/logger');

module.exports = function factory(models) {
  const handlers = {};

  fs
    .readdirSync(__dirname)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .map(file => file.split('.')[0])
    .forEach(handlerName => {
      logger.debug(`[Handlers] Including ${handlerName} handler...`);
      handlers[handlerName] = require(`./${handlerName}`)(models);
    });

  return handlers;
};
