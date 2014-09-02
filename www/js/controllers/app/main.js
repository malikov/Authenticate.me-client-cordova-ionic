'use strict';

/*
	'services.common.constants'
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
	'$ionicNavBarDelegate',
	'Constants',
	'AuthService',
function($ionicModal,$ionicLoading, $ionicPlatform, $ionicViewService, $scope,$state, $stateParams, $ionicNavBarDelegate, Constants, AuthService) {
	if(Constants.DEBUGMODE){
		console.log("app/main.js controller loaded");
	}

	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('templates/modal/networkError.html', {
	    scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});
	
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
	    //display the modal view with netowrk required
	    $scope.modal.show();
	});

	$scope.dismiss = function(){
		if(Constants.DEBUGMODE){
			console.log("Dismissing the modal view");
		}
		$scope.modal.hide();
	}

}]);


