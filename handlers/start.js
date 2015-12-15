'use strict';

const async = require('async');
const logger = require('../libs/logger');

module.exports = function factory(models) {
  return function start(req, res) {
    logger.debug('[Start Handler] Got request.', req.body);

    const trackerUsername = req.body.trackerUsername;
    const trackedUsername = req.body.trackedUsername;
    const status = req.body.status === 'true';

    async.parallel([
      createNotification,
      updateTracking
    ], (err, results) => {
      if (err) {
        logger.error('[Start Handler] Start error.', err);
        return res.json({ ok: false, message: 'Start failed. Try again.' });
      }

      logger.debug('[Start Handler] Start success.', results);
      res.json({ ok: true });
    });

    function createNotification(callback) {
      const notification = {
        username: trackerUsername,
        type: 'trackResponse',
        message: `${trackedUsername} ${status ? 'accepted' : 'rejected'} your tracking request.`,
        data: { trackerUsername, trackedUsername, status }
      };

      models.Notification.new(notification)
        .then(callback.bind(null, null))
        .catch(callback);
    }

    function updateTracking(callback) {
      const tracking = { trackerUsername, trackedUsername };
      models.Tracking.setActive(tracking, status)
        .then(callback.bind(null, null))
        .catch(callback);
    }
  };
};
