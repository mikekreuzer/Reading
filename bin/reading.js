#!/usr/bin/env node
'use strict';

var chalk = require('chalk'),
  flags = require('commander'),
  reading = require('..');

try {
  flags
    .version('0.1.0')
    .description('A minimal RSS/Atom feed reader')
    .option('-i, --in <opml>', 'path of the OPML input file (default is subs.opml)')
    .option('-o, --out <html>', 'path of the HTML output file (default is index.html)')
    // .option('-t, --template <jade>', 'path of the Jade template file used to build the output')
    // .option('-s, --stale', 'list feeds that haven\'t been updated in 3 months')
    .parse(process.argv);

  if (flags.stale) {
    console.log('Stale feeds list not implemented yet...');
  } else {
    var inFileName = flags.in ? flags.in : 'subs.opml';

    reading.outFileName = flags.out ? flags.out : 'index.html';

    if (flags.template) {
      console.log('Alternative template not implemented yet...');
    }
    reading.read(inFileName);
  }

} catch (err) {
  console.log(chalk.red(err));
}
