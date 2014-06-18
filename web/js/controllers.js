"use strict";
/* global gadgets: true */

angular.module('medialibrary').controller("MainController", ["$scope", "$rootScope",
  function ($scope, $rootScope) {
    $rootScope.actionsDisabled = true;
    $rootScope.closeButtonClick = function() {
      gadgets.rpc.call("", "rscmd_closeSettings", null);
    }

    $scope.$on("user.signout", function () {
      $("#signindialog").modal("show");
    });

    $scope.$on("profile.loaded", function () {
      $("#signindialog").modal("hide");
    });
  }
])

.controller("ButtonsController",
            ["$scope", "$rootScope", "$routeParams",
            function ($scope, $rootScope, $routeParams) {
  $scope.downloadDisabled = true;
  $scope.deleteDisabled = true;	
  $scope.newFolderDisabled = ($routeParams.folder ? true : false);

  $scope.$on("CheckedCountChange", function(event, count) {
    $scope.downloadDisabled = count !== 1;
    $scope.deleteDisabled = !count;
  });

  $scope.uploadButtonClick = function() {
    $("#file").click();
  };

  $scope.downloadButtonClick = function() {
    $rootScope.$broadcast("FileDownloadAction");
  };

  $scope.deleteButtonClick = function() {
    $rootScope.$broadcast("FileDeleteAction");
  };

  $scope.newFolderButtonClick = function() {
    $rootScope.$broadcast("NewFolderAction");
  }
}])

.controller("ProgressController", ["$scope", "$rootScope", function ($scope, $rootScope) {
  $rootScope.uploadProgress = 0;
}])

.controller("NavController", ["$scope", "$location", function ($scope, $location) { 

  $scope.isActive = function (viewLocation) { 
    return viewLocation === $location.path();
  };
}]);
