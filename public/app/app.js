var app = angular.module('ThunderApp',['ngRoute', 'ThunderCtrls', 'ThunderServices']);

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

