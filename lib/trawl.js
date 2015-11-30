'use strict';

var chalk = require('chalk'),
  FeedParser = require('feedparser'),
  fs = require('fs'),
  fse = require('fs-extra'),
  global = require('..'),
  jade = require('jade'),
  moment = require('moment'),
  parseString = require('xml2js').parseString,
  path = require('path'),
  request = require('request'),
  sanitizeHtml = require('sanitize-html');

var render = function (jadeFn, posts) {
  var outFile = global.outFileName;
  try {
    var content = jadeFn({postData: posts}).trim();
    // write content
    fs.writeFile(outFile, content,
      function (err) {
        if (err) {
          console.log(chalk.red(err));
        }
        console.log('File created at:' + outFile);
      });
    // copy css
    var css = path.resolve(path.dirname(__filename), 'layout.css'),
      outCSS = path.join(path.dirname(outFile), 'layout.css');
    fse.copy(css, outCSS, function (err) {
      if (err) {
        console.log(chalk.red(err));
      }
    });
  } catch (err) {
    console.log(chalk.red(err));
  }
};

var getFeed = function (templateFn, feedURL, posts, expected) {
  var req = request(feedURL); // , {timeout: 60000, pool: void 0});
  req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/601.2.7 (KHTML, like Gecko) Version/9.0.1 Safari/601.2.7');
  req.setHeader('accept', 'application/xml,application/xhtml+xml,text/html');

  var feedparser = new FeedParser(),
    oneDayAgo = moment().subtract(1, 'days'),
    currentPosts = [],
    complete = function () {
      expected.left = expected.left - 1;
      if (expected.left === 0) {
        posts.sort(function (a, b) {
          if (b.date.isAfter(a.date)) {
            return 1;
          } else {
            return -1;
          }
        });
        render(templateFn, posts);
      }
    };

  req
  .on('error', function (err) {
    console.log(chalk.red(feedURL + ' - ' + err));
    complete();
  })
  .on('response', function (res) {
    if (res.statusCode !== 200) {
      console.log(chalk.red(feedURL + ' - Bad status code: ' + res.statusCode));
      complete();
    } else {
      res.pipe(feedparser);
    }
  });

  feedparser
  .on('error', function (err) {
    console.log(chalk.red(err));
    complete();
  })
  .on('readable', function () {
    var stream = this, // eslint-disable-line no-invalid-this
      meta = this.meta, // eslint-disable-line no-invalid-this
      item;

    while (item = stream.read()) { // eslint-disable-line no-cond-assign
      try {
        var date = moment(item.pubdate);
        if (date.isAfter(oneDayAgo)) {
          var thisPost = {
            date: date,
            blogTitle: meta.title,
            itemTitle: item.title, // may be blank in micro post
            author: item.author,
            url: item.link, // apply to both titles if not blank
            origURL: item.origlink, // add original link link
            summary: sanitizeHtml(item.summary),
            description: sanitizeHtml(item.description)
          };
          currentPosts.push(thisPost);
        }
      } catch (err) {
        console.log(chalk.red(err));
      }
    }
  })
  .on('meta', function (meta) {}) // eslint-disable-line no-unused-vars
  .on('end', function () {
    if (currentPosts.length > 0) {
      for (var i = 0; i < currentPosts.length; i = i + 1) {
        posts.push(currentPosts[i]);
      }
      currentPosts = [];
    }
    complete();
  });
};

var readTemplate = function (templateFilePath, complete) {
  var filePath = templateFilePath ? templateFilePath : path.resolve(path.dirname(__filename), 'out.jade');
  fs.readFile(filePath, 'utf-8', function (readErr, template) {
    if (readErr) {
      console.log(chalk.red(readErr));
    }
    var jadeFn = jade.compile(template, {pretty: true, filename: templateFilePath});
    complete(jadeFn);
  });
};

module.exports = function (inFileName) {
  var posts = [];
  fs.readFile(inFileName, 'utf-8', function (readErr, xml) {
    if (readErr) {
      console.log(chalk.red(readErr));
    }
    parseString(xml, function (parseErr, result) {
      if (parseErr) {
        console.log(chalk.red(parseErr));
      }
      try {
        var feedsArray = result.opml.body[0].outline,
          length = feedsArray.length,
          expected = {left: feedsArray.length};
        readTemplate(null, function (templateFn) {
          for (var i = 0; i < length; i = i + 1) {
            getFeed(templateFn, feedsArray[i].$.xmlUrl, posts, expected);
          }
        });
      } catch (opmlErr) {
        console.log(chalk.red(opmlErr));
      }
    });
  });
};
