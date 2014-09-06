'use strict';

/*
 * controllers/profile/main.js
 * controller for the profile page
 *
 * (c) 2014 Vincent Maliko http://frnchnrd.com
 * License: MIT
 */

angular.module('controllers.profile', ['ngCordova.plugins.camera'])

.controller('ProfileCtrl', [
	'$cordovaCamera',
	'$ionicActionSheet',
	'$ionicModal',
	'$ionicViewService',
	'$ionicLoading',
	'$ionicNavBarDelegate',
	'$ionicPopup',
	'$timeout',
	'$scope',
	'$state',
	'$stateParams',
	'Constants',
	'AuthService',
function($cordovaCamera, $ionicActionSheet, $ionicModal, $ionicViewService, $ionicLoading, $ionicNavBarDelegate, $ionicPopup, $timeout, $scope,$state, $stateParams, Constants, AuthService) {
	//show loading gif
	$ionicLoading.show({
    	template: 'Loading profile...'
   	});
   	
	if(Constants.DEBUGMODE){
		console.log("ProfileCtrl controller");
		console.log($stateParams);
	}
	

	if(!AuthService.isLoggedIn()){
		$ionicLoading.hide();
		return $state.go('app.start');
	}
	
	$scope.user = AuthService.currentUser.info;
	$scope.tmp = {
		profileBg : null,
		avatar: null
	}

	if(AuthService.currentUser.info.avatar === ""){
		$scope.user.avatar = Constants.IMG.avatar;
	}

	if(AuthService.currentUser.info.profileBg === ""){
		$scope.user.profileBg = Constants.IMG.profile_bg;
	}

	
	//data for the form
	$scope.updateData = angular.copy($scope.user);

	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('templates/profile/edit.html', {
	    scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.$on('event:auth-loginRequired', function() {
		$ionicLoading.hide();
    	$scope.modal.hide();
  	});

	$scope.deleteImg = function(img){
		if(img !== null){
			img.delete().then(function(){
				if(Constants.DEBUGMODE){
					console.log("image deleted");
				}
			}, function(){
				if(Constants.DEBUGMODE){
					console.log("error deleting");
				}
			})
		}
	}

	// Triggered in the login modal to close it
	$scope.closeEdit = function(saved) {
	  if(!saved){
	  	
	  	$scope.deleteImg($scope.tmp.avatar);
		$scope.deleteImg($scope.tmp.profileBg);

	  	angular.copy($scope.updateData, $scope.user);
	  }

	  $scope.modal.hide();
	};

	// Open the edit modal
	$scope.openEdit = function() {
	  $scope.modal.show();
	};

	

	$scope.goTo = function(state){
		if(state === 'edit'){
			$scope.openEdit();
		}else{
			console.log("clicked on state : "+state);
		}
	}

	$scope.updateLoading = function(msg,cb){
		$ionicLoading.show({
	    	template: msg
	   	});			

		$timeout(function() {
			$ionicLoading.hide();
			if(typeof cb === 'function'){
				cb();
			}
		}, 2000);
	}

	$scope.updateUser = function(){
		if(Constants.DEBUGMODE){
			console.log("Update user : "+$scope.updateData);
		}
		
		$ionicLoading.show({
	    	template: 'Updating profile...'
	   	});

	    var success = function(response){
	    	$ionicLoading.hide();	

	    	$scope.updateLoading('Update successful',function(){
	    		AuthService.updateUser($scope.user, {set: true});
	    		$scope.closeEdit(true);	
	    	});
		}

		var error = function(error){
			$scope.updateLoading('Update Error, please try again '+error.message);
		}
		/*
			if image changed create a new image then destroy the other one
			then update the user's info
		*/
		AuthService.currentUser.update().then(success,error);
	}

	$ionicLoading.hide();
}])