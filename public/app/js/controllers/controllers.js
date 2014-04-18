'use strict';

/* Controllers */

angular.module('caf.controllers', [])
  .controller('mainCtrl', ['$scope', function($scope) {
    $scope.test = 'Wolrd';
  }])
  .controller('MyCtrl2', [function() {

  }]);
