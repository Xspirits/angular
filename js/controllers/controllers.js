'use strict';

/* Controllers */
angular.module('caf.controllers', [])
  .controller('mainCtrl', ['$scope','$location','$anchorScroll', function($scope, $location, $anchorScroll) {
    $scope.test = 'Wolrd';
  }])
  .controller('leaderboardCtrl', ['$scope', function($scope) {
    $scope.test = 'leaderboardCtrl';
  }])
  .controller('profile', ['$scope', '$routeParams', '$angularCacheFactory','Users', function($scope, $routeParams, $angularCacheFactory, Users) {
   var profileCache = $angularCacheFactory.get('profileCache');

    /* Profile is cached */
    if(!profileCache) {

    } else {

    }
  }])
  .controller('MenuLeftCtrl', ['$location', '$localStorage', '$modal', '$scope' ,function($location, $localStorage, $modal, $scope) {
      $scope.currentUser = $localStorage.profile ? $localStorage.profile : false;
      $scope.location = $location;
      $scope.open = function(options) {
        $modal.open(options);
      };
    }]);
