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
     		// Push to new message to our $scope.messages
		    $scope.messages.push(data.newMessage);
		    //Empty the textarea
		    $scope.msg = "";
		    //Update the scroll
		    setTimeout(updateScroll, 100);		    
			});

			//on connection, get current users from server and other fun stuff!
			socket.on('connected', function(data){
				console.log("UPDATED THE CLIENT WITH THIS", data);
				//FIRST, GET USERS ON SERVER AND UPDATE CLIENT SIDE ARR
				$scope.connectedUsers.push(data);
				//Create new user object to send to server
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

			socket.on('update on connect', function(users){
				console.log("UPDATE ON CONNECT FIRED!", users[0]);
				// var connectMessage = {};
				// connectMessage.username = users[0].name;
				// connectMessage.content = "has joined the Thunderdome!";
				// $scope.messages.push(connectMessage);
				$scope.connectedUsers = users;
			})

			//On disconnect grab user name and send back to server
			socket.on('disconnected', function(serverArr){
				$scope.connectedUsers = serverArr;
			});

			//server sends back updated list of who is connected
			socket.on('server users', function(users){
				$scope.connectedUsers = users;
			});

			//Send a new message
			$scope.send = function (msg) {
				if(msg){
					var newMessage = new Messages();
					newMessage.username= $rootScope.user.name;
					newMessage.content = msg.content;
					newMessage.room = "ThunderDome";
					newMessage.$save();
			    //Notify the server that there is a new message with the message as packet
			    socket.emit('new message', {
			      newMessage
			    });			
				}
			};

			//Get the messages from the database for each connection
			Messages.query(function success(data) {
		      $scope.messages = data;
	      }, function error(data) {
		      console.log(data);
	    });

  		var out = angular.element(document.querySelector('#screen'));
  		var isScrolledToBottom = out.context.scrollHeight - out.context.clientHeight <= out.context.scrollTop + 1;

  		//function to go to bottom of chatbox
  		var updateScroll = function(){
				if(isScrolledToBottom){
		    	out.context.scrollTop = out.context.scrollHeight;
				};
  		}
		}
	]
);