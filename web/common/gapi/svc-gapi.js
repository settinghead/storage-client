/* jshint ignore:start */

window.isGoogleJSClientLoaded = false;
function handleClientJSLoad() {
    window.isGoogleJSClientLoaded = true;
    console.log("Google JS client is loaded");
    //Ready: create a generic event
    var evt = document.createEvent("Events");
    //Aim: initialize it to be the event we want
    evt.initEvent("gapi.loaded", true, true);
    //FIRE!
    window.dispatchEvent(evt);
}
/* jshint ignore:end */

angular.module("gapi", ["common-config"])
  .factory("oauthAPILoader", ["gapiLoader", "$q", "$log", function (gapiLoader, $q, $log) {
    var deferred = $q.defer();
    var promise;

    var factory = {
      get: function () {
        if (!promise) {
          promise = deferred.promise;
          gapiLoader.get().then(function (gApi) {
            gApi.client.load("oauth2", "v2", function () {
                $log.info("OAuth2 API is loaded");
                deferred.resolve(gApi);
            });
          });
        }
        return promise;
      }
    };
    return factory;

  }])  

  .factory("storageAPILoader", ["$rootScope", "gapiLoader", "$q", "STORAGE_URL", "$window", "$log", function ($rootScope, gapiLoader, $q, STORAGE_URL, $window, $log) {

    return {
      get: function () {
        var deferred = $q.defer();
        var errMsg;
        var apiuri = $window.location.search.substr(1).split("&")[0].split("=");
        apiuri = apiuri[0] === "apiuri" ? apiuri[1] : "";

        gapiLoader.get().then(function (gApi) {
          if ($window.isStorageApi) {
            deferred.resolve(gApi.client.storage);
          }
          else {
            gApi.client.load("storage", "v0.01", function () {
              if (gApi.client.storage) {
                $rootScope.$broadcast("storageApi.loaded");
                $log.info("Storage API is loaded: gApi: ", gApi.client.storage);
                $window.isStorageApi = true;
                deferred.resolve(gApi.client.storage);
              } else {
                errMsg = "Storage API is NOT loaded";
                $log.error(errMsg);
                deferred.reject(errMsg);
              }
            }, apiuri ? apiuri : STORAGE_URL);
          }
        });

        return deferred.promise;
      }
    };
  }])

  .factory("gapiLoader", ["$q", "$window", function ($q, $window) {
    return {
      get: function () {
        var deferred = $q.defer(), gapiLoaded;

        if($window.isGoogleJSClientLoaded) { 
          deferred.resolve($window.gapi);
        }

        else {
          gapiLoaded = function () {
            deferred.resolve($window.gapi);
            $window.removeEventListener("gapi.loaded", gapiLoaded, false);
          };
          $window.addEventListener("gapi.loaded", gapiLoaded, false);
        }

        return deferred.promise;
      }
    };
  }]);
