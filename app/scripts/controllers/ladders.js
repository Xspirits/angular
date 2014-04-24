'use strict';

/* Controllers */
angular.module('ladders.controllers', [])
  .controller('leaderboardCtrl', ['$scope', '$routeParams', 'Ladders',function($scope, $routeParams, Ladders) {
      var callType = $routeParams.type ? $routeParams.type : false;
      $scope.type = callType ? callType : 'global';
      if(callType === false) {
        Ladders.query({type: 'score', scope:'global'}, function(leaderboard){
          console.log(leaderboard);
          var data = leaderboard;
          $scope.ladder = leaderboard;
        });
      } else {
        Ladders.get({type: 'score', scope:callType}, function(leaderboard) {
          console.log(leaderboard);
          var data = leaderboard;
          $scope.ladder = leaderboard;
        }, function(res) {
          console.log(res);
        });
      }
  }]);