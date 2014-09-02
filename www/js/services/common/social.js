'use strict';

angular.module('services.common.social',[])

.service('Social',['Constants', '$q',
	function (Constants,$q){
		var _facebook = {

		}

		var _instagram = {

		}

		var _twitter = {

		}

		var social = {
			facebookInfo : _facebook,
			instagramInfo : _instagram,
			twitter : _twitter,
			like : function(model,success,error){
				var deferred = $q.defer();

				var success = success || function(response){
					if(Constants._DEBUGMODE){
						console.log('SocialService.js like -- success callback');
						console.log(response);
					}
					
					deferred.resolve(response);
				}

				var error = error || function(error){
					if(Constants._DEBUGMODE){
						console.log("SocialService.js like -- error callback");
					}

					deferred.reject();
				}

				model.like().then(success,error);

				return deferred.promise;
			},
			unlike : function(model,like){
				
			},
			share : function(model,target){
				var deferred = $q.defer();
				var self = this;

		    	var success = function(response){
				   console.log(response);

				   deferred.resolve(response);
		        }
				  
				  
				var error = function(error){
					console.log(error);
					deferred.reject();
				}

				model.share(target,success,error);

				return deferred.promise;
			}
		}

		return social;
}]);