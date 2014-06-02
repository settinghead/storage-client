"use strict";

commonModule.service("apiStorage", ["$q", "$rootScope", "$timeout", "apiAuth", 
  function ($q, $rootScope, $timeout, apiAuth) {
    var self = this;
    var getCompanyId = function () {
      var res = "";
      if (apiAuth.userCompany) {
        res = apiAuth.userCompany.id;
      }
      return res;
    };

    var loadStorageAPI = function () {
      gapi.client.load("storage", "v0.01", function () {
        if (gapi.client.storage) {
          console && console.log("Storage API is loaded");
          $rootScope.$broadcast("storageApi.loaded");
        } else {
          console && console.error("Store API is NOT loaded");
        }
      }, rvGlobals.STORAGE_URL);
    };

    $rootScope.$on("userCompany.loaded", function (event) {

      loadStorageAPI();

    });

    this.getFiles = function (companyId) {
      var deferred = $q.defer();

      var obj = {
        "companyId": companyId
      };
      var request = gapi.client.storage.files.get(obj);
      request.execute(function (resp) {
        console && console.log(resp);
        if (resp.code === 200) {  
          $rootScope.actionsDisabled = false;
        }
        else if (resp.code === 403 || resp.code === 401 || resp.code === 400) {
          $rootScope.authenticationError = true;
        }
        else if (resp.code == 404) {
          $rootScope.actionsDisabled = false;
          $rootScope.requireBucketCreation = true;
        }
      deferred.resolve(resp);
      });

      return deferred.promise;
    };

    this.deleteFiles = function (companyId, files, validationRequired) {
      var deferred = $q.defer();

      var obj = {
        "companyId": companyId,
        "files": files
      };
      var request = gapi.client.storage.files.delete(obj);
      request.execute(function (resp) {
        console && console.log(resp);
        if (resp.code !== 200) {
          console && console.error("Error deleting files: ", resp);
          resp = null;
        }
        deferred.resolve(resp);
      });

      return deferred.promise;
    };

    this.getFileUrl = function (companyId, file) {
      var deferred = $q.defer();

      var obj = {
        "companyId": companyId,
        "file": file
      };
      var request = gapi.client.storage.file.url(obj);
      request.execute(function (resp) {
        console && console.log(resp);
        if (resp.code !== 200) {
          console && console.error("Error retrieving policy: ", resp);
          resp = null;
        }
        deferred.resolve(resp.response);
      });

      return deferred.promise;

    };

    this.createBucket = function (companyId) {
      var deferred = $q.defer();
      var obj = {
        "companyId": companyId,
      };
      var request = gapi.client.storage.createBucket(obj);
      request.execute(function (resp) {
        if (resp.code !== 200) {
          console && console.error("Error creating bucket: ", resp);
          deferred.reject(resp);
        } else {
          console && console.log(resp);
          deferred.resolve(resp);
        }
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
      var request = gapi.client.storage.signPolicy(obj);
      request.execute(function (resp) {
        console && console.log(resp);
        if (resp.code !== 200) {
          console && console.error("Error retrieving policy: ", resp);
          resp = null;
        }
        deferred.resolve(resp.response);
      });

      return deferred.promise;
    };
  } ]);
