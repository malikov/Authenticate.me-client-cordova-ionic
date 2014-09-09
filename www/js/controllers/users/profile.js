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
	'$ionicModal',
	'$ionicLoading',
	'$timeout',
	'$scope',
	'$state',
	'$stateParams',
	'Constants',
function(CtrlFilter, UserModel, $ionicModal, $ionicLoading, $timeout, $scope,$state, $stateParams, Constants) {
	if(Constants.DEBUGMODE){
		console.log("UserCtrl controller");
		console.log($stateParams);
	}

	var user = new UserModel(CtrlFilter.params.model);
	
	$scope.profile = user.info;
	
	$scope.$on("$destroy", function() {
  		if(Constants.DEBUGMODE){
  			console.log('destroying UserCtrl');
  		}

  		user = null;
    });
}])