'use strict';

/* Directives */


angular.module('caf.directives', [])
  .directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('menuLeft', function () {
    return {
      templateUrl: 'views/partials/menuleft.html',
      restrict: 'AE',
      controller: 'MenuLeftCtrl'
    };
  })
  .directive('scrollTo', ['$location', '$anchorScroll', function ($location, $anchorScroll) {
      return function(scope, elm, attrs) {
        elm.bind('click', function(event) {
            event.stopPropagation();
            // scope.$on('$locationChangeStart', function(ev) {
            //     ev.preventDefault();
            // });
            var target = attrs.scrollTo;
            var old = $location.hash();
            $location.hash(target);
            $anchorScroll();
            //reset to old to keep any additional routing logic from kicking in
            $location.hash(old);
        });
      }
    }]);
