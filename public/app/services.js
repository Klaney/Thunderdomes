var serverBaseUrl = location.origin.replace(/^http/, "ws");
console.log("******** "+serverBaseUrl);
angular.module('ThunderServices', ['ngResource', 'btford.socket-io'])
.factory('sessionService', 
  [
  '$rootScope', 
  '$window', 
  '$http',  
  function ($rootScope, $window, $http) {
    var _currentUser = {};
    var session = {
      init: function () {
        this.resetSession();
      },
      resetSession: function() {
        $rootScope.user = null;
        this.isLoggedIn = false;
      },
      facebookLogin: function() {
        var url = '/auth/facebook',
          width = 1000,
          height = 650,
          top = (window.outerHeight - height) / 2,
          left = (window.outerWidth - width) / 2;
        $window.open(url, 'facebook_login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);
      },
      logout: function() {
        var scope = this;
        $http.delete('/auth').success(function() {
          scope.resetSession();
          $rootScope.$emit('session-changed');
        });
      },
      authSuccess: function(userData) {
        this.currentUser = userData;
        this.isLoggedIn = true;
        $rootScope.user = userData;
        $rootScope.$emit('session-changed');
      },
      authFailed: function() {
        this.resetSession();
        alert('Authentication failed');
      },
      getCurrentUser: function() {
        $http.get('/confirm-login')
        .success(function (user) {
          if (user) {
            $rootScope.user = user;
          }
        });
        return $rootScope.user;
      }
    };
    //this.isLoggedIn = false;
    if (!session.getCurrentUser()){
      console.log("Initialized")
      session.init(); 
    } else {
      console.log("GOT THE USER")
      this.isLoggedIn = true;
    }
    return session;
}])
.factory('Users', ['$resource', function($resource){
  return $resource('/api/users');
}])
.factory('Messages', ['$resource', function($resource){
  return $resource('/api/messages');
}])
.factory('socket', function(socketFactory){
  var myIoSocket = io.connect(serverBaseUrl);
  var socket = socketFactory({
      ioSocket: myIoSocket
  });
  return socket;
});
//END AUTH FACTORY