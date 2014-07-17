"use strict";
/* global gadgets: true */

angular.module("medialibrary").controller("FileListCtrl", ["$scope", "$rootScope", "$routeParams", "$route", "$location", "apiStorage", "FileListFactory", "apiAuth", "$interval", "oauthAPILoader", "InitialAuthService", "$window",
	function ($scope, $rootScope, $routeParams, $route, $location, apiStorage, fileListFactory, apiAuth, $interval, oauthAPILoader, InitialAuthService, $window) {

  var MEDIA_LIBRARY_URL = "http://commondatastorage.googleapis.com/";

  $rootScope.bucketName = "risemedialibrary-" + $routeParams.companyId;
  $rootScope.bucketUrl = MEDIA_LIBRARY_URL + $rootScope.bucketName + "/";
  $scope.isAuthed = InitialAuthService.isAuthed;
  $scope.$location = $location;
  $scope.fileListRequestInProgress = false;

  $scope.orderByAttribute = "lastModified";
  
  $scope.dateModifiedOrderFunction = function(file) {
    return file.updated ? file.updated.value : ""
  };

  $scope.login = function() {
    apiAuth.checkAuth().then(function() {
      $window.location.reload();
    });
  };

  $scope.fileExtOrderFunction = function(file) {
    return file.name.substr(-1) === "/" ?
           "Folder" :
           file.name.split(".").pop();
  };

  $scope.fileSizeOrderFunction = function(file) {
    return Number(file.size);
  };

  $scope.reverseSort = true;

  $scope.updateFileList = function() {
    $scope.fileListRequestInProgress = true;
    fileListFactory.listFiles($routeParams.companyId, $routeParams.folder)
                   .then(onGetFiles);
  };

  $scope.$on("user.oAuthPermissionGranted", $scope.updateFileList);
  $scope.$on("file.uploaded", $scope.updateFileList);
  $scope.$on("user.oAuthPermissionNotGranted", function() {
    $scope.isAuthed = false;
  });
	
  function onGetFiles(resp) {
    $scope.fileListRequestInProgress = false;
    $rootScope.actionsDisabled = false;
    $rootScope.librarySize = 0;
    $scope.selectAll = false;

    $scope.mediaFiles = resp.files || [];

    if(resp.authError) {
      $scope.authenticationError = true;
    }

    if(resp.notFound) {
      $rootScope.actionsDisabled = false;
      apiStorage.createBucket($routeParams.companyId);
    }

    if(resp.local) {
      $rootScope.actionsDisabled = true;
    }
  }
	
  function getLibrarySize(mediaFiles) {
    var size = 0;
    for ( var i = 0; i < mediaFiles.length; ++i ) {
      size += parseInt(mediaFiles[ i ].size);
    }
    return size;
  }

  $scope.$watch("mediaFiles", function(items) {
    if(items) {
      var checkedCount = 0, folderChecked = false;
      items.forEach(function(item) {
        if (item.checked) {
          checkedCount++;
          if (item.name.substr(-1) === "/") { folderChecked = true;}
        }
        $rootScope.librarySize = getLibrarySize(items);
      });
      $rootScope.$broadcast("CheckedCountChange", checkedCount, folderChecked);    
    }
    else {
      $rootScope.librarySize = 0;
    }

  }, true);
/*
 *     Scope $watch won't work within a bootstrap modal unless it's an object
 *     property that is being changed.  See the following issue:
 *     https://github.com/angular-ui/bootstrap/issues/1680
 *     
	$scope.$watch('selectAll', function(v) {

	    for ( var i = 0; i < $scope.mediaFiles.length; ++i ) {
	        $scope.mediaFiles[ i ].checked = v;
	    }

	});

        */

  $scope.selectAllCheckboxes = function() {
    $scope.selectAll = !$scope.selectAll;

    for ( var i = 0; i < $scope.mediaFiles.length; ++i ) {
      if (!$scope.fileIsCurrentFolder($scope.mediaFiles[i])) {
        $scope.mediaFiles[ i ].checked = $scope.selectAll;
      }
    }
  };

  $scope.fileIsCurrentFolder = function(file) {
      return file.name === $routeParams.folder + "/"
    }

  $scope.fileIsFolder = function(file) {
      return file.name.substr(-1) === '/';
    }

  $scope.$on("FileSelectAction", function(event, file) {
    if (!file) {
      file = getSelectedFile();
    }

    if (file) {
      var fileUrl = $rootScope.bucketUrl + file.name;
      var data = { params: fileUrl };
      var newPath;

      if ($scope.fileIsCurrentFolder(file)) {
        $scope.$location.path("/files/" + $routeParams.companyId); 
      } else if ($scope.fileIsFolder(file)) {
        $scope.$location
              .path("/files/" + $routeParams.companyId + 
                    "/folder/" + file.name)
      } else {
        gadgets.rpc.call("", "rscmd_saveSettings", null, data);
      }
    }
  });
	
  $scope.$on("FileDownloadAction", function(event, file) {
    if (!file) {
      file = getSelectedFile();
    }
    $scope.selectedFile = file;

    if ($scope.selectedFile) {
      $window.location.assign("https://www.googleapis.com/storage/v1/b/" +
                              $rootScope.bucketName + "/o/" +
                              $scope.selectedFile + "?alt=media");
    }
  });

  $scope.$on("FileDeleteAction", function(event) {
    var selectedFiles = getSelectedFiles()
       ,confirmationMessage = "Please confirm PERMANENT deletion of:\n\n";

    selectedFiles.forEach(function(val) {
      if (val.substr(-1) === "/") {
        confirmationMessage += "folder: " + val + " and all its contents" + "\n";
      } else {
        confirmationMessage += "file: " + val + "\n";
      }
    });

    if (confirm(confirmationMessage)) {
      apiStorage.deleteFiles($routeParams.companyId, selectedFiles)
                .then(function() {$scope.updateFileList()});
    }
  });

  $scope.$on("NewFolderAction", function(event) {
    var folderName = prompt("Enter a folder name");
    if (!folderName) {return;}
    if (folderName.indexOf("/") > -1) {return;}
    apiStorage.createFolder($routeParams.companyId, folderName)
              .then(function() {$scope.updateFileList()});
  });

  function getSelectedFile() {
    var file;
    var files = getSelectedFiles();
    if (files && files.length > 0) {
      file = files[0];
    }
    return file;
  }

  function getSelectedFiles() {
    var selectedFiles = [];

    for ( var i = 0; i < $scope.mediaFiles.length; ++i ) {
      if ($scope.mediaFiles[ i ].checked) {
        selectedFiles.push($scope.mediaFiles[ i ].name);
      }
    }
    return selectedFiles;
  }
}]);
