angular.module("medialibrary").service("InitialAuthService",
["apiAuth", "$interval", "$window", "$rootScope",
function(apiAuth, $interval, $window, $rootScope) {
  apiAuth.checkAuth(true).then(function (authResult) {
    if (authResult && !authResult.error) {
      console.log("Application has user's oAuth permission.");
      $rootScope.$broadcast("user.oAuthPermissionGranted");
    } else {
      console.log("Application does not have user's oAuth permission.");
      $rootScope.$broadcast("user.oAuthPermissionNotGranted");
    }
  });
}]);
