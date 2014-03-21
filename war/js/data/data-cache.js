"use strict";

commonModule.service("cacheService", ["$q", function ($q) {
    var products = [];

    this.clear = function () {
        rvStorage.clear();
        updateShoopingCartIcon(0);
    }

    this.getProducts = function (search) {
        return products;
    };

    this.setProducts = function (value) {
        products = value;
    };

    this.getProduct = function (productId) {
        if (products && products.length > 0) {
            for (var i = 0; i < products.length; i++) {
                if (products[i].id === productId) {
                    return products[i];
                }
            }
        }
        return null;
    };

    this.getShipTo = function () {
        return this.get("rvStore_ShipTo", null);
    };

    this.setShipTo = function (company) {
        rvStorage.setItem("rvStore_ShipTo", JSON.stringify(company));
    };


    this.getCartItems = function () {
        var items = this.get("rvStore_OrderProducts", []);
        var res = { subscriptions: [], purchases: [] };
        for (var i = 0; i < items.length; i++) {
            if (items[i].paymentTerms === "On Order") {
                res.subscriptions.push(items[i]);
            } else if (items[i].paymentTerms === "On Payment") {
                res.purchases.push(items[i]);
            }
        }
        return res;
    };

    this.setCartItems = function (items) {
        rvStorage.setItem("rvStore_OrderProducts", JSON.stringify(items));
        updateShoopingCartIcon(items.length);
    };

    this.get = function (key, defaultValue) {
        try {
            var res = rvStorage.getItem(key);
            if (res) {
                return JSON.parse(res);
            } else {
                return defaultValue;
            }
        }
        catch (e) {
            return defaultValue;
        }
    };

} ]);