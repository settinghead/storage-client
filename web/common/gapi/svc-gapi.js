/* jshint ignore:start */
var isClientJS = false;
function handleClientJSLoad() {
    isClientJS = true;
    console.log("ClientJS is loaded");
    //Ready: create a generic event
    var evt = document.createEvent("Events");
    //Aim: initialize it to be the event we want
    evt.initEvent("gapi.loaded", true, true);
    //FIRE!
    window.dispatchEvent(evt);
}
/* jshint ignore:end */

angular.module("gapi", [])
  .factory("gapiLoader", ["$q", "$window", function ($q, $window) {
    return {
      get: function () {
        var deferred = $q.defer(), gapiLoaded;

        if($window.isClientJS) {
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