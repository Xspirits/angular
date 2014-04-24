'use strict';

angular.module('api.services', [])
  .factory('apiService', ['conf', '$resource', function apiService(conf, $resource) {
    return {
      Auth: $resource(conf.epApi + 'auth/:email/:pass', {}, {
        query: {method:'GET', dataType :'json', params: {email: false,pass: false}}
      })
    };
  }]);