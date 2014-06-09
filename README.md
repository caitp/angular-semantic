##AngularSemantic [![Build Status](https://travis-ci.org/caitp/angular-semantic.svg?branch=master)](https://travis-ci.org/caitp/angular-semantic) [![devDependency Status](https://david-dm.org/caitp/angular-semantic/dev-status.svg?branch=master)](https://david-dm.org/caitp/angular-semantic#info=devDependencies)

[Docs](http://caitp.github.io/angular-semantic/docs)

Work-in-progress on [AngularJS](http://angularjs.org) directives to support [Semantic-UI](http://semantic-ui.com) modules.

###About

This is in extremely early stages currently, and will likely not get very far without your help!

Please, fork, pick a module, implement it and provide as many thoroughly rigid (or not so rigid, whatever) tests as you can. It will be awesome, trust me.

Let us work together to turn Semantic-UI into a truely semantic framework with AngularJS directives bringing the markup to life.

###Dependencies
- Semantic-UI
- AngularJS

###Global DevDependencies
- grunt-cli

###Building

```bash
$ npm install --dev
$ grunt
```

###Testing

Testing locally, by default, uses the Chrome browser. However, it is necessary to install the Karma Chrome launcher before making use of it.
To do this, run `grunt setup --launchers chrome` to install it, as a convenience. You can also install other launchers this way, such as
`grunt setup --launchers "firefox, phantomjs, chrome"`.

To run tests, simply run `grunt test`. Currently, testing with alternative browsers requires either changes to the Gruntfile, or else changes
to karma.conf.js. This will be improved in the near future.

###Contribution

Any form of contribution is welcome, whether it be a bug report, a feature request, a feature implementation, a bug fix, or even an example usage or additional test. The contribution is welcome and appreciated.

Patches should follow the [Google JavaScript Style Guide](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml), and each and every new feature or bug fix should incorporate one or more meaningful tests to assist in preventing future regressions.

While you may, if you so wish, discuss this module anywhere you like, I will be most likely to respond to inquiries directed to me on IRC (particularly in #angularjs on irc.freenode.net), or on the [issue tracker](https://github.com/caitp/angular-semantic/issues).
