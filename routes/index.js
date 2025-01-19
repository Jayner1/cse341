const routes = require('express').Router();

const baseController = require('../controllers');

routes.get('/', baseController.getName);

app.get('/', (req, res) => {
    res.send('Server is up and running');
  });

module.exports = routes;