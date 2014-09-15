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
function(ModelCollection, UserModel, $ionicLoading, $timeout, $scope,$state, $stateParams, Constants, AuthService) {
	if(Constants.DEBUGMODE){
		console.log("UsersCtrl controller");
		console.log($stateParams);
	}
	
	$scope.$on('event:auth-loginRequired', function() {
		$ionicLoading.hide();
  });

  // set a modelCollection with the userModel type
  // this way the collection.get call will query api/users
	var modelCollection = new ModelCollection({
		model: UserModel,
		busy: false,
		latestTop: true
	});
  
  // binding the collection to the modelCollection.items array
  // after fetching the items the collection will be updated
  $scope.collection = modelCollection.items;

  // loading items from the server
  $scope.loadItems = function(params){
  	return modelCollection.get(params);
  }

  // TODO not functional right now
  $scope.loadPreviousItems = function(params){
  	var _params = angular.extend(params,{
  		prev: true
  	})
  		
  	return modelCollection.get(params);
  }

  $ionicLoading.show({
	    template: 'Loading users...'
	});

  //loading and setting the collection
  $scope.loadItems().then(function(response){
    // close the loading overlay
  	$ionicLoading.hide();
  }, function(error){
  	if(Constants.DEBUGMODE){
  		console.log("UsersCtrl couldn't fetch collection items");
  	}

    // close the loading overlay
    $ionicLoading.hide();
  });

  $scope.$on("$destroy", function() {
    // garbage collection destroy this object
  	if(Constants.DEBUGMODE){
  		console.log('destroying UsersCtrl');
  	}

  	modelCollection = null;
  });
  
}])