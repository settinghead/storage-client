/*jshint expr:true */

describe("Services: apiStorage", function() {
  "use strict";

  beforeEach(module("medialibraryServices"));
  beforeEach(module("gapi-auth"));
  beforeEach(module(function ($provide) {

    $provide.service("$q", function() {return Q;});
    $provide.value("apiAuth", {
      authorize: function() {
        var deferred = Q.defer(); 
        deferred.resolve();
        return deferred.promise;
      }
    });

    $provide.value("gapiLoader", {get: function() {
       var deffered = Q.defer();
       var gapi = {
        client: { 
          storage: { 
            files: {
              get: function () {
                return {
                  execute: function (callback) {
                    setTimeout(function () {
                      callback(rvFixtures.companiesResp);
                    }, 0);
                  }
                };
              }
            }
          }
        }
       };
       deffered.resolve(gapi);
       return deffered.promise;
    }});
  }));


  it("should exist", function (done) {
    inject(function (apiStorage) {
      expect(apiStorage).be.defined;
      done();
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
