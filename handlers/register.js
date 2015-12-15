'use strict';

const logger = require('../libs/logger');

module.exports = function factory(models) {
  return function register(req, res) {
    logger.debug('[Register Handler] Got request.', req.body);

    const username = req.body.username;

    models.User
      .new(username)
      .then(() => {
        res.json({ ok: true });
      })
      .catch(() => {
        res.json({ ok: false, message: 'Register failed. Try again.' });
      });
  };
};
