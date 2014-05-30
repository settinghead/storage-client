"use strict";

/*
 * App Configuration File
 * Put environment-specific global variables in this file.
 *
 * In general, if you put an variable here, you will want to 
 * make sure to put an equivalent variable in all three places:
 * dev.js, stage.js & prod.js
 * 
 */

angular.module("common-config", [])
    .value("GAPI_CLIENT_ID", "614513768474.apps.googleusercontent.com")
    .value("CORE_URL", "https://store-dot-rvacore-test.appspot.com/_ah/api")
    .value("STORAGE_URL", "https://storage-dot-rvacore-test.appspot.com/_ah/api")
;