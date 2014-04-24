'use strict';

/* Controllers */
angular.module('users.controllers', ['jmdobry.angular-cache'])
  .controller('usersCtrl', ['$rootScope','$scope', '$routeParams', '$angularCacheFactory','Users', function($rootScope, $scope, $routeParams, $angularCacheFactory, Users) {
    var userId = $routeParams.userId ? $routeParams.userId : false;

    // Is it a profile or the list of our users ?
    if(!userId) {
      $scope.users = Users.query();
    }
    else{
      console.log(userId);
      var uCached = $angularCacheFactory('usersCache');
      var userProfileCached = uCached.get('/users_'+userId);

      if(!userProfileCached || !userProfileCached.idCool) {
        console.log('load from api')
        Users.get({userId: userId}, function(userInfos) {
            console.log(userInfos);
            uCached.put('/users_'+userInfos.idCool, userInfos);

            console.log(uCached.get('/users_'+userInfos.idCool));
            $scope.user = userInfos;
          }, function(res) {
            console.log(res);
          }
        );

      } else {
        console.log('load from cache')
        console.log(userProfileCached);
        $scope.user = userProfileCached;        
      }

    }
  }])
  .controller('friendsCtrl', ['$scope', '$routeParams', '$localStorage',function($scope, $routeParams, $localStorage) {

    var currentUser = $localStorage.profile ? $localStorage.profile : false;
    console.log(currentUser);
    $scope.currentUser = currentUser;

  }]);