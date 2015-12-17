var serverBaseUrl = 'http://thethunderdome.herokuapp.com/:3030';
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
        this.currentUser = null;
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
        console.log("IN THE SERVICES: "+userData);
        this.currentUser = userData;
        this.isLoggedIn = true;
        _currentUser = userData;
        $rootScope.$emit('session-changed');
      },
      authFailed: function() {
        this.resetSession();
        alert('Authentication failed');
      },
      getCurrentUser: function() {
        return this.currentUser;
      }
    };
    session.init();
    return session;
}])
.factory('Users', ['$resource', function($resource){
  return $resource('http://thethunderdome.herokuapp.com/api/users');
}])
.factory('Messages', ['$resource', function($resource){
  return $resource('http://thethunderdome.herokuapp.com/api/messages');
}])
.factory('socket', function(socketFactory){
  var myIoSocket = io.connect(serverBaseUrl);
  // console.log("User Connected");
  var socket = socketFactory({
      ioSocket: myIoSocket
  });
  console.log(socket);
  return socket;
});
//END AUTH FACTORY