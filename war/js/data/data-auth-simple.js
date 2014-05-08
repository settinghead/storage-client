"use strict";

var isClientJS = false;

function handleClientJSLoad() {
    isClientJS = true;
    console.log("ClientJS is loaded");
}

commonModule.service("apiAuth", ["$timeout", "$rootScope", "$http", function apiAuthConstructor($timeout, $rootScope, $http) {

    var CLIENT_ID = "614513768474.apps.googleusercontent.com";
    var SCOPES = "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";

    this.AUTH_STATUS_UNDEFINED = -1;
    this.AUTH_STATUS_NOT_AUTHENTICATED = 0;
    this.AUTH_STATUS_AUTHENTICATED = 1;

    this.authStatus = this.AUTH_STATUS_UNDEFINED;     //-1=unknown, 0=not authenticated, 1=authenticated
    this.isAuthed = false;    //true if authenticated
    this.isOAuth2Api = false; //true if isOAuth2Api is loaded

    this.userProfileName = "";
    this.userProfileEmail = "";
    this.userProfilePicture = this.DEFAULT_PROFILE_PICTURE;

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

                $rootScope.$broadcast("userCompany.loaded");

            } else {
                console && console.log("user is not authenticated");

                self.isOAuth2Api = false;
                self.userProfileName = "";
                self.userProfileEmail = "";
                self.userProfilePicture = self.DEFAULT_PROFILE_PICTURE;
                
                $rootScope.$broadcast("user.signout");

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
        $http.get(getLogoutUrl()).
            success(function (data, status, headers, config) {
                setAuthStatus(self.AUTH_STATUS_NOT_AUTHENTICATED);
            }).
            error(function (data, status, headers, config) {
                setAuthStatus(self.AUTH_STATUS_NOT_AUTHENTICATED);
            });
    };

}
]);
