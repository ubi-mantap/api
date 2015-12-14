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
     * @param  {object}   position.name         The position's city name
     * @param  {object}   position.weather      The position's weather
     * @param  {object}   position.timestamp    The position's timestamp
     * @return {Promise}                        The promise
     */
    new(position) {
      logger.debug('[Position Model] New', position);
      const promise = new Promise((resolve, reject) => {
        db.query(
          `INSERT INTO ${TABLE_NAME} (lat, long, name, weather, timestamp) VALUES ($1, $2, $3, $4, $5)`,
          [position.lat, position.long, position.name, position.weather, position.timestamp],
          (err, result) => {
            if (err) {
              logger.debug('[Position Model] Error creating new position.', { position, err });
              return reject(err);
            }

            logger.debug('[Position Model] Done creating new position.');
            resolve(result);
          }
        );
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
        db.query(`SELECT * FROM ${TABLE_NAME} WHERE username=$1`, [username], (err, result) => {
          if (err) {
            logger.debug('[Position Model] Error finding position.', { username, err });
            return reject(err);
          }

          logger.debug('[Position Model] Done finding position.');
          resolve(result);
        });
      });

      return promise;
    },

    /**
     * Find last 10 positions for a username
     * @param  {string}   username  The username
     * @return {Promise}            The promise
     */
    findLast10(username) {
      logger.debug('[Position Model] Find Last 10', username);
      const promise = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${TABLE_NAME} WHERE username=$1 LIMIT 10 ORDER BY id DESC`, [username], (err, result) => {
          if (err) {
            logger.debug('[Position Model] Error finding last 10 position.', { username, err });
            return reject(err);
          }

          logger.debug('[Position Model] Done finding last 10 position.');
          resolve(result);
        });
      });

      return promise;
    }

  };

  return Position;
};
