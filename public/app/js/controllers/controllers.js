'use strict';

/* Controllers */

angular.module('caf.controllers', [])
  .controller('mainCtrl', ['$scope', function($scope) {
    $scope.test = 'Wolrd';
  }])

  .controller('leaderboardCtrl', ['$scope', function($scope) {
    $scope.test = 'leaderboardCtrl';
  }])


  .controller('MyCtrl2', [function() {

  }]);
