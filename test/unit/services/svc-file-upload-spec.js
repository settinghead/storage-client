/*jshint expr:true */
"use strict";

describe("Services: FileList", function() {

  beforeEach(module("gapi-file"));

  it("should exist", function(done) {
    inject(function(fileUpload) {
      expect(fileUpload).be.defined;
      done();
    });
  });
});
