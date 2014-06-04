"use strict"

mediaLibraryApp.controller("FileListCtrl", ["$scope", "$rootScope", "$routeParams", "$filter", "apiStorage", "apiAuth", "LocalFiles", 
	function ($scope, $rootScope, $routeParams, $filter, apiStorage, apiAuth, LocalFiles) {

	var MEDIA_LIBRARY_URL = 'http://commondatastorage.googleapis.com/';

	$rootScope.bucketName = 'risemedialibrary-' + $routeParams.companyId;
	$rootScope.bucketUrl = MEDIA_LIBRARY_URL + $rootScope.bucketName + '/';
	$rootScope.requireBucketCreation = false;
	
	$scope.mediaFiles = [];
	$rootScope.librarySize = 0;
	
	$scope.orderByAttribute = 'lastModified';
        $scope.fileExtOrderFunction = function(file) {
          return file.key.split('.').pop();
        };

        $scope.fileSizeOrderFunction = function(file) {
          return Number(file.size);
        };

	$scope.reverseSort = true;
	
    function updateAuthStatus() {
        $scope.authStatus = apiAuth.authStatus;
    };
    
    $scope.$on("storageApi.loaded", function(event) {
    	updateAuthStatus();
    	
        if ($scope.mediaFiles.length == 0) {
        	$rootScope.updateList();
        }
        
    });
    
	$rootScope.updateList = function() {
        
		if ($scope.authStatus !== 1) {
            return;
        }
        
		if ($routeParams.companyId) {

//			MediaFiles.query({companyId: $routeParams.companyId}, function(response) {
//				onGetFiles(response);
//			});
			
			apiStorage.getFiles($routeParams.companyId).then(onGetFiles);

		}
		else {

			$scope.mediaFiles = LocalFiles.query(function(mediaFiles) {

//				$rootScope.setTermsCheckbox(true);
				$rootScope.actionsDisabled = true;

				$rootScope.librarySize = getLibrarySize(mediaFiles);

			});

		}
	};
	
	function onGetFiles(resp) {
//		$scope.phonesGroupBy4 = $filter('groupBy')(phones, 4);
		
        if (resp && resp.files) {
		
        	$scope.mediaFiles = resp.files;
			$rootScope.librarySize = getLibrarySize($scope.mediaFiles);
        
        }
        else {
        	$scope.mediaFiles = [];
        	$rootScope.librarySize = 0;
        }
			
//		if (response.code == 200) {  
//
//			$rootScope.setTermsCheckbox(true);
//			$rootScope.actionsDisabled = false;
//
//			$scope.mediaFiles = response.files;
//			$rootScope.librarySize = getLibrarySize($scope.mediaFiles);
//
//		}
//		// Authentication failed
//		else if (response.code == 403 || response.code == 401 || response.code == 400) {
//
//			$rootScope.authenticationError = true;
//
//		}
//		// Bucket not found
//		else if (response.code == 404) {
//
//			$rootScope.setTermsCheckbox(true);
//			$rootScope.actionsDisabled = false;
//			$rootScope.requireBucketCreation = true;
//
//		}
//		// Media Library feature not enabled
//		else if (response.code == 412) {
//		
//			$rootScope.requireBucketCreation = true;
//			$rootScope.setTermsCheckbox(false);
//
//		}
		
	}
	
	$scope.$watch('mediaFiles', function(items) {

		var checkedCount = 0;

		items.forEach(function(item) {
			if (item.checked) {
				checkedCount++;
			}
		});

		$rootScope.$broadcast('CheckedCountChange', checkedCount);		

	}, true);

	$scope.$watch('selectAll', function(v) {

	    for ( var i = 0; i < $scope.mediaFiles.length; ++i ) {
	        $scope.mediaFiles[ i ].checked = v;
	    }

	});

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
			
//			$http({
//
//				url: 'deleteFiles',
//				method: 'POST',
//				data: selectedFiles,
//				params:{companyId:$routeParams.companyId},
//				headers: {'Content-Type': 'application/octet-stream'}
//
//			}).success(function (data, status, headers, config) {
//			
//				if (data.status == 200) {
//					$scope.mediaFiles = data.mediaFiles;
//				}
//		
//			}).error(function (data, status, headers, config) {
//				
//				$scope.status = status;
//
//			});
		
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

	function getLibrarySize(mediaFiles) {

		var size = 0;
		for ( var i = 0; i < mediaFiles.length; ++i ) {
			size += parseInt(mediaFiles[ i ].size);
		}

		return size;

	}
	
}

]);
