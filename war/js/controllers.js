'use strict';

/* Controllers */

function FileListCtrl($scope, $rootScope, $routeParams, $filter, $http, MediaFiles, LocalFiles) {

	var MEDIA_LIBRARY_URL = 'http://commondatastorage.googleapis.com/';

	$rootScope.bucketName = 'risemedialibrary-' + $routeParams.companyId;
	$rootScope.bucketUrl = MEDIA_LIBRARY_URL + $rootScope.bucketName + '/';
	$scope.mediaFiles = {};

	$rootScope.updateList = function() {
		if ($routeParams.companyId) {
	  	MediaFiles.query({companyId: $routeParams.companyId}, function(response) {

//			$scope.phonesGroupBy4 = $filter('groupBy')(phones, 4);

				if (response.status == 200) {  
					$scope.mediaFiles = response.mediaFiles;
					$rootScope.librarySize = getLibrarySize(response.mediaFiles);
				}
				else {

				}

	  	});
		}
		else {
			$scope.mediaFiles = LocalFiles.query(function(mediaFiles) {
	
				$rootScope.librarySize = getLibrarySize(mediaFiles);

			});
		}
	};

	$rootScope.updateList();
	
  $scope.orderByAttribute = 'key';
  $scope.reverseSort = false;

	initActions($scope, $rootScope, $routeParams, $http);

}

//FileListCtrl.$inject = ['$scope', 'Phone'];

//function FileDetailCtrl($scope, $rootScope, $routeParams, MediaFile) {
//
//  $scope.mediaFiles = MediaFile.query();
//
//	initScope($scope, $rootScope);
//
//}

//PhoneDetailCtrl.$inject = ['$scope', '$routeParams', 'Phone'];


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

			$http({

				url: 'deleteFiles',
				method: 'POST',
				data: selectedFiles,
				params:{companyId:$routeParams.companyId},
				headers: {'Content-Type': 'application/octet-stream'}

			}).success(function (data, status, headers, config) {
			
				$scope.mediaFiles = data;
		
			}).error(function (data, status, headers, config) {
				
				$scope.status = status;

			});
		
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

