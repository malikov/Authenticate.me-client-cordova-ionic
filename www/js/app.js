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



})
.config(function($stateProvider, $urlRouterProvider) {
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
      onEnter:[
        'AuthService',
        'Constants',
        '$state',
        function(AuthService,Constants, $state){
          //check if user is loggedin first
          if(AuthService.isLoggedIn()){
            if(Constants.DEBUGMODE){
              console.log("User is loggedIn");
            }
            return $state.go('app.profile');
          }
        }
      ]
  })

  // users page
  .state('app.users', {
      url: "/users",
      views: {
        'content@app': {
          controller: 'UsersCtrl',
          templateUrl: "templates/users/index.html"
        }
      },
      resolve : {
        CtrlFilter : function(){
          return {
            _params : {}
          };
        }
      },
      onEnter: [
        'AuthService',
        'Constants',
        '$stateParams',
        '$state',
        function(AuthService, Constants, $stateParams, $state){
          if(Constants.DEBUGMODE){
            console.log('profile.users -- onEnter');
          }

          if(!AuthService.isLoggedIn()){
            if(Constants.DEBUGMODE){
              console.log("User is not loggedIn");
            }
            return $state.go('app.auth');
          }
        }
      ],
      onExit : [
        'Constants', 
        function(Constants){
          if(Constants.DEBUGMODE){
            console.log('Exiting profile.users state');
          }
        }
      ]
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
      onEnter: [
        'AuthService',
        'Constants',
        '$stateParams',
        '$state',
        function(AuthService, Constants, $stateParams, $state){
          if(Constants.DEBUGMODE){
            console.log('profile.users -- onEnter');
          }

          if(!AuthService.isLoggedIn()){
            if(Constants.DEBUGMODE){
              console.log("User is not loggedIn");
            }
            return $state.go('app.auth');
          }
        }
      ],
      onExit : [
        'Constants', 
        function(Constants){
          if(Constants.DEBUGMODE){
            console.log('Exiting profile.users state');
          }
        }
      ]
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
      onEnter: [
        'AuthService',
        'Constants',
        '$stateParams',
        '$state',
        function(AuthService, Constants, $stateParams, $state){
          if(Constants.DEBUGMODE){
            console.log('auth -- onEnter');
          }

          if(AuthService.isLoggedIn()){
            if(Constants.DEBUGMODE){
              console.log("User is loggedIn");
            }
            return $state.go('app.profile');
          }
        }
      ],
      onExit : [
          'Constants', 
          function(Constants){
            if(Constants.DEBUGMODE){
              console.log('Exiting state auth');
            }
          }
      ]
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
    onEnter: [
        'Constants',
        '$stateParams',
        function(Constants,$stateParams){
          if(Constants.DEBUGMODE){
            console.log('auth.signup -- onEnter');
            console.log($stateParams);
          }
        }
    ],
    onExit : [
        'Constants', 
        function(Constants){
          if(Constants.DEBUGMODE){
            console.log('Exiting state auth.signup');
          }
        }
    ]
  })

  // profile page
  .state('app.profile', {
      url: "/profile",
      views: {
        'content@app': {
          controller: 'ProfileCtrl',
          templateUrl: "templates/profile/index.html"
        }
      },
      onEnter: [
        'AuthService',
        'Constants',
        '$stateParams',
        '$state',
        function(AuthService, Constants, $stateParams, $state){
          if(Constants.DEBUGMODE){
            console.log('profile -- onEnter');
          }

          if(!AuthService.isLoggedIn()){
            if(Constants.DEBUGMODE){
              console.log("User is loggedIn");
            }
            return $state.go('app.auth');
          }
        }
      ],
      onExit : [
        'Constants', 
        function(Constants){
          if(Constants.DEBUGMODE){
            console.log('Exiting profile state');
          }
        }
      ]
  });
  
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/start');
})

