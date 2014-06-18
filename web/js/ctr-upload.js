"use strict";

angular.module("medialibrary").controller("UploadController", ["$scope", "$rootScope", "$route", "$routeParams", "$http", "$timeout", "apiStorage",
	function ($scope, $rootScope, $route, $routeParams, $http, $timeout, apiStorage) {
  $scope.uploadFileName = "";
  $scope.uploadFileSize = "";
  $scope.uploadComplete = false;
  $scope.uploadActive = false;
  $scope.uploadError = false;

  $scope.googleAccessId = "452091732215@developer.gserviceaccount.com";
  $scope.responseUrl = location.protocol + "//" + location.hostname + ":" + location.port + "/uploadComplete';
  $scope.fileName = "";
  $scope.contentType = "";

  $scope.filesSelected = function(element) {
    if ($scope.authStatus !== 1) {
      return;
    }

    if ($rootScope.requireBucketCreation) {
      apiStorage.createBucket($routeParams.companyId)
        .then(function() {
          $rootScope.requireBucketCreation=false; loadFiles(element);
        }, onUploadError);
    }
    else {
      loadFiles(element);
    }
  };

  function loadFiles(element) {
    $("#uploadform").attr("action", $rootScope.bucketUrl);

    for (var i = 0; i < element.files.length; i++) {

      $scope.uploadFileName = element.files[i].name;
      $scope.uploadFileSize = element.files[i].size;
      $scope.contentType = element.files[i].type;

      if ($routeParams.folder) {
        $scope.uploadFileName = $routeParams.folder + "/" + $scope.uploadFileName;
      }

      $scope.uploadActive = true;
      $scope.uploadComplete = false;
      $scope.uploadError = false;

      $scope.policyBase64 = apiStorage.getUploadPolicyBase64($rootScope.bucketName, $scope.uploadFileName, $scope.contentType, $scope.responseUrl);

      apiStorage.getSignedPolicy($routeParams.companyId, $scope.policyBase64).then(onSignedPolicy);


      break;

    }

  }

  function onSignedPolicy(response) {
    $scope.signature = response;

    if ($scope.signature) {

      $timeout(function() {

        $("#uploadform").submit();

      });

    }
  }

  $("#uploadcompleteframe").load(function(event) {
    try {
      if (event.target.contentWindow.name && $scope.uploadActive === true) {
        onUploadComplete();
      }
      else {
        onUploadError();
      }
    } catch (err) {
      onUploadError();
    }

  });

  function onUploadComplete() {

    $("#uploadform").trigger("reset");

    $rootScope.updateList();
    $scope.uploadComplete = true;
    $scope.uploadError = false;
    $scope.uploadActive = false;

  }

  function onUploadError() {

    $("#uploadform").trigger("reset");

    $scope.uploadError = true;
    $scope.uploadComplete = false;
    $scope.uploadActive = false;

  }
}]);

