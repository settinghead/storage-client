'use strict';

angular.module('medialibrary').controller("MainController", ["$scope", "$rootScope", "$routeParams", "apiStorage",
  function ($scope, $rootScope, $routeParams, apiStorage) {
    $rootScope.actionsDisabled = true;
    $rootScope.closeButtonClick = function() {
      gadgets.rpc.call('', 'rscmd_closeSettings', null);
    }

    $scope.$on("user.signout", function (event) {
      $('#signindialog').modal('show');
    });

    $scope.$on("profile.loaded", function (event) {
      $('#signindialog').modal('hide');
    });
  }
]);

function ButtonsController($scope, $rootScope) {
  $scope.downloadDisabled = true;
  $scope.deleteDisabled = true;	

  $scope.$on('CheckedCountChange', function(event, count) {
    $scope.downloadDisabled = count != 1;
    $scope.deleteDisabled = !count;
  });

  $scope.uploadButtonClick = function() {
    $('#file').click();
  }

  $scope.downloadButtonClick = function() {
    $rootScope.$broadcast('FileDownloadAction');
  }

  $scope.deleteButtonClick = function() {
    $rootScope.$broadcast('FileDeleteAction');
  }

  $scope.newFolderButtonClick = function() {
    $rootScope.$broadcast('NewFolderAction');
  }
}

function ProgressController($scope, $rootScope) {
  $rootScope.uploadProgress = 0;
}

function NavController($scope, $location) { 

  $scope.isActive = function (viewLocation) { 
    return viewLocation === $location.path();
  };

}

// function ViewController($scope) {
//   $('#view-toggle').bootstrapSwitch();
//   $('#view-toggle').on('switch-change', function (e, data) {
//     $scope.thumbnailView = data.value;

//     if (data.value) {
//       showListView();
//     }
//     else {
//       showThumbView();
//     }
//   });

//   function showThumbView() {
//     $(".has-switch label").html("<i class='fa fa-th-list'></i>");
//     $('#thumbnails').show();
//     $('#list').hide();
//   }

//   function showListView() {
//     $(".has-switch label").html("<i class='fa fa-th-large'></i>");
//     $('#thumbnails').hide();
//     $('#list').show();
//   }
// }
