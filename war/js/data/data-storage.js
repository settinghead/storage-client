"use strict";

commonModule.service("apiStorage", ["$q", "$timeout", "$http", "apiAuth", function ($q, $timeout, $http, apiAuth) {

    var self = this;
    
    var getCompanyId = function () {
        var res = "";
        if (apiAuth.userCompany) {
            res = apiAuth.userCompany.id;
        }
        return res;
    };

    // Storage API access 

    this.deleteFiles = function (company, files, validationRequired) {
        var deferred = $q.defer();

//        var request = gapi.client.storage.deleteFiles(files);
//        request.execute(function (resp) {
//            console && console.log(resp);
//            deferred.resolve(resp);
//        });
        
		$http({
    	
    		url: 'deleteFiles',
  			method: 'POST',
  			data: selectedFiles,
   			params:{companyId:$routeParams.companyId},
   			headers: {'Content-Type': 'application/octet-stream'}
    	
   		}).success(function (data, status, headers, config) {
   			if (data.status == 200) {
//				$scope.mediaFiles = data.mediaFiles;
				deferred.resolve(data.mediaFiles);

    		}
  		}).error(function (data, status, headers, config) {
    					
//  		$scope.status = status;
  			return null;
  			
   		});
        
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
            if (resp.code !== 0) {
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

		$http({
			url: 'getSignedPolicy',
			method: "POST",
			data: "policyBase64=" + policyBase64,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function (data, status, headers, config) {
	
//			$scope.signature = data.trim();
//	
//			if ($scope.signature) {
//	
//				$timeout(function() {
//	
//					$("#uploadform").submit();
//	
//				});
//	
//			}
			
            deferred.resolve( data.trim() );
	
		}).error(function (data, status, headers, config) {
	
//			$scope.uploadError(status);
			
			return null;
	
		});
		
        return deferred.promise;

    };
   

} ]);