'use strict';

const logger = require('../libs/logger');

module.exports = function factory(db) {
  const TABLE_NAME = 'users';

  /**
   * User class
   */
  const User = {

    /**
     * Create new user
     * @param  {string}   username  The username
     * @return {Promise}            The promise
     */
    new(username) {
      logger.debug('[User Model] New', username);
      var promise = new Promise((resolve, reject) => {
        db.query(`INSERT INTO ${TABLE_NAME} (username) VALUES ($1)`, [username], (err, result) => {
          if (err) {
            logger.debug('[User Model] Error creating new user.', { username, err });
            return reject(err);
          }

          logger.debug('[User Model] Creating new user done.');
          resolve(result);
        });
      });

      return promise;
    },

    /**
     * Find a user by a username
     * @param  {string}   username  The username
     * @return {Promise}            The promise
     */
    find(username) {
      logger.debug('[User Model] Find', username);
      var promise = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${TABLE_NAME} WHERE username=$1`, [username], (err, result) => {
          if (err) {
            logger.debug('[User Model] Error finding user.', { username, err });
            return reject(err);
          }

          logger.debug('[User Model] Finding user done.');
          resolve(result);
        });
      });

      return promise;
    }

  };

  return User;
};
