/*jshint expr:true */
"use strict";

describe("Services: apiAuth", function() {

  beforeEach(module("common"));

  it("should exist", function(done) {
    inject(function(apiAuth) {
      expect(apiAuth).be.defined;
      done();
    });
  });
});
