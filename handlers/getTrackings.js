'use strict';

const logger = require('../libs/logger');

module.exports = function factory(models) {
  return function getTrackings(req, res) {
    logger.debug('[GetTrackings Handler] Got request.', req.query);

    const username = req.query.username;

    models.Tracking.findTrackings(username)
      .then(result => {
        logger.debug('[GetTrackings Handler] Get trackings success.');
        res.json({ ok: true, trackings: result });
      })
      .catch(err => {
        logger.error('[GetTrackings Handler] Error getting trackings.', err);
        res.json({ ok: false, trackings: [] });
      });
  };
};
