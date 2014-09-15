'use strict';

/*
 * common/auth.js
 *
 * (c) 2014 Vincent Maliko http://frnchnrd.com
 * License: MIT
 */

angular.module('services.common.auth',['services.models.user','ngCordova.plugins.localStorage'])

.service('AuthService', ['$http','$rootScope','$q', 'UserModel', '$cordovaLocalStorage', 'Constants',
  function($http, $rootScope, $q, UserModel, $cordovaLocalStorage, Constants){

  var auth = {

    // the user currently logged in
    currentUser: {},

    init : function(){
      var self = this;

      //set the session token in the http header
      $http.defaults.headers.common['X-Access-Token'] = $cordovaLocalStorage.getItem('sessionToken') || ""; 

      // getting the userdata if there's any from the localstorage
      var userData = $cordovaLocalStorage.getItem('app_user') ||  {profileBg:"", avatar: "", objectId : "", username: "", name : "", bio:"",location:"",website:""};
      
      //quick check to make sure it's a string ()
      if(typeof(userData) === "string")
      {
        userData = JSON.parse(userData);
      }

      // setting currentUser
      self.currentUser = new UserModel(userData);
    },
    
    // update currentUser's data
    updateUser: function(user,options){
      var self = this;
      var opts = {remove:false, set:false}
      
      angular.extend(opts,options);
      angular.extend(self.currentUser.info,user);

      if(opts.remove === true){
        $cordovaLocalStorage.removeItem('app_user');
      }

      if(opts.set === true){
        $cordovaLocalStorage.setItem('app_user',JSON.stringify(self.currentUser.info));
      }

    },

    //
    isLoggedIn: function(){
      var self = this;
      var output = false;

      if(self.currentUser.info.objectId){
        output = true;
      }

      return output;
    },

    // registering a user
    register: function(userData){
      var self = this;
      var deferred = $q.defer();

      // success callback
      var success = function(response, status, headers, config){
        if(Constants.DEBUGMODE){
          console.log("AuthService.register success callback");
          console.log(response);
        }

        deferred.resolve(response.payload.user);
      }

      // error callback
      var error = function(error, status, headers, config){
        if(Constants.DEBUGMODE){
          console.log("AuthService.error callback function ");
          console.log(error);
        }

        deferred.reject(error);
      }

      $http.post(Constants.API.baseUrl+'/register', {user: userData}).success(success).error(error);

      return deferred.promise;
    },

    // Signing a user in
    login: function(userData,provider){
      var self = this;
      
      var deferred = $q.defer();

      var success = function(response, status, headers, config){
        var user = response.payload.user;
        var token = response.payload.token;

        self.updateUser(user, {set: true});
        
        //set token on success
        $http.defaults.headers.common['X-Access-Token'] = token;
        $cordovaLocalStorage.setItem('sessionToken',token); 
        
        deferred.resolve(self.currentUser);
      }

      var error = function(error, status, headers, config){
        if(Constants.DEBUGMODE){
          console.log("AuthService.error callback function ");
          console.log(error);
        }

        deferred.reject(error);
      }

      // if the provider is a social provider we use inAppbrowser to launch a new window
      // which will redirect the user to the provider's login page
      if(provider === 'instagram' || provider === 'twitter' || provider === 'facebook'){
        var browserWindow = window.open(Constants.API.baseUrl+'/oauth/'+provider, "_blank", "closebuttoncaption=Done,location=no");

        // this function is called everytime a new page finishes to load.
        browserWindow.addEventListener( "loadstop", function() {
              // we get the url everythime the page loads
              browserWindow.executeScript({code: "document.URL" },

              //that url is passed to this function
              function( url ) {
                  var _url = url.toString();
                  if(Constants.DEBUGMODE){
                    console.log("Browser loadstop event");
                    console.log("Url : "+_url);
                  }

                  // we check if the callback page was reached
                  if(_url.indexOf(Constants.API.baseUrl+"/oauth/callback?type="+provider) > -1){
                    // the callback page was reached therefore it contains the json output returned from the server
                    // we parse the html page to strip out the html tags and keep the json string
                    browserWindow.executeScript({code: "document.body.innerHTML" },function(response){
                      if(Constants.DEBUGMODE){
                        console.log("browser Response sent we've reached the callack page");
                      }
                      browserWindow.close();
                      // we close the window and call this function with the url and the json output
                      _browserOnClose({url: url, response: response});
                    });
                  }
              }
            );
        });

        // function called when the browser is closed
        var _browserOnClose = function(output){
          // stripping the html tags out the html response, we only want the json output
          var _response = JSON.parse(output.response.toString().replace(/(<([^>]+)>)/ig,""));
          
          if(Constants.DEBUGMODE){
            console.log("==========URL==============");
            console.log(output.url.toString());

            console.log("==========RESPONSE==============");
            console.log(output.response.toString());

            console.log(_response);
          }
          
          // if there's a token and a user in the json output everything is fine
          if(_response.payload.token &&  _response.payload.user){
            success(_response);
          }else{
            // if not there was an error
            error(_response);
          }
        }
        
      }else{
        //default login 
        $http.post(Constants.API.baseUrl+'/login', {user: userData}).success(success).error(error);
      }
      
      return deferred.promise;
    },

    // function to sign a user out
    logout: function(){
      var self = this;
      var deferred = $q.defer();

      var success = function(response, status, headers, config){
        self.resetCookie();
        deferred.resolve(response.payload);
      }

      var error = function(error, status, headers, config){
        if(error.status === 400){
          self.resetCookie();
        }
        deferred.reject(error);
      }

      $http.get(Constants.API.baseUrl+'/logout').success(success).error(error);

      return deferred.promise;
    },

    // ping the api/me url to get the currennt logged user
    ping: function(){
      var self  = this;
      var deferred = $q.defer();

      var success = function(response, status, headers, config){
        deferred.resolve(response.payload.user);
      }

      var error = function(error, status, headers, config){
        // on error then set current user to default value.
        self.resetCookie();
        deferred.reject(error);
      }

      $http.get(Constants.API.baseUrl+'/me').success(success).error(error);

      return deferred.promise;
    },

    // function to reset data saved till now
    resetCookie: function(){
      var self = this;
      
      $cordovaLocalStorage.removeItem('sessionToken'); 
      $http.defaults.headers.common['X-Access-Token'] = "";

      self.updateUser({profileBg:"", avatar: "", objectId : "", username: "", name : "", bio:"",location:"",website:""},{remove:true})
    }

  }

  return auth;

}]);
      
