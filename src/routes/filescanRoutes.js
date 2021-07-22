'use strict';
module.exports = function(app) {
  const filescan = require('../controllers/filescanController');

  // Template routes
  app.route("/")
    .get(filescan.showIndex)

  // fileScan API Route
  app.route('/scan')
    .get(filescan.showScans)
    .post(filescan.scanFile);

};
