angular.module('ThunderCtrls', ["ThunderServices"])
.controller('MessageCtrl', 
	[
		'$scope', 
		'$rootScope', 
		'$http', 
		'sessionService', 
		'socket',
		'Messages', 
		function(
			$scope, 
			$rootScope, 
			$http, 
			sessionService, 
			socket,
			Messages
		)
		{
			$scope.messages = [];
			$scope.connectedUsers = [];

			socket.on('message created', function (data) {
				console.log("MESSAGE CREATED IN CONTROLLER: ", data);
     		// Push to new message to our $scope.messages
			    $scope.messages.push(data.newMessage);
			    //Empty the textarea
			    $scope.msg = "";
			    //Update the scroll
			    //updateScroll();
			    setTimeout(updateScroll, 100);		    
			});
			socket.on('connected', function(){
				var userData = {};
				userData.name = $rootScope.user.name;
				userData.image = $rootScope.user.facebook.picture.data.url;
				$scope.connectedUsers.push(userData);
				socket.emit('connected users', {
					userData
				});
			});
			socket.on('disconnected', function(){
				var userName = $rootScope.user.name;
				socket.emit('disconnected name', userName);
			});
			socket.on('server users', function(users){
				$scope.connectedUsers = users;
				console.log("COMPARING SERVER USERS AND ASSIGNING TO CLIENT USERS: ",connectedUsers);
			})
			//$scope.currentUser = sessionService.getCurrentUser();
			//Send a new message
			$scope.send = function (msg) {
				if(msg){
					console.log("THE MSG:", msg);
					var newMessage = new Messages();
					newMessage.username= $rootScope.user.name;
					newMessage.content = msg.content;
					newMessage.room = "ThunderDome";
					console.log("THE NEW MESSAGE:",newMessage);
					newMessage.$save();
			    //Notify the server that there is a new message with the message as packet
			    socket.emit('new message', {
			        newMessage
			    });			
				}
			};

			Messages.query(function success(data) {
				console.log(data);
        $scope.messages = data;
        }, function error(data) {
        console.log(data);
    	});

    	var out = angular.element(document.querySelector('#screen'));
    	var isScrolledToBottom = out.context.scrollHeight - out.context.clientHeight <= out.context.scrollTop + 1;


    	var updateScroll = function(){
    		console.log("Tried to update scroll", isScrolledToBottom);
				if(isScrolledToBottom){
			    out.context.scrollTop = out.context.scrollHeight;
				};
    	}

    	$scope.$watchCollection("messages", function(data, old){
    		// setInterval(updateScroll, 100);
    	});
		}
	]
);