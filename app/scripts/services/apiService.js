'use strict';

var apiServices = angular.module('api.services', ['ngResource']);
 
apiServices
  .factory('apiService', ['conf', '$resource', function apiService(conf, $resource) {
    return {
      Auth: $resource(conf.epApiDev + 'auth/:email/:pass', {}, {query: {method:'GET', dataType :"json", params: {email: false,pass: false}}})

    }
  }]);