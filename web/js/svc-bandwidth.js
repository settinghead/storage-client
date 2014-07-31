"use strict";
angular.module("medialibrary")
.factory("BandwidthService", ["$q", "storageAPILoader", "OAuthService",

function bandwidthFactory($q, storageAPILoader, OAuthService) {
  var service = {}
     ,bandwidthValuesPromiseCache = {};

  service.getBandwidth = function(companyId) {
    if (!companyId) {return {};}

    if (bandwidthValuesPromiseCache.hasOwnProperty(companyId)) {
      return bandwidthValuesPromiseCache[companyId];
    }

    bandwidthValuesPromiseCache[companyId] =
    $q.all([storageAPILoader.get(), OAuthService.getAuthStatus()])
    .then(function(results) {
      if (results[1] === false) {return;}
      var request = results[0].getBucketBandwidth({
        "companyId": companyId
      });
      return executeRequest(request);
    }).then(function(resp) {
      return resp;
    });
    return bandwidthValuesPromiseCache[companyId];
  };

  function executeRequest(request) {
    var defer = $q.defer();
    request.execute(function(resp) {
      if (resp.result === false) {
        defer.resolve("undetermined");
      } else {
        resp.message = parseInt(resp.message, 10);
        resp.message = isNaN(resp.message) ? 0 : resp.message / 1000000;
        resp.message = resp.message < 1 ?
                       "less than one" : resp.message.toFixed(2);
        console.log("Received bandwidth: " + resp.message);
        defer.resolve(resp.message);
      }
    });
    return defer.promise;
  }

  return service;
}]);
