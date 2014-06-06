/*global gapi,handleClientJSLoad: false */

window.gapi = {};
gapi.client = {
  load: function(path, version, cb) {
    cb();
  },
  storage: {
    files: {
      get: function () {
      return {
          execute: function(cb) {
            return cb({
             "result": true,
             "code": 200,
             "files": [
              {
               "key": "1384288610427 (1).jpg",
               "lastModified": "2014-06-05T23:14:49.238Z",
               "eTag": "\"903ce5d24cc1c4d9aa5137d0c08e5b29\"",
               "size": "133630",
               "owner": {
                "id": "00b4903a97715ec7d8e3d6931508921f6ef0f5d3c55b430420cb830d52b14112"
               }
              },
              {
               "key": "2245362817_60824c9d3d_o.jpg",
               "lastModified": "2014-06-06T04:01:08.338Z",
               "eTag": "\"e5dc00379958e75d73a29562030a7503\"",
               "size": "289224",
               "owner": {
                "id": "00b4903a97715ec7d8e3d6931508921f6ef0f5d3c55b430420cb830d52b14112"
               }
              },
              {
               "key": "temp.txt",
               "lastModified": "2014-05-13T18:26:32.580Z",
               "eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"",
               "size": "0",
               "owner": {
                "id": "00b4903a97715ec7d8e3d6931508921f6ef0f5d3c55b430420cb830d52b14112"
               }
              }
             ],
             "kind": "storage#filesItem",
             "etag": "\"xYK6gfXi9mtDdgPqql9jGgxxU8s/fFpEbbx70Xx7hnwIHgPuLk3uixA\""
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