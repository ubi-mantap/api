'use strict';

const logger = require('../libs/logger');

module.exports = function factory(models) {
  return function getNotifications(req, res) {
    logger.debug('[GetNotifications Handler] Got request.', req.query);

    const username = req.query.username;

    models.Notification.findUnsent(username)
      .then(result => {
        logger.debug('[GetNotifications Handler] Get notifications success.');
        const notifications = result.map(notification => {
          notification.data = JSON.parse(notification.data);
          return notification;
        });
        res.json({ ok: true, notifications });

        return result;
      })
      .then(result => {
        result.forEach(notification => {
          logger.debug(`[GetNotifications Handler] Setting sent flag for ${notification.id}.`);
          models.Notification.sent(notification.id)
            .catch(err => {
              logger.error(`[GetNotifications Handler] Error setting sent flag for ${notification.id}.`, err);
            });
        });
      })
      .catch(err => {
        logger.error('[GetNotifications Handler] Error getting notification.', err);
        res.json({ ok: false, notifications: [] });
      });
  };
};
