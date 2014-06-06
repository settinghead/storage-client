'use strict';

/* App Module */

var mediaLibraryApp = angular.module('medialibrary', [
  'ngRoute',
  'medialibraryFilters', 
  'medialibraryServices',
  'common',
  'gapi-auth'
]);

mediaLibraryApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
//	when('/files/', {templateUrl: 'partials/file-items.html',   controller: "FileListCtrl"}).
//	when('/files/:companyId', {templateUrl: 'partials/file-items.html',   controller: "FileListCtrl"}).
//	when('/files/:companyId/:fileType', {templateUrl: 'partials/file-items.html', controller: "FileListCtrl"}).

	when('/files/', {
    templateUrl: 'partials/main.html',
    controller: 'MainController',
    resolve: {
      auth: function($rootScope) {
        return $rootScope.authDeffered.promise;
      }
    }
  })
	.when('/files/:companyId', {
    templateUrl: 'partials/main.html',
    controller: 'MainController', 
    resolve: {
      auth: function($rootScope) {
        return $rootScope.authDeffered.promise;
      }
    }
  })
	
	.otherwise({redirectTo: '/files/'});
}]);
