'use strict';

const logger = require('../libs/logger');

module.exports = function factory(models) {
  return function init(req, res) {
    logger.debug('[Init Handler] Got request.', req.body);

    const notification = {
      username: req.body.trackedUsername,
      type: 'trackRequest',
      message: `You have a new tracking request from ${req.body.trackerUsername}.`,
      data: {
        trackerUsername: req.body.trackerUsername,
        trackedUsername: req.body.trackedUsername
      }
    };

    models.Notification.new(notification)
      .then(() => {
        logger.debug('[Init Handler] Init success.');
        res.json({ ok: true });
      })
      .catch(err => {
        logger.error('[Init Handler] Init error.', err);
        res.json({ ok: false, message: 'Init failed. Try again.' });
      });
  };
};
