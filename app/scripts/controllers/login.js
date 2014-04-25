'use strict';

/* Controllers */
angular.module('login.controllers', [])
  .controller('logoutCtrl', ['conf', '$rootScope', '$scope', '$location', '$resource', '$routeParams', '$http', '$localStorage', function (conf, $rootScope, $scope, $location, $resource, $routeParams, $http, $localStorage) {
      // Now do the server-side logout. The result isn't critical so pass/fail silently
      //var Logout = $resource(conf.epApi + 'auth/?');
      //Logout.delete();
  
      // Remove the AuthToken that's currently set on the headers
      delete $http.defaults.headers.common['X-cyf-AuthToken'];
      delete $localStorage.profile;
      delete $localStorage.sessionKey;
      // We're done with everything in $localStorage now, nuke it
      $localStorage.$reset();
      $rootScope.currentUser = false;
    
      // Return to the landing page
      $location.path('/');
    }])
  .controller('loginCtrl', ['$http', '$location', '$modal', '$modalInstance', '$localStorage', '$rootScope', '$scope', 'apiService', function ($http, $location, $modal, $modalInstance, $localStorage, $rootScope, $scope, apiService) {
    $scope.state = {progress: false};
  
    // Define the form object in the controller so that it can be prototypically inhereted into the
    // child scope created by the tab group
    $scope.form = {};
  
    // Handle modal submit button
    $scope.login = function() {
      if ($scope.form.login.$valid) {
        $scope.state.progress = true;

        apiService.Auth.get({'email':$scope.form.login.email, 'pass':$scope.form.login.pass}, function(data) {
            if(data.passed === true)
              onLoginSuccess(data);
            else
              onLoginError(data);
          }, function(res) {
            onLoginError(res);
          }
        );
      }
    }
    $scope.signup = function() {
      if ($scope.form.register.$valid) {
        $scope.state.progress = true;

        apiService.Signup.post({'username':$scope.form.register.username,'email':$scope.form.register.email, 'pass':$scope.form.register.pass}, function(data) {
          console.log(data)
            if(data.passed === true){
              if(data.log === true) {
                onLoginSuccess(data);
              } else {
                $modalInstance.close();
                $modal.open({
                  templateUrl: 'views/partials/emailConfirm.html'
                });
              }
            } else{
              onLoginError(data);
            }
          }, function(res) {
            onLoginError(res);
          }
        );
      }
    }
  
    // Handle modal cancel button
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  
    $scope.tabSelect = function(index) {
      $scope.tabIndex = index;
    };

    function onLoginSuccess(loginData) {
      // Let's double check to make sure we got a session key in the response.
      if (loginData.user && loginData.user.sessionKey) {
        $http.defaults.headers.common['X-cyf-AuthToken'] = loginData.user.sessionKey;
        try {
          $localStorage.profile = loginData.user;
          $localStorage.sessionKey = loginData.user.sessionKey;
          $modalInstance.close();

          $rootScope.currentUser = $localStorage.profile;
        } catch (err) {
           console.log(err);
        }
      }
    }

    function onLoginError(res) {
      $scope.state.progress = false;
      $http.defaults.headers.common['X-cyf-AuthToken'] = '';
      delete $localStorage.profile;
      delete $localStorage.sessionKey;

      // TODO: Finish error messages
      if (res.err) {
        console.log(res.err);
      } else if (res.status) {
        console.log(res.status);
      } else {
        console.log('other error');
      }
    }
  }]);