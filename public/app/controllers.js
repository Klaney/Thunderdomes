angular.module('ThunderCtrls', ["ThunderServices"])
.controller('MessageCtrl', ['$scope', '$rootScope', '$http', 'sessionService', function($scope, $rootScope, $http, sessionService){
	$scope.messages = {};

    function loadMessages() {
      $http.get('/api/secured/message').success(function(data) {
        $scope.messages.secured = data.message || data.error;
      });

      $http.get('/api/message').success(function(data) {
        $scope.messages.unsecured = data.message || data.error;
      });
    }

    var deregistration = $rootScope.$on('session-changed', loadMessages);
    $scope.$on('$destroy', deregistration);

    loadMessages();
}]);