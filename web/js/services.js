"use strict";

angular.module("medialibraryServices", ["ngResource"]).
	factory("MediaFiles", function($resource) {
    return $resource("/getFiles?companyId=:companyId", {}, {
      query: {method:"GET", params:{companyId:""}, isArray:false},
			remove: {method:"POST", params:{companyId:""}, isArray:false}
  	});
	}).
	factory("LocalFiles", function($resource) {
    return $resource("/files/files.json", {}, {
      query: {method:"GET", params:{}, isArray:true}
  	});
	});
