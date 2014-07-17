/*jshint expr:true */

describe("Services: FileListFactory", function() {
  
  "use strict";

  beforeEach(module("gapi-file"));

  beforeEach(module(function ($provide) {
      $provide.service("$q", function() {return Q;});
      $provide.value("$log", console.log);
      $provide.value("storageAPILoader", {get: function() {
         
         var deffered = Q.defer();
         var storageApi = {
          files: {
            get: function () {
              return {
                execute: function (callback) {
                  setTimeout(function () {
                    callback(rvFixtures.filesResp);
                  }, 0);
                }
              };
            }
          }
         };
         deffered.resolve(storageApi);
         return deffered.promise;
      }});
      $provide.value("LocalFiles", {query: function(cb) {
        cb(rvFixtures.filesResp);
      }});
    }));

  it("should exist", function (done) {
    inject(function (FileListFactory) {
      expect(FileListFactory).be.defined;
      done();
    });
  });

  it("should get local files", function (done) {
    inject(function (FileListFactory) {
      FileListFactory.listFiles().then(function (fileInfo) {
        expect(fileInfo).to.be.defined;
        expect(fileInfo.files.files.length).to.equal(3);
        done();
      });
    });
  });

  it("should get company files", function (done) {
    inject(function (FileListFactory) {
      FileListFactory.listFiles("fj243g43g4-g43g43g43g-34g43").then(function (fileInfo) {
        expect(fileInfo).to.be.defined;
        expect(fileInfo.files.length).to.equal(3);
        done();
      });
    });
  });
});
