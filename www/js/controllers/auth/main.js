'use strict';

/*
	'services.common.constants'
	'services.common.auth'
*/
angular.module('controllers.auth', [])

.controller('AuthCtrl', [
	'$ionicLoading',
	'$ionicNavBarDelegate',
	'$ionicPopup',
	'$timeout',
	'$scope',
	'$state',
	'$stateParams',
	'Constants',
	'AuthService',
function($ionicLoading,$ionicNavBarDelegate,$ionicPopup, $timeout, $scope,$state, $stateParams, Constants, AuthService,$cordovaLocalStorage) {
	
	if(Constants.DEBUGMODE){
		console.log("AuthCtrl controller");
		console.log($stateParams);
	}

	// user data passed to authentication service
	$scope.user = {};

    var authType = ($stateParams.type)? $stateParams.type : 'login';
    
    $scope.auth = {
		type : authType
	}

	
	//check if user is loggedin first
	if(AuthService.isLoggedIn()){
		if(Constants.DEBUGMODE){
			console.log("User is loggedIn");
		}
		return $state.go('app.profile');
	}

	// function for login user in the system
	$scope.authenticateUser = function(provider){
		var error = function(error){
			$ionicLoading.hide();

			if(Constants.DEBUGMODE){
				console.log("AuthenticateUser failed");
				console.log(error);
			}

			$scope.error = error;
			// if error is 404 the interceptor throws 
			//show popup error
			// An elaborate, custom popup
			var errorPopup = $ionicPopup.show({
		    	templateUrl: 'templates/modal/error.html',
		    	title: 'Error',
		    	scope: $scope,
		    	buttons: [
		       		{ text: 'Ok' }
		    	]
		   	});

		   errorPopup.then(function(res) {
		   	 	if(Constants.DEBUGMODE){
		  	   		console.log('Popup close button Tapped!', res);
		 		}
		   });
		   
		   $timeout(function() {
		      errorPopup.close(); //close the popup after 3 seconds for some reason
		   }, 3000);
		}

		var success = function(response){
			if(Constants.DEBUGMODE){
				console.log("Authentication successful")
				console.log(response);
			}

			// request login with response, if the user is logged in send him to the profile page
			// need to keep track of the auth process I'm lo
			$ionicLoading.hide();
			$state.go('app.profile');
		}

		

		$ionicLoading.show({
      		template: 'Loading...'
   		 });
		
		if(provider === 'facebook' || provider === 'twitter' || provider === 'instagram'){
			if(Constants.DEBUGMODE){
				console.log('authenticating with '+provider);
			}	
		}

		AuthService.login($scope.user,provider).then(success,error);
	}

	$scope.registerUser = function(){
		var success = function(response){
			if(Constants.DEBUGMODE){
				console.log("Registering user successful");
				console.log(response);
			}
			$ionicLoading.hide();
			$scope.authenticateUser();
		}

		var error = function(error){
			$ionicLoading.hide();
			console.log(error);
			$scope.error = error;
			// if error is 404 the interceptor throws 
			//show popup error
			// An elaborate, custom popup
			var errorPopup = $ionicPopup.show({
		    	templateUrl: 'templates/modal/error.html',
		    	title: 'Error',
		    	scope: $scope,
		    	buttons: [
		       		{ text: 'Ok' }
		    	]
		   	});

		   errorPopup.then(function(res) {
		   		if(Constants.DEBUGMODE){
				     console.log('popup ok Tapped!', res);
				 }
		   });
		   
		   $timeout(function() {
		      errorPopup.close(); //close the popup after 3 seconds for some reason
		   }, 3000);
		}

		$ionicLoading.show({
      		template: 'Loading...'
   		 });

		AuthService.register($scope.user).then(success,error);
	}

	// display signup modal
	$scope.promptSignup = function(){
		// use modal to display signup
	}

	// display signup modal
	$scope.navigateTo = function(state){
		return $state.go(state);
	}

	$scope.authenticate = function(provider){
		$scope.authenticateUser(provider);
	}

	$scope.$on('event:app-networkRequired', function() {
	    //display the modal view with netowrk required
	    $ionicLoading.hide();
	});

}]);