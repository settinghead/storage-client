'use strict';

/* App Module */

angular.module('medialibrary', [
  'ngRoute',
  'medialibraryFilters', 
  'medialibraryServices',
  'common',
  'gapi-auth'
]);


angular.module('medialibrary').config(['$routeProvider', function($routeProvider) {
  $routeProvider.
//	when('/files/', {templateUrl: 'partials/file-items.html',   controller: "FileListCtrl"}).
//	when('/files/:companyId', {templateUrl: 'partials/file-items.html',   controller: "FileListCtrl"}).
//	when('/files/:companyId/:fileType', {templateUrl: 'partials/file-items.html', controller: "FileListCtrl"}).

	when('/files/', {
    templateUrl: 'partials/main.html',
    controller: 'FileListCtrl',
    resolve: {
      fileInfo: function ($q, $rootScope, FileList) {
        var deferred = $q.defer();
        $rootScope.authDeffered.promise.then(function (){
          FileList().then(deferred.resolve);
        });
        return deferred.promise;
      }
    }
  })
	.when('/files/:companyId', {
    templateUrl: 'partials/main.html',
    controller: 'FileListCtrl', 
    resolve: {
      fileInfo: function ($q, $rootScope, FileList, $route) {
        var deferred = $q.defer();
        $rootScope.authDeffered.promise.then(function (){
          FileList($route.current.params.companyId).then(deferred.resolve);
        });
        return deferred.promise;
      }
    }
  })
	
	.otherwise({redirectTo: '/files/'});
}]);
