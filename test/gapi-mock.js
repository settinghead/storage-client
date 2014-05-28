"use strict";

/*global gapi,handleClientJSLoad: false */

window.gapi = {};
gapi.client = {
  load: function(path, version, cb) {
    cb();
  },
  store: {
    statusmessages: {
      get: function () {
      return {
          execute: function(cb) {
            return cb({
             "result": true,
             "code": 0,
             "items": [
              {
               "text": "This Message starts on Wednesday the 21st, and ends on Thursday the 22nd!",
               "startDate": "2014-05-21T00:00:00.000Z",
               "endDate": "2014-05-22T00:00:00.000Z",
               "kind": "store#statusmessagesItem"
              },
              {
               "text": "This Message only shows on Wednesday the 21st!",
               "startDate": "2014-05-21T00:00:00.000Z",
               "endDate": "2014-05-21T00:00:00.000Z",
               "kind": "store#statusmessagesItem"
              },
              {
               "text": "This Message started Monday the 19th, and ends on the 21st!",
               "startDate": "2014-05-19T00:00:00.000Z",
               "endDate": "2014-05-21T00:00:00.000Z",
               "kind": "store#statusmessagesItem"
              },
              {
               "text": "We have updated our \u003ca href=\"http://www.risevision.com/terms-service-privacy/\"" +
               " target=_blank\u003eService Agreement\u003c/a\u003e with you. " +
               " Please \u003ca href=\"http://www.risevision.com/terms-service-privacy/\" target=_blank\u003eCLICK HERE\u003c/a\u003e here to review. Thank You.",
               "startDate": "2001-01-01T00:00:00.000Z",
               "endDate": "2014-05-13T00:00:00.000Z",
               "kind": "store#statusmessagesItem"
              },
              {
               "text": "This Message only shows on Tuesday the 20th",
               "startDate": "2014-05-20T00:00:00.000Z",
               "endDate": "2014-05-20T00:00:00.000Z",
               "kind": "store#statusmessagesItem"
              }
             ],
             "kind": "store#statusmessages",
             "etag": "\"zhssHH-g0T9TDWc5-6YGse9tSHQ/umm64wnLGjmuaG3Xe1M_hKKH0os\""
            });
          }
        };
      }
    },
    usercompanies: {
      get: function () {
      return {
          execute: function(cb) {
            return cb({
              "result": true,
              "code": 0,
              "items": [
              {
                "id": "b428b4e8-c8b9-41d5-8a10-b4193c789443",
                "name": "Rise Vision Test Co.",
                "street": "302 The East Mall",
                "unit": "Suite 301",
                "city": "Etobicoke",
                "province": "ON",
                "country": "CA",
                "postalCode": "M9B 6C7",
                "timeZoneOffset": -300,
                "telephone": "416-538-1291",
                "userRoles": [
                 "ba"
                ],
                "fullAddress": "302 The East Mall, Suite 301, Etobicoke, ON, CA, M9B 6C7",
                "kind": "store#usercompaniesItem"
               }],
              "kind": "store#usercompanies",
              "etag": "\"zhssHH-g0T9TDWc5-6YGse9tSHQ/XU9yBraIk-G_SyWodTZ-lK5QwyA\""
            });
          }
        };
      }
    },
    product: {
      get: function (params) {
      return {
          execute: function(cb) {
            return cb({
              "result": true,
              "code": 0,
              "item": {
              "id": "2",
              "name": "Finance Chart - Premium",
              "descriptionShort": "20 minute delayed stock, market index, currency, bond, commodity quote and volume charts from Thomson Reuters.",
              "descriptionLong": "20 minute delayed stock, market index, currency, bond and commodity quote and volume charts from Thomson Reuters.",
              "iconUrl": "https://s3.amazonaws.com/Store-Products/Rise-Display/widget_chart_premium_icon.png",
              "imageUrl": "https://s3.amazonaws.com/Store-Products/Rise-Display/widget_chart_premium_image.png",
              "infoUrl": "none",
              "termsUrl": "none",
              "vendorId": "null",
              "vendorName": "Rise Display",
              "vendorUrl": "http://www.risedisplay.com/",
              "vendorEmail": "sales@risedisplay.com",
              "revenueAccount": "4350",
              "costAccount": "5350",
              "paymentTerms": "On Order",
              "trialPeriod": 30,
              "discountApplies": true,
              "productTag": [
               "Content"
              ],
              "availableIn": [
               "All"
              ],
              "active": true,
              "pricing": [
               {
                "accountingId": "100001",
                "unit": "per Display per Month",
                "priceUSD": 80.0,
                "priceCAD": 80.0,
                "shippingUSD": 0.0,
                "shippingCAD": 0.0
               }
              ]
              },
              "kind": "store#productItem",
              "etag": "\"zhssHH-g0T9TDWc5-6YGse9tSHQ/Bb4uKl36487wA26QfOWQjkRO5dg\""
              });
          }
        };
      }
    }
  },
  oauth2: {
    userinfo: {
      get: function() {
        return {
          execute: function(cb) {
            return cb({
              "id":"1",
              "name":"Sergey Brin",
              "given_name":"Sergey",
              "family_name":"Brin",
              "link":"https://plus.google.com/1",
              "picture":"",
              "gender":"male",
              "locale":"en",
              "result":{
                "id":"1",
                "name":"Sergey Brin",
                "given_name":"Sergey",
                "family_name":"Brin",
                "link":"https://plus.google.com/1",
                "picture":"",
                "gender":"male",
                "locale":"en"
              }
            });
          }
        };
      }
    }
  },
  setApiKey: function() {
  },
  tasks: {
    tasks: {
      update: function() {
        return {
          execute: function(cb) {
            cb({});
          }
        };
      },
      delete: function() {
        return {
          execute: function(cb) {
            cb();
          }
        };
      },
      insert: function() {
        return {
          execute: function() {
          }
        };
      },
      list: function() {
        return {
          execute: function(cb) {
            return cb({
              "kind": "tasks#tasks",
              "items": [
                {
                  "kind": "tasks#task",
                  "id": "MDE5MzU2Njg4NDcyNjMxOTE4MzE6Njk1MzUzOTY2OjQ3NTg4MjQyMg",
                  "title": "x1",
                  "updated": "2012-08-10T22:07:22.000Z",
                  "position": "00000000000000410311",
                  "status": "needsAction"
                },
                {
                  "kind": "tasks#task",
                  "id": "MDE5MzU2Njg4NDcyNjMxOTE4MzE6Njk1MzUzOTY2OjE0ODU0NTE1NDc",
                  "title": "x2",
                  "updated": "2012-08-10T22:07:25.000Z",
                  "position": "00000000000000615467",
                  "status": "needsAction"
                },
                {
                  "kind": "tasks#task",
                  "id": "MDE5MzU2Njg4NDcyNjMxOTE4MzE6Njk1MzUzOTY2OjgxNTQ5MTA3Nw",
                  "title": "x3",
                  "updated": "2012-08-12T14:30:49.000Z",
                  "position": "00000000000000820623",
                  "status": "completed",
                  "completed": "2012-08-12T14:30:49.000Z"
                }
              ],
              "result": {
                "kind": "tasks#tasks",
                "items": [
                  {
                    "kind": "tasks#task",
                    "id": "MDE5MzU2Njg4NDcyNjMxOTE4MzE6Njk1MzUzOTY2OjQ3NTg4MjQyMg",
                    "title": "x1",
                    "updated": "2012-08-10T22:07:22.000Z",
                    "position": "00000000000000410311",
                    "status": "needsAction"
                  },
                  {
                    "kind": "tasks#task",
                    "id": "MDE5MzU2Njg4NDcyNjMxOTE4MzE6Njk1MzUzOTY2OjE0ODU0NTE1NDc",
                    "title": "x2",
                    "updated": "2012-08-10T22:07:25.000Z",
                    "position": "00000000000000615467",
                    "status": "needsAction"
                  },
                  {
                    "kind": "tasks#task",
                    "id": "MDE5MzU2Njg4NDcyNjMxOTE4MzE6Njk1MzUzOTY2OjgxNTQ5MTA3Nw",
                    "title": "x3",
                    "updated": "2012-08-12T14:30:49.000Z",
                    "position": "00000000000000820623",
                    "status": "completed",
                    "completed": "2012-08-12T14:30:49.000Z"
                  }
                ]
              }
            });
          }
        };
      }
    },
    tasklists: {
      update: function() {
        return {
          execute: function(cb) {
            cb({});
          }
        };
      },
      delete: function() {
        return {
          execute: function(cb) {
            cb({});
          }
        };
      },
      insert: function() {
        return {
          execute: function(cb) {
            // Used for the 'Creating a list' test
            cb({
              "id": "1",
              "kind": "tasks#taskList",
              "title": "Example list",
              "updated": "2013-01-14T13:58:48.000Z"
            });
          }
        };
      },
      list: function() {
        return {
          execute: function(cb) {
            cb({
              "kind": "tasks#taskLists",
              "items": [
                {
                  "kind": "tasks#taskList",
                  "id": "MDE5MzU2Njg4NDcyNjMxOTE4MzE6MDow",
                  "title": "Default List",
                  "updated": "2012-08-14T13:58:48.000Z",
                },
                {
                  "kind": "tasks#taskList",
                  "id": "MDE5MzU2Njg4NDcyNjMxOTE4MzE6NDg3ODA5MzA2OjA",
                  "title": "Writing",
                  "updated": "2012-07-22T17:58:19.000Z",
                }
              ],
              "result": {
                "kind": "tasks#taskLists",
                "items": [
                  {
                    "kind": "tasks#taskList",
                    "id": "MDE5MzU2Njg4NDcyNjMxOTE4MzE6MDow",
                    "title": "Default List",
                    "updated": "2012-08-14T13:58:48.000Z",
                  },
                  {
                    "kind": "tasks#taskList",
                    "id": "MDE5MzU2Njg4NDcyNjMxOTE4MzE6NDg3ODA5MzA2OjA",
                    "title": "Writing",
                    "updated": "2012-07-22T17:58:19.000Z",
                  }
                ]
              }
            });
          }
        };
      }
    }
  }
};
gapi.auth = {
  authorize: function(options, cb) {
    cb({
      "methods":{
        "oauth2.tokeninfo":{
          "id":"oauth2.tokeninfo"
        },
        "oauth2.userinfo.get":{
          "id":"oauth2.userinfo.get"
        },
        "oauth2.userinfo.v2.me.get":{
          "id":"oauth2.userinfo.v2.me.get"
        }
      }
    });
  }
};

handleClientJSLoad();