describe("Services: OAuthService", function() {
  "use strict";
  var oAuthService
     ,$rootScope;

  beforeEach(function() {
    module("medialibrary");

    var apiAuthMock = {};

    module(function($provide) {
      $provide.value("apiAuth", apiAuthMock);
    });

    inject(function($q, OAuthService, _$rootScope_) {
      apiAuthMock.defer = $q.defer();
      oAuthService = OAuthService;
      $rootScope = _$rootScope_;
    });

    apiAuthMock.callCount = 0;

    apiAuthMock.authorize = function() {
      apiAuthMock.callCount += 1;
      return apiAuthMock.defer.promise;
    };

    apiAuthMock.resolve = function(resolveObj) {
      apiAuthMock.defer.resolve(resolveObj);
    };
  });

  describe("getAuthStatus() with positive response", function() {

    it("should seek immediate authorization on first call", inject(function(apiAuth) {
      oAuthService.getAuthStatus();
      expect(apiAuth.callCount).to.equal(1);
    }));

    it("should not seek authorization on subsequent calls", inject(function(apiAuth) {
      oAuthService.getAuthStatus();
      oAuthService.getAuthStatus();
      oAuthService.getAuthStatus();
      expect(apiAuth.callCount).to.equal(1);
    }));

    it("should return a promise", inject(function(apiAuth) {
      expect(oAuthService.getAuthStatus()).to.have.property("then");
    }));

    it("should resolve to true on success", inject(function(apiAuth) {
      var response;
      oAuthService.getAuthStatus().then(function(resp) {
        response = resp;
      });

      apiAuth.resolve({"success": 1});
      $rootScope.$digest();
      expect(response).to.be.true;
    }));

    it("should resolve to false on error", inject(function(apiAuth) {
      var response;
      oAuthService.getAuthStatus().then(function(resp) {
        response = resp;
      });

      apiAuth.resolve({"error": 1});
      $rootScope.$digest();
      expect(response).to.be.false;
    }));
  });
});
