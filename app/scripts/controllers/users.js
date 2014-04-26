'use strict';

/* Controllers */
angular.module('users.controllers', ['jmdobry.angular-cache'])
  .controller('usersCtrl', ['$rootScope', '_', '$scope', '$routeParams', '$angularCacheFactory','Users', function($rootScope, _, $scope, $routeParams, $angularCacheFactory, Users) {
    var userId = $routeParams.userId ? $routeParams.userId : false
      , name;

    console.log($rootScope.currentUser);
    // Is it a profile or the list of our users ?
    if(!userId) {

      $scope.pageTitle = 'Challenger list';
      $scope.users = Users.query();

    // User profile details
    } else {

      var uCached = $rootScope.cacheUsers;
      var userProfileCached = uCached.get('users_'+userId);

      if(!userProfileCached || !userProfileCached.idCool) {
        console.log('load from api');
        return Users.get({userId: userId}, function(userInfos) {

            uCached.put('users_'+userInfos.idCool, userInfos);

            // Scope variables
            $scope.pageTitle = userInfos.local.pseudo + '\'s profile';
            $scope.user = userInfos;

          }, function(res) {
            console.log(res);
          }
        );

      } else {        
        console.log('load from cache');
        
        // Scope variables
        $scope.pageTitle = userProfileCached.local.pseudo + '\'s profile';
        $scope.user = userProfileCached;        
      }
    }

  }])
  .controller('friendsCtrl', ['$scope', '$routeParams', '$localStorage',function($scope, $routeParams, $localStorage) {

    $scope.pageTitle = 'My friends';

    var currentUser = $localStorage.profile ? $localStorage.profile : false;
    console.log(currentUser);
    $scope.currentUser = currentUser;

  }]);