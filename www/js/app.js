'use strict';

angular.module('AuthenticateMe', [
  'ionic',
  'controllers.main',
  'controllers.auth',
  'controllers.profile',
  'controllers.thread',
  'services.common.constants',
  'services.common.auth',
  'components.http-auth-interceptor',
  'directives.file',
  'ngResource',
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
  

  AuthService.init();

  $rootScope.$on('event:auth-loginRequired', function() {
    AuthService.resetCookie();
    $state.go('app.start');
  });



})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/app.html",
      controller: 'AppCtrl'
  })

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

  // authentication path
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

  .state('app.auth.login', {
    url: "/login",
    views: {
      'content@app': {
        controller: 'AuthCtrl',
        templateUrl: "templates/auth/login.html"
      }
    },
    onEnter: [
        'Constants',
        '$stateParams',
        function(Constants,$stateParams){
          if(Constants.DEBUGMODE){
            console.log('auth.login -- onEnter');
          }
        }
    ],
    onExit : [
        'Constants', 
        function(Constants){
          if(Constants.DEBUGMODE){
            console.log('Exiting state auth.login');
          }
        }
    ]
  })
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
  .state('app.auth.info', {
    url: "/info",
    views: {
      'content@app': {
        controller: 'AuthCtrl',
        templateUrl: "templates/auth/info.html"
      }
    },
    onEnter: [
        'Constants',
        '$stateParams',
        function(Constants,$stateParams){
          if(Constants.DEBUGMODE){
            console.log('auth.info -- onEnter');
          }
        }
    ],
    onExit : [
        'Constants', 
        function(Constants){
          if(Constants.DEBUGMODE){
            console.log('Exiting state auth.info');
          }
        }
    ]
  })

  // profile routing
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
  })
  // profile settings
  .state('app.profile.settings', {
      url: "/settings",
      views: {
        'content@app': {
          controller: 'ProfileCtrl',
          templateUrl: "templates/profile/settings.html"
        }
      },
      onEnter: [
        'AuthService',
        'Constants',
        '$stateParams',
        '$state',
        function(AuthService, Constants, $stateParams, $state){
          if(Constants.DEBUGMODE){
            console.log('profile.settings -- onEnter');
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
            console.log('Exiting profile.settings state');
          }
        }
      ]
  })


  // profile messages
  .state('app.threads', {
      url: "/threads",
      views: {
        'content@app': {
          controller: 'ThreadCtrl',
          templateUrl: "templates/threads/index.html"
        }
      },
      resolve : {
        CtrlFilter : function(){
          return {
            _type : 'Threads',
            _filter : 'byMe',
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
  })

  //
  .state('app.threads.profile', {
      url: "/profile",
      views: {
        'content@app': {
          controller: 'ThreadCtrl',
          templateUrl: "templates/profile/messages.html"
        }
      },
      resolve : {
        CtrlFilter : function(){
          return {
            _type : 'Threads',
            _filter : 'byId',
            _params : {resoure : 'resource url to filter'}
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
            console.log('thread -- onEnter');
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
            console.log('Exiting thread state');
          }
        }
      ]
  })
  //specific thread with all messages
  .state('app.threads.id', {
      url: "/threads/:id",
      views: {
        'content@app': {
          controller: 'ThreadCtrl',
          templateUrl: "templates/threads/single.html"
        }
      },
      resolve : {
        CtrlFilter : function(){
          return {
            _type : 'Threads',
            _filter : 'byId',
            _params : {resoure : 'resource url to filter'}
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
            console.log('thread -- onEnter');
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
            console.log('Exiting thread state');
          }
        }
      ]
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/start');
})

