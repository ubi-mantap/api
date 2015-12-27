'use strict';

const logger = require('../libs/logger');

module.exports = function factory(db) {
  const TABLE_NAME = 'positions';

  /**
   * Position class
   */
  const Position = {

    /**
     * Create new position
     * @param  {object}   position              The position
     * @param  {string}   position.username     The position's owner username
     * @param  {string}   position.lat          The position's latitude
     * @param  {string}   position.long         The position's longitude
     * @param  {string}   position.name         The position's city name
     * @param  {string}   position.weather      The position's weather
     * @param  {string}   position.timestamp    The position's timestmap
     * @return {Promise}                        The promise
     */
    new(position) {
      logger.debug('[Position Model] New', position);
      position.timestamp = position.timestamp || 'now()';
      const promise = new Promise((resolve, reject) => {
        db.query(
          `INSERT INTO ${TABLE_NAME} (username, lat, long, name, weather, timestamp) VALUES ($1, $2, $3, $4, $5, $6)`,
          [position.username, position.lat, position.long, position.name, position.weather, position.timestamp]
        )
          .then(result => {
            logger.debug('[Position Model] Done creating new position.');
            resolve(result);
          })
          .catch(err => {
            logger.error('[Position Model] Error creating new position.', { position, err });
            reject(err);
          });
      });

      return promise;
    },

    /**
     * Find positions for a username
     * @param  {string}   username  The username
     * @return {Promise}            The promise
     */
    find(username) {
      logger.debug('[Position Model] Find', username);
      const promise = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${TABLE_NAME} WHERE username=$1`, [username])
          .then(result => {
            logger.debug('[Position Model] Done finding position.');
            resolve(result);
          })
          .catch(err => {
            logger.error('[Position Model] Error finding position.', { username, err });
            reject(err);
          });
      });

      return promise;
    },

    /**
     * Find last position for a username
     * @param  {string}   username  The username
     * @return {Promise}            The promise
     */
    findLast(username) {
      logger.debug('[Position Model] Find Last', username);
      const promise = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${TABLE_NAME} WHERE username=$1 ORDER BY id DESC LIMIT 1`, [username])
          .then(result => {
            logger.debug('[Position Model] Done finding last position.');
            resolve(result);
          })
          .catch(err => {
            logger.error('[Position Model] Error finding last position.', { username, err });
            reject(err);
          });
      });

      return promise;
    },

    /**
     * Find last 10 positions for a username
     * @param  {string}   username  The username
     * @param  {string}   timestamp Timestamp (overriding default now())
     * @return {Promise}            The promise
     */
    findLast10(username, timestamp) {
      logger.debug('[Position Model] Find Last 10', { username, timestamp });
      timestamp = timestamp || 'now()';
      const promise = new Promise((resolve, reject) => {
        db.query(`SELECT lat, long FROM ${TABLE_NAME}
                  WHERE username=$1
                  AND (
                       (timestamp BETWEEN timestamp '${timestamp}' - interval '7 days 00:05:00'
                                      AND timestamp '${timestamp}' - interval '7 days -00:05:00')
                    OR (timestamp BETWEEN timestamp '${timestamp}' - interval '14 days 00:05:00'
                                      AND timestamp '${timestamp}' - interval '14 days -00:05:00')
                    OR (timestamp BETWEEN timestamp '${timestamp}' - interval '21 days 00:05:00'
                                      AND timestamp '${timestamp}' - interval '21 days -00:05:00')
                    OR (timestamp BETWEEN timestamp '${timestamp}' - interval '28 days 00:05:00'
                                      AND timestamp '${timestamp}' - interval '28 days -00:05:00')
                    OR (timestamp BETWEEN timestamp '${timestamp}' - interval '35 days 00:05:00'
                                      AND timestamp '${timestamp}' - interval '35 days -00:05:00')
                    OR (timestamp BETWEEN timestamp '${timestamp}' - interval '42 days 00:05:00'
                                      AND timestamp '${timestamp}' - interval '42 days -00:05:00')
                    OR (timestamp BETWEEN timestamp '${timestamp}' - interval '49 days 00:05:00'
                                      AND timestamp '${timestamp}' - interval '49 days -00:05:00')
                    OR (timestamp BETWEEN timestamp '${timestamp}' - interval '56 days 00:05:00'
                                      AND timestamp '${timestamp}' - interval '56 days -00:05:00')
                    OR (timestamp BETWEEN timestamp '${timestamp}' - interval '63 days 00:05:00'
                                      AND timestamp '${timestamp}' - interval '63 days -00:05:00')
                    OR (timestamp BETWEEN timestamp '${timestamp}' - interval '70 days 00:05:00'
                                      AND timestamp '${timestamp}' - interval '70 days -00:05:00')
                  )
                  ORDER BY id DESC LIMIT 10`, [username])
          .then(result => {
            logger.debug('[Position Model] Done finding last 10 position. Found', result.length, 'results.');
            resolve(result);
          })
          .catch(err => {
            logger.error('[Position Model] Error finding last 10 position.', { username, err });
            reject(err);
          });
      });

      return promise;
    }

  };

  return Position;
};
