'use strict';

/*
  angular component for using PhoneGap's SplashScreen, 
  
  Dependencies : 
    anngular-phonegap-ready by Brian Ford
*/

angular.module('malikov.phonegap.splashscreen',
  ['btford.phonegap.ready']).
  factory('splashscreen', function (phonegapReady) {
    /*
      perhaps check if navigator.spashscreen exits (if the phonegap's plugin has been added) and return a warning
       if it doesn't it should not crash the app ???
    */
    var splashscreen = {
      display : phonegapReady(function () {
        navigator.splashscreen.show();
      }),
      hide : phonegapReady(function () {
        navigator.splashscreen.hide();
      })
    };

    return splashscreen; 

  });