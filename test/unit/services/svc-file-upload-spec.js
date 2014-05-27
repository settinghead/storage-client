/*jshint expr:true */
"use strict";

describe("Services: fileList", function() {

  beforeEach(module("file"));

  it("should exist", function(done) {
    inject(function(fileUpload) {
      expect(fileUpload).be.defined;
      done();
    });
  });
});
