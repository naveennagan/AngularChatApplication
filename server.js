var express=require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var mongo=require('mongoose');
var config=require('./config/config.js').settings;
var mongoDbUrl=config.mongodburl;
console.log(mongoDbUrl);
var mongoose=mongo.connect(mongoDbUrl, function (error) {
    if (error) {
       console.log(error);
    }
});
var Schema=mongoose.Schema;
var ChatSchema=new Schema({
	username: String,
	content: String
});
var ChatModel = mongoose.model('Chat', ChatSchema);

http.listen(3000, function(){
  console.log('listening on *:3000');
});

app.use(express.static('angular'));

app.get('/', function(req, res){
  res.sendfile('angular/index.html');
});
app.get('/getServerAddress', function(req, res){
    res.send({ip:config.serverUrl});
});
app.get('/getAllChats',function(req,res){
    console.log('Getting all Chats');
    ChatModel.find({},function(err,chats){
	    if(err)
		{
		  console.log(err);
		}
		res.send(chats);
	});
});

io.sockets.on('connection', function (socket) {
   console.log('new user connection');
  
   //save chat in mongodb
   socket.on('send msg',function(data){
      var chatModel=new ChatModel(data);
      chatModel.save(function(err,doc){
	     if(err){
		    console.log('Error saving chats'+err);
		 }      
      }); 	  
      io.sockets.emit('get msg',data);
   });
});




