"use strict";

var rvGlobals = {

    CORE_URL: "",
    CORE_URL_TEST: "https://store-dot-rvacore-test.appspot.com/_ah/api",
    CORE_URL_PRODUCTION: "https://store-dot-rvaserver2.appspot.com/_ah/api",
    STORAGE_URL_TEST: "https://medialibrary-dot-rva-test.appspot.com/_ah/api",
    RVA_URL: "",
    RVA_URL_TEST: "http://rdn-test.appspot.com/",
    RVA_URL_PRODUCTION: "http://rvauser.appspot.com/",
    STRIPE_KEY: "pk_test_ORQJQQhZUpYBWjy8SigiYABQ",
    //STRIPE_KEY: "sk_test_HTjqyfWzO7mNKWncT6aBwXal",
    STRIPE_KEY_TEST: "sk_test_HTjqyfWzO7mNKWncT6aBwXal",
    STRIPE_KEY_LIVE: "sk_live_cSdIqHd0brI4YQC5LYYhm1e2",

    init: function (isProduction) {
        if (isProduction) {
            this.RVA_URL = this.RVA_URL_PRODUCTION;
            this.CORE_URL = this.CORE_URL_PRODUCTION;
        } else {
            this.RVA_URL = this.RVA_URL_TEST;
            this.CORE_URL = this.CORE_URL_TEST;
        }
    },

    BaseList: function (maxCount) {
        this.list = [];
        this.maxCount = maxCount ? maxCount : 20;
        this.cursor = null;
        this.endOfList = false;
        this.searchString = "";
        this.clear = function () {
            this.list = [];
            this.cursor = null;
            this.endOfList = false;
        };
        this.append = function (items) {
            for (var i = 0; i < items.length; i++) {
                this.list.push(items[i]);
            }
        };
        this.concat = function (items) {
            this.list = this.list.concat(items);
        };
        this.add = function (items, cursor) {
            this.cursor = cursor;
            this.endOfList = items.length < maxCount;
            this.concat(items);
        };
        this.remove = function (index) {
            this.list.splice(index, 1);
        };
    }
}

rvGlobals.init(false);