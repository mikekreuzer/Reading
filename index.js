'use strict';

var trawl = require('./lib/trawl.js');

exports.outFileName = '';

exports.read = function (inFileName, outFileName) {
  trawl(inFileName, outFileName);
};
