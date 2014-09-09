'use strict';

/*
 * models/collection.js
 *
 * (c) 2014 Vincent Maliko http://frnchnrd.com
 * License: MIT
 */

angular.module('services.models.collection',[])
.factory('ModelCollection',['$q','$http',
  function($q, $http){
    var collection = function (options) {
      this.options = angular.extend({busy : false, itemCount : 10, items : []},options);
      
      this.items = this.options.items;
      this.busy = this.options.busy;
      this.itemCount = this.options.itemCount; // default is get them by group of 10
      this.model = new this.options.model() || {}; 
      this.url = this.model.url;
    };
    
    collection.prototype.reset = function(){
      this.clearItems();
      this.busy = false;
      this.itemCount = 10;
      this.model = null;
      this.url = "";
    };

    collection.prototype.itemIndex = function(){
      return this.items.length;
    };

    collection.prototype.clearItems = function(){
      this.items = [];
    };
    
    /*
      params:
        i : item index
        c : item count
    */
    collection.prototype.get = function(params){
      var self = this;

      var _params = angular.extend(params , {i : self.itemIndex(), c : self.itemCount})|| {i : self.itemIndex(), c : self.itemCount};
      
      var deferred = $q.defer();

      var success = function(response){
        var output = response.payload;
        
        for (var i = 0; i < output.length; i++){
          self.items.push(output[i]);
        }
        
        self.busy = false;

        deferred.resolve(self.items);
      };
      
      var error = function(){
        deferred.reject();
      };
      
      if(self.busy)
        return deferred.reject();

      self.busy = true;
      
      $http.get(self.url, _params).success(success).error(error);

      return deferred.promise;
    };

    return collection;
  }]);