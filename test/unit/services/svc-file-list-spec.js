/*jshint expr:true */
"use strict";

xdescribe("Services: FileList", function() {

  beforeEach(module("gapi-file"));

  beforeEach(module(function ($provide) {
      $provide.service("$q", function() {return Q;});
      $provide.value("$log", console.log);
      $provide.value("storageApiLoader", {get: function() {
         var deffered = Q.defer();
         var storageApi = {
          files: { 
            get: function () {
              return {
                execute: function (callback) {
                  setTimeout(function () {
                    callback(rvFixtures.fileResp);
                  }, 0);
                }
              };
            }
          }
         };
         deffered.resolve(storageApi);
         return deffered.promise;
      }});
      $provide.value("LocalFiles", {query: function() {
        var deffered = Q.defer();
        deffered.resolve(rvFixtures.fileResp);
        return deffered.promise;
      }});
    }));

  it("should exist", function(done) {
    inject(function (FileList) {
      expect(FileList).be.defined;
      done();
    });
  });

  it("should get local files", function (done) {
    inject(function (FileList) {
      new FileList().then(function (fileInfo) {
        expect(fileInfo).to.be.defined;
        expect(fileInfo.files.length).to.equal(3);
        done();
      });
    });
  });

  it("should get company files", function (done) {
    inject(function (FileList) {
      new FileList().then(function (fileInfo) {
        expect(fileInfo).to.be.defined;
        expect(fileInfo.files.length).to.equal(3);
        done();
      });
    });
  });
});
