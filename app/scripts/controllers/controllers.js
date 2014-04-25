'use strict';

/* Controllers */
angular.module('caf.controllers', [])
  .controller('mainCtrl', ['$scope', function($scope) {
    $scope.pageTitle = 'Welcome';
  }])
  .controller('profile', ['$scope', '$routeParams', '$angularCacheFactory','Users', function($scope, $routeParams, $angularCacheFactory, Users) {
    var profileCache = $angularCacheFactory.get('profileCache');
    $scope.pageTitle = 'My profile';

  }])
  .controller('MenuLeftCtrl', ['$location', '$localStorage', '$modal', '$scope', function($location, $localStorage, $modal, $scope) {
        $scope.currentUser = $localStorage.profile ? $localStorage.profile : false;
        $scope.location = $location;
        $scope.modal = $modal;
  }]);