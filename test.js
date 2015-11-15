(function() {
  "use strict";

  let fs = require('fs')
    , index = require('./index')
    , util = require('util');

  let ls = fs.readFileSync('./sample.ini');
  let rs = fs.readFileSync('./sample-diff.ini');
  console.log('LEFT SIDE --------------------------------');
  console.log(ls.toString());
  console.log('RIGHT SIDE--------------------------------');
  console.log(rs.toString());
  console.log('RESULT --------------------------------');
  let ret = index(ls.toString(), rs.toString());
  console.log(util.inspect(ret, { depth: null }));
})();
