/*jshint expr:true */

describe("Services: apiAuth", function() {
  "use strict";

  beforeEach(module("gapi-auth"));

  it("should exist", function(done) {
    inject(function(apiAuth) {
      expect(apiAuth).be.defined;
      done();
    });
  });
});
