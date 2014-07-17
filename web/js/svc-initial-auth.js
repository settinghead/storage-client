angular.module("medialibrary").service("InitialAuthService",
["apiAuth", "$interval", "$window", "$rootScope",
function(apiAuth, $interval, $window, $rootScope) {
  var obj = {};

  apiAuth.checkAuth(true).then(function (authResult) {
    if (authResult && !authResult.error) {
      console.log("Application has user's oAuth permission.");
      $rootScope.$broadcast("user.oAuthPermissionGranted");
      obj.isAuthed = true;
    } else {
      console.log("Application does not have user's oAuth permission.");
      $rootScope.$broadcast("user.oAuthPermissionNotGranted");
      obj.isAuthed = false;
    }
  });
  return obj;
}]);
