# ChildBrowser plugin for PhoneGap

This is a prototype of a cross-platform ChildBrowser PhoneGap plugin. Android
and iOS are currently supported. Support for BlackBerry and Windows Phone is
also planned.

The goal is for a single JavaScript file to be usable on all supported
platforms, and the native code to be installed in a project through a [separate
script](http://github.com/alunny/pluginstall).

## The Structure

    plugin.xml
    -- src
      -- android
        -- ChildBrowser.java
      -- ios
        -- ChildBrowser.bundle
          -- arrow_left.png
          -- arrow_left@2x.png
          -- ...
        -- ChildBrowserCommand.h
        -- ChildBrowserCommand.m
        -- etc
    -- www
      -- childbrowser.js
      -- childbrowser
        -- icon_arrow_left.png
        -- icon_arrow_right.png
        -- ...

## plugin.xml

The plugin.xml file is loosely based on the W3C's Widget Config spec.

It is in XML to facilitate transfer of nodes from this cross platform manifest
to native XML manifests (AndroidManifest.xml, App-Info.plist, config.xml (BB)).

A specification for this file format will be forthcoming once more feedback
has been received, and the tooling around plugin installation is more mature. 

## ChildBrowser JavaScript API

As with most Cordova/PhoneGap APIs, functionality is not available until the
`deviceready` event has fired on the document. The `childbrowser.js` file
should be included _after_ the `phonegap.js` file.

All functions are called on the singleton ChildBrowser instance - accessible
as `window.plugins.ChildBrowser`.

### Methods

#### showWebPage

    showWebPage(url, [options])

Displays a new ChildBrowser with the specified URL. Defaults to true.

Available options:

* `showLocationBar` (Android and iOS): show/hide a location bar in the generated browser
* `showAddress` (Android and iOS): show/hide the address bar in the generated browser
* `showNavigationBar` (Android and IOS): show/hide the entire navigation bar. Important: since there is no "Done"-Button anymore, the ChildBrowser can only be closed with the api call close() (see below).

Example:

    window.plugins.ChildBrowser.showWebPage('http://www.google.com',
                                            { showLocationBar: true });

#### close

    close()

Closes the ChildBrowser.

Example:

    window.plugins.ChildBrowser.close();

#### openExternal

    openExternal(url, usePhoneGap)

(Android only) Opens the URL in a regular browser - if `usePhoneGap`, that
browser will be a PhoneGap-enabled webview

Example:

    window.plugins.ChildBrowser.openExternal('http://www.google.com');

### Events

All events can be subscribed to by assigning a function to
`window.plugins.ChildBrowser['on' + eventName]`; see examples below

#### close

Called when the ChildBrowser has been closed

Example:

    window.plugins.ChildBrowser.onClose = function () {
        alert('childBrowser has closed');
    };

#### locationChange

Called when the ChildBrowser loads a URL (including the initial location, when
`showWebPage` is called). The callback function is passed the new URL being
loaded.

Example:

    window.plugins.ChildBrowser.onLocationChange = function (url) {
        alert('childBrowser has loaded ' + url);
    };

#### openExternal

(iOS only) Called when the user opts to load an app in the device's browser
(exiting the PhoneGap app in the process).

Example:

    window.plugins.ChildBrowser.onOpenExternal = function () {
        alert('opening Mobile Safari');
    };

## Thank you GitHub People

* @RandyMcMillan
* @reinberger
* @yimingkuan

## License

MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.

Copyright 2012, Andrew Lunny, Adobe Systems

Copyright (c) 2005-2010, Nitobi Software Inc.

Copyright (c) 2011, IBM Corporation

Copyright (c) 2010 Jesse MacFadyen, Nitobi

Copyright (c) 2012 Randy McMillan

Copyright (c) 2013 Takhfifan