function ButtonsController($scope, $rootScope) {

	$scope.selectDisabled = true;	
	$scope.downloadDisabled = true;
	$scope.deleteDisabled = true;	
	
	$rootScope.$on('CheckedCountChange', function(event, count)	 {

		$scope.selectDisabled = count != 1;
		$scope.downloadDisabled = !count;
		$scope.deleteDisabled = !count;

	});

	$scope.uploadButtonClick = function() {
	
//		$('#uploaddialog').modal('show');
		$('#file').click();

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

function ViewController($scope) {
	//$scope.thumbnailView = false;	

	$('#view-toggle').bootstrapSwitch();

	$('#view-toggle').on('switch-change', function (e, data) {
		$scope.thumbnailView = data.value;
		
		if (data.value) {
			showListView();
		}
		else {
			showThumbView();
		}
	});
	
}

function showThumbView() {
	$(".has-switch label").html("<i class='fa fa-th-list'></i>");
	$('#thumbnails').show();
	$('#list').hide();
}

function showListView() {
	$(".has-switch label").html("<i class='fa fa-th-large'></i>");
	$('#thumbnails').hide();
	$('#list').show();

}

function UploadController($scope, $rootScope, $http, $timeout) {

/*
	Dropzone.options.myAwesomeDropzone = {
		multipleUploads: false,
		init: function() {
			this.on("addedfile", function(file) { alert("Added file."); });
		}
	};
*/

	$scope.googleAccessId = '452091732215@developer.gserviceaccount.com';
	$scope.responseUrl = location.protocol + '//' + location.hostname + '/uploadComplete';
	$scope.fileName = '';
	$scope.contentType = '';

	$scope.uploadFiles = function() {

		//$("#uploadform").submit();
		//$('#file').click();

	}

/*
	$('#uploadform').ajaxForm({
		beforeSend: function() {
			$rootScope.uploadProgress = 0;
		},
		uploadProgress: function(event, position, total, percentComplete) {
			$rootScope.uploadStatus = "Uploading";
			$rootScope.uploadProgress = percentComplete;
		},
		complete: function(xhr) {
			$rootScope.uplodaProgress = 100;
			$rootScope.uploadStatus = xhr.responseText;
		}
	});
*/

	$scope.loadFiles = function(element) {
	//	$('#uploadcompleteframe').contentWindow.name = 'uploadCompleteFrame';
		
		$('#uploadform').attr('action', $rootScope.bucketUrl);

		for (var i = 0; i < element.files.length; i++) {

			$rootScope.uploadFileName = element.files[i].name;
			$rootScope.uploadFileSize = element.files[i].size;
			$scope.contentType = element.files[i].type;

			$rootScope.uploadActive = true;
			$rootScope.uploadComplete = false;
			$rootScope.uploadError = false;


			var policyString = '{' +
				'  "expiration": "2020-01-01T12:00:00.000Z",' +
				'  "conditions": [' +
				'    {"bucket": "' + $rootScope.bucketName + '" },' +
				'    {"acl": "public-read" },' +
				'    ["eq", "$key", "' + $rootScope.uploadFileName + '"],' +
				'    ["starts-with", "$Content-Type", "' + $scope.contentType + '"],' +
				'    ["starts-with", "$Cache-Control", "public, max-age=60"],' +
				'    {"success_action_redirect": "' + $scope.responseUrl + '" },' +
				'  ]' +
				'}';

			$scope.policyBase64 = utf8_to_b64(policyString);

			$http({
				url: 'getSignedPolicy',
				method: "POST",
				data: "policyBase64=" + $scope.policyBase64,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).success(function (data, status, headers, config) {
		
				$scope.signature = data.trim();

				if ($scope.signature) {
		
					$timeout(function() {

						$("#uploadform").submit();

					});

				}

			}).error(function (data, status, headers, config) {
		
				$scope.uploadError(status);

			});

/*
			var reader = new FileReader();
			reader.readAsBinaryString(element.files[i]);

			reader.onload = function(e){

				$scope.fileContent = e.target.result;
			
				$http({
					url: 'getSignedPolicy',
					method: "POST",
					data: "policyBase64=" + $scope.policyBase64,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).success(function (data, status, headers, config) {
			
					$scope.signature = data.trim();

					if ($scope.signature) {
			
						$timeout(function() {
							$("#uploadform").submit();
						});

					}
	
				}).error(function (data, status, headers, config) {
			
					$scope.status = status;

				});

			};			
*/

			break;

		}

	}

	$('#uploadcompleteframe').load(function(event) {

		try {
			if (event.target.contentWindow.name) {
				$scope.uploadComplete();
			}
			else {
				$scope.uploadError();
			}
		} catch (err) {
			$scope.uploadError();
		}

	});

	$scope.uploadComplete = function() {

		$("#uploadform").trigger("reset");

		$rootScope.updateList();
		$rootScope.uploadComplete = true;

	}

	$scope.uploadError = function() {

		$("#uploadform").trigger("reset");
	
		$rootScope.uploadError = true;

	}

/*
	$scope.uploadComplete = function(element) {

		try {
			if (element.contentWindow.name) {

				$("#uploadform").reset();

			}
			else {
				return false;
			}
		} catch (err) {
			return false;
		}

	}
*/

/*
	// below code requires OAuth token, which cannot be obtained for Anonymous uploads
	$scope.tok = "<token>";
	$scope.boundary = "---======= rv-upload12034245623562346 ====---";
	$scope.consolidated_request = '';


	$scope.fileCount = 0;
//	$scope.uploadDisabled = !$scope.fileCount > 0;

	$scope.loadFiles = function(element) {

//		var input = $('fileInput');
		$scope.consolidated_request = "";

		for (var i = 0; i < element.files.length; i++) {

			var f = element.files[i];

			var reader = new FileReader();
			reader.readAsBinaryString(f);

			reader.onload = function(e){

				var fbinary = e.target.result;
				var fsize = f.size;

				var url = '/upload/storage/v1beta2/b/' + 'risemedialibrary-' + '17899fe3-db05-4ecd-ade4-a7106fe53784/o?';
				url += 'uploadType=media&name='+f.name+ ' HTTP/1.1';

				var req = $scope.boundary + 
				'\r\nContent-Type: application/http'+
				'\r\nContent-Transfer-Encoding: binary'+
				'\r\n\nPOST ' + url +
				'\r\nContent-Type: image/jpeg'+
				'\r\nContent-Length: '+ f.size +
				'\r\nAuthorization: '+ $scope.tok +
				'\r\n\n'+ fbinary + '\n';

				$scope.consolidated_request += req;
				$scope.fileCount++;
			
			};

		}

	}

	$scope.uploadFiles = function() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'https://www.googleapis.com/batch', true);
    xhr.setRequestHeader("Authorization", $scope.tok);
    xhr.setRequestHeader("Content-Type", "multipart/mixed;boundary=" + $scope.boundary);
    xhr.send($scope.consolidated_request);

		$scope.fileCount = 0;
	}
*/


}

function UploadInfoController($scope, $rootScope) {
	$rootScope.uploadFileName = "";
	$rootScope.uploadFileSize = "";
	$rootScope.uploadComplete = false;
	$rootScope.uploadActive = false;
	$rootScope.uploadError = false;

	$scope.uploadInfoClose = function() {
		$rootScope.uploadActive = false;
	};
}

function utf8_to_b64( str ) {
	return window.btoa(unescape(encodeURIComponent( str )));
}

