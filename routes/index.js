const express = require('express');
const config = require('../config/config');
const textToSpeechRoute = require('./textToSpeech.route')
const historyRoute = require('./history.route')

const router = express.Router();

const defaultRoutes = [
  {
    path: '/convert',
    route: textToSpeechRoute
  },
  {
    path: '/history',
    route: historyRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
// if (config.env === 'development') {
//   devRoutes.forEach((route) => {
//     router.use(route.path, route.route);
//   });
// }

module.exports = router;