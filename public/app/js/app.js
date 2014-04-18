'use strict';


// Declare app level module which depends on filters, and services
angular.module('caf', [
  'ngRoute',
  'caf.filters',
  'caf.services',
  'caf.directives',
  'caf.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/', {templateUrl: 'partials/main.html', controller: 'mainCtrl'})

  .when('/leaderboard', {templateUrl: 'partials/main.html', controller: 'mainCtrl'})
  .when('/signup', {templateUrl: 'partials/main.html', controller: 'mainCtrl'})
  .when('/login', {templateUrl: 'partials/main.html', controller: 'mainCtrl'})

  .when('/friends', {templateUrl: 'partials/main.html', controller: 'mainCtrl'})
  .when('/settings', {templateUrl: 'partials/main.html', controller: 'mainCtrl'})


  .when('/request', {templateUrl: 'partials/main.html', controller: 'mainCtrl'})
  .when('/launchChallenge', {templateUrl: 'partials/main.html', controller: 'mainCtrl'})
  .when('/challenges', {templateUrl: 'partials/main.html', controller: 'mainCtrl'})
  .when('/ongoing', {templateUrl: 'partials/main.html', controller: 'mainCtrl'})
  .when('/myChallenges', {templateUrl: 'partials/main.html', controller: 'mainCtrl'})
  .when('/rateChallenges', {templateUrl: 'partials/main.html', controller: 'mainCtrl'})
  .when('/tribunal', {templateUrl: 'partials/main.html', controller: 'mainCtrl'})


  .when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'})
  .otherwise({redirectTo: '/'});
}]);
