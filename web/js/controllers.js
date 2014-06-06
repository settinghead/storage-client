"use strict";
/* global gadgets: true */

angular.module("medialibrary").controller("MainController", ["$scope", "$rootScope",
  function ($scope, $rootScope) {
    $rootScope.actionsDisabled = true;
    $rootScope.closeButtonClick = function() {
      gadgets.rpc.call("", "rscmd_closeSettings", null);
    };

    $scope.$on("user.signout", function () {
      $("#signindialog").modal("show");
    });

    $scope.$on("profile.loaded", function () {
      $("#signindialog").modal("hide");
    });
  }
])

.controller("ButtonsController", ["$scope", "$rootScope", function ($scope, $rootScope) {
  $scope.downloadDisabled = true;
  $scope.deleteDisabled = true;	

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
}])

.controller("ProgressController", ["$scope", "$rootScope", function ($scope, $rootScope) {
  $rootScope.uploadProgress = 0;
}])

.controller("NavController", ["$scope", "$location", function ($scope, $location) { 

  $scope.isActive = function (viewLocation) { 
    return viewLocation === $location.path();
  };

}]);

// function ViewController($scope) {
//   $("#view-toggle").bootstrapSwitch();
//   $("#view-toggle").on("switch-change", function (e, data) {
//     $scope.thumbnailView = data.value;

//     if (data.value) {
//       showListView();
//     }
//     else {
//       showThumbView();
//     }
//   });

//   function showThumbView() {
//     $(".has-switch label").html("<i class="fa fa-th-list"></i>");
//     $("#thumbnails").show();
//     $("#list").hide();
//   }

//   function showListView() {
//     $(".has-switch label").html("<i class="fa fa-th-large"></i>");
//     $("#thumbnails").hide();
//     $("#list").show();
//   }
// }
