"use strict";

/*jshint node: true */
/* global concat: true */

// ************************
// * Rise Vision Storage UI *
// * build script         *
// ************************

// Include gulp

var env = process.env.NODE_ENV || "dev",
    E2E_PORT = { "dev" : 8001, "prod" : 8002, "stage" : 8003 },
    e2ePort = E2E_PORT[env] || 8001,
    gulp = require("gulp"),
    // Include Our Plugins
    uglify = require("gulp-uglify"),
    karma = require("gulp-karma"),
    jshint = require("gulp-jshint"),
    usemin = require("gulp-usemin"),
    htmlreplace = require("gulp-html-replace"),
    watch = require("gulp-watch"),
    sass = require("gulp-sass"),
    minifyCSS = require("gulp-minify-css"),
    concat = require("gulp-concat"),
    clean = require("gulp-clean"),
    rename = require("gulp-rename"),
    connect = require("gulp-connect"),
    protractor = require("gulp-protractor").protractor,
    webdriver_update = require("gulp-protractor").webdriver_update,
    httpServer,

    //Test files
    testFiles = [
      "web/components/jQuery/dist/jquery.js",
      "web/components/q/q.js",
      "https://js.stripe.com/v2/",
      "web/lib/spin.min.js",
      "web/components/angular/angular.js",
      "web/components/angular-bootstrap/ui-bootstrap-tpls.js",
      "web/components/angular-route/angular-route.js",
      "web/components/angular-mocks/angular-mocks.js",
      "http://s3.amazonaws.com/rise-common/scripts/modernizr/modernizr.js",
      "https://s3.amazonaws.com/rise-common-test/scripts/bootstrap/bootstrap.min.js",
      "web/script/*.js",
      "web/script/*/*.js",
      "web/script/**/*.js",
      "web/script/**/**/*.js",
      "test/unit/fixtures/*.js",
      "test/**/*spec.js"
    ],
    // uglify also take care of removing unnecessary "use strict" statements 

    appJSFiles = [
      "web/script/**/*.js",
      "test/**/*.js"
    ],

    sassFiles = [
      "web/scss/**/*.scss"
    ],

    cssFiles = [
      "web/css/store.css",
      "web/css/**/*.css"
    ],

    imgFiles = [
      "web/img/**/*"
    ],

    htmlFiles = [
      "web/*.html"
    ],

    viewFiles = [
      "web/view/**/*"
    ];

gulp.task("clean", function() {
  return gulp.src("dist")
    .pipe(clean({force: true}));
});

gulp.task("lint", function() {
  return gulp.src(appJSFiles)
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"))
    .pipe(jshint.reporter("fail"));
});

gulp.task("watch", function() {
    return gulp.watch(appJSFiles, ["lint"]);
});

gulp.task("html", ["lint"], function () {
  return gulp.src(htmlFiles)
    .pipe(usemin({
    js: [uglify({mangle:false, outSourceMap: true})] //disable mangle just for $routeProvider in controllers.js
  }))
  .pipe(gulp.dest("dist/"));
});

gulp.task("build-e2e", function () {
  gulp.src("test/gapi-mock.js")
  .pipe(gulp.dest("dist-e2e/"));
  
  gulp.src(viewFiles).pipe(gulp.dest("dist-e2e/view"));
  gulp.src(imgFiles).pipe(gulp.dest("dist-e2e/img"));

  return gulp.src(htmlFiles)
    .pipe(htmlreplace({
      e2e: {
        src: ["gapi-mock.js"],
        tpl: "<script type=\"text/javascript\" src=\"%s\"></script>"
      }
    }))
    .pipe(usemin({
      js: [uglify({mangle:false})] //disable mangle just for $routeProvider in controllers.js
    }))

  .pipe(gulp.dest("dist-e2e/"));
});

gulp.task("view", function() {
  return gulp.src(viewFiles)
    .pipe(gulp.dest("dist/view"));
});

gulp.task("img", function() {
  return gulp.src(imgFiles)
    .pipe(gulp.dest("dist/img"));
});

gulp.task("sass", function () {
    return gulp.src(sassFiles)
      .pipe(sass())
      .pipe(gulp.dest("web/css"));
});

gulp.task("css", ["sass"], function () {
  return gulp.src(cssFiles)
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(concat("all.min.css"))
    .pipe(gulp.dest("dist/css"));
});


/* Task: config
 * Copies configuration file in place based on the current
   environment variable (default environment is dev)
*/
gulp.task("config", function() {
  gulp.src(["./web/script/config/" + env + ".js"])
    .pipe(rename("config.js"))
    .pipe(gulp.dest("./web/script/config"));
});

gulp.task("build", ["clean", "config", "html", "view", "img", "css"]);


gulp.task("test", function() {
  // Be sure to return the stream
  return gulp.src(testFiles).pipe(
    watch(function(files) {
      return files.pipe(karma({
        configFile: "test/karma.conf.js",
        action: "start"
      }))
      .on("error", function(err) {
        // Make sure failed tests cause gulp to exit non-zero
        throw err;
      });  
    }));
});

gulp.task("test-ci", function() {
  // Be sure to return the stream
  return gulp.src(testFiles)
    .pipe(karma({
      configFile: "test/karma-jenkins.conf.js",
      action: "run"
    }))
    .on("error", function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});

gulp.task("watch-dev", function() {
  gulp.watch(sassFiles, ["sass"]);
});

gulp.task("watch-dist", function() {
  gulp.watch(htmlFiles, ["html"]);
  gulp.watch(viewFiles, ["view"]);
  gulp.watch(imgFiles, ["img"]);
  gulp.watch(sassFiles, ["css"]);
});
 
gulp.task("server", ["sass", "watch-dev"], function() {
  httpServer = connect.server({
    root: "web",
    port: 8000,
    livereload: true
  });
  return httpServer;
});

gulp.task("server-dist", function() {
  gulp.start("build");
  gulp.start("watch-dist");
  httpServer = connect.server({
    root: "dist",
    port: 8000,
    livereload: true
  });
  return httpServer;
});

gulp.task("webdriver_update", webdriver_update);

gulp.task("e2e-server", ["build-e2e"], function() {
  httpServer = connect.server({
    root: "dist-e2e",
    port: e2ePort,
    livereload: false
  });
  return httpServer;
});

gulp.task("protractor", ["webdriver_update", "e2e-server"], function () {
  return gulp.src(["./test/e2e/*.js"])
    .pipe(protractor({
        configFile: "./test/protractor.conf.js",
        args: ["--baseUrl", "http://127.0.0.1:" + e2ePort + "/index.html"]
    }))
    .on("error", function (e) { console.log(e); throw e; })
    .on("end", function () {
      connect.serverClose();
    });
});

gulp.task("test-e2e", ["protractor"], function() {
});

gulp.task("default", [], function () {
  console.log("\n***********************");
  console.log("* Tell me what to do: *");
  console.log("***********************");
  console.log("* gulp build          *");
  console.log("* gulp lint           *");
  console.log("* gulp watch          *");
  console.log("* gulp test           *");
  console.log("***********************\n");
  return true;
});