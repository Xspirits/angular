'use strict';

angular.module('users.services', [])
  .factory('Users', ['conf','$resource',
  function(conf,$resource){
    return $resource(conf.epApi + 'app/users/:userId', {}, {
      query: {method:'GET', params:{userId:''}, isArray:true}
    });
  }]);