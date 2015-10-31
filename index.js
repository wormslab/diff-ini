(function() {
  "use strict";

  let reader = require('./lib/iniReader');
  let differ = require('./lib/diffini');
  let p = reader('./sample.ini');

  p.then(function(data) {
    // console.log(data);
  });

  differ('./sample.ini', './sample-diff.ini').then(function(ret) {
    console.log(require('util').inspect(ret, { colors: true, depth: null}));
    console.log(ret.section.child.scope)
    // console.log(ret);
  });
})();
