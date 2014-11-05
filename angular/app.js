var app=angular.module('chatModule',[]);

app.factory('chatSocket',function () {   
   var servIp='http://172.19.31.21:3000';
   console.log(servIp);
   var socket = io.connect(servIp);
   return socket;
});

app.controller('ChatController',['$scope','chatSocket','$http',function($scope,chatSocket,$http){ 
    $http.get('getServerAddress').success(function(resp,code){
      if(code==200)
	  {
	     var servIp=resp.ip;
         console.log(servIp);
         var socket = io.connect(servIp);
		 $scope.chats=[];
	     $http.get('getAllChats').success(function(response,code){
			if(code==200)
			{
			  console.log(response);
			  $scope.chats=response;
			}
			else{
			  console.log(code);
			}
		});
		$scope.username='Anonymous';
		$scope.addChat=function(){
		  var chat={username:$scope.username,content:$scope.chatContent};
		  $scope.chatContent='';	  
		  socket.emit('send msg',chat);
		}
		socket.on('get msg',function(data){
		   $scope.chats.push(data);
		   $scope.$digest();
		});
	  }
	  else{
	     console.log('Error Connecting to Server');
	  }
    });	

}]);