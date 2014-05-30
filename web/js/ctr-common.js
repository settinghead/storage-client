"use strict";

var commonModule = angular.module("common", ["ngRoute", "gapi-auth"]);

// commonModule.run(function (apiAuth) { apiAuth.ensureAuth(); });

commonModule.controller("commonController", ["$scope", "$rootScope", "$sce", "apiAuth", function ($scope, $rootScope, $sce, apiAuth) {
	$scope.userProfilePicture = apiAuth.DEFAULT_PROFILE_PICTURE;
	$scope.messages = [];
	$scope.selectedCompanyName = "";
	$scope.selected = "list";

  apiAuth.getProfile().then(function (resp) {
      $rootScope.user.profile.name = resp.name;
      $rootScope.user.profile.email = resp.email;
      $rootScope.user.profile.picture = resp.picture;
      profileDeferred.resolve();
      $rootScope.$broadcast("profile.loaded");
    });

	$scope.login = function () {
		apiAuth.login();
	};

	$scope.logout = function () {
		apiAuth.logout();
	};
}
]);



commonModule.controller("headerController", ["$scope", function ($scope) {
	$(".selectpicker").selectpicker();
}
]);