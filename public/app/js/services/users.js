'use strict';

var usersServices = angular.module('users.services', ['ngResource']);
 
usersServices.factory('Users', ['$resource',
  function($resource){
    return $resource('http://localhost:8080/app/users/:userId', {}, {
      query: {method:'GET', params:{userId:''}, isArray:true}
    });
  }]);