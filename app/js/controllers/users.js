'use strict';

/* Controllers */
angular.module('users.controllers', [])
  .controller('usersCtrl', ['$scope', '$routeParams', '$angularCacheFactory','Users', function($scope, $routeParams, $angularCacheFactory, Users) {

    var userId = $routeParams.userId ? $routeParams.userId : false;

    // Is it a profile or the list of our users ?
    if(!userId)
      $scope.users = Users.query();
    else{

      var usersCache = $angularCacheFactory.get('usersCache');
      var userProfileCached = usersCache.get('/users/'+userId);

      if(!userProfileCached) {

        var userInfos = Users.get({userId: userId});
        
        usersCache.put('/users/'+userId, userInfos);
        $scope.user = userInfos;

      } else {
        console.log('load from cache')
        $scope.user = userProfileCached;        
      }

    }
  }])
  .controller('friendsCtrl', ['$scope', '$routeParams', '$localStorage',function($scope, $routeParams, $localStorage) {

    var currentUser = $localStorage.profile ? $localStorage.profile : false;
    console.log(currentUser);
    $scope.currentUser = currentUser;

  }]);