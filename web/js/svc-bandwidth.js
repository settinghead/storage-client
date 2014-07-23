"use strict";
angular.module("medialibrary")
.factory("BandwidthService", ["$q", "storageAPILoader",
  function ($q, storageAPILoader) {
    var factory = {};
    factory.oAuthReady = false;
    factory.bandwidthValuesCache = {};
    factory.getBandwidth = function (companyId) {
      var deferred = $q.defer();

      if (factory.bandwidthValuesCache.hasOwnProperty(companyId)) {
        deferred.resolve(factory.bandwidthValuesCache[companyId]);
        return deferred.promise;
      }

      if (companyId) {
        storageAPILoader.get().then(function (storageApi) {
          var request = storageApi.getBucketBandwidth({
            "companyId": companyId,
          });
          request.execute(function (resp) {
            if (resp.result === false) {
              deferred.resolve("undetermined");
            } else {
              resp.message = parseInt(resp.message, 10);
              resp.message = isNaN(resp.message) ? 0 : resp.message / 1000000;
              console.log("Setting bandwidth: " + resp.message);
              factory.bandwidthValuesCache[companyId] = resp.message;
              deferred.resolve(resp.message);
            }
          });
        });
      }
      return deferred.promise;
    };
    return factory;
  }
]);
