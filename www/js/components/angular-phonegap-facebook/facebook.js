'use strict';
/*
  angular component for using PhoneGap's facebook plugin

  Dependencies : 
    $http service
*/
angular.module('components.facebook',
  []).
  factory('Facebook', function ($http) {
    //warn if none of this elements are present

    if(typeof CDV == 'undefined')
      return console.log('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');

    if(typeof FB == 'undefined')
      return console.log('FB variable does not exist. Check that you have included the Facebook JS SDK file');
    
    var facebook = {
      apiUrl : 'http://graph.facebook.com',
      appId : null,
      options : {},
      scope : { scope: "email, user_about_me, user_photos"},
      
      //set the appid in the init function
      init : function(appId,options){
        console.log("facebook init function");

        appId = typeof appId !== 'undefined' ? appId : false;
        options = options || {permissions:[]};

        if(!appId)
          return console.log('No appId was provided please add your appId');

        angular.extend(this.options,options);
        this.appId = appId;

        this.initFb(this.appId);
        
      },
      initFb : function(appId){
        return FB.init({
                appId: appId,
                nativeInterface: CDV.FB,
                useCachedDialogs: false
              });
      },
      eventSubscribe : function(event,callbackFct){
        console.log("facebook event subscribe : "+event);

        event = typeof event !== 'undefined' ? event : false;

        if(!event)
          return console.log("Argument event can't be empty");

        if(typeof callbackFct !== 'function')
          return console.log('Need a callbackFct for eventSubscribe');

        FB.Event.subscribe(event,callbackFct);

      },
      login : function(callbackFct,scope){
        // ideally you wanna create the scope with the permissions passed in the init function
        console.log("facebook login ");

        if(typeof callbackFct !== 'function')
          return console.log('Need a callbackFct for login');
        
        scope = scope || this.scope;

        FB.login(callbackFct,scope);
      },
      logout : function(callbackFct){
        console.log("facebook logout ");

        if(typeof callbackFct !== 'function')
          return console.log('Need a callbackFct for logout');

        Fb.logout(callbackFct);
      },
      getLoginStatus : function(callbackFct){
        console.log("facebook getLoginStatus ");

        if(typeof callbackFct !== 'function')
          return console.log('Need a callbackFct for getLoginStatus');

        FB.getLoginStatus(callbackFct);
      },
      me : function(callbackFct){
        console.log("facebook me ");
        
        // used to get your facebook profile
        FB.api('/me',callbackFct);
      },
      getFriends : function(callbackFct){
        console.log("facebook getFriends ");
      },
      /*
        options should be of the following format
        options : {
          width: width of image
          height: height of image
          success : successfct callback
        }
      */
      getPicture : function(userId,options){

        console.log("facebook getPicture");

        var success = function(data,status,headers,config){
          console.log("getPicture success : "+JSON.stringify(data));
        }

        var error = function(data,status,headers,config){
          console.log("getPicture error : "+JSON.stringify(data));
        }

        options = options || {width : 50, height : 50, successCallback : success, errorCallback : error};

        userId = (typeof userId !== 'undefined')? userId : false;

        if(!userId)
          return;


        //apparently you can't get the picture through the /api so I had to use
        // http://graph.facebook.com/picture?width=140&height=140
        console.log("UserId : "+userId);

        console.log("Options: "+JSON.stringify(options));

        $http({method: 'GET', url: this.apiUrl+"/"+userId+"/picture?width="+options.width+"&height="+options.height }).
        success(options.successCallback).
        error(options.errorCallback);

       // return this.apiUrl+"/"+userId+"/picture?width="+options.width+"&height="+options.height;
      }

    };

    return facebook; 

  });