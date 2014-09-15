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
	'CtrlFilter',
	'UserModel',
	'$ionicLoading',
	'$timeout',
	'$scope',
	'$state',
	'$stateParams',
	'Constants',
function(CtrlFilter, UserModel, $ionicLoading, $timeout, $scope,$state, $stateParams, Constants) {
	if(Constants.DEBUGMODE){
		console.log("UserCtrl controller");
		console.log($stateParams);
	}

	// the data was preloaded in the CtrlFilter dependency
	// therefore we set profile to user.info after instantiating user
	var user = new UserModel(CtrlFilter.params.model);
	
	$scope.profile = user.info;
	

	$scope.$on("$destroy", function() {
		// garbage collection

  		if(Constants.DEBUGMODE){
  			console.log('destroying UserCtrl');
  		}

  		user = null;
    });
}])