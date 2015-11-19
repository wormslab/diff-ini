(function() {
  "use strict";

  let fs = require('fs')
    , reader = require('./lib/iniReader')
    , differ = require('./lib/diffini')
    , defaultOpt = require('./lib/defaultOptions');

  module.exports = function(ls, rs, inputOptions) {
    let defaultOptions = {
      caseInsensitive: true,
      section: {
        allowDuplicate: false
      },
      key: {
        allowDuplicate: false,
        replcaeDuplicate: false
      },
      value: {
        hasDelimiter: true,
        needToSort: true,
        delimiter: ','
      }
    }

    let options = defaultOpt(defaultOptions, inputOptions);
    console.log(options);
    let ld = reader(ls, options);
    let rd = reader(rs, options);
    return differ(ld, rd);
  }
})();
