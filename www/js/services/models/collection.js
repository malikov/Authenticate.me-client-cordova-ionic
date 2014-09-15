'use strict';

/*
 * models/collection.js
 *
 * (c) 2014 Vincent Maliko http://frnchnrd.com
 * License: MIT
 */

angular.module('services.models.collection',[])
.factory('ModelCollection',['$q','$http','$cacheFactory','Constants',
  function($q, $http, $cacheFactory,C){
    var collection = function (options) {
      this.options = angular.extend({
        busy : false, 
        itemCount : 10, 
        items : [],
        latestTop: true, // by default the latest entry is always at the top
        nextPage: 0,
        prevPage: 0
      },options);
      
      this.items = this.options.items;
      this.busy = this.options.busy;
      this.itemCount = this.options.itemCount; // default is get them by group of 10
      this.model = new this.options.model() || {}; 
      this.url = this.model.url;

      this.nextPage = this.options.nextPage;
      this.prevPage = this.options.prevPage;

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
      fetches the next set based on the next or previous page
      params:
        i : item index
        c : item count
    */
    collection.prototype.get = function(params){
      var self = this;

      var _params = angular.extend({
        i : self.itemIndex(),
        c : self.itemCount,
        prev: false,
        next: true,
        cache : true
      }, params);
      
      var deferred = $q.defer();

      var success = function(response){
        var output = response.payload;
        
        for (var i = 0; i < output.length; i++){
          if(self.latestTop){
            self.unshift(output[output.length-i]);
          }else{
            self.items.push(output[i]);
          }
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

      //
      if(_params.next){
        _params.from = (this.latestTop)? this.items[0] : this.items[this.itemIndex()];
      }else{
        _params.from = (this.latestTop)? this.items[this.itemIndex()] : this.items[0];
      }
      
      var $cache = $cacheFactory.get('$http');
      
      var date = new Date();

      // if it's been more than 5 minutes
      if((date.getTime() - C.timeouts.collection.user) > 60000){
        // clear cache
        $cache.remove(self.url);
        C.timeouts.collection.user = date.getTime();
      }

      $http.get(self.url, _params).success(success).error(error);  

      return deferred.promise;
    };

    return collection;
  }]);