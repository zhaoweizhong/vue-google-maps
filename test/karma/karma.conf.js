const _ = require('lodash')
const webpackConfig = require('../../webpack.config');

process.env.CHROMIUM_BIN = require('puppeteer').executablePath()

module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    // reporters: ['spec', 'coverage'],
    files: ['./index.js'],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
    },
    // ** ADD THIS IN ** (vue-cli's webpack template doesn't add it by default)
    plugins: [
      // Launchers
      'karma-phantomjs-launcher',

      // Test Libraries
      'karma-jasmine',

      // Preprocessors
      'karma-webpack',
      'karma-sourcemap-loader',

      // Reporters
      // 'karma-spec-reporter',
      // 'karma-coverage'
    ],
    webpack: {
      ..._.omit(webpackConfig[0], ['entry', 'externals']),
      plugins: (webpackConfig.plugins || []).concat(
        config.grep ? [
          new webpack.ContextReplacementPlugin(/\.\/specs/, function (result) {
            if (result.request === './specs') {
              result.regExp = new RegExp('.*' + config.grep + '.*\\.spec$')
            }
          }) ] : []
      ),
      mode: 'development',
      devtool: 'cheap-source-map'
    },
    // webpackMiddleware: {
    //   noInfo: true
    // }
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          '--headless',
          '--disable-gpu',
          '--disable-translate',
          '--disable-extensions'
        ]
      }
    }
  })
}