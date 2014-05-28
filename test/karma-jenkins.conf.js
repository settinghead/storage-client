module.exports = function(config){
  config.set({

    basePath : "../",

    autoWatch : true,

    frameworks: ["mocha", "chai", "chai-as-promised"],

    browsers : ["PhantomJS"],

    preprocessors : {
      "web/script/**/*.js": "coverage"
    },

    reporters: ["progress", "junit", "coverage"],

    plugins : [
            "karma-jasmine",
            "karma-mocha",
            "karma-chai",
            "karma-junit-reporter",
            "karma-coverage",
            "karma-chai-plugins",
            "karma-phantomjs-launcher"
            ],

    junitReporter : {
      outputFile: "test_reports/unit.xml"
    },

    // optionally, configure the reporter
    coverageReporter: {
      type : "cobertura",
      dir : "test_reports/"
    },

    // web server port
    port: 9876,
    logLevel: config.LOG_INFO,

    // enable / disable colors in the output (reporters and logs)
    colors: true

  });
};