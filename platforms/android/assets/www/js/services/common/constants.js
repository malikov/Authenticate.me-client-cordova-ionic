'use.strict'

angular.module('services.common.constants',[])

.service('Constants',[function(){
  	
  var _API = {
  	//baseUrl: "http://authenticate-app-me.herokuapp.com"
    //baseUrl: "http://localhost:3000"
    baseUrl: "http://192.168.0.105:3000"
  }

  var _providers = {
    instagram : {
        authorizationURL: "https://instagram.com/accounts/login/?next=/oauth/authorize"
    },

    twitter: {
      authorizationURL: "https://api.twitter.com/oauth/authorize?oauth_token="
    }
  }

  var _img = {
    avatar : "img/avatar.png",
    profile_bg : "img/14569280153_4e318b755c_h.jpg"
  }
  
  var constants = {
    DEBUGMODE : true,
    SHOWBROADCAST_EVENTS :true,
    API: _API,
    IMG: _img,
    PROVIDERS: _providers
  };

  return constants;
}])