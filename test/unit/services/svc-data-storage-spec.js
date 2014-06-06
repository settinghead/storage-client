/*jshint expr:true */
"use strict";

describe("Services: apiStorage", function() {

  beforeEach(module("common"));

  beforeEach(module(function ($provide) {

    $provide.service("$q", function() {return Q;});
    $provide.value("apiAuth", {
      checkAuth: function() {
        var deferred = Q.defer(); 
        deferred.resolve();
        return deferred.promise;
      }
    });
  }));


  it("should exist", function(done) {
    inject(function(apiStorage) {
      expect(apiStorage).be.defined;
      done();
    });
  });

  describe("getFiles", function () {
    it("should get files", function (done) {
      inject(function (apiStorage) {
        
        done();
      });
    });
  });
  
  describe("deleteFiles", function () {
    it("should delete files", function (done) {
      done();
    });

    it("should reject upon error", function (done) {
      done();
    });

  });

  describe("getFileUrl", function () {
    it("should get file URL", function (done) {
      done();
    })
  });

  describe("createBucket", function () {
    it("should create bucket", function (done) {
      done();
    });
  });

  describe("getSignedPolicy", function () {
    it("should get signed policty", function (done) {
      done();
    });
  });
  
});
