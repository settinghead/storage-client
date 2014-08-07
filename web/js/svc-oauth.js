"use strict";
angular.module("medialibrary").factory("OAuthService", ["apiAuth", factory]);

function factory(apiAuth) {
  var service = {}
     ,authPromise;

  service.getAuthStatus = function() {
    if (authPromise !== undefined) {
      return authPromise;
    }

    authPromise = apiAuth.authorize(true).then(function (authResult) {
      if (authResult && !authResult.error) {
        console.log("Application has user's oAuth permission.");
        return true;
      } else {
        console.log("Application does not have user's oAuth permission.");
        return false;
      }
    });
    return authPromise;
  };

  return service;
}
