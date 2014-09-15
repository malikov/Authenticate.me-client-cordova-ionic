'use.strict'
/*
 * models/user.js
 * This model represents a user in the database
 * 
 * (c) 2014 Vincent Maliko http://frnchnrd.com
 * License: MIT
 */

angular.module('services.models.user',[])

.factory('UserModel',['$http','$q', 'Constants',
  function($http, $q, Constants){

    var _urlApi = Constants.API.baseUrl+'/users';

    var userModel = function(info){
      this.info = info || {objectId: null};
      this.url = _urlApi;
    };
    
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

      // since the data is cached maybe it'll be nice to reload new data after a x minutes.
      $http.get(this.url+'/'+id, {cache: true}).success(success).error(error);
      
      return deferred.promise;
    }

    // post /api/users/
    userModel.prototype.create = function(){
      var deferred = $q.defer();

      var success = function(response, status, headers, config){
        deferred.resolve(response.payload);
      }

      var error = function(error, status, headers, config){
        deferred.reject(error);
      }

      $http.post(this.url, {user : self.info}).success(success).error(error);
      
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

      $http.put(this.url+'/'+self.info.objectId, {user : self.info}).success(success).error(error);

      return deferred.promise; 
    }
   
  	return userModel;
  }])