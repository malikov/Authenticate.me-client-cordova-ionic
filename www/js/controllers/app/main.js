'use strict';
/*
 * controllers/app/main.js
 * main controller
 *
 * (c) 2014 Vincent Maliko http://frnchnrd.com
 * License: MIT
 */
angular.module('controllers.main', [])

.controller('AppCtrl', [
	'$ionicModal',
	'$ionicLoading',
	'$ionicPlatform',
	'$ionicViewService',
	'$scope',
	'$state',
	'$stateParams',
	'Constants',
	'AuthService',
function($ionicModal,$ionicLoading, $ionicPlatform, $ionicViewService, $scope,$state, $stateParams, Constants, AuthService) {
	if(Constants.DEBUGMODE){
		console.log("app/main.js controller loaded");
	}

	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('templates/modal/networkError.html', {
	    scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});
	
	// setting $scope.user to the current user logged in the system
	$scope.user = AuthService.currentUser.info;

	if(AuthService.currentUser.info.avatar === ""){
		$scope.user.avatar = Constants.IMG.avatar;
	}

	
	$scope.navigateTo = function(state){
		return $state.go(state);	
	}

	$scope.logout = function(){
		$ionicLoading.show({
    		template: 'Signing out ...'
   		});

		var success = function(response){
			$ionicLoading.hide();
			return $state.go("app.start");
		}

		var error = function(error){
			if(Constants.DEBUGMODE){
				console.log("error when logging out");
			}

			$ionicLoading.hide();
			return $state.go("app.start");
		}

		return AuthService.logout().then(success,error);
	}

	// Catching the broadcasted event 
	$scope.$on('event:app-networkRequired', function() {
	    //display the modal view
	    $scope.modal.show();
	});

	$scope.dismiss = function(){
		if(Constants.DEBUGMODE){
			console.log("Dismissing the modal view");
		}
		$scope.modal.hide();
	}

	$scope.launchFrnchNrd = function(){
		var browserWindow = window.open("http://frnchnrd.com", "_blank", "closebuttoncaption=Done,location=no");
	}

}]);


