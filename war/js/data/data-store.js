"use strict";

commonModule.service("apiStore", ["$q", "$timeout", "apiAuth", function ($q, $timeout, apiAuth) {

    var self = this;

    var getCompanyId = function () {
        var res = "";
        if (apiAuth.userCompany) {
            res = apiAuth.userCompany.id;
        }
        return res;
    };

    this.getSystemMessages = function () {
        var deferred = $q.defer();
        var request = gapi.client.store.statusmessages.get({ "companyId": getCompanyId() });
        request.execute(function (resp) {
            console && console.log(resp.items);
            deferred.resolve(resp.items);
        });
        return deferred.promise;
    };

    this.getSubCompanies = function (companyId, search, cursor, count, sort) {
        var deferred = $q.defer();
        var obj = {
            "companyId": companyId,
            "search": search,
            "cursor": cursor,
            "count": count,
            "sort": sort
        };
        var request = gapi.client.store.subcompanies.get(obj);
        request.execute(function (resp) {
            console && console.log(resp);
            deferred.resolve(resp);
        });
        return deferred.promise;
    };

    this.getProducts = function (search, cursor, count) {
        var deferred = $q.defer();
        var obj = {
            "companyId": null,
            "search": search,
            "cursor": cursor,
            "count": count,
            "sort": null
        };
        var request = gapi.client.store.products.get(obj);
        request.execute(function (resp) {
            console && console.log(resp);
            if (resp.code !== 0) {
                console && console.error("Error loading products: ", resp);
                resp = null;
            }
            deferred.resolve(resp);
        });
        return deferred.promise;
    };

    this.getProduct = function (productId) {
        var deferred = $q.defer();
        var obj = {
            "id": productId,
            "companyId": null
        };
        var request = gapi.client.store.product.get(obj);
        request.execute(function (resp) {
            console && console.log(resp);
            if (resp.code > 0) {
                console && console.error("Error loading product: ", resp);
                resp = null;
            }
            deferred.resolve(resp.item);
        });
        return deferred.promise;
    };

    this.getSubscriptionConfirmation = function (orderId) {
        var deferred = $q.defer();
        var obj = {
            "orderID": orderId
        };
        var request = gapi.client.store.order.getSubscriptionConfirmation(obj);
        request.execute(function (resp) {
            console && console.log(resp);
            if (resp.code > 0) {
                console && console.error("Error loading invoice: ", resp);
                resp = null;
            }
            deferred.resolve(resp);
        });
        return deferred.promise;
    };

    // ------ INVOICE API ------

    this.getInvoice = function (invoiceId) {
        var deferred = $q.defer();
        var obj = {
            "invoiceNumber": invoiceId
        };
        var request = gapi.client.store.invoice.get(obj);
        request.execute(function (resp) {
            console && console.log(resp);
            if (resp.code > 0) {
                console && console.error("Error loading invoice: ", resp);
                resp = null;
            }
            deferred.resolve(resp);
        });
        return deferred.promise;
    };

    this.payInvoiceAndGetStatus = function (invoiceId, isDefault, isSaved, cardId, token, last4, name, expMonth, expYear, cardType) {
        return this.payInvoice(invoiceId, isDefault, isSaved, cardId, token, last4, name, expMonth, expYear, cardType).then(function (result) {
            if (result.code > 0) {
                return self.dataToPromise(result);
            } else {
                return self.getInvoicePaymentStatus(invoiceId);
            }
        });
    };

    this.dataToPromise = function (data) {
        var deferred = $q.defer();
        deferred.resolve(data);
        return deferred.promise;
    };

    this.payInvoice = function (invoiceId, isDefault, isSaved, cardId, token, last4, name, expMonth, expYear, cardType) {
        var deferred = $q.defer();
        var obj = {
            "invoiceId": invoiceId,
            "isDefault": isDefault,
            "isSaved": isSaved
        };
        if (cardId) {
            //existing card
            obj.cardId = cardId;
        } else {
            //new card
            obj.token = token;
            obj.last4 = last4;
            obj.name = name;
            obj.expMonth = expMonth;
            obj.expYear = expYear;
            obj.cardType = cardType;
        }
        var request = gapi.client.store.invoice.pay(obj);
        request.execute(function (resp) {
            console && console.log(resp);
            deferred.resolve(resp);
        });
        return deferred.promise;
    };

    this.getInvoicePaymentStatus = function (invoiceId) {
        function checkStatus(deferred, obj) {
            var request = gapi.client.store.invoice.getPaymentStatus(obj);
            request.execute(function (resp) {
                console && console.log(resp);
                if (resp.status === "processing") {
                    $timeout(function () { checkStatus(deferred, obj) }, 1000); //re-try every second
                } else {
                    deferred.resolve(resp);
                }
            });
        }
        var deferred = $q.defer();
        var obj = {
            "invoiceId": invoiceId
        };
        checkStatus(deferred, obj);
        return deferred.promise;
    };

    this.updateInvoice = function (invoiceId, jsonData) {
        var deferred = $q.defer();
        var obj = {
            "invoiceNumber": invoiceId,
            "jsonData": jsonData
        };
        var request = gapi.client.store.invoice.update(obj);
        request.execute(function (resp) {
            console && console.log(resp);
            if (resp.code > 0) {
                console && console.error("Error updating invoice: ", resp);
                resp = null;
            }
            deferred.resolve(resp);
        });
        return deferred.promise;
    };


    // ------ PAYMENT FORM ------

    this.getCards = function (companyId) {
        var deferred = $q.defer();
        var obj = {
            "companyId": companyId
        };
        var request = gapi.client.store.cards.get(obj);
        request.execute(function (resp) {
            console && console.log(resp);
            deferred.resolve(resp);
        });
        return deferred.promise;
    };

    // ------ ACCOUNT PAGE APIs ------
    this.getInvoicesDue = function (companyId, search, cursor, count) {
        return this.getCommonList(companyId, search, cursor, count, gapi.client.store.invoicesDue);
    };

    this.getTrialsExpiring = function (companyId, search, cursor, count) {
        return this.getCommonList(companyId, search, cursor, count, gapi.client.store.trialsExpiring);
    };

    this.getSubscriptions = function (companyId, search, cursor, count) {
        return this.getCommonList(companyId, search, cursor, count, gapi.client.store.subscriptions);
    };

    this.getLog = function (companyId, search, cursor, count) {
        return this.getCommonList(companyId, search, cursor, count, gapi.client.store.log);
    };

    this.getInvoicesHistory = function (companyId, search, cursor, count) {
        return this.getCommonList(companyId, search, cursor, count, gapi.client.store.invoicesHistory);
    };

    this.getCommonList = function (companyId, search, cursor, count, method) {
        var deferred = $q.defer();
        var obj = {
            "companyId": companyId,
            "search": search,
            "cursor": cursor,
            "count": count
        };
        var request = method.get(obj);
        request.execute(function (resp) {
            console && console.log(resp);
            if (resp.code > 0) {
                console && console.error("Error: ", resp);
                resp = null;
            }
            fixTrialStatus(resp);
            deferred.resolve(resp);
        });
        return deferred.promise;
    };

    function fixTrialStatus(data) {
        var item;
        if (data && data.items && data.kind === "store#trialsExpiring") {
            for (var i = 0; i < data.items.length; i++) {
                item = data.items[i];
                if (!$.isNumeric(item.daysTillExpiry)) {
                    item.status = -1; //status is used to select CSS class
                    item.statusText = "Error";
                } else if (item.daysTillExpiry <= 0) {
                    item.status = 2; // status red
                    item.statusText = "Expired";
                } else if (item.daysTillExpiry < 7) {
                    item.status = 1; // status amber
                    item.statusText = "Expiring in " + item.daysTillExpiry + " days";
                } else {
                    item.status = 0; // status green
                    item.statusText = "Expiring in " + item.daysTillExpiry + " days";
                }
            }
        }
    };

    this.cancelSubscription = function (subscriptionId) {
        var deferred = $q.defer();
        var obj = {
            "subscriptionId": subscriptionId
        };
        var request = gapi.client.store.subscription.cancel(obj);
        request.execute(function (resp) {
            console && console.log(resp);
            if (resp.code > 0) {
                console && console.error("Error: ", resp);
                resp = null;
            }
            deferred.resolve(resp);
        });
        return deferred.promise;
    };

    this.getCompany = function (companyId) {
        var deferred = $q.defer();
        var obj = {
            "id": companyId
        };
        var request = gapi.client.store.company.get(obj);
        request.execute(function (resp) {
            console && console.log(resp);
            deferred.resolve(resp);
        });
        return deferred.promise;
    };

    // ------ ORDER PAGE ------

    this.updateAddress = function (company, validationRequired) {
        var deferred = $q.defer();
        var obj = {
            "id": company.id,
            "street": company.street,
            "unit": company.unit,
            "city": company.city,
            "country": company.country,
            "postalCode": company.postalCode,
            "province": company.province,
            "validate": validationRequired
        };
        var request = gapi.client.store.company.updateAddress(obj);
        request.execute(function (resp) {
            console && console.log(resp);
            deferred.resolve(resp);
        });
        return deferred.promise;
    };

    this.putSubscription = function (jsonData) {
        var deferred = $q.defer();
        var obj = {
            "jsonData": jsonData
        };
        var request = gapi.client.store.order.putSubscription(obj);
        request.execute(function (resp) {
            console && console.log(resp);
            deferred.resolve(resp);
        });
        return deferred.promise;
    };

    this.putPurchase = function (jsonData) {
        var deferred = $q.defer();
        var obj = {
            "jsonData": jsonData
        };
        var request = gapi.client.store.order.putPurchase(obj);
        request.execute(function (resp) {
            console && console.log(resp);
            deferred.resolve(resp);
        });
        return deferred.promise;
    };

    this.putPurchaseAndGetStatus = function (jsonData) {
        return this.putPurchase(jsonData).then(function (result) {
            if (result.code > 0) {
                return self.dataToPromise(result);
            } else {
                return self.getInvoicePaymentStatus(result.id);
            }
        });
    };

    this.getTaxes = function (amount, street, unit, city, country, state, zip) {
        var deferred = $q.defer();
        var obj = {
            "amount": amount,
            "street": street,
            "unit": unit,
            "city": city,
            "country": country,
            "state": state,
            "zip": zip
        };
        var request = gapi.client.store.tax.lookup(obj);
        request.execute(function (resp) {
            console && console.log(resp);
            deferred.resolve(resp);
        });
        return deferred.promise;
    };

    // ------  MISCELLANEOUS ------

    this.requestPermission = function () {
        var deferred = $q.defer();
        var obj = {};
        var request = gapi.client.store.user.requestPermission(obj);
        request.execute(function (resp) {
            console && console.log(resp);
            if (resp.code > 0) {
                console && console.error("Error: ", resp);
                resp = null;
            }
            deferred.resolve(resp);
        });
        return deferred.promise;
    };

} ]);