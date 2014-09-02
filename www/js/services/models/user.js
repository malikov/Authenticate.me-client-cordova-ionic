'use.strict'

angular.module('services.models.user',['services.models.image'])

.factory('UserModel',['$http','$q', 'Constants', 'ImageModel',
  function($http, $q, Constants, ImageModel){

    var _urlApi = Constants.API.baseUrl+'/users';

    var userModel = function(info){
      this.info = info || {objectId: null};
      this.urlApi = _urlApi;
    };
    
    // get /api/users/all
    userModel.prototype.all = function(){
      var self = this;
      var deferred = $q.defer();

      var success = function(response, status, headers, config){
        deferred.resolve(response.payload);
      }

      var error = function(error, status, headers, config){
        deferred.reject(error);
      }

      $http.get().success(success).error(error);

      return deferred.promise;
    }

    //get /api/users/:id
    userModel.prototype.get = function(id){
      var self = this;
      var deferred = $q.defer();

      var success = function(response, status, headers, config){
        //update current info for this user model
        angular.extend(self.info,response.payload);
        deferred.resolve(response.payload);
      }

      var error = function(error, status, headers, config){
        deferred.reject(error);
      }

      $http.get(_urlApi+'/'+id).success(success).error(error);
      
      return deferred.promise;
    }

    // post /api/users/
    userModel.prototype.create = function(){
      var self = this;
      var deferred = $q.defer();

      var success = function(response, status, headers, config){
        deferred.resolve(response.payload);
      }

      var error = function(error, status, headers, config){
        deferred.reject(error);
      }

      $http.post(_urlApi, {user : self.info}).success(success).error(error);
      
      return deferred.promise; 
    }

    // put /api/users/:id
    userModel.prototype.update = function(){
      var self = this;
      var deferred = $q.defer();

      var success = function(response, status, headers, config){
        angular.extend(self.info,response.payload);
        return deferred.resolve(response.payload);
      }

      var error = function(error, status, headers, config){
        return deferred.reject(error);
      }

      $http.put(_urlApi+'/'+self.info.objectId, {user : self.info}).success(success).error(error);

      return deferred.promise; 
    }
   
  	return userModel;
  }])