'use strict';

var usersServices = angular.module('users.services', ['ngResource']);
 
usersServices
  .factory('Users', ['conf','$resource',
  function(conf,$resource){
    return $resource(conf.epApi + 'app/users/:userId', {}, {
      query: {method:'GET', params:{userId:''}, isArray:true}
    });
  }]);