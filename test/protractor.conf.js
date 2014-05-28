exports.config = {
  allScriptsTimeout: 11000,

  // specs: [
  //   "e2e/*.js"
  // ],

  // capabilities: {
  //   "browserName": "phantomjs"
  // },

  // -----------------------------------------------------------------
  // Browser and Capabilities: Chrome
  // -----------------------------------------------------------------
 
  capabilities: {
    browserName: "phantomjs",
    version: "",
    platform: "ANY"
  },
 
  framework: "mocha",

  mochaOpts: {
    reporter: "spec",
    slow: 3000
  }
};