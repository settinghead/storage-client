"use strict";

var rvStorage = sessionStorage;
var isPrintView = false;

function storageGetProducts() {
    try {
        var res = rvStorage.getItem("rvStore_OrderProducts");
        if (res) {
            return JSON.parse(res);
        } else {
            return [];
        }

    }
    catch (e) {
        return [];
    }
}

function storageSetProducts(products) {
    rvStorage.setItem("rvStore_OrderProducts", JSON.stringify(products));
    updateShoopingCartIcon(products.length);
}

function addProduct(products, newProduct) {
    for (var i = 0; i < products.length; i++) {
        if (products[i].id == newProduct.id) {
            return;
        }
    }
    products.push(newProduct);
}

function removeProduct(products, aProduct) {
    for (var i = 0; i < products.length; i++) {
        if (products[i].id == aProduct.id) {
            products.splice(i, 1);
        }
    }
}

function updateShoopingCartIcon(count) {
	var el = $("#cartBadge");
	if (el) {
		//el.css("visibility", count > 0 ? "visible" : "hidden");
	    el.css("display", count > 0 ? "inline-block" : "none");
		el.html(count);
	}
}

//------------- SPIN SETTINGS ---------------

var RV_SPIN_SETTINGS = {
	lines : 13, // The number of lines to draw
	length : 20, // The length of each line
	width : 10, // The line thickness
	radius : 30, // The radius of the inner circle
	corners : 1, // Corner roundness (0..1)
	rotate : 0, // The rotation offset
	direction : 1, // 1: clockwise, -1: counterclockwise
	color : "#00F", // #rgb or #rrggbb or array of colors
	speed : 1, // Rounds per second
	trail : 60, // Afterglow percentage
	shadow : false, // Whether to render a shadow
	hwaccel : false, // Whether to use hardware acceleration
	className : "spinner", // The CSS class to assign to the spinner
	zIndex : 2e9, // The z-index (defaults to 2000000000)
	top : "auto", // Top position relative to parent in px
	left : "auto" // Left position relative to parent in px
};

// AD - Disabling spinner for the local copy
//var rvSpinner = new Spinner(RV_SPIN_SETTINGS);
//
//function showSpin(elementId) {
//    if (!elementId) {
//        elementId = "wrap";
//    }
//    rvSpinner.spin($("#" + elementId)[0]);
//}
//
//function hideSpin() {
//    rvSpinner.stop();
//}

//------------- STRIPE FUNCTIONS ---------------

// set the key
//var RV_STRIPE_KEY = "pk_test_czwzkTp2tactuLOEOqbMTRzG";
//if (Stripe) {
//    Stripe.setPublishableKey(RV_STRIPE_KEY);
//}

//override default submit function
//jQuery(function ($) {
//    $("#payment-form").submit(function (event) {
//        wireframePaymentSubmit();
//        return false;

//        var $form = $(this);

//        // Disable the submit button to prevent repeated clicks
//        $form.find("button").prop("disabled", true);

//        Stripe.card.createToken($form, stripeResponseHandler);

//        // Prevent the form from submitting with the default action
//        return false;
//    });
//});

//function wireframePaymentSubmit() {

//    rvSpinner.spin($("#payment-popup")[0]);

//	window.setTimeout(function () {
//    	rvSpinner.stop();
//    	$("#payment-popup").modal("hide");

//    	$("#payment-confirm-popup").on("hidden.bs.modal", function () {
//    		rvPaymentSuccessCallback && rvPaymentSuccessCallback();
//   		});

//    	$("#payment-confirm-popup").modal("show");

//    }, 2000);

//}

//var stripeResponseHandler = function(status, response) {
//	  var $form = $("#payment-form");

//	  if (response.error) {
//	    // Show the errors on the form
//	    $form.find(".payment-errors").text(response.error.message);
//	    $form.find("button").prop("disabled", false);
//	  } else {
//	    // token contains id, last4, and card type
//	    var token = response.id;
//	    // Insert the token into the form so it gets submitted to the server
//	    $form.append($("<input type='hidden' name='stripeToken' />").val(token));
//	    // and submit to our server
//	    $form.get(0).submit();
//	  }
//};

var rvPaymentSuccessCallback= null;

function openPaymentForm(successCallback) {
	rvPaymentSuccessCallback = successCallback;
	$("#payment-popup").modal("show");
	var cards = $("#ppSavedCards")[0];
	//clear
	for(var i=cards.length-1;i>=0;i--)
    {
		cards.remove(i);
    }
	//populate
	cards.add(new Option("new card", ""));
	for(var i=0; i<testCreditCards.length; i++)
    {
		var cc = testCreditCards[i];
		cards.add(new Option("***-" + cc.last4 + ", " + cc.type + (cc.is_default ? " (default)":""), cc.id));
		if (cc.is_default) {
			cards.selectedIndex = cards.length - 1;
		}
    }

	onSavedCardSelected();
}

function showPrintView() {
    isPrintView = true;
    //hideSystemMessages();
    $("#main-nav").hide();
    $("#footer").hide();
    $("#wrap").css("padding-top", 0).css("padding-bottom", 0);
}

var rvCountries = [
	["Afghanistan", "AF"],
	["Albania", "AL"],
	["Algeria", "DZ"],
	["American Samoa", "AS"],
	["Andorra", "AD"],
	["Angola", "AO"],
	["Anguilla", "AI"],
	["Antarctica", "AQ"],
	["Antigua and Barbuda", "AG"],
	["Argentina", "AR"],
	["Armenia", "AM"],
	["Aruba", "AW"],
	["Australia", "AU"],
	["Austria", "AT"],
	["Azerbaijan", "AZ"],
	["Bahamas", "BS"],
	["Bahrain", "BH"],
	["Bangladesh", "BD"],
	["Barbados", "BB"],
	["Belarus", "BY"],
	["Belgium", "BE"],
	["Belize", "BZ"],
	["Benin", "BJ"],
	["Bermuda", "BM"],
	["Bhutan", "BT"],
	["Bolivia", "BO"],
	["Bosnia and Herzegovina", "BA"],
	["Botswana", "BW"],
	["Bouvet Island", "BV"],
	["Brazil", "BR"],
	["British Indian Ocean Territory", "IO"],
	["British Virgin Islands", "VG"],
	["Brunei Darussalam", "BN"],
	["Bulgaria", "BG"],
	["Burkina Faso", "BF"],
	["Burundi", "BI"],
	["Cambodia", "KH"],
	["Cameroon", "CM"],
	["Canada", "CA"],
	["Cape Verde", "CV"],
	["Cayman Islands", "KY"],
	["Central African Republic", "CF"],
	["Chad", "TD"],
	["Chile", "CL"],
	["China", "CN"],
	["Christmas Island", "CX"],
	["Cocos", "CC"],
	["Colombia", "CO"],
	["Comoros", "KM"],
	["Congo", "CG"],
	["Cook Islands", "CK"],
	["Costa Rica", "CR"],
	["Croatia", "HR"],
	["Cuba", "CU"],
	["Cyprus", "CY"],
	["Czech Republic", "CZ"],
	["Denmark", "DK"],
	["Djibouti", "DJ"],
	["Dominica", "DM"],
	["Dominican Republic", "DO"],
	["East Timor", "TP"],
	["Ecuador", "EC"],
	["Egypt", "EG"],
	["El Salvador", "SV"],
	["Equatorial Guinea", "GQ"],
	["Eritrea", "ER"],
	["Estonia", "EE"],
	["Ethiopia", "ET"],
	["Falkland Islands", "FK"],
	["Faroe Islands", "FO"],
	["Fiji", "FJ"],
	["Finland", "FI"],
	["France", "FR"],
	["French Guiana", "GF"],
	["French Polynesia", "PF"],
	["French Southern Territories", "TF"],
	["Gabon", "GA"],
	["Gambia", "GM"],
	["Georgia", "GE"],
	["Germany", "DE"],
	["Ghana", "GH"],
	["Gibraltar", "GI"],
	["Greece", "GR"],
	["Greenland", "GL"],
	["Grenada", "GD"],
	["Guadeloupe", "GP"],
	["Guam", "GU"],
	["Guatemala", "GT"],
	["Guinea", "GN"],
	["Guinea-Bissau", "GW"],
	["Guyana", "GY"],
	["Haiti", "HT"],
	["Heard and McDonald Islands", "HM"],
	["Honduras", "HN"],
	["Hong Kong", "HK"],
	["Hungary", "HU"],
	["Iceland", "IS"],
	["India", "IN"],
	["Indonesia", "ID"],
	["Iran", "IR"],
	["Iraq", "IQ"],
	["Ireland", "IE"],
	["Israel", "IL"],
	["Italy", "IT"],
	["Ivory Coast", "CI"],
	["Jamaica", "JM"],
	["Japan", "JP"],
	["Jordan", "JO"],
	["Kazakhstan", "KZ"],
	["Kenya", "KE"],
	["Kiribati", "KI"],
	["Kuwait", "KW"],
	["Kyrgyzstan", "KG"],
	["Laos", "LA"],
	["Latvia", "LV"],
	["Lebanon", "LB"],
	["Lesotho", "LS"],
	["Liberia", "LR"],
	["Libya", "LY"],
	["Liechtenstein", "LI"],
	["Lithuania", "LT"],
	["Luxembourg", "LU"],
	["Macau", "MO"],
	["Macedonia", "MK"],
	["Madagascar", "MG"],
	["Malawi", "MW"],
	["Malaysia", "MY"],
	["Maldives", "MV"],
	["Mali", "ML"],
	["Malta", "MT"],
	["Marshall Islands", "MH"],
	["Martinique", "MQ"],
	["Mauritania", "MR"],
	["Mauritius", "MU"],
	["Mayotte", "YT"],
	["Mexico", "MX"],
	["Micronesia", "FM"],
	["Moldova", "MD"],
	["Monaco", "MC"],
	["Mongolia", "MN"],
	["Montserrat", "MS"],
	["Morocco", "MA"],
	["Mozambique", "MZ"],
	["Myanmar", "MM"],
	["Namibia", "NA"],
	["Nauru", "NR"],
	["Nepal", "NP"],
	["Netherlands", "NL"],
	["Netherlands Antilles", "AN"],
	["New Caledonia", "NC"],
	["New Zealand", "NZ"],
	["Nicaragua", "NI"],
	["Niger", "NE"],
	["Nigeria", "NG"],
	["Niue", "NU"],
	["Norfolk Island", "NF"],
	["North Korea", "KP"],
	["Northern Mariana Islands", "MP"],
	["Norway", "NO"],
	["Oman", "OM"],
	["Pakistan", "PK"],
	["Palau", "PW"],
	["Panama", "PA"],
	["Papua New Guinea", "PG"],
	["Paraguay", "PY"],
	["Peru", "PE"],
	["Philippines", "PH"],
	["Pitcairn", "PN"],
	["Poland", "PL"],
	["Portugal", "PT"],
	["Puerto Rico", "PR"],
	["Qatar", "QA"],
	["Reunion", "RE"],
	["Romania", "RO"],
	["Russian Federation", "RU"],
	["Rwanda", "RW"],
	["S. Georgia and S. Sandwich Islands", "GS"],
	["Saint Kitts and Nevis", "KN"],
	["Saint Lucia", "LC"],
	["Saint Vincent and The Grenadines", "VC"],
	["Samoa", "WS"],
	["San Marino", "SM"],
	["Sao Tome and Principe", "ST"],
	["Saudi Arabia", "SA"],
	["Senegal", "SN"],
	["Seychelles", "SC"],
	["Sierra Leone", "SL"],
	["Singapore", "SG"],
	["Slovakia", "SK"],
	["Slovenia", "SI"],
	["Solomon Islands", "SB"],
	["Somalia", "SO"],
	["South Africa", "ZA"],
	["South Korea", "KR"],
	["Soviet Union", "SU"],
	["Spain", "ES"],
	["Sri Lanka", "LK"],
	["St. Helena", "SH"],
	["St. Pierre and Miquelon", "PM"],
	["Sudan", "SD"],
	["Suriname", "SR"],
	["Svalbard and Jan Mayen Islands", "SJ"],
	["Swaziland", "SZ"],
	["Sweden", "SE"],
	["Switzerland", "CH"],
	["Syria", "SY"],
	["Taiwan", "TW"],
	["Tajikistan", "TJ"],
	["Tanzania", "TZ"],
	["Thailand", "TH"],
	["Togo", "TG"],
	["Tokelau", "TK"],
	["Tonga", "TO"],
	["Trinidad and Tobago", "TT"],
	["Tunisia", "TN"],
	["Turkey", "TR"],
	["Turkmenistan", "TM"],
	["Turks and Caicos Islands", "TC"],
	["Tuvalu", "TV"],
	["Uganda", "UG"],
	["Ukraine", "UA"],
	["United Arab Emirates", "AE"],
	["United Kingdom", "UK"],
	["United States", "US"],
	["Uruguay", "UY"],
	["US Minor Outlying Islands", "UM"],
	["US Virgin Islands", "VI"],
	["Uzbekistan", "UZ"],
	["Vanuatu", "VU"],
	["Venezuela", "VE"],
	["Viet Nam", "VN"],
	["Wallis and Futuna Islands", "WF"],
	["Western Sahara", "EH"],
	["Yemen", "YE"],
	["Yugoslavia", "YU"],
	["Zaire", "ZR"],
	["Zambia", "ZM"],
	["Zimbabwe", "ZW"]];

var rvRegiounsCA = [
    ["Alberta", "AB"],
    ["British Columbia", "BC"],
    ["Manitoba", "MB"],
    ["New Brunswick", "NB"],
    ["Newfoundland and Labrador", "NL"],
    ["Northwest Territories", "NT"],
    ["Nova Scotia", "NS"],
    ["Nunavut", "NV"],
    ["Ontario", "ON"],
    ["Prince Edward Island", "PE"],
    ["Quebec", "QC"],
    ["Saskatchewan", "SK"],
    ["Yukon Territory", "YT"]];

var rvRegiounsUS = [
	["Alabama", "AL"],
	["Alaska", "AK"],
	["Arizona", "AZ"],
	["Arkansas", "AR"],
	["California", "CA"],
	["Colorado", "CO"],
	["Connecticut", "CT"],
	["Delaware", "DE"],
	["District of Columbia", "DC"],
	["Florida", "FL"],
	["Georgia", "GA"],
	["Hawaii", "HI"],
	["Idaho", "ID"],
	["Illinois", "IL"],
	["Indiana", "IN"],
	["Iowa", "IA"],
	["Kansas", "KS"],
	["Kentucky", "KY"],
	["Louisiana", "LA"],
	["Maine", "ME"],
	["Maryland", "MD"],
	["Massachusetts", "MA"],
	["Michigan", "MI"],
	["Minnesota", "MN"],
	["Mississippi", "MS"],
	["Missouri", "MO"],
	["Montana", "MT"],
	["Nebraska", "NE"],
	["Nevada", "NV"],
	["New Hampshire", "NH"],
	["New Jersey", "NJ"],
	["New Mexico", "NM"],
	["New York", "NY"],
	["North Carolina", "NC"],
	["North Dakota", "ND"],
	["Ohio", "OH"],
	["Oklahoma", "OK"],
	["Oregon", "OR"],
	["Pennsylvania", "PA"],
	["Rhode Island", "RI"],
	["South Carolina", "SC"],
	["South Dakota", "SD"],
	["Tennessee", "TN"],
	["Texas", "TX"],
	["Utah", "UT"],
	["Vermont", "VT"],
	["Virginia", "VA"],
	["Washington", "WA"],
	["West Virginia", "WV"],
	["Wisconsin", "WI"],
	["Wyoming", "WY"]];

function getCountryName(value) {
    for (var i = 0; i < rvCountries.length; i++) {
        if (rvCountries[i][1] === value) {
            return rvCountries[i][0];
        }
    }
    return value;
}

function copyAddress(src, dest) {
    dest.street = src.street;
    dest.unit = src.unit;
    dest.city = src.city;
    dest.country = src.country;
    dest.postalCode = src.postalCode;
    dest.province = src.province;
    formatAddress(dest);
}

function formatAddress(company) {
    if (company) {
        company.cityLong = (company.city ? company.city : "") + (company.province ? ", " + company.province : "") + (company.postalCode ? ", " + company.postalCode : "");
        company.countryName = getCountryName(company.country);
    }
}

function dayWithSuffix(value) {
    var suffix;
    if ($.isNumeric(value)) {
        switch (value) {
            case 1: case 21: case 31: suffix = 'st'; break;
            case 2: case 22: suffix = 'nd'; break;
            case 3: case 23: suffix = 'rd'; break;
            default: suffix = 'th';
        }
        return value + suffix;
    }
    return value;
}
