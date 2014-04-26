'use strict';

/* Filters */

angular.module('caf.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }]).
  filter('isFriend', ['_', '$rootScope', function(_, $rootScope) {
     return function(idUser) {
      var currUser = $rootScope.currentUser
        , stringId = idUser.toString()
        , check_friend = false
        , check_sent = false
        , check_pending = false;

      // We can't use contains() as friends is a nested object and we need to check the friends' ids.
      if(currUser.friends.length > 0)
        check_friend = _.filter(currUser.friends, function(f){ return f.idUser.toString() === stringId; });

      if(currUser.sentRequests.length > 0)
        check_sent = _.filter(currUser.sentRequests, function(s){ return s.idUser.toString() === stringId; });
      
      if(currUser.pendingRequests.length > 0)
        check_pending = _.filter(currUser.pendingRequests, function(p){ return p.idUser.toString() === stringId; });

      // Are they friends? or CurrUser has sent a request ? or idUser has invited CurrUser? else they don't know eachothers
      return check_friend ? 1 : (check_sent ? 2 : (check_pending ? 2 : 0)) ;
     }
    }]);
