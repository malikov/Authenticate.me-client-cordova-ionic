'use strict';

/*
 * controllers/users/main.js
 * controller for the user list page
 *
 * (c) 2014 Vincent Maliko http://frnchnrd.com
 * License: MIT
 */
angular.module('controllers.users', ['services.models.collection','services.models.user'])

.controller('UsersCtrl', [
	'ModelCollection',
	'UserModel',
	'$ionicLoading',
	'$timeout',
	'$scope',
	'$state',
	'$stateParams',
	'Constants',
	'AuthService',
	'CtrlFilter',
function(ModelCollection, UserModel, $ionicLoading, $timeout, $scope,$state, $stateParams, Constants, AuthService, CtrlFilter) {
	//show loading gif
	
	if(Constants.DEBUGMODE){
		console.log("UsersCtrl controller");
		console.log($stateParams);
	}
	

	if(!AuthService.isLoggedIn()){
		$ionicLoading.hide();
		return $state.go('app.start');
	}
	

	$scope.$on('event:auth-loginRequired', function() {
		$ionicLoading.hide();
  	});

	var modelCollection = new ModelCollection({
		model: UserModel,
		busy: false
	});

  	$scope.loadItems = function(params){
  		$ionicLoading.show({
	    	template: 'Loading users...'
	   	});
  		return modelCollection.get(params);
  	}

  	$scope.showUser = function(userId){
  		return $state.go('app.start');
  	}
  	
  	//loading and setting the collection
  	$scope.loadItems(CtrlFilter._params).then(function(response){
  		$ionicLoading.hide();
  		$scope.collection = modelCollection.items;
  	}, function(error){
  		if(Constants.DEBUGMODE){
  			console.log("UsersCtrl couldn't fetch collection items");
  		}
  	});

}])