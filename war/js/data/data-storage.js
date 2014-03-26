"use strict";

commonModule.service("apiStorage", ["$q", "$rootScope", "$routeParams", "$timeout", "apiAuth", 
    function ($q, $rootScope, $routeParams, $timeout, apiAuth) {

    var self = this;

	var MEDIA_LIBRARY_URL = 'http://commondatastorage.googleapis.com/';

	$rootScope.bucketName = 'risemedialibrary-' + $routeParams.companyId;
	$rootScope.bucketUrl = MEDIA_LIBRARY_URL + $rootScope.bucketName + '/';
	$rootScope.requireBucketCreation = false;
    
    var getCompanyId = function () {
        var res = "";
        if (apiAuth.userCompany) {
            res = apiAuth.userCompany.id;
        }
        return res;
    };
    
    var loadStorageAPI = function () {
        gapi.client.load("storage", "v0.01", function () {
            if (gapi.client.storage) {
                console && console.log("Storage API is loaded");
//                self.isStoreApi = true;
                $rootScope.$broadcast("storageApi.loaded");
            } else {
                console && console.error("Store API is NOT loaded");
            }
        }, rvGlobals.STORAGE_URL_TEST);
    };
    
    $rootScope.$on("userCompany.loaded", function (event) {

        loadStorageAPI();

    });

    // Storage API access 
    
    this.getFiles = function (companyId) {
        var deferred = $q.defer();

        var obj = {
        		"companyId": companyId
        	};
        var request = gapi.client.storage.files.get(obj);
        request.execute(function (resp) {
            console && console.log(resp);
//            if (resp.code !== 200) {
//                console && console.error("Error retrieving files: ", resp);
//                resp = null;
//            }
            
    		if (resp.code === 200) {  

    			$rootScope.setTermsCheckbox(true);
    			$rootScope.actionsDisabled = false;

    		}
    		// Authentication failed
    		else if (resp.code === 403 || resp.code === 401 || resp.code === 400) {

    			$rootScope.authenticationError = true;

    		}
    		// Bucket not found
    		else if (resp.code == 404) {

    			$rootScope.setTermsCheckbox(true);
    			$rootScope.actionsDisabled = false;
    			$rootScope.requireBucketCreation = true;

    		}
    		// Media Library feature not enabled
    		else if (resp.code == 412) {
    		
    			$rootScope.requireBucketCreation = true;
    			$rootScope.setTermsCheckbox(false);

    		}
            
            deferred.resolve(resp);
        });
        
        return deferred.promise;
    };

    this.deleteFiles = function (companyId, files, validationRequired) {
        var deferred = $q.defer();

        var obj = {
        		"companyId": companyId,
                "files": files
            };
        var request = gapi.client.storage.files.delete(obj);
        request.execute(function (resp) {
            console && console.log(resp);
            if (resp.code !== 200) {
                console && console.error("Error deleting files: ", resp);
                resp = null;
            }
            deferred.resolve(resp);
        });
        
//		$http({
//    	
//    		url: 'deleteFiles',
//  			method: 'POST',
//  			data: selectedFiles,
//   			params:{companyId:$routeParams.companyId},
//   			headers: {'Content-Type': 'application/octet-stream'}
//    	
//   		}).success(function (data, status, headers, config) {
//   			if (data.status == 200) {
////				$scope.mediaFiles = data.mediaFiles;
//				deferred.resolve(data.mediaFiles);
//
//    		}
//  		}).error(function (data, status, headers, config) {
//    					
////  		$scope.status = status;
//  			return null;
//  			
//   		});
        
        return deferred.promise;
    };

    this.createBucket = function (companyId, bucketName) {
        var deferred = $q.defer();
        var obj = {
            "companyId": companyId,
            "bucketName": bucketName,
        };
        var request = gapi.client.storage.createBucket(obj);
        request.execute(function (resp) {
            console && console.log(resp);
            if (resp.code !== 200) {
                console && console.error("Error creating bucket: ", resp);
                resp = null;
            }
            deferred.resolve(resp);
        });
        return deferred.promise;
    	
//		$http({
//			url: 'createBucket',
//			method: "POST",
//			data: "bucketName=" + $rootScope.bucketName,
//			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
//		}).success(function (data, status, headers, config) {
//	
//			if (data.status == 200) {
//
//				$rootScope.requireBucketCreation = false;
//				$scope.loadFiles(element);				
//
//			}
//			else {
//
//			}
//
//		}).error(function (data, status, headers, config) {
//	
//		});
    };
    
    this.getPolicyBase64 = function (bucketName, uploadFileName, contentType, responseUrl) {
    	
		var policyString = '{' +
		'  "expiration": "2020-01-01T12:00:00.000Z",' +
		'  "conditions": [' +
		'    {"bucket": "' + bucketName + '" },' +
		'    {"acl": "public-read" },' +
		'    ["eq", "$key", "' + uploadFileName + '"],' +
		'    ["starts-with", "$Content-Type", "' + contentType + '"],' +
		'    ["starts-with", "$Cache-Control", "public, max-age=60"],' +
		'    {"success_action_redirect": "' + responseUrl + '" },' +
		'  ]' +
		'}';

		return utf8_to_b64(policyString);
		
    };
    
	function utf8_to_b64( str ) {
		return window.btoa(unescape(encodeURIComponent( str )));
	}
    
    this.getSignedPolicy = function (companyId, policyBase64) {
        var deferred = $q.defer();

        var obj = {
        		"companyId": companyId,
                "policyBase64": policyBase64
            };
        var request = gapi.client.storage.signPolicy(obj);
        request.execute(function (resp) {
            console && console.log(resp);
            if (resp.code !== 200) {
                console && console.error("Error retrieving policy: ", resp);
                resp = null;
            }
            deferred.resolve(resp.signedPolicy);
        });
        
//		$http({
//			url: 'getSignedPolicy',
//			method: "POST",
//			data: "policyBase64=" + policyBase64,
//			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
//		}).success(function (data, status, headers, config) {
//	
////			$scope.signature = data.trim();
////	
////			if ($scope.signature) {
////	
////				$timeout(function() {
////	
////					$("#uploadform").submit();
////	
////				});
////	
////			}
//			
//            deferred.resolve( data.trim() );
//	
//		}).error(function (data, status, headers, config) {
//	
////			$scope.uploadError(status);
//			
//			return null;
//	
//		});
		
        return deferred.promise;

    };
   

} ]);