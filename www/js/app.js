'use strict';

angular.module('AuthenticateMe', [
  'ionic',
  'controllers.main',
  'controllers.auth',
  'controllers.profile',
  'controllers.users',
  'controllers.users.profile',
  'services.common.constants',
  'services.common.auth',
  'components.http-auth-interceptor',
  'ngCordova.plugins.network'
])

.run(function($ionicPlatform, AuthService, Constants, $state, $rootScope,$http,$cordovaNetwork) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    if(Constants.DEBUGMODE){
    var networkType = $cordovaNetwork.getNetwork();
    console.log("Network used on this machine : "+networkType);
  }
  

  if(!$cordovaNetwork.isOnline()){
    if(Constants.DEBUGMODE){
      console.log("No NETWORK FOUND");
      // at this point we need to broadcast a no network found event and the app.controller will get that and display the popup
      $rootScope.$broadcast('event:app-networkRequired');
    }
  }else{
    if(Constants.DEBUGMODE){
      console.log("NETWORK FOUND");
    }
  }

  });
  
  // init Authentication service
  AuthService.init();

  $rootScope.$on('event:auth-loginRequired', function() {
    //if login is required redirect to the app.start page
    AuthService.resetCookie();
    $state.go('app.start');
  });

  // on state change you want to check whether or not the state.
  // I'm trying to reach is protected 
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if(toState.authenticate && !AuthService.isLoggedIn()){
      // User isn’t authenticated
      $state.transitionTo("app.auth");
      event.preventDefault(); 
    }
  });

})

.config(function($stateProvider, $urlRouterProvider) {

  // loging function
  var _onEnter =[
    'Constants',
    '$state',
    '$stateParams',
    function(C, $state, $stateParams){
      if(C.DEBUGMODE){
        console.log("Entering state : "+$state.current.name);
        console.log({
          currentState : $state.current,
          url : $state.current.url,
          route : $state.current.name,
          params : $stateParams
        })
      }
    }];

    var _onExit =[
    'Constants',
    '$state',
    function(C, $state){
      if(C.DEBUGMODE){
        console.log("Exiting state : "+$state.current.name);
      }
    }];

  $stateProvider
  // routing 
  .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/app.html",
      controller: 'AppCtrl'
  })

  // starting page
  .state('app.start', {
      url: "/start",
      views: {
        'content@app': {
          controller: 'AppCtrl',
          templateUrl: "templates/index.html"
        }
      },
      authenticate : false,
      onEnter: _onEnter,
      onExit: _onExit
  })
  
  // authentication page
  .state('app.auth', {
      url: "/auth",
      views: {
        'content@app': {
          controller: 'AuthCtrl',
          templateUrl: "templates/auth/index.html"
        }
      },
      authenticate : false, 
      onEnter: _onEnter,
      onExit: _onExit
  })

  // signup page
  .state('app.auth.signup', {
    url: "/signup",
    views: {
      'content@app': {
        controller: 'AuthCtrl',
        templateUrl: "templates/auth/signup.html"
      }
    },
    authenticate : false, 
    onEnter: _onEnter,
    onExit : _onExit
  })

  // logged user's profile page
  .state('app.profile', {
      url: "/profile",
      views: {
        'content@app': {
          controller: 'ProfileCtrl',
          templateUrl: "templates/profile/index.html"
        }
      },
      authenticate : true, 
      onEnter: _onEnter,
      onExit : _onExit
  })

  // users page
  .state('app.users', {
      url: "/users",
      views: {
        'content@app': {
          controller: 'UsersCtrl',
          templateUrl: "templates/users/index.html",
        }
      },
      authenticate: true,
      resolve : {
        CtrlFilter : function(){
          return {
            _params : {}
          };
        }
      },
      onEnter: _onEnter,
      onExit : _onExit
  })

  // users/:id profile page
  .state('app.users.profile', {
      url: "/:id",
      views: {
        'content@app': {
          controller: 'UserCtrl',
          templateUrl: "templates/users/profile.html"
        }
      },
      authenticate: true,
      onEnter: _onEnter,
      onExit : _onExit
  });
  
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/start');
})

