(function() {

  "use strict";

  /* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);
  var expect = chai.expect;

  var fs = require("fs");

  browser.driver.manage().window().setSize(1024, 768);

  describe("Storage", function() {
  var ptor;

    //a scenario where two products are added to the shopping cart
    describe("File Listing", function() {

      beforeEach(function() {
        ptor = protractor.getInstance();
        browser.get("/#/files/22f2f-f3223f32-f23f32");
      });

      it("should get a list of files", function() {
        expect(element.all(by.css("#list table tbody tr")).count()).to.eventually.equal(3);
        //browser.takeScreenshot().then(function(png) {
        //var stream = fs.createWriteStream("/tmp/screenshot.png");
        //  stream.write(new Buffer(png, "base64"));
        //  stream.end();
        //});
        var storageUsedInfoElem = element(by.css("div.storage-used-info"));
        expect(storageUsedInfoElem.getText()).to.eventually.equal("Storage Used: 412.9 KB");
      });
    });
  });
})();