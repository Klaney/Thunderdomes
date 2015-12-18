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
			//listen for message to be created and push to messages array to be displayed
			socket.on('message created', function (data) {
				console.log("MESSAGE CREATED IN CONTROLLER: ", data);
     		// Push to new message to our $scope.messages
		    $scope.messages.push(data.newMessage);
		    //Empty the textarea
		    $scope.msg = "";
		    //Update the scroll
		    setTimeout(updateScroll, 100);		    
			});

			//on connection, get current users from server and other fun stuff!
			socket.on('connected', function(data){
				//Create new user object to send to server
				$scope.connectedUsers = data;
				var userData = {};
				userData.name = $rootScope.user.name;
				userData.image = $rootScope.user.facebook.picture.data.url;
				//set chatbox to bottom
				updateScroll();
				//emit the user back to the server
				socket.emit('connected users', {
					userData
				});
			});

			//On disconnect grab user name and send back to server
			socket.on('disconnected', function(serverArr){
				$scope.connectedUsers = serverArr;
				console.log("THIS SHOULD EQUAL THE SPLICED ARRAY", $scope.connectedUsers);
			});

			//server sends back updated list of who is connected
			socket.on('server users', function(users){
				$scope.connectedUsers = users;
				console.log("COMPARING SERVER USERS AND ASSIGNING TO CLIENT USERS: ", users);
			});

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

			//Get the messages from the database for each connection
			Messages.query(function success(data) {
				console.log(data);
        $scope.messages = data;
        }, function error(data) {
        console.log(data);
    	});

    	var out = angular.element(document.querySelector('#screen'));
    	var isScrolledToBottom = out.context.scrollHeight - out.context.clientHeight <= out.context.scrollTop + 1;

    	//function to go to bottom of chatbox
    	var updateScroll = function(){
    		console.log("Tried to update scroll", isScrolledToBottom);
				if(isScrolledToBottom){
			    out.context.scrollTop = out.context.scrollHeight;
				};
    	}
		}
	]
);