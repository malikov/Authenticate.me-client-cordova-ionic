'use strict';
/*
  angular component for using PhoneGap's localstorage
*/
angular.module('components.localStorage',
  []).
  factory('LocalStorage', function () {
    
    var localstorage = {
      getKey: function (index) {

        index = typeof index !== 'undefined'? index : 0;
        return window.localStorage.key(index);      
      },

      setItem: function (key,value) {
        key = typeof key !== 'undefined'? key : false;
        value = typeof value !== 'undefined'? value : false;
        
        if(!key || !value)
          return false;

        window.localStorage.setItem(key,value);
          
        return true;
      },

      getItem: function(key){
        key = typeof key !== 'undefined'? key : false;

        if(!key)
          return 'undefined';

        return window.localStorage.getItem(key);
      },

      removeItem: function(key){
        key = typeof key !== 'undefined'? key : false;

        if(!key)
          return false;
        
        window.localStorage.removeItem(key);

        return true;
      },

      clear: function(){
        window.localStorage.clear();
      }

    };

    return localstorage; 

  });