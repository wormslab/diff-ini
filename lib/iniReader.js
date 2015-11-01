(function()  {
  "use strict";

  function parseLines(lines, options) {
    options = {
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
        delimiter: ' '
      }
    }

    function parseValue(value) {
      if (options.value.hasDelimiter) {
        let val = value.split(options.value.delimiter);
        if (options.value.needToSort) {
          val.sort(); // inplace sort
        }
        return val.join(options.value.delimiter);
      } else {
        return value;
      }
    }

    let state = null;
    let section = null;
    let data = {};

    // section, key, value, case_sensitive, comment
    for (let line of lines.split('\n')) {
      line = line.trim();

      if (options.caseInsensitive) {
        line = line.toLowerCase();
      }

      // ignore blank line
      if (line.length === 0) {
        continue;
      }

      if (line.match(/^\[([^\]])*\]$/)) { // ex: [sectionName]
        let sectionName = line.trim().substring(1, line.length - 1);
        let exist = data[sectionName];
        if (!options.section.allowDuplicate && exist) {
          throw new Error('Section duplicate not allowed');
        }
        data[sectionName] = data[sectionName] ? data[sectionName] : {};
        section = data[sectionName];
        continue;
      }

      if (!section) {
        throw new Error('There is no section');
      }

      // parse key value
      if (line.indexOf('=') < 0) {
        throw new Error('Invalid key value format. there is no character \'=\'')
      }

      let ary = line.split('=');
      let key = ary[0].trim();
      let value = ary[1].trim();

      if (!options.key.allowDuplicate && section[key]) {
        throw new Error('Key duplicate not allowed');
      }

      // section 안의 key 가 이미 존재하는 경우에는 reaplce 할지 무시할지를 결정한다.
      if (section[key]) {
        if (options.key.replcaeDuplicate) {
          section[key] = parseValue(value, options);
        }
      } else {
        section[key] = parseValue(value);
      }
    }
    return data;
  };

  module.exports = function(lines, options) {
    return parseLines(lines, options);
  }
})();
