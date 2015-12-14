'use strict';

const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');

const database = require('./libs/db');
const logger = require('./libs/logger');

database.init((db) => {

  const models = require('./models')(db);
  const handlers = require('./handlers')(models);

  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.set('port', process.env.PORT || 5000);

  app.post('/trackings/init', handlers.init);
  app.post('/trackings/start', handlers.start);
  app.post('/trackings/stop', handlers.stop);
  app.post('/trackings/log', handlers.log);
  app.post('/register', handlers.register);
  app.get('/trackings', handlers.getTrackings);
  app.get('/trackers', handlers.getTrackers);
  app.get('/notifications', handlers.getNotifications);

  // TODO: move this to handlers.log
  app.get('/weather-test', (req, res) => {
    const WEATHER_API_KEY = '79a4f0e5d011f84644fee1cecc5e03ae';
    const lat = '-6.328535';
    const long = '106.7387273';
    const weatherApiUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${WEATHER_API_KEY}`;
    request(weatherApiUrl, (err, response, body) => {
      let weatherData = JSON.parse(body);
      res.json({
        weather: weatherData.weather[0].main,
        city: weatherData.name
      });
    });
  });

  app.listen(app.get('port'), () => {
    logger.info(`Node app is running on port ${app.get('port')}`);
  });

});
