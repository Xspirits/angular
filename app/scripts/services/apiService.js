'use strict';

angular.module('api.services', [])
  .factory('apiService', ['conf', '$resource', function apiService(conf, $resource) {
    return {
      Auth: $resource(conf.epApi + 'auth/:email/:pass', {}, {
        query: {method:'GET', dataType :'json', params: {email: false,pass: false}}
      }),
      Signup: $resource(conf.epApi + 'register/:username/:email/:pass', {}, {
        post: {method:'POST', dataType :'json', params: {username: '@username', email: '@email',pass: '@pass'}}
      })
    };
  }]);