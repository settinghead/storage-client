"use strict";
angular.module("medialibrary")
  .controller("BandwidthController",
  ["$scope", "$rootScope", "$route", "$routeParams", "BandwidthService",
  function ($scope, $rootScope, $route, $routeParams, bandwidthService) {
    $scope.bandwidthUse = undefined;

    (function getBandwidth() {
      bandwidthService.getBandwidth($routeParams.companyId)
      .then(function(resp) {
        $scope.bandwidthUse = resp;
      });
    }());
  }
]);
