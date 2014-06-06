"use strict";

angular.module("medialibrary").controller("UploadController", ["$scope", "$rootScope", "$route", "$routeParams", "$http", "$timeout", "apiStorage", 
	function ($scope, $rootScope, $route, $routeParams, $http, $timeout, apiStorage) {

/*
	Dropzone.options.myAwesomeDropzone = {
		multipleUploads: false,
		init: function() {
			this.on("addedfile", function(file) { alert("Added file."); });
		}
	};
*/

	$scope.uploadFileName = "";
	$scope.uploadFileSize = "";
	$scope.uploadComplete = false;
	$scope.uploadActive = false;
	$scope.uploadError = false;
	
	$scope.googleAccessId = "452091732215@developer.gserviceaccount.com";
	$scope.responseUrl = location.protocol + "//" + location.hostname + ":" + location.port + "/uploadComplete";
	$scope.fileName = "";
	$scope.contentType = "";
	
	$scope.uploadFiles = function() {
		//$("#uploadform").submit();
		//$("#file").click();
	};

/*
	$("#uploadform").ajaxForm({
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
			if (event.target.contentWindow.name) {
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
	
//	$scope.uploadInfoClose = function() {
//		$scope.uploadActive = false;
//	};
	
//	function utf8_to_b64( str ) {
//		return window.btoa(unescape(encodeURIComponent( str )));
//	}

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
	$scope.consolidated_request = "";


	$scope.fileCount = 0;
//	$scope.uploadDisabled = !$scope.fileCount > 0;

	$scope.loadFiles = function(element) {

//		var input = $("fileInput");
		$scope.consolidated_request = "";

		for (var i = 0; i < element.files.length; i++) {

			var f = element.files[i];

			var reader = new FileReader();
			reader.readAsBinaryString(f);

			reader.onload = function(e){

				var fbinary = e.target.result;
				var fsize = f.size;

				var url = "/upload/storage/v1beta2/b/" + "risemedialibrary-" + "17899fe3-db05-4ecd-ade4-a7106fe53784/o?";
				url += "uploadType=media&name="+f.name+ " HTTP/1.1";

				var req = $scope.boundary + 
				"\r\nContent-Type: application/http"+
				"\r\nContent-Transfer-Encoding: binary"+
				"\r\n\nPOST " + url +
				"\r\nContent-Type: image/jpeg"+
				"\r\nContent-Length: "+ f.size +
				"\r\nAuthorization: "+ $scope.tok +
				"\r\n\n"+ fbinary + "\n";

				$scope.consolidated_request += req;
				$scope.fileCount++;
			
			};

		}

	}

	$scope.uploadFiles = function() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://www.googleapis.com/batch", true);
    xhr.setRequestHeader("Authorization", $scope.tok);
    xhr.setRequestHeader("Content-Type", "multipart/mixed;boundary=" + $scope.boundary);
    xhr.send($scope.consolidated_request);

		$scope.fileCount = 0;
	}
*/


}

]);

