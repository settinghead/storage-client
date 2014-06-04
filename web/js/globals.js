"use strict";

var rvGlobals = {

    CORE_URL: "",
    CORE_URL_TEST: "https://store-dot-rvacore-test.appspot.com/_ah/api",
    CORE_URL_PRODUCTION: "https://store-dot-rvaserver2.appspot.com/_ah/api",
    STORAGE_URL: "",
    STORAGE_URL_TEST: "https://storage-dot-rvacore-test.appspot.com/_ah/api",
    STORAGE_URL_PRODUCTION: "https://storage-dot-rvaserver2.appspot.com/_ah/api",
    RVA_URL: "",
    RVA_URL_TEST: "http://rdn-test.appspot.com/",
    RVA_URL_PRODUCTION: "http://rvauser.appspot.com/",

    init: function (isProduction) {
        if (isProduction) {
            this.RVA_URL = this.RVA_URL_PRODUCTION;
            this.CORE_URL = this.CORE_URL_PRODUCTION;
            this.STORAGE_URL = this.STORAGE_URL_PRODUCTION;
        } else {
            this.RVA_URL = this.RVA_URL_TEST;
            this.CORE_URL = this.CORE_URL_TEST;
            this.STORAGE_URL = this.STORAGE_URL_TEST;
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

rvGlobals.init(true);
