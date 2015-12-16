var app = angular.module('ThunderApp',['ngRoute', 'ThunderCtrls', 'ThunderServices', 'btford.socket-io']);

// ROUTES
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'app/views/index.html'
  })
  .when('/about', {
    templateUrl: 'app/views/about.html'
  })
  .when('/chat', {
    templateUrl: 'app/views/chat.html',
    controller: "MessageCtrl"
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
            $rootScope.loggedInUser = user;
            break;
          case 'failure':
            sessionService.authFailed();
            break;
        }
      });
    }
  };
}]);
app.run(['sessionService', '$window', '$http', '$rootScope', function (sessionService, $window, $http, $rootScope) {  
      console.log("YOOOOO")
      console.log($window.user)
      $http.get('/confirm-login')
        .success(function (user) {
          console.log("IN THE HTTP GET",user);

          if (user) {
            $rootScope.user = user;
          }
      });
      
    if ($window.user !== null) {
        sessionService.authSuccess($window.user);
    }
}]);
app.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if (event.which === 13) {
        scope.$apply(function () {
          scope.$eval(attrs.ngEnter);
        });

        event.preventDefault();
      }
    });
  };
});



