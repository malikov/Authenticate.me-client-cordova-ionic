'use strict';
/*
 * controllers/users/profile.js
 * controller for the user profile page
 *
 * (c) 2014 Vincent Maliko http://frnchnrd.com
 * License: MIT
 */

angular.module('controllers.users.profile', ['services.models.user'])

.controller('UserCtrl', [
	'UserModel',
	'$ionicModal',
	'$ionicLoading',
	'$timeout',
	'$scope',
	'$state',
	'$stateParams',
	'Constants',
function(UserModel, $ionicModal, $ionicLoading, $timeout, $scope,$state, $stateParams, Constants) {
	//show loading gif
	$ionicLoading.show({
    	template: 'Loading profile...'
   	});
   	
	if(Constants.DEBUGMODE){
		console.log("UserCtrl controller");
		console.log($stateParams);
	}

	var user = new UserModel();
	user.get($stateParams.id).then(function(response){
		$scope.profile = user.info;
		
		if(user.info.avatar === ""){
			$scope.profile.avatar = Constants.IMG.avatar;
		}

		if(user.info.profileBg === ""){
			$scope.profile.profileBg = Constants.IMG.profile_bg;
		}

		$ionicLoading.hide();
	}, function(error){
		if(Constants.DEBUGMODE){
			console.log("error fetching user");
		}
	});

	$scope.$on('event:auth-loginRequired', function() {
		$ionicLoading.hide();
  	});

	$scope.$on("$destroy", function() {
  		if(Constants.DEBUGMODE){
  			console.log('destroying UserCtrl');
  		}

  		user = null;
    });
}])