/*jshint expr:true */
"use strict";

xdescribe("Services: fileList", function() {

  beforeEach(module("file"));

  it("should exist", function(done) {
    inject(function(fileList) {
      expect(fileList).be.defined;
      done();
    });
  });
});
