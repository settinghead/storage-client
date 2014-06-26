"use strict";

var commonModule = angular.module("common", ["ngRoute", "gapi-auth", "common-config", "gapi", "gapi-file"]);
// commonModule.run(function (apiAuth) { apiAuth.ensureAuth(); });

commonModule.controller("commonController", ["$scope", "$rootScope", "apiAuth", 
         "$interval", "$q", "oauthAPILoader", "$window",
        function ($scope, $rootScope, apiAuth, $interval, $q, oauthAPILoader, $window) {

  var AUTH_STATUS_UNDEFINED = -1;
  var AUTH_STATUS_NOT_AUTHENTICATED = 0;
  var AUTH_STATUS_AUTHENTICATED = 1;
  var DEFAULT_PROFILE_PICTURE = "img/user-icon.png";
  $rootScope.user = {
      profile: {
          name: "",
          email: "",
          picture: DEFAULT_PROFILE_PICTURE
      }
  };
  $rootScope.authStatus = AUTH_STATUS_UNDEFINED;     //-1=unknown, 0=not authenticated, 1=authenticated
  $rootScope.isAuthed = false;    //true if authenticated

  $rootScope.isRiseAdmin = false; //Rise Vision Billing Administrator
  $rootScope.isPurchaser = false;

  $scope.thAutoRefresh = null;
  $rootScope.authDeffered = $q.defer();

  // initial auth check (silent)
  apiAuth.checkAuth(true).then(function (authResult) {
    if (authResult && !authResult.error) {
        $scope.thAutoRefresh = $interval(function(){
          $interval.cancel($scope.thAutoRefresh);
          apiAuth.checkAuth(true);
        }, 55 * 60 * 1000); //refresh every 55 minutes

        $rootScope.authStatus = AUTH_STATUS_AUTHENTICATED;
        $rootScope.isAuthed = true;
        console.log("user is authenticated");
        oauthAPILoader.get();

        var profileDeferred = $q.defer();
        apiAuth.getProfile().then(function (resp) {
          $rootScope.user.profile.name = resp.name;
          $rootScope.user.profile.email = resp.email;
          $rootScope.user.profile.picture = resp.picture;
          profileDeferred.resolve();
          $rootScope.$broadcast("profile.loaded");
        });
        // this promise is for both the company and profile load, so it signifies complete auth.
        $q.all([profileDeferred.promise]).then(function () { $rootScope.authDeffered.resolve(); });


    } else {
      console.log("user is not authenticated");
      $rootScope.authDeffered.resolve();
      $scope.clearUser();
      $rootScope.$broadcast("user.signout"); 
    }
  });

  $rootScope.authStatus = apiAuth.AUTH_STATUS_UNDEFINED; //this value is linked to the UI
  $rootScope.selectedCompany = {};
  $rootScope.shipTo = {};
  $rootScope.isCAD = false;
  $scope.user.profile.picture = apiAuth.DEFAULT_PROFILE_PICTURE;
  $scope.messages = [];
  $scope.companyLoaded = false;

  $scope.login = function () {
    apiAuth.checkAuth().then(function () {
        $window.location.reload();
    });
};

  $scope.logout = function () {
      /* jshint ignore:start */
      logoutFrame.location = "https://www.google.com/accounts/Logout";
      /* jshint ignore:end */
      $scope.clearUser();
      $interval.cancel($scope.thAutoRefresh);
      $rootScope.$broadcast("user.signout");
  };

  $scope.clearUser = function () {
      $rootScope.authStatus = AUTH_STATUS_NOT_AUTHENTICATED;
      $rootScope.isAuthed = false;
      $rootScope.user.profile.name = "";
      $rootScope.user.profile.email = "";
      $rootScope.user.profile.picture = DEFAULT_PROFILE_PICTURE;
  };
}]);

commonModule.controller("headerController", [function () {
	$(".selectpicker").selectpicker();
}
]);