'use strict';

const logger = require('../libs/logger');

module.exports = function factory(db) {
  const TABLE_NAME = 'trackings';

  /**
   * Tracking class
   */
  const Tracking = {

    /**
     * Create new user
     * @param  {object}   tracking                   The tracking details
     * @param  {string}   tracking.trackerUsername   The tracking details
     * @param  {string}   tracking.trackedUsername   The tracking details
     * @return {Promise}                             The promise
     */
    new(tracking) {
      logger.debug('[Tracking Model] New', tracking);
      var promise = new Promise((resolve, reject) => {
        db.query(
          `INSERT INTO ${TABLE_NAME} (tracker_username, tracked_username, active) VALUES ($1, $2, $3)`,
          [tracking.trackerUsername, tracking.trackedUsername, false]
        )
          .then(result => {
            logger.debug('[Tracking Model] Creating new tracking done.');
            resolve(result);
          })
          .catch(err => {
            logger.error('[Tracking Model] Error creating new tracking.', { tracking, err });
            reject(err);
          });
      });

      return promise;
    },

    /**
     * Create new user
     * @param  {object}   tracking                   The tracking details
     * @param  {string}   tracking.trackerUsername   The tracking details
     * @param  {string}   tracking.trackedUsername   The tracking details
     * @param  {boolean}  active                     Active status
     * @return {Promise}                             The promise
     */
    setActive(tracking, active) {
      logger.debug('[Tracking Model] Set Active', { tracking, active });
      var promise = new Promise((resolve, reject) => {
        db.query(
          `UPDATE ${TABLE_NAME} SET active=$1 WHERE tracker_username=$2 AND tracked_username=$3`,
          [active, tracking.trackerUsername, tracking.trackedUsername]
        )
          .then(result => {
            logger.debug('[Tracking Model] Set active done.');
            resolve(result);
          })
          .catch(err => {
            logger.error('[Tracking Model] Error set active.', { tracking, err });
            reject(err);
          });
      });

      return promise;
    },

    /**
     * Find trackers of a username
     * @param  {string}   username  The username
     * @return {Promise}            The promise
     */
    findTrackers(username) {
      logger.debug('[Tracking Model] Find Trackers', username);
      var promise = new Promise((resolve, reject) => {
        db.query(`SELECT tracker_username FROM ${TABLE_NAME} WHERE tracked_username=$1 AND active=$2`, [username, true])
          .then(result => {
            logger.debug('[Tracking Model] Finding trackers done.');
            resolve(result);
          })
          .catch(err => {
            logger.error('[Tracking Model] Error finding trackers.', { username, err });
            reject(err);
          });
      });

      return promise;
    },

    /**
     * Find trackings of a username
     * @param  {string}   username  The username
     * @return {Promise}            The promise
     */
    findTrackings(username) {
      logger.debug('[Tracking Model] Find Trackings', username);
      var promise = new Promise((resolve, reject) => {
        db.query(`SELECT tracked_username FROM ${TABLE_NAME} WHERE tracker_username=$1 AND active=$2`, [username, true])
          .then(result => {
            logger.debug('[Tracking Model] Finding trackings done.');
            resolve(result);
          })
          .catch(err => {
            logger.error('[Tracking Model] Error finding trackings.', { username, err });
            reject(err);
          });
      });

      return promise;
    }

  };

  return Tracking;
};
