const http = require('http');
const express = require('express');
const morgan = require('morgan');
const webServerConfig = require('../config/web-server.js');
const routes = require('../routes/filescanRoutes'); 
const path = require("path");
const router = express.Router();

let httpServer;

function initialize() {
  return new Promise((resolve, reject) => {
    const app = express(),
    bodyParser = require('body-parser');
    httpServer = http.createServer(app);

    // Combines logging info from request and response
    app.use(morgan('combined'));

    app.use(bodyParser.urlencoded({ limit: '14mb', extended: true }));
    app.use(bodyParser.json({limit: '14mb', extended: true}));

    // Setup PUG templating
    app.set("view engine", "pug");
    app.set("views", path.join(__dirname, "/../views"));

    // Mount the router at /api so all its routes start with /api
    routes(app); //register the route

    // Setup static files
    app.use(express.static('public'));

    httpServer.listen(webServerConfig.port, err => {
      if (err) {
        reject(err);
        return;
      }

      console.log(`Filescan Web server listening on localhost:${webServerConfig.port}`);

      resolve();
    });
  });
}

module.exports.initialize = initialize;

function close() {
  return new Promise((resolve, reject) => {
    httpServer.close((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

module.exports.close = close;