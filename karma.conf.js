// Karma configuration
// Generated on Wed Mar 30 2016 18:48:25 GMT+0200 (Europe de l’Ouest (heure d’été))

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'src/main/webapp/lib/angular.js',
            'src/main/webapp/lib/angular-animate.js',
            'src/main/webapp/lib/angular-route.js',
            'src/main/webapp/lib/angular-mocks.js',
            'src/main/webapp/lib/*.js',
            'src/main/webapp/app/modules.js',
            'src/main/webapp/app/filter.js',
            'src/main/webapp/app/routing.js',
            'src/main/webapp/app/services/*',
            'src/main/webapp/app/controller/*',
            'src/test/javaScript/formFunctions.js',
            'src/test/javaScript/spec/*.js'
        ],


        // list of files to exclude
        exclude: [
            'src/main/webapp/app/services/serviceInitBdd.js',
            'src/main/webapp/app/controller/global.js'
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/main/webapp/app/**/*.js': ['coverage']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter

        reporters: ['progress', 'coverage'],

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing fake whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the fake and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
