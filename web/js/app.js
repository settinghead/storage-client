'use strict';

/* App Module */

var mediaLibraryApp = angular.module('medialibrary', [
  'ngRoute',
  'medialibraryFilters', 
  'medialibraryServices',
  'common',
  'gapi-auth'
]);

// mediaLibraryApp.run(function (apiAuth) { apiAuth.ensureAuth(); });

mediaLibraryApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
//	when('/files/', {templateUrl: 'partials/file-items.html',   controller: "FileListCtrl"}).
//	when('/files/:companyId', {templateUrl: 'partials/file-items.html',   controller: "FileListCtrl"}).
//	when('/files/:companyId/:fileType', {templateUrl: 'partials/file-items.html', controller: "FileListCtrl"}).

	when('/files/', {templateUrl: 'partials/main.html',   controller: 'MainController'})
	.when('/files/:companyId', {templateUrl: 'partials/main.html',   controller: 'MainController'})
	

	.otherwise({redirectTo: '/files/'});
}]);
