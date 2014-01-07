'use strict';

/* App Module */

angular.module('medialibrary', [
  'ngRoute',
  'medialibraryFilters', 
  'medialibraryServices'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/files/grid', {templateUrl: 'partials/file-grid.html',   controller: FileListCtrl}).
      when('/files/list', {templateUrl: 'partials/file-list.html',   controller: FileListCtrl}).
      when('/files/items/', {templateUrl: 'partials/file-items.html',   controller: FileDetailCtrl}).
      when('/files/items/:companyId', {templateUrl: 'partials/file-items.html',   controller: FileListCtrl}).
      when('/files/:fileId', {templateUrl: 'partials/file-detail.html', controller: FileDetailCtrl}).
      otherwise({redirectTo: '/files/items'});
}]);
