(function() {
  "use strict";

  let co = require('co')
    , _ = require('lodash')
    , reader = require('./iniReader');

  const LEFT_ONLY = 'LO';
  const RIGHT_ONLY = 'RO';
  const DIFFERENCE = 'DI';
  const SAME = 'ID';

  function bothKey(lhs, rhs) {
    let lsKeys = Object.keys(lhs);
    let rsKeys = Object.keys(rhs);

    return _.uniq(lsKeys.concat(rsKeys));
  }

  function diffSpace(ls, rs) {
    let start = 0
      , end = Math.max(ls.length, rs.length);
    while (start < end && ls.charAt(start) === rs.charAt(start)) start++;
    while (start < end && rs.charAt(end) === rs.charAt(end)) end--;
    return { start: start, end: end };
  }

  function diff(lhs, rhs, ret, options) {
    let allKey = bothKey(lhs, rhs);

    for (let key of allKey) {
      if (!lhs[key] && rhs[key]) {
        ret[key] = { type: LEFT_ONLY };
      }
      if (lhs[key] && !rhs[key]) {
        ret[key] = { type: RIGHT_ONLY };
      }

      ret[key] = { type: SAME };
      if (typeof lhs[key] === 'object' && typeof rhs[key] === 'object') {
        ret[key]['child'] = {};
        diff(lhs[key], rhs[key], ret[key]['child'], options)
        continue;
      } else if (typeof lhs[key] === 'string' && typeof rhs[key] === 'string') {
        if (lhs[key] === rhs[key]) {
          ret[key] = { type: SAME };
        } else {
          ret[key] = { type: DIFFERENCE };
          _.assign(ret[key], diffSpace(lhs[key], rhs[key]), { ls: lhs[key], rs: rhs[key]});
        }
      }
    }
    return ret;
  }

  module.exports = function(lhs, rhs, options) {
    return diff(lhs, rhs, {}, options);
  }

})();
