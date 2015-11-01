(function() {
  "use strict";

  let fs = require('fs');
    , reader = require('./lib/iniReader');
    , differ = require('./lib/diffini');

  module.exports = function(ld, rd, options) {
    let ld = reader(lf);
    let rd = reader(rf);
    return differ(ld, rd);
  }
})();
