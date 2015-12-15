var app = angular.module('ThunderApp',['ngRoute', 'ThunderCtrls', 'ThunderServices', 'btford.socket-io']);

// ROUTES
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'app/views/index.html',
    controller: "MessageCtrl"
  })
  .when('/about', {
    templateUrl: 'app/views/about.html'
  })
  .when('/chat', {
    templateUrl: 'app/views/chat.html'
  })
  .otherwise({
    templateUrl: 'app/views/404.html'
  });

  $locationProvider.html5Mode(true);
}]);
// END ROUTES
app.run(['$rootScope', 'sessionService', function ($rootScope, sessionService) {  
    $rootScope.session = sessionService;
}]);
app.run(['$rootScope', '$window', 'sessionService', function ($rootScope, $window, sessionService) {  
  $window.app = {
    authState: function(state, user) {
      $rootScope.$apply(function() {
        switch (state) {
          case 'success':
            sessionService.authSuccess(user);
            break;
          case 'failure':
            sessionService.authFailed();
            break;
        }
      });
    }
  };
}]);
app.run(['sessionService', '$window', function (sessionService, $window) {  
    if ($window.user !== null) {
        sessionService.authSuccess($window.user);
    }
}]);
// socket.on('connect', function() {
//   console.log('Connected!');
// });

// socket.on('message created', function (data) {
//     //Push to new message to our $scope.messages
//     $scope.messages.push(data);
//     //Empty the textarea
//     $scope.message = "";
// });
//Send a new message
// $scope.send = function (msg) {
//     //Notify the server that there is a new message with the message as packet
//     socket.emit('new message', {
//         room: $scope.room,
//         message: msg,
//         username: $scope.username
//     });
// };

