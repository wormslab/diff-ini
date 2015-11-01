(function() {
  "use strict";

  let fs = require('fs')
    , reader = require('./lib/iniReader')
    , differ = require('./lib/diffini');

  module.exports = function(ls, rs, options) {
    let ld = reader(ls);
    let rd = reader(rs);
    return differ(ld, rd);
  }
})();
