# Reading

A minimal RSS/Atom feed reader, based on code & a blog post by [Dr Drang][Drang].

Elevator pitch:
- polls RSS/Atom feeds from a subscription list
- display the previous day's posts as a simple web page
- run it manually on your desktop, or set it up on a server

## Install

After installing Node, install Reading using npm in the usual way:

```bash
npm install -g Reading
```

## Use

<code>cd</code> into a folder with the OPML file with your blog subscriptions (my current one's attached as an example), and in the simplest case type:

```bash
reading
```

and that's it. A web page called index.html along with a layout.css file are generated in the folder. Additional options are listed below.

## Options (so far)

Flag             | Means
-----------------| --------
-h, --help       |  output usage information
-V, --version    |  output the version number
-i, --in <opml>  |  path of the OPML input file (default is subs.opml)
-o, --out <html> |  path of the HTML output file (default is index.html)

## Design notes

So far this is just the start of a Node port of the Python code in the Dr Drang article. I'm curious where this could go though, and  have some ideas I'd like to explore. There are already several Node feed parsers, and they're next on my reading list.

Lately I've been using Reeder (Reeder 3 as it now is) on my iPhone, but without an aggregation service, so without the benefit of syncing to my Mac. Other than that my blog reader history is pretty similar to the one described in the original article, and to a million others' experiences I suppose too.

I'm not convinced whether this script with its simple one day's worth of feed, with no marking things read or starring them for later is a better or worse solution, but I'll see.

Happy reading!

## History

### 0.1.0 - 29 November 2015

- initial commit
- rough cut, no tests, plenty of 404 errors from a fairly musty OPML file

[Drang]: http://leancrew.com/all-this/2015/11/simpler-syndication/
