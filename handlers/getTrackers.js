'use strict';

const logger = require('../libs/logger');

module.exports = function factory(models) {
  return function getTrackers(req, res) {
    logger.debug('[GetTrackers Handler] Got request.', req.query);

    const username = req.query.username;

    models.Tracking.findTrackers(username)
      .then(result => {
        logger.debug('[GetTrackers Handler] Get trackers success.');
        res.json({ ok: true, trackers: result });
      })
      .catch(err => {
        logger.error('[GetTrackers Handler] Error getting trackers.', err);
        res.json({ ok: false, trackers: [] });
      });
  };
};
