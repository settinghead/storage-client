"use strict";

angular.module("gapi", [])
  .factory("oauthAPILoader", ["gapiLoader", "$q", function (gapiLoader, $q) {
    var deferred = $q.defer();
    var promise;

    var factory = {
      get: function () {
        if (!promise) {
          promise = deferred.promise;
          gapiLoader.get().then(function (gApi) {
            gApi.client.load("oauth2", "v2", function () {
                console.log("OAuth2 API is loaded");
                deferred.resolve(gApi);
            });
          });
        }
        return promise;
      }
    };
    return factory;

  }]);