cordova.define("com.phonegap.plugins.childbrowser.ChildBrowser", function(require, exports, module) { /*
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright 2012, Andrew Lunny, Adobe Systems
 * Copyright (c) 2005-2010, Nitobi Software Inc.
 * Copyright (c) 2011, IBM Corporation
 * (c) 2010 Jesse MacFadyen, Nitobi
 */

function isFunction(arg) {
    return typeof arg === "function";
}

// placeholder and constants
function ChildBrowser() {}

var CLOSE_EVENT = 0,
    LOCATION_CHANGED_EVENT = 1,
    OPEN_EXTERNAL_EVENT = 2;

/**
 * Function called when the child browser has an event.
 */
function onEvent(data) {
    switch (data.type) {
        case CLOSE_EVENT:
            if (isFunction(window.plugins.ChildBrowser.onClose)) {
                window.plugins.ChildBrowser.onClose();
            }
            break;
        case LOCATION_CHANGED_EVENT:
            if (isFunction(window.plugins.ChildBrowser.onLocationChange)) {
                window.plugins.ChildBrowser.onLocationChange(data.location);
            }
            break;
        case OPEN_EXTERNAL_EVENT:
            if (isFunction(window.plugins.ChildBrowser.onOpenExternal)) {
                window.plugins.ChildBrowser.onOpenExternal();
            }
            break;
    }
}

/**
 * Function called when the child browser has an error.
 */
function onError(data) {
    if (isFunction(window.plugins.ChildBrowser.onError)) {
        window.plugins.ChildBrowser.onError(data);
    }
}

/**
 * Maintain API consistency with iOS
 */
ChildBrowser.prototype.install = function () {
    console.log('ChildBrowser.install is deprecated');
};

/**
 * Display a new browser with the specified URL.
 * This method loads up a new web view in a dialog.
 *
 * @param url           The url to load
 * @param options       An object that specifies additional options
 */
ChildBrowser.prototype.showWebPage = function (url, options) {
    if (!options) {
        options = { showLocationBar: true };
    }

    cordova.exec(onEvent, onError, "ChildBrowser", "showWebPage", [url, options]);
};

/**
 * Close the browser opened by showWebPage.
 */
ChildBrowser.prototype.close = function () {
    cordova.exec(null, null, "ChildBrowser", "close", []);
};

/**
 * Display a new browser with the specified URL.
 * This method starts a new web browser activity.
 *
 * @param url           The url to load
 * @param usePhoneGap   Load url in PhoneGap webview [optional]
 */
ChildBrowser.prototype.openExternal = function(url, usePhoneGap) {
    if (device.platform.toLowerCase() == 'android') {
        if (usePhoneGap) {
            navigator.app.loadUrl(url);
        } else {
            cordova.exec(null, null, "ChildBrowser", "openExternal", [url, usePhoneGap]);
        }
    } else {
        ChildBrowser.showWebPage(url);
    };
};

/**
 * Load ChildBrowser
 */
cordova.addConstructor(function () {
    if (!window.plugins) {
        window.plugins = {};
    }

    window.plugins.ChildBrowser = new ChildBrowser();
});

});
