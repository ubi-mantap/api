'use strict';

const logger = require('../libs/logger');

module.exports = function factory(models) {
  return function register(req, res) {
    logger.debug('[Register Handler] Got request.', req.body);

    const username = req.body.username;

    models.User
      .new(username)
      .then(() => {
        logger.debug('[Register Handler] Register success.');
        res.json({ ok: true });
      })
      .catch(err => {
        logger.error('[Register Handler] Register error.', err);
        res.json({ ok: false, message: 'Register failed. Try again.' });
      });
  };
};
