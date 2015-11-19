(function() {
  "use strict";

  let _ = require('lodash')
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
      , end = -1
      , lsLength = ls ? ls.length : -1
      , rsLength = rs ? rs.length : -1;

    if (lsLength >= 0 && rsLength >= 0) {
      end = Math.max(lsLength, rsLength);
    }
    while (start < end && ls.charAt(start) === rs.charAt(start)) start++;
    while (start < end && ls.charAt(end) === rs.charAt(end)) end--;
    return { start: start, end: end + 1 }; // exclusive end position
  }

  function diff(lhs, rhs, ret) {
    let allKey = bothKey(lhs, rhs);

    for (let key of allKey) {
      if (!lhs[key] && rhs[key]) {
        ret[key] = { type: RIGHT_ONLY };
      } else if (lhs[key] && !rhs[key]) {
        ret[key] = { type: LEFT_ONLY };
      } else {
        ret[key] = { type: SAME };
      }

      if (typeof lhs[key] === 'object' || typeof rhs[key] === 'object') {
        ret[key]['child'] = {};
        diff(lhs[key], rhs[key], ret[key]['child'])
        // continue;
      } else {
        if (lhs[key]) {
          ret[key]['lv'] = lhs[key];
        }
        if (rhs[key]) {
          ret[key]['rv'] = rhs[key];
        }
        if (!lhs[key] && rhs[key]) {
          ret[key]['type'] = RIGHT_ONLY;
        } else if (lhs[key] && !rhs[key]) {
          ret[key]['type'] = LEFT_ONLY;
        } else if (lhs[key] === rhs[key]) {
          ret[key]['type'] = SAME;
        } else if (rhs){
          ret[key]['type'] = DIFFERENCE;
          _.assign(ret[key], diffSpace(lhs[key], rhs[key]));
        }
      }
    }
    return ret;
  }

  module.exports = function(lhs, rhs) {
    return diff(lhs, rhs, {});
  }

})();
