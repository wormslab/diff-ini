(function() {
  "use strict";

  function defaultOpt(defaultOptions, options, ret) {
    for (let opt in defaultOptions) {
      if (!options.hasOwnProperty(opt)) {
        ret[opt] = defaultOptions[opt];
        continue;
      }

      if (typeof defaultOptions[opt] === 'object' && typeof options[opt] === 'object') {
        ret[opt] = {};
        defaultOpt(defaultOptions[opt], options[opt], ret[opt]);
      } else {
        ret[opt] = options[opt];
      }
    }
  }

  module.exports = function(defaultOptions, options) {
    if (!options) {
      return defaultOptions;
    }
    let ret = {};
    defaultOpt(defaultOptions, options, ret);
    return ret;
  };

})();
