'use strict';


// Declare app level module which depends on filters, and services
angular.module('caf', [
    /* ANG RESSOURCES */
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'ngStorage',
    'ngTouch',
    'ngTable',
    'ngSanitize',
    'jmdobry.angular-cache', 
    'ui.bootstrap',
    'monospaced.elastic',

    /* FILTERS */
    'caf.filters',

    /* SERVICES */
    'caf.services',
    'api.services',
    'users.services',
    'ladders.services',
    'underscore.services',

    /* DIRECTIVES */
    'caf.directives',

    /* CONTROLLERS */
    'caf.controllers',
    'login.controllers',
    'users.controllers',
    'ladders.controllers',
    'caf.animations'
  ])
  .constant('conf', {
    'epApiDev': 'http://localhost:8080/api/',
    'epApi': 'http://www.cyf-app.co/api/'
  })
  .config(function($angularCacheFactoryProvider, $routeProvider) {

    $angularCacheFactoryProvider.setCacheDefaults({
      deleteOnExpire: 'aggressive', // Items will be deleted from this cache right they expire.
      storageMode: 'localStorage' // This cache will sync itself with `localStorage`.
    });

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'mainCtrl'
      })
      .when('/leaderboard/', {
        templateUrl: 'views/leaderboard.html',
        controller: 'leaderboardCtrl'
      })
      .when('/leaderboard/:type', {
        templateUrl: 'views/leaderboard.html',
        controller: 'leaderboardCtrl'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'mainCtrl'
      })
      .when('/login', {
        templateUrl: 'views/partials/login.html',
        controller: 'loginCtrl'
      })
      .when('/logout', {
        templateUrl: 'views/main.html',
        controller: 'logoutCtrl'
      })
      .when('/challenges', {
        templateUrl: 'views/challenges.html',
        controller: 'mainCtrl'
      })
      .when('/users', {
        templateUrl: 'views/users.html',
        controller: 'usersCtrl'
      })
      .when('/users/:userId', {
        templateUrl: 'views/user_detail.html',
        controller: 'usersCtrl'
      })
      .when('/friends', {
        templateUrl: 'views/friends.html',
        controller: 'friendsCtrl',
        authRequired: true
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'mainCtrl',
        authRequired: true
      })
      .when('/request', {
        templateUrl: 'views/requests.html',
        controller: 'mainCtrl',
        authRequired: true
      })
      .when('/launchChallenge', {
        templateUrl: 'views/launchChallenge.html',
        controller: 'mainCtrl',
        authRequired: true
      })
      .when('/ongoing', {
        templateUrl: 'views/ongoing.html',
        controller: 'mainCtrl',
        authRequired: true
      })
      .when('/myChallenges', {
        templateUrl: 'views/myChallenges.html',
        controller: 'mainCtrl',
        authRequired: true
      })
      .when('/rateChallenges', {
        templateUrl: 'views/rateChallenges.html',
        controller: 'mainCtrl',
        authRequired: true
      })
      .when('/tribunal', {
        templateUrl: 'views/tribunal.html',
        controller: 'mainCtrl',
        authRequired: true
      })
      .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'profile',
        authRequired: true
      })
      .otherwise({
        redirectTo: '/'
      });
    })
    .run(function($rootScope, $location, $anchorScroll, $localStorage, $http, $routeParams, $angularCacheFactory) {
      $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
      $http.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
      $http.defaults.headers.common['X-cyf-AuthToken'] = $localStorage.sessionKey;

      $rootScope.$on('$routeChangeStart', function (event, next) {
        document.getElementById('app-slider').classList.remove('slider-active');
        if (next.authRequired === true && !$localStorage.sessionKey) {
          console.log('This route requires authentication');
          $location.path('/');
        }
      });

      $rootScope.cacheLadders = $angularCacheFactory('leaderboardCache');
      $rootScope.cacheUsers = $angularCacheFactory('usersCache');
      //when the route is changed scroll to the proper element.
      $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
        $location.hash($routeParams.scrollTo);
        $anchorScroll();  
      });
    });

