'use strict';
/*
  'components.localStorage'
  'components.facebook'
  'services.models.user'
*/
angular.module('services.common.auth',['services.models.user','ngCordova.plugins.localStorage','ngCordova.plugins.childBrowser'])

.service('AuthService', ['$http','$rootScope','$q', 'UserModel', '$cordovaLocalStorage', '$cordovaChildBrowser','Constants',
  function($http, $rootScope, $q, UserModel, $cordovaLocalStorage, $cordovaChildBrowser,Constants){

  var auth = {
    currentUser: {},

    init : function(){
      var self = this;

      //sessionToken
      $http.defaults.headers.common['X-Access-Token'] = $cordovaLocalStorage.getItem('sessionToken') || ""; 

      var userData = $cordovaLocalStorage.getItem('app_user') ||  {profileBg:"", avatar: "", objectId : "", username: "", name : "", bio:"",location:"",website:""};
      
      if(typeof(userData) === "string")
      {
        userData = JSON.parse(userData);
      }

      self.currentUser = new UserModel(userData);
    },
    
    // Changing user
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

    isLoggedIn: function(){
      var self = this;
      var output = false;

      if(self.currentUser.info.objectId){
        output = true;
      }

      return output;
    },

    register: function(userData){
      var self = this;
      var deferred = $q.defer();

      var success = function(response, status, headers, config){
        if(Constants.DEBUGMODE){
          console.log("success callback function response");
          console.log(response);
        }

        deferred.resolve(response.payload.user);
      }

      var error = function(error, status, headers, config){
        if(Constants.DEBUGMODE){
          console.log("error callback function ");
          console.log(error);
        }

        deferred.reject(error);
      }

      $http.post(Constants.API.baseUrl+'/register', {user: userData}).success(success).error(error);

      return deferred.promise;
    },

    login: function(userData,provider){
      var self = this;
      
      var deferred = $q.defer();

      var success = function(response, status, headers, config){
        var user = response.payload.user;
        var token = response.payload.token;

        self.updateUser(user, {set: true});
        
        $http.defaults.headers.common['X-Access-Token'] = token;
        $cordovaLocalStorage.setItem('sessionToken',token); 
        
        deferred.resolve(self.currentUser);
      }

      var error = function(error, status, headers, config){
        if(Constants.DEBUGMODE){
          console.log("error callback function ");
          console.log(error);
        }

        deferred.reject(error);
      }


      if(provider === 'instagram' || provider === 'twitter' || provider === 'facebook'){
        var browserWindow = window.open(Constants.API.baseUrl+'/oauth/'+provider, "_blank", "closebuttoncaption=Done,location=no");

        browserWindow.addEventListener( "loadstop", function() {
              browserWindow.executeScript({code: "document.URL" },
              function( url ) {
                  var _url = url.toString();
                    if(Constants.DEBUGMODE){
                      console.log("Browser loadstop event");
                      console.log("Url : "+_url);
                    }

                  if(_url.indexOf(Constants.API.baseUrl+"/oauth/callback?type="+provider) > -1){
                    browserWindow.executeScript({code: "document.body.innerHTML" },function(response){
                      if(Constants.DEBUGMODE){
                        console.log("browser Response sent we've reached the callack page");
                      }
                      browserWindow.close();
                      _browserOnClose({url: url, response: response});
                    });
                  }
              }
            );
        });

        var _browserOnClose = function(output){
          if(Constants.DEBUGMODE){
            console.log("Displaying the output outside");
            console.log("==========URL==============");
            console.log(output.url.toString());

            console.log("==========RESPONSE==============");
            console.log(output.response.toString());

            
            console.log("==========PARSED RESPONSE==============");
          }

          // stripping the html tags out the html response, we only want the json part.
          var _response = JSON.parse(output.response.toString().replace(/(<([^>]+)>)/ig,""));
          console.log(_response);

          if(_response.payload.token &&  _response.payload.user){
            success(_response);
          }else{
            error(_response);
          }
        }
        
      }else{
        //default login 
        $http.post(Constants.API.baseUrl+'/login', {user: userData}).success(success).error(error);
      }
      
      return deferred.promise;
    },

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

    resetCookie: function(){
      var self = this;
      
      $cordovaLocalStorage.removeItem('sessionToken'); 
      $http.defaults.headers.common['X-Access-Token'] = "";

      self.updateUser({profileBg:"", avatar: "", objectId : "", username: "", name : "", bio:"",location:"",website:""},{remove:true})
    }

  }

  return auth;

}]);
      
