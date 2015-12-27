'use strict';

const async = require('async');
const logger = require('../libs/logger');

module.exports = function factory(models) {
  return function init(req, res) {
    logger.debug('[Init Handler] Got request.', req.body);

    const trackerUsername = req.body.trackerUsername;
    const trackedUsername = req.body.trackedUsername;

    async.parallel([
      createNotification,
      createTracking
    ], (err, results) => {
      if (err) {
        logger.error('[Init Handler] Init error.', err);
        return res.json({ ok: false, message: 'Init failed. Try again.' });
      }

      logger.debug('[Init Handler] Init success.', results);
      res.json({ ok: true });
    });

    function createNotification(callback) {
      const notification = {
        username: trackedUsername,
        type: 'trackRequest',
        message: `${trackerUsername} wants to track you.`,
        data: { trackerUsername, trackedUsername }
      };

      models.Notification.new(notification)
        .then(callback.bind(null, null))
        .catch(callback);
    }

    function createTracking(callback) {
      const tracking = { trackerUsername, trackedUsername };
      models.Tracking.new(tracking)
        .then(callback.bind(null, null))
        .catch(callback);
    }
  };
};
