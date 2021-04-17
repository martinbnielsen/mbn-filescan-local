'use strict';
module.exports = function(app) {
  const filescan = require('../controllers/filescanController');

  // fileScan Routes
  app.route('/scan')
    .get(filescan.showScans)
    .post(filescan.scanFile);

};
