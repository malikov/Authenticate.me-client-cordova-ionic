'use strict';

/*
	controller for the profile page
*/
angular.module('controllers.profile', ['ngCordova.plugins.camera','services.models.image'])

.controller('ProfileCtrl', [
	'ImageModel',
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
function(ImageModel, $cordovaCamera, $ionicActionSheet, $ionicModal, $ionicViewService, $ionicLoading, $ionicNavBarDelegate, $ionicPopup, $timeout, $scope,$state, $stateParams, Constants, AuthService) {
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

	$scope.editBg = function(type){
		if(Constants.DEBUGMODE){
			console.log("Editing bg "+type);
		}

		// Setting default options for the camera
		var options = { 
	        quality : 80, 
	        destinationType : Camera.DestinationType.FILE_URI, 
	        encodingType: Camera.EncodingType.PNG,
	        targetWidth: 400,
	        targetHeight: 400,
	        saveToPhotoAlbum: true,
	        allowEdit : true
	    };

		// Trigger action sheet
		$ionicActionSheet.show({
		    buttons: [
		      { text: 'Take a picture' },
		      { text: 'Choose from gallery' }
		    ],
		    titleText: 'Choose an option',
		    destructiveText: 'Delete',
		    cancelText: 'Cancel',
		    cancel: function() {
		        // add cancel code..
		        return true;
		    },
		    destructiveButtonClicked: function(){
		    	$scope.deleteImg($scope.tmp.avatar);
		    	$scope.deleteImg($scope.tmp.profileBg);

		    	$scope.tmp.avatar = null;
		    	$scope.tmp.profileBg = null;

		    	$scope.user.profileBg = $scope.updateData.profileBg;
		    	$scope.user.avatar = $scope.updateData.avatar;

		    	return true;
		    },
		    buttonClicked: function(index) {
		    	if(type === 'top'){
		    		options.targetWidth = 900;
		    		options.targetHeight = 450;
		    	}

		    	if(index === 0){
		    		// taking a picture
		    		options.sourceType = Camera.PictureSourceType.CAMERA;
		    	}

		    	if(index === 1){
		    		// choosing from gallery
		    		options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
		    	}

		    	$cordovaCamera.getPicture(options).then(function(imageData) {
				    var success = function(image){
		    			$ionicLoading.hide();

		    			$scope.updateLoading('Update successful', function(){
		    				if(type === 'top'){
					    		$scope.user.profileBg = image.url;	
					    	}else{
					    		$scope.user.avatar = image.url;	
					    	}
					   	});
		    		}

		    		var error = function(error){
		    			$scope.updateLoading('Update failed');
		    		}

				    // Success! Image data is here
				    if(type === 'top'){
				    	$ionicLoading.show({
					    	template: 'Updating background image ...'
					   	});
		    			// set the background
		    			$scope.tmp.profileBg = new ImageModel({filepath: imageData});
		    			var file = $scope.fileImg;
		    			$scope.tmp.profileBg.create(file).then(success, error);
					}else{
						// set the avatar
						$scope.tmp.avatar = new ImageModel({filepath: imageData});
						var file = scope.fileImg;
						$scope.tmp.avatar.create(file).then(success, error);
					}
				}, function(err) {
				      // An error occured. Show a message to the user
				      if(Constants.DEBUGMODE){
				      	console.log("error when getting the camera");
				      	console.log(err);
				      }
				});

		    	return true;
		    }
		});
	}

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