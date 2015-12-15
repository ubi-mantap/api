'use strict';

const async = require('async');
const logger = require('../libs/logger');

module.exports = function factory(models) {
  return function stop(req, res) {
    logger.debug('[Stop Handler] Got request.', req.body);

    const trackerUsername = req.body.trackerUsername;
    const trackedUsername = req.body.trackedUsername;

    async.parallel([
      createNotification,
      deleteTracking
    ], (err, results) => {
      if (err) {
        logger.error('[Stop Handler] Stop error.', err);
        return res.json({ ok: false, message: 'Stop failed. Try again.' });
      }

      logger.debug('[Stop Handler] Stop success.', results);
      res.json({ ok: true });
    });

    function createNotification(callback) {
      logger.debug('[Stop Handler] Creating notifications...', req.body);
      async.parallel([
        createTrackerNotification,
        createTrackedNotification
      ], (err, results) => {
        if (err) {
          logger.error('[Stop Handler] Error creating notifications.', err);
          return callback(err);
        }

        logger.debug('[Stop Handler] Creating notifications done', results);
        callback(null, results);
      });

      function createTrackerNotification(cb) {
        const trackerNotification = {
          username: trackerUsername,
          type: 'trackStop',
          message: `You have stopped tracking ${trackedUsername}.`,
          data: { trackerUsername, trackedUsername }
        };

        models.Notification.new(trackerNotification)
          .then(cb.bind(null, null))
          .catch(cb);
      }

      function createTrackedNotification(cb) {
        const trackedNotification = {
          username: trackedUsername,
          type: 'trackStop',
          message: `You have stopped being tracked by ${trackerUsername}.`,
          data: { trackerUsername, trackedUsername }
        };

        models.Notification.new(trackedNotification)
          .then(cb.bind(null, null))
          .catch(cb);
      }
    }

    function deleteTracking(callback) {
      const tracking = { trackerUsername, trackedUsername };
      logger.debug('[Stop Handler] Deleting tracking...', tracking);
      models.Tracking.delete(tracking)
        .then(callback.bind(null, null))
        .catch(callback);
    }
  };
};
