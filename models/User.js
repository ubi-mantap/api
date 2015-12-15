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
     * @param  {object}   user            The new user
     * @param  {string}   user.username   The username
     * @param  {string}   user.phone      The phone
     * @return {Promise}                  The promise
     */
    new(user) {
      logger.debug('[User Model] New', user);
      var promise = new Promise((resolve, reject) => {
        db.query(`INSERT INTO ${TABLE_NAME} (username, phone) VALUES ($1, $2)`, [user.username, user.phone])
          .then(result => {
            logger.debug('[User Model] Creating new user done.');
            resolve(result);
          })
          .catch(err => {
            logger.error('[User Model] Error creating new user.', { user, err });
            reject(err);
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
        db.query(`SELECT * FROM ${TABLE_NAME} WHERE username=$1`, [username])
          .then(result => {
            logger.debug('[User Model] Finding user done.');
            resolve(result);
          })
          .catch(err => {
            logger.error('[User Model] Error finding user.', { username, err });
            reject(err);
          });
      });

      return promise;
    }

  };

  return User;
};
