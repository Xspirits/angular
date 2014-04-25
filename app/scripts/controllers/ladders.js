'use strict';

/* Controllers */
angular.module('ladders.controllers', [])
  .controller('leaderboardCtrl', ['$scope','$rootScope', '$routeParams', '$angularCacheFactory', 'Ladders', 'ngTableParams', function($scope, $rootScope, $routeParams, $angularCacheFactory, Ladders, ngTableParams) {
    var callType = $routeParams.type ? $routeParams.type : false;

    var ladderCache =  $rootScope.cacheLadders;
    var ladderGlobal = ladderCache.get('ladderGlobal')
      , ladderTyped = ladderCache.get('ladder' + callType);
    
    // Scopes
    $scope.type = callType ? callType : 'global';

    if(callType === false) {

      if(ladderGlobal && ladderGlobal.length > 0) {
        console.log('Load from cache');
        return setScopeTable(ladderGlobal);
      } else {

        return Ladders.query({type: 'score', scope:'global'}, function(leaderboard) {
          console.log('Load from API');
          console.log(leaderboard);

          // update cache for the ladder
          ladderCache.put('ladderGlobal', leaderboard);
          return setScopeTable(leaderboard);

        }, function(res) {
            return console.log(res);
        });

      }

    } else {

      if(ladderTyped && ladderTyped.length > 0) {
        console.log('Load from cache');
        return setScopeTable(ladderTyped);

      } else {

        return Ladders.get({type: 'score', scope:callType}, function(leaderboard) {
          console.log('Load from API');
          console.log(leaderboard);

          ladderCache.put('ladder' + callType, leaderboard);
          return setScopeTable(leaderboard);
        }, function(res) {
          return console.log(res);
        });
      }
    }



    /* FUNCTIONS */
    function setScopeTable (tableData) {
      $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 5           // count per page
      }, {
        total: tableData.length, // length of data
        getData: function($defer, params) {
          $defer.resolve(tableData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });

    }

  }]);