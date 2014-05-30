"use strict";
/* exported logoutFrame */
angular.module("gapi-auth", ["common-config", "data-cache", "gapi"])
  .service("apiProfile", ["$interval", "$rootScope", "$q", "$http", "gapiLoader", "cacheService", "apiOauth2", 
    function apiProfileConstructor($interval, $rootScope, $q, $http, gapiLoader, cache, apiOauth2) {
      
      var self = this;

      this.DEFAULT_PROFILE_PICTURE = "img/user-icon.png";

      $rootScope.user = {
        profile: {}
      };

      $rootScope.user.profile.name = "";
        $rootScope.user.profile.email = "";
        $rootScope.user.profile.picture = this.DEFAULT_PROFILE_PICTURE;

      $rootScope.$on("user.notAuthorized", function () {
        clearUserProfile();
      });

      apiOauth2.ensureOauth2Api().then( function () {
        loadProfile();
      });

      var clearUserProfile = function () {
        $rootScope.user.profile.name = "";
        $rootScope.user.profile.email = "";
        $rootScope.user.profile.picture = self.DEFAULT_PROFILE_PICTURE;
        self.setUserCompany(null);
      };

      this.setUserCompany = function (company) {
          $rootScope.user.company = company;
          if (company) {
              $rootScope.isRiseAdmin = company.userRoles && company.userRoles.indexOf("ba") > -1;
              //release 1 simpification - everyone is Purchaser ("pu" role)
              $rootScope.isPurchaser = true;
          } else {
              $rootScope.isRiseAdmin = false;
              $rootScope.isPurchaser = false;
          }
      };


      var loadRVAUser = function () {
          var deferred = $q.defer();
          if ($rootScope.isAuthed && self.isStoreApi) {

              gapiLoader.get().then(function (gApi) {
                var request = gApi.client.store.usercompanies.get({});
                request.execute(function (resp) {
                    if (resp.items && resp.items.length > 0) {
                        self.setUserCompany(resp.items[0]);
                        $rootScope.selectedCompany = resp.items[0];
                        self.updateShipTo();
                        $rootScope.$broadcast("userCompany.loaded");
                        deferred.resolve();
                    }
                });
              });
          }
          else {
            deferred.reject();
          }
          return deferred.promise;
      };

      var loadProfile = function () {
        if (self.isOAuth2Api && $rootScope.isAuthed) {
          gapiLoader.get().then(function (gApi) {
            var request = gApi.client.oauth2.userinfo.get({});
            request.execute(function (resp) {
                $rootScope.user.profile.name = resp.name;
                $rootScope.user.profile.email = resp.email;
                $rootScope.user.profile.picture = resp.picture;
                console.log(resp);
                $rootScope.$broadcast("profile.loaded");
            });
          });
        }
      };
  }]);