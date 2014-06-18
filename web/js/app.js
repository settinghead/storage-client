"use strict";

/* App Module */

angular.module("medialibrary", [
  "ngRoute",
  "medialibraryFilters", 
  "medialibraryServices",
  "common",
  "gapi-auth"
]);


angular.module("medialibrary").config(["$routeProvider", function($routeProvider) {
  $routeProvider
    .when("/files/", {
       templateUrl: "partials/main.html",
       controller: "FileListCtrl",
       resolve: {
         fileInfo: function ($q, $rootScope, FileList) {
           var deferred = $q.defer();
           $rootScope.authDeffered.promise.then(function (){
             new FileList().then(deferred.resolve);
           });
           return deferred.promise;
         }
       }
    })
    .when("/files/:companyId", {
      templateUrl: "partials/main.html",
      controller: "FileListCtrl", 
      resolve: {
        fileInfo: function ($q, $rootScope, FileList, $route) {
          var deferred = $q.defer();
          $rootScope.authDeffered.promise.then(function () {
            new FileList($route.current.params.companyId)
                .then(deferred.resolve);
          });
          return deferred.promise;
        }
      }
    })
    .when("/files/:companyId/folder/:folder", {
      templateUrl: "partials/main.html",
      controller: "FileListCtrl", 
      resolve: {
        fileInfo: function ($q, $rootScope, FileList, $route) {
          var deferred = $q.defer();
          $rootScope.authDeffered.promise.then(function () {
            new FileList($route.current.params.companyId,
                         $route.current.params.folder)
                .then(deferred.resolve);
          });
          return deferred.promise;
        }
      }
    })
    .otherwise({redirectTo: "/files/"})
}]);
