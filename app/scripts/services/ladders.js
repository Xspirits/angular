'use strict';

angular.module('ladders.services', [])
  .factory('Ladders', ['conf','$resource',
  function(conf,$resource){
    return $resource(conf.epApi + 'ladder/:type/:scope', {}, {
        get: {method:'GET', dataType :'json', params: {type: '@type', scope:'@scope'}, isArray:true}
    });
  }]);
      