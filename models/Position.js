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
     * @return {Promise}                        The promise
     */
    new(position) {
      logger.debug('[Position Model] New', position);
      const promise = new Promise((resolve, reject) => {
        db.query(
          `INSERT INTO ${TABLE_NAME} (username, lat, long, name, weather) VALUES ($1, $2, $3, $4, $5)`,
          [position.username, position.lat, position.long, position.name, position.weather]
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
     * @return {Promise}            The promise
     */
    findLast10(username) {
      logger.debug('[Position Model] Find Last 10', username);
      const promise = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${TABLE_NAME} WHERE username=$1 ORDER BY id DESC LIMIT 10`, [username])
          .then(result => {
            logger.debug('[Position Model] Done finding last 10 position.');
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
