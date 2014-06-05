"use strict"

angular.module('medialibrary').controller("FileListCtrl", ["$scope", "$rootScope", "$routeParams", "$route", "$filter", "apiStorage", "apiAuth", "LocalFiles", "$log", "storageAPILoader", "fileInfo", "FileList",
	function ($scope, $rootScope, $routeParams, $route, $filter, apiStorage, apiAuth, LocalFiles, $log, storageAPILoader, fileInfo, FileList) {

	var MEDIA_LIBRARY_URL = 'http://commondatastorage.googleapis.com/';

	$rootScope.bucketName = 'risemedialibrary-' + $routeParams.companyId;
	$rootScope.bucketUrl = MEDIA_LIBRARY_URL + $rootScope.bucketName + '/';
	$rootScope.requireBucketCreation = false;
	
	$scope.mediaFiles = fileInfo.files || [];

  if(fileInfo.authError) {
    $scope.authenticationError = true;
  }

  else if(fileInfo.notFound) {
    $rootScope.actionsDisabled = false;
    $rootScope.requireBucketCreation = true;
  }

  else {
    $rootScope.actionsDisabled = false;
    $rootScope.librarySize = 0;
    $scope.selectAll = false;
    if(fileInfo.local) {
      $rootScope.actionsDisabled = true;
    }
  }
  
	$scope.orderByAttribute = 'lastModified';
  
  $scope.fileExtOrderFunction = function(file) {
    return file.key.split('.').pop();
  };

  $scope.fileSizeOrderFunction = function(file) {
    return Number(file.size);
  };

	$scope.reverseSort = true;

	$rootScope.updateList = function() {
		if ($rootScope.authStatus !== 1) {
      return;
    }
    FileList($routeParams.companyId).then($route.reload());
	};
	
	function onGetFiles(resp) {
    if (resp && resp.files) {
    	$scope.mediaFiles = resp.files;
    }
    else {
    	$scope.mediaFiles = [];
    }
	}
	
  function getLibrarySize(mediaFiles) {
    var size = 0;
    for ( var i = 0; i < mediaFiles.length; ++i ) {
      size += parseInt(mediaFiles[ i ].size);
    }
    return size;
  }

	$scope.$watch('mediaFiles', function(items) {
    if(items) {
      var checkedCount = 0;
      items.forEach(function(item) {
        if (item.checked) {
          checkedCount++;
        }
        $rootScope.librarySize = getLibrarySize(items);
      });
      $rootScope.$broadcast('CheckedCountChange', checkedCount);    
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
        $scope.mediaFiles[ i ].checked = $scope.selectAll;
    }
	};

	$scope.$on('FileSelectAction', function(event, file) {

		if (!file) {
			file = getSelectedFile();
		}

		if (file) {
			var fileUrl = $rootScope.bucketUrl + file.key;
			var data = { params: fileUrl };
			gadgets.rpc.call('', 'rscmd_saveSettings', null, data);
		}
	});
	
	$scope.$on('FileDownloadAction', function(event, file) {
		if (!file) {
			file = getSelectedFile();
		}
		$scope.selectedFile = file;
		if ($scope.selectedFile) {
			apiStorage.getFileUrl($routeParams.companyId, encodeURIComponent($scope.selectedFile)).then(onFileUrlResponse);
		}
	});
	
	function onFileUrlResponse(response) {
		window.location.assign(response);
	}

	$scope.$on('FileDeleteAction', function(event) {
		var selectedFiles = getSelectedFiles();
		if (confirm('Are you sure you want to delete the ' + selectedFiles.length + ' files selected?')) {
			apiStorage.deleteFiles($routeParams.companyId, selectedFiles).then(onGetFiles);
		}
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
		
		var selectedFiles = new Array();

		for ( var i = 0; i < $scope.mediaFiles.length; ++i ) {
			if ($scope.mediaFiles[ i ].checked) {
				selectedFiles.push($scope.mediaFiles[ i ].key);
			}
		}
		return selectedFiles;
	}
}

]);
