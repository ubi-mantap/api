'use strict';

const logger = require('../libs/logger');

module.exports = function factory(db) {
  const TABLE_NAME = 'notifications';

  /**
   * Notification class
   */
  const Notification = {

    /**
     * Create new notification
     * @param  {object}   notification            The notification
     * @param  {string}   notification.username   The username the notification is for
     * @param  {string}   notification.type       The notification's type
     * @param  {string}   notification.message    The notification's message
     * @param  {object}   notification.data       The notification's data
     * @return {Promise}                          The promise
     */
    new(notification) {
      logger.debug('[Notification Model] New', notification);
      const promise = new Promise((resolve, reject) => {
        db.query(
          `INSERT INTO ${TABLE_NAME} (username, type, message, data, sent) VALUES ($1, $2, $3, $4, $5)`,
          [notification.username, notification.type, notification.message, JSON.stringify(notification.data), false]
        )
          .then(result => {
            logger.debug('[Notification Model] Creating new notification done.');
            resolve(result);
          })
          .catch(err => {
            logger.error('[Notification Model] Error creating new notification.', { notification, err });
            reject(err);
          });
      });

      return promise;
    },

    /**
     * Find notification for a username
     * @param  {string}   username  The username
     * @return {Promise}            The promise
     */
    find(username) {
      logger.debug('[Notification Model] Find', username);
      const promise = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${TABLE_NAME} WHERE username=$1 AND sent=$2`, [username, false])
          .then(result => {
            logger.debug('[Notification Model] Finding notification done.');
            resolve(result);
          })
          .catch(err => {
            logger.error('[Notification Model] Error creating finding notification.', { username, err });
            reject(err);
          });
      });

      return promise;
    },

    /**
     * Set the sent flag of a notification to true
     * @param  {integer}  notificationId  The ID of the notification
     * @return {Promise}                  The promise
     */
    sent(notificationId) {
      logger.debug('[Notification Model] Sent', notificationId);
      const promise = new Promise((resolve, reject) => {
        db.query(`UPDATE ${TABLE_NAME} SET sent=$1 WHERE id=$2`, [true, notificationId])
          .then(result => {
            logger.debug('[Notification Model] Updating notification sent done.');
            resolve(result);
          })
          .catch(err => {
            logger.error('[Notification Model] Error updating notification sent.', { notificationId, err });
            reject(err);
          });
      });

      return promise;
    }

  };

  return Notification;
};
