"use strict";

var isClientJS = false;

function handleClientJSLoad() {
    isClientJS = true;
    console.log("ClientJS is loaded");
}

commonModule.service("apiAuth", ["$timeout", "$rootScope", "$http", "cacheService", function apiAuthConstructor($timeout, $rootScope, $http, cache) {

    var CLIENT_ID = "614513768474.apps.googleusercontent.com";
    var SCOPES = "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";

    this.AUTH_STATUS_UNDEFINED = -1;
    this.AUTH_STATUS_NOT_AUTHENTICATED = 0;
    this.AUTH_STATUS_AUTHENTICATED = 1;

    this.DEFAULT_PROFILE_PICTURE = "img/user-icon.png";

    this.authStatus = this.AUTH_STATUS_UNDEFINED;     //-1=unknown, 0=not authenticated, 1=authenticated
    this.isAuthed = false;    //true if authenticated
    this.isOAuth2Api = false; //true if isOAuth2Api is loaded
    this.isStoreApi = false;  //true if isStoreApi is loaded
    this.isCAD = false;

    this.userProfileName = "";
    this.userProfileEmail = "";
    this.userProfilePicture = this.DEFAULT_PROFILE_PICTURE;

    this.userCompany;
    this.selectedCompany;
    this.isRiseAdmin = false; //Rise Vision Billing Administrator
    this.isPurchaser = false;

    var self = this;
    var access_token;
    var thAutoRefresh; //timeout promise to renew auth token

    var setAuthStatus = function (value) {
        if (self.authStatus !== value) {
            self.authStatus = value;
            self.isAuthed = (self.authStatus === self.AUTH_STATUS_AUTHENTICATED);
            if (self.isAuthed) {
                console && console.log("user is authenticated");
                loadOAuth2API();
                loadStoreAPI();
            } else {
                console && console.log("user is not authenticated");

                self.isStoreApi = false;
                self.isOAuth2Api = false;
                self.userProfileName = "";
                self.userProfileEmail = "";
                self.userProfilePicture = self.DEFAULT_PROFILE_PICTURE;
                self.setUserCompany(null);
                self.selectedCompany = null;
                cache.clear();
                self.updateShipTo();

                $rootScope.$broadcast("user.signout");

                loadStoreAPI();
            }
        }
    };

    var checkAuth = function (silentCheck) {
        gapi.auth.authorize({ client_id: CLIENT_ID, scope: SCOPES, immediate: silentCheck }, handleAuthResult);
    };

    var checkAuthSilent = function (silentCheck) {
        checkAuth(true);
    };

    var handleAuthResult = function (authResult) {
        if (authResult && !authResult.error) {
            thAutoRefresh = $timeout(checkAuthSilent, 55 * 60 * 1000); //refresh every 55 minutes
            access_token = authResult.access_token;
            setAuthStatus(self.AUTH_STATUS_AUTHENTICATED);
        } else {
            setAuthStatus(self.AUTH_STATUS_NOT_AUTHENTICATED);
            $timeout.cancel(thAutoRefresh);
        }
    };

    var loadOAuth2API = function () {
        //we need this API to access user profile
        gapi.client.load("oauth2", "v2", function () {
            console && console.log("OAuth2 API is loaded");
            self.isOAuth2Api = true;
            loadProfile();
        });
    };

    var loadStoreAPI = function () {
        gapi.client.load("store", "v0.01", function () {
            if (gapi.client.store) {
                console && console.log("Store API is loaded");
                self.isStoreApi = true;
                $rootScope.$broadcast("storeApi.loaded");
                loadRVAUser();
            } else {
                console && console.error("Store API is NOT loaded");
            }
        }, rvGlobals.CORE_URL);
    };

    var loadRVAUser = function () {
        if (self.isAuthed && self.isStoreApi) {
            var request = gapi.client.store.usercompanies.get({});
            request.execute(function (resp) {
                console && console.log(resp.items);
                if (resp.items && resp.items.length > 0) {
                    self.setUserCompany(resp.items[0]);
                    self.selectedCompany = resp.items[0];
                    self.updateShipTo();
                    $rootScope.$broadcast("userCompany.loaded");
                }
            });
        }
    };

    var loadProfile = function () {
        if (self.isOAuth2Api && self.isAuthed) {
            var request = gapi.client.oauth2.userinfo.get({});
            request.execute(function (resp) {
                self.userProfileName = resp.name;
                self.userProfileEmail = resp.email;
                self.userProfilePicture = resp.picture;
                console && console.log(resp);
                $rootScope.$broadcast("profile.loaded");
            });
        }
    };

    var getLogoutUrl = function () {
        var res = "";
        if (access_token) {
            return "https://accounts.google.com/o/oauth2/revoke?token=" + access_token;
        }
        return res;
    };

    this.init = function () {

        var waitForClientJS = function () {
            if (isClientJS) {
                checkAuthSilent();
            } else {
                $timeout(waitForClientJS, 100);
            }
        };

        waitForClientJS();
    };

    this.login = function () {
        if (!self.isAuthed) {
            checkAuth(false);
        }
    };

    this.logout = function () {
        //$http.get return errors  "No "Access-Control-Allow-Origin" header is present on the requested resource."
        //but we don"t need to get callback results. Just make sure to handle $http.get()..error() callback.
    	
    	gapi.auth.signOut();
    	
//        $http.get(getLogoutUrl()).
//            success(function (data, status, headers, config) {
//                setAuthStatus(self.AUTH_STATUS_NOT_AUTHENTICATED);
//            }).
//            error(function (data, status, headers, config) {
//                setAuthStatus(self.AUTH_STATUS_NOT_AUTHENTICATED);
//            });
        
        setAuthStatus(self.AUTH_STATUS_NOT_AUTHENTICATED);

    };

    this.setUserCompany = function (company) {
        self.userCompany = company;
        if (company) {
            self.isRiseAdmin = company.userRoles && company.userRoles.indexOf("ba") > -1;
            self.isPurchaser = company.userRoles && company.userRoles.indexOf("pu") > -1;
            formatAddress(self.userCompany);
        } else {
            self.isRiseAdmin = false;
            self.isPurchaser = false;
        }
    };

    this.updateShipTo = function () {
        var savedShipTo = cache.getShipTo();
        if (!self.userCompany) {
            //this is the user is logged off use case
            self.shipTo = null;
            self.isCAD = false;
        } else if (savedShipTo) {
            //load from cache if the same user
            self.shipTo = savedShipTo;
            self.isCAD = self.shipTo.country === "CA";
        } else {
            //assume shipTo=billTo
            self.shipTo = $.extend({}, self.userCompany);
            self.isCAD = self.shipTo.country === "CA";
        }
    };

}
]);
