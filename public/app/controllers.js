angular.module('ThunderCtrls', ["ThunderServices"])
.controller('MessageCtrl', 
	[
		'$scope', 
		'$rootScope', 
		'$http', 
		'sessionService', 
		'socket', 
		function($scope, $rootScope, $http, sessionService, socket){
			// $scope.messages = {};

		 //    function loadMessages() {
		 //      $http.get('/api/secured/message').success(function(data) {
		 //        $scope.messages.secured = data.message || data.error;
		 //      });

		 //      $http.get('/api/message').success(function(data) {
		 //        $scope.messages.unsecured = data.message || data.error;
		 //      });
		 //    }

		 //    var deregistration = $rootScope.$on('session-changed', loadMessages);
		 //    $scope.$on('$destroy', deregistration);

		 //    loadMessages();

		 //  socket.on('connect', function() {
		 //  	console.log('Connected!');
			// });
		}
	]
);