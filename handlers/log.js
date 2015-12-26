'use strict';

const async = require('async');
const request = require('request');
const logger = require('../libs/logger');

module.exports = function factory(models) {
  return function log(req, res) {
    logger.debug('[Log Handler] Got request.', req.body);

    const WEATHER_API_KEY = '79a4f0e5d011f84644fee1cecc5e03ae';
    const username = req.body.username;
    const lat = req.body.lat;
    const long = req.body.long;

    let weatherAndCity, distance, phone;

    async.parallel([
      fetchWeatherAndCity,
      calculateDistance,
      getPhone
    ], (err, results) => {
      if (err) {
        logger.error('[Log Handler] Error on external API calls.', err);
        return res.json({ ok: false, message: 'Error on external API calls.' });
      }

      logger.debug('[Log Handler] External API calls success.', results);
      weatherAndCity = results[0];
      distance = results[1];
      phone = results[2];

      async.parallel([
        createPosition,
        createNotification
      ], (error) => {
        if (error) {
          logger.error('[Log Handler] Error on inserting to database.', error);
          return res.json({ ok: false, message: 'Error on inserting to database.' });
        }

        logger.debug('[Log Handler] Inserting to database success.');
        res.json({ ok: true });
      });
    });

    function fetchWeatherAndCity(callback) {
      logger.debug('[Log Handler] Fetching weather and city...');
      const weatherApiUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${WEATHER_API_KEY}`;
      request(weatherApiUrl, (err, response, body) => {
        if (err) {
          logger.error('[Log Handler] Error fetching weather and city.', err);
          return callback(err);
        }

        logger.debug('[Log Handler] Fetching weather and city success.');
        const weatherData = JSON.parse(body);
        callback(null, {
          weather: weatherData.weather[0].main,
          city: weatherData.name
        });
      });
    }

    function calculateDistance(callback) {
      logger.debug('[Log Handler] Calculating distance...');
      const distanceCalculatorUrl = `https://ft-distance-calculator.herokuapp.com`;
      models.Position.findLast10(username)
        .then(result => {
          if (result.length > 0) {
            logger.debug('[Log Handler] Last 10 positions exists, proceeding...');
            request({
              url: distanceCalculatorUrl,
              method: 'POST',
              json: {
                current: { Lat: Number(lat), Lon: Number(long) },
                previous: result.map(pos => {
                  return { Lat: Number(pos.lat), Lon: Number(pos.long) };
                })
              }
            }, (err, response, body) => {
              if (err) {
                logger.error('[Log Handler] Error fetching calculation result', err);
                return callback(err);
              }

              logger.debug('[Log Handler] Fetching calculation result done.', body);
              callback(null, body.CurrDistance);
            });
          } else {
            logger.debug('[Log Handler] No last 10 positions. Returning 0.');
            callback(null, 0);
          }
        })
        .catch(err => {
          logger.error('[Log Handler] Error finding last 10 position.', err);
          callback(err);
        });
    }

    function getPhone(callback) {
      logger.debug(`[Log Handler] Getting phone number of user...`);
      models.User.find(username)
        .then(result => {
          callback(null, result[0].phone);
        })
        .catch(err => {
          logger.error('[Log Handler] Getting phone number failed.', err);
          callback(err);
        });
    }

    function createPosition(callback) {
      models.Position.new({ username, lat, long, name: weatherAndCity.city, weather: weatherAndCity.weather })
        .then(() => {
          logger.debug('[Log Handler] Create position success.');
          callback();
        })
        .catch(err => {
          logger.error('[Log Handler] Create position failed.', err);
          callback(err);
        });
    }

    function createNotification(callback) {
      models.Tracking.findTrackers(username)
        .then(result => {
          result.forEach(tracker => {
            let message = `Update: ${username} is on ${weatherAndCity.city} (${weatherAndCity.weather}).`;
            if (distance > 1) {
              message += ` Detecting unusual behavior (${distance} KM away from usual). What would you do?`;
            }
            const notification = {
              username: tracker.username,
              type: 'update',
              message,
              data: { phone }
            };

            models.Notification.new(notification)
              .catch(err => {
                logger.error(`[Log Handler] Create notification for ${tracker.username} failed.`, err);
              });
          });

          callback();
        })
        .catch(err => {
          logger.error('[Log Handler] Error on creating notifications');
          callback(err);
        });
    }
  };
};
