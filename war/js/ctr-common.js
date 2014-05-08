"use strict";

var commonModule = angular.module("common", ["ngRoute"]);

commonModule.run(function (apiAuth) { apiAuth.init(); });

commonModule.controller("commonController", ["$scope", "$rootScope", "$sce", "apiAuth", function ($scope, $rootScope, $sce, apiAuth) {
	$scope.authStatus = apiAuth.AUTH_STATUS_UNDEFINED; //this value is linked to the UI
	$scope.userProfilePicture = apiAuth.DEFAULT_PROFILE_PICTURE;
	$scope.messages = [];
	$scope.selectedCompanyName = "";
	$scope.selected = "list";

	$scope.login = function () {
		apiAuth.login();
	};

	$scope.logout = function () {
		apiAuth.logout();
	};

	$scope.updateAuthStatus = function (value) {
		if ($scope.authStatus !== value) {
			$scope.authStatus = value;
			$scope.userProfileName = apiAuth.userProfileName;
			$scope.userProfileEmail = apiAuth.userProfileEmail;
			$scope.userProfilePicture = apiAuth.userProfilePicture;
		}
	};

	$scope.$on("profile.loaded", function (event) {
		$scope.updateAuthStatus(apiAuth.authStatus);
		$scope.$apply();
		//$scope.getSystemMessages();
	});

	$scope.$on("user.signout", function (event) {
		$scope.companyLoaded = false;
		$scope.updateAuthStatus(apiAuth.authStatus);
		//$apply is needed when user is not logged in when app loads
		if (!$scope.$$phase) {
			$scope.$apply();
		}
	});

}
]);
