"use strict";
angular.module("medialibrary")
  .controller("BandwidthController", 
  ["$scope", "$rootScope", "$route", "$routeParams", "BandwidthService",
  function ($scope, $rootScope, $route, $routeParams, bandwidthService) {
    $scope.bandwidthUse = "undetermined";

    $scope.getbandwidth = function() {
      bandwidthService.getBandwidth($routeParams.companyId)
                      .then(function(resp) {
        $scope.bandwidthUse = resp < 1 ? "less than one" : resp.toFixed(2);
      });
    }

    $rootScope.$on("user.oAuthPermissionGranted", function() {
      bandwidthService.oAuthReady = true;
      $scope.getbandwidth();
    });

    if (bandwidthService.oAuthReady) {
      $scope.bandwidthUse = $scope.getbandwidth();
    }

  }
]);
