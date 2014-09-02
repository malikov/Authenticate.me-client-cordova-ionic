
'use strict';

angular.module('malikov.phonegap.event', []).
  factory('phonegapEvent', function ($rootScope) {
    return function (event,fn) {
      var queue = [];

      var impl = function () {
        queue.push(Array.prototype.slice.call(arguments));
      };

      document.addEventListener(event, function () {
        queue.forEach(function (args) {
          fn.apply(this, args);
        });
        impl = fn;
      }, false);
      
      return function () {
        return impl.apply(this, arguments);
      };
    };
  });
