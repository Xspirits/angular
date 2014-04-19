'use strict';


// Declare app level module which depends on filters, and services
angular.module('caf', [
    'ngRoute',
    'ngAnimate',
    'ngTouch',
    'caf.filters',
    'caf.services',
    'users.services',
    'caf.directives',
    'caf.controllers',
    'caf.animations'
  ])
  .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/main.html',
          controller: 'mainCtrl'
        })
        .when('/leaderboard', {
          templateUrl: 'views/leaderboard.html',
          controller: 'leaderboardCtrl'
        })
        .when('/signup', {
          templateUrl: 'views/signup.html',
          controller: 'mainCtrl'
        })
        .when('/login', {
          templateUrl: 'views/login.html',
          controller: 'mainCtrl'
        })
        .when('/friends', {
          templateUrl: 'views/friends.html',
          controller: 'mainCtrl'
        })
        .when('/settings', {
          templateUrl: 'views/settings.html',
          controller: 'mainCtrl'
        })
        .when('/request', {
          templateUrl: 'views/requests.html',
          controller: 'mainCtrl'
        })
        .when('/launchChallenge', {
          templateUrl: 'views/launchChallenge.html',
          controller: 'mainCtrl'
        })
        .when('/challenges', {
          templateUrl: 'views/challenges.html',
          controller: 'mainCtrl'
        })
        .when('/ongoing', {
          templateUrl: 'views/ongoing.html',
          controller: 'mainCtrl'
        })
        .when('/myChallenges', {
          templateUrl: 'views/myChallenges.html',
          controller: 'mainCtrl'
        })
        .when('/rateChallenges', {
          templateUrl: 'views/rateChallenges.html',
          controller: 'mainCtrl'
        })
        .when('/tribunal', {
          templateUrl: 'views/tribunal.html',
          controller: 'mainCtrl'
        })
        .when('/users', {
          templateUrl: 'views/users.html',
          controller: 'users'
        })
        .when('/users/:userId', {
          templateUrl: 'views/user_detail.html',
          controller: 'users'
        })
        .otherwise({
          redirectTo: '/'
        });

    }])
    .run(function($rootScope, $location, $anchorScroll, $http, $routeParams) {
      $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
      $http.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
      //when the route is changed scroll to the proper element.
      $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
        $location.hash($routeParams.scrollTo);
        $anchorScroll();  
      });
    });

