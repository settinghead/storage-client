/*jshint expr:true */

describe("Services: fileUpload", function() {
  "use strict";

  beforeEach(module("gapi-file"));

  it("should exist", function (done) {
    inject(function(fileUpload) {
      expect(fileUpload).be.defined;
      done();
    });
  });
});
