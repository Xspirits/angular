'use strict';

var usersServices = angular.module('ladders.services', ['ngResource']);

usersServices
  .factory('Ladders', ['conf','$resource',
  function(conf,$resource){
    return $resource(conf.epApi + 'ladder/:type/:scope', {}, {
        get: {method:'GET', dataType :'json', params: {type: '@type', scope:'@scope'}, isArray:true}
    });
  }]);
      