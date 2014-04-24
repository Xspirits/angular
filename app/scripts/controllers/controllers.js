'use strict';

/* Controllers */
angular.module('caf.controllers', [])
  .controller('mainCtrl', ['$scope', function($scope) {
    $scope.test = 'Wolrd';
  }])
  .controller('profile', ['$scope', '$routeParams', '$angularCacheFactory','Users', function($scope, $routeParams, $angularCacheFactory, Users) {
  var profileCache = $angularCacheFactory.get('profileCache');

  }])
  .controller('MenuLeftCtrl', function($location, $localStorage, $modal, $scope) {
      $scope.currentUser = $localStorage.profile ? $localStorage.profile : false;
      $scope.location = $location;
      $scope.modal = $modal;
  });
