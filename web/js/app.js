"use strict";
angular.module("medialibrary", [
  "ngRoute",
  "medialibraryFilters", 
  "medialibraryServices",
  "gapi-auth",
  "gapi-file"
]);

angular.module("medialibrary")
.config(["$routeProvider", function($routeProvider) {
  $routeProvider
    .when("/files/", {
       templateUrl: "partials/main.html",
    })
    .when("/files/:companyId", {
      templateUrl: "partials/main.html",
    })
    .when("/files/:companyId/folder/:folder", {
      templateUrl: "partials/main.html",
    })
    .otherwise({redirectTo: "/files/"});
}]);
