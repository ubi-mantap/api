'use strict';

const async = require('async');
const logger = require('../libs/logger');

module.exports = function factory(models) {
  return function getTrackings(req, res) {
    logger.debug('[GetTrackings Handler] Got request.', req.query);

    const username = req.query.username;

    models.Tracking.findTrackings(username)
      .then(result => {
        logger.debug('[GetTrackings Handler] Get trackings success.');
        async.map(result, fetchTrackingDetail, (err, trackings) => {
          res.json({ ok: true, trackings });
        });
      })
      .catch(err => {
        logger.error('[GetTrackings Handler] Error getting trackings.', err);
        res.json({ ok: false, trackings: [] });
      });
  };

  function fetchTrackingDetail(user, callback) {
    logger.debug(`[GetTrackings Handler] Getting last position for ${user.username}`);
    models.Position.findLast(user.username)
      .then(result => {
        result = result[0];
        const detail = {
          username: result.username,
          location: {
            lat: result.lat,
            long: result.long,
            name: result.name
          },
          weather: result.weather,
          timestamp: result.timestamp
        };

        callback(null, detail);
      })
      .catch(callback);
  }
};
