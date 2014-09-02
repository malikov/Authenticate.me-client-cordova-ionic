'use.strict'

angular.module('services.models.image',[])

.factory('ImageModel',['$http','$q','Constants',
  function($http, $q, Constants){

    var _urlApi = Constants.API.baseUrl+'/images';

    var imageModel = function(info){
      this.info = info || {objectId: null};
      this.urlApi = _urlApi;
    };
    
    //get /api/users/:id
    imageModel.prototype.get = function(id){
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
    imageModel.prototype.create = function(){
      var self = this;
      var deferred = $q.defer();

      var success = function(response, status, headers, config){
        angular.extend(self.info, response.payload);
        return deferred.resolve(response.payload);
      }

      var error = function(error, status, headers, config){
        deferred.reject(error);
      }

      var fd = new FormData();

      //creating a file input 
      
      fd.append('image',self.info.filepath);

      $http.post(_urlApi, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      }).success(success).error(error);
      
      return deferred.promise;
    }

    // put /api/users/:id
    imageModel.prototype.update = function(){
      var self = this;
      var deferred = $q.defer();

      var success = function(response, status, headers, config){
        angular.extend(self.info,response.payload);
        return deferred.resolve(response.payload);
      }

      var error = function(error, status, headers, config){
        return deferred.reject(error);
      }

      $http.put(_urlApi+'/'+self.info.objectId, {image : self.info}).success(success).error(error);

      return deferred.promise; 
    }

    // put /api/users/:id
    imageModel.prototype.delete = function(){
      var self = this;
      var deferred = $q.defer();

      var success = function(response, status, headers, config){
        angular.extend(self.info,response.payload);
        return deferred.resolve(response.payload);
      }

      var error = function(error, status, headers, config){
        return deferred.reject(error);
      }

      $http.put(_urlApi+'/'+self.info.objectId, {image : self.info}).success(success).error(error);

      return deferred.promise; 
    }
   
  	return imageModel;
  }])