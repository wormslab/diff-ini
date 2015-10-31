(function()  {
  "use strict";
  let fs = require('fs')
    , readLine = require('readline');

  function readFromFile(file, options) {
    if (!fs.existsSync(file)) {
      throw new Error("File not found");
    }

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

    let stream = readLine.createInterface({ input: fs.createReadStream(file) });
    let state = null;
    let section = null;
    let data = {};

    // section, key, value, case_sensitive, comment
    return new Promise(function(resolve) {
      stream.on('close', function() {
        resolve(data);
      });
      stream.on('line', function(line) {

        line = line.trim();

        if (options.caseInsensitive) {
          line = line.toLowerCase();
        }

        // ignore blank line
        if (line.length === 0) {
          return false;
        }

        if (line.match(/^\[([^\]])*\]$/)) { // ex: [sectionName]
          let sectionName = line.trim().substring(1, line.length - 1);
          let exist = data[sectionName];
          if (!options.section.allowDuplicate && exist) {
            throw new Error('Section duplicate not allowed');
          }
          data[sectionName] = data[sectionName] ? data[sectionName] : {};
          section = data[sectionName];
          return true;
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
      });
    });
  }

  module.exports = function(file, options) {
    return readFromFile(file, options);
  }
})();
