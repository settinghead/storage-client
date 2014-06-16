"use strict";


angular.module("common").service("apiStorage", ["$q", "$rootScope", "$timeout", "apiAuth", "$routeParams", "gapiLoader", "storageAPILoader", "STORAGE_URL",
  function ($q, $rootScope, $timeout, apiAuth, $routeParams, gapiLoader, storageAPILoader, STORAGE_URL) {


    apiAuth.checkAuth(true).then(function () {
        storageAPILoader.get();
    });

    this.deleteFiles = function (companyId, files, validationRequired) {
      var deferred = $q.defer();

      var obj = {
        "companyId": companyId,
        "files": files
      };
      gapiLoader.get().then(function (gApi) {
        var request = gApi.client.storage.files.delete(obj);
        request.execute(function (resp) {
          console && console.log(resp);
          if (resp.code !== 200) {
            console && console.error("Error deleting files: ", resp);
            resp = null;
          }
          deferred.resolve(resp);
        });
      });

      return deferred.promise;
    };

    this.getFileUrl = function (companyId, file) {
      var deferred = $q.defer();

      var obj = {
        "companyId": companyId,
        "file": file
      };
      gapiLoader.get().then(function (gApi) {
        var request = gApi.client.storage.file.url(obj);
        request.execute(function (resp) {
          console && console.log(resp);
          if (resp.code !== 200) {
            console && console.error("Error retrieving policy: ", resp);
            resp = null;
          }
          deferred.resolve(resp.response);
        });
      });

      return deferred.promise;

    };

    this.createBucket = function (companyId) {
      var deferred = $q.defer();
      var obj = {
        "companyId": companyId,
      };
      gapiLoader.get().then(function (gApi) {
        var request = gApi.client.storage.createBucket(obj);
        request.execute(function (resp) {
          if (resp.code !== 200) {
            console && console.error("Error creating bucket: ", resp);
            deferred.reject(resp);
          } else {
            console && console.log(resp);
            deferred.resolve(resp);
          }
        });
      });
      return deferred.promise;
    };

    this.createFolder = function (companyId, folderName) {
      var deferred = $q.defer();
      var obj = {
        "companyId": companyId,
        "folder": folderName
      };
      gapiLoader.get().then(function (gApi) {
        var request = gApi.client.storage.createFolder(obj);
        request.execute(function (resp) {
          if (resp.code !== 200) {
            console && console.error("Error creating folder: ", resp);
            deferred.reject(resp);
          } else {
            console && console.log(resp);
            deferred.resolve(resp);
          }
        });
      });
      return deferred.promise;
    };

    this.getUploadPolicyBase64 = function (bucketName, uploadFileName, contentType, responseUrl) {

      var policyString = '{' +
        '  "expiration": "2020-01-01T12:00:00.000Z",' +
        '  "conditions": [' +
        '    {"bucket": "' + bucketName + '" },' +
        '    {"acl": "public-read" },' +
        '    ["eq", "$key", "' + uploadFileName + '"],' +
        '    ["starts-with", "$Content-Type", "' + contentType + '"],' +
        '    ["starts-with", "$Cache-Control", "public, max-age=60"],' +
        '    {"success_action_redirect": "' + responseUrl + '" },' +
        '  ]' +
        '}';

      return utf8_to_b64(policyString);

    };

    function utf8_to_b64( str ) {
      return window.btoa(unescape(encodeURIComponent( str )));
    }

    this.getSignedPolicy = function (companyId, policyBase64) {
      var deferred = $q.defer();

      var obj = {
        "companyId": companyId,
        "policyBase64": policyBase64
      };
      gapiLoader.get().then(function (gApi) {
        var request = gApi.client.storage.signPolicy(obj);
        request.execute(function (resp) {
          console && console.log(resp);
          if (resp.code !== 200) {
            console && console.error("Error retrieving policy: ", resp);
            resp = null;
          }
          deferred.resolve(resp.response);
        });
      });

      return deferred.promise;
    };
  } ]);
