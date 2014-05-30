/*jshint expr:true */
"use strict";

xdescribe("Services: apiAuth", function() {

  beforeEach(module("gapi-auth"));

  it("should exist", function(done) {
    inject(function(apiAuth) {
      expect(apiAuth).be.defined;
      done();
    });
  });
});
