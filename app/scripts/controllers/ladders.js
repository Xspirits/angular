'use strict';

/* Controllers */
angular.module('ladders.controllers', [])
  .controller('leaderboardCtrl', ['$scope', '$routeParams', '$angularCacheFactory', 'Ladders', 'ngTableParams', function($scope, $routeParams, $angularCacheFactory, Ladders, ngTableParams) {
    var callType = $routeParams.type ? $routeParams.type : false;
    $scope.type = callType ? callType : 'global';
    if(callType === false) {
      Ladders.query({type: 'score', scope:'global'}, function(leaderboard){
        console.log(leaderboard);
        var data = leaderboard;
        $scope.tableParams = new ngTableParams({
          page: 1,            // show first page
          count: 5           // count per page
        }, {
          total: leaderboard.length, // length of data
          getData: function($defer, params) {
            $defer.resolve(leaderboard.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          }
        });
      });
    } else {
      Ladders.get({type: 'score', scope:callType}, function(leaderboard) {
        console.log(leaderboard);
        var data = leaderboard;
        $scope.tableParams = new ngTableParams({
          page: 1,            // show first page
          count: 5           // count per page
        }, {
          total: leaderboard.length, // length of data
          getData: function($defer, params) {
            $defer.resolve(leaderboard.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          }
        });
      }, function(res) {
        console.log(res);
      });
    }
  }]);