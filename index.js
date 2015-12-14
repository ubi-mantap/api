'use strict';

const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 5000);

app.get('/', (req, res) => {
  let a = 10;
  res.send(`hello! a is ${a}`);
});

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

app.post('/process', (req, res) => {
  const lat = req.body.lat;
  const long = req.body.long;
  res.json({ lat, long });
});

app.listen(app.get('port'), () => {
  console.log(`Node app is running on port ${app.get('port')}`);
});
