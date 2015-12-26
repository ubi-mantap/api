'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const db = require('./libs/db');
const logger = require('./libs/logger');

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

app.listen(app.get('port'), () => {
  logger.info(`Node app is running on port ${app.get('port')}`);
});
