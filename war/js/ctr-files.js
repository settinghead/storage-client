"use strict"

mediaLibraryApp.controller("FileListCtrl", ["$scope", "$rootScope", "$routeParams", "$filter", "$http", "apiStorage", "MediaFiles", "LocalFiles", 
	function ($scope, $rootScope, $routeParams, $filter, $http, apiStorage, MediaFiles, LocalFiles) {

	var MEDIA_LIBRARY_URL = 'http://commondatastorage.googleapis.com/';

	$rootScope.bucketName = 'risemedialibrary-' + $routeParams.companyId;
	$rootScope.bucketUrl = MEDIA_LIBRARY_URL + $rootScope.bucketName + '/';
	$scope.mediaFiles = [];
	$rootScope.actionsDisabled = true;
	$rootScope.requireBucketCreation = false;

	$rootScope.updateList = function() {
		if ($routeParams.companyId) {

			MediaFiles.query({companyId: $routeParams.companyId}, function(response) {
				onGetFiles(response);
			});

		}
		else {

			$scope.mediaFiles = LocalFiles.query(function(mediaFiles) {

				checkTermsCheckbox();
				$rootScope.actionsDisabled = true;

				$rootScope.librarySize = getLibrarySize(mediaFiles);

			});

		}
	};

	$rootScope.updateList();
	
	$scope.orderByAttribute = 'key';
	$scope.reverseSort = false;

	initActions($scope, $rootScope, $routeParams, $http);

	function onGetFiles(response) {
//		$scope.phonesGroupBy4 = $filter('groupBy')(phones, 4);

		if (response.status == 200) {  

			checkTermsCheckbox();
			$rootScope.actionsDisabled = false;

			$scope.mediaFiles = response.mediaFiles;
			$rootScope.librarySize = getLibrarySize($scope.mediaFiles);

		}
		// Authentication failed
		else if (response.status == 403 || response.status == 401 || response.status == 400) {

			$rootScope.authenticationError = true;

		}
		// Bucket not found
		else if (response.status == 404) {

			checkTermsCheckbox();
			$rootScope.actionsDisabled = false;
			$rootScope.requireBucketCreation = true;

		}
		// Media Library feature not enabled
		else if (response.status == 412) {
		
			$rootScope.requireBucketCreation = true;
			initTermsCheckbox($rootScope, $routeParams, $http);

		}
		
	}

	function checkTermsCheckbox() {

		$('#termsCheckbox').attr('checked', true);
		$('#termsCheckbox').attr('disabled', true);

	}

	function initTermsCheckbox($rootScope, $routeParams, $http) {

		$('#termsCheckbox').attr('disabled', false);
		$('#termsCheckbox').click(function() {

			if (this.checked) {
				
				$http({
					url: 'enableMediaLibrary',
					method: "POST",
					data: "companyId=" + $routeParams.companyId,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).success(function (data, status, headers, config) {
			
					if (data.status == 200) {

						$('#termsCheckbox').unbind('click');
						checkTermsCheckbox();
						$rootScope.actionsDisabled = false;

					}
					else {

						$('#termsCheckbox').attr('checked', false);

					}

				}).error(function (data, status, headers, config) {
			
					$('#termsCheckbox').attr('checked', false);

				});

			}

		});

	}
	
	function initActions($scope, $rootScope, $routeParams, $http) {

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

		$rootScope.$on('FileSelectAction', function(event, file) {

			if (!file) {

			  for ( var i = 0; i < $scope.mediaFiles.length; ++i ) {
	        if ($scope.mediaFiles[ i ].checked) {
						file = $scope.mediaFiles[ i ];
					}
				}
		
			}

			if (file) {
				var fileUrl = $rootScope.bucketUrl + file.key;
				var data = { params: fileUrl };
				gadgets.rpc.call('', 'rscmd_saveSettings', null, data);

			}

		});

		$rootScope.$on('FileDeleteAction', function(event) {

			var selectedFiles = new Array();

			for ( var i = 0; i < $scope.mediaFiles.length; ++i ) {
				if ($scope.mediaFiles[ i ].checked) {
					selectedFiles.push($scope.mediaFiles[ i ].key);
				}
			}

			if (confirm('Are you sure you want to delete the ' + selectedFiles.length + ' files selected?')) {

				apiStorage.deleteFiles($routeParams.companyId, selectedFiles).then(onGetFiles);
				
//				$http({
	//
//					url: 'deleteFiles',
//					method: 'POST',
//					data: selectedFiles,
//					params:{companyId:$routeParams.companyId},
//					headers: {'Content-Type': 'application/octet-stream'}
	//
//				}).success(function (data, status, headers, config) {
//				
//					if (data.status == 200) {
//						$scope.mediaFiles = data.mediaFiles;
//					}
//			
//				}).error(function (data, status, headers, config) {
//					
//					$scope.status = status;
	//
//				});
			
			}

		});

		$rootScope.closeButtonClick = function() {

			gadgets.rpc.call('', 'rscmd_closeSettings', null);

		}

	}
	
	function getLibrarySize(mediaFiles) {

		var size = 0;
		for ( var i = 0; i < mediaFiles.length; ++i ) {
			size += mediaFiles[ i ].size;
		}

		return size;

	}
	
}

]);
