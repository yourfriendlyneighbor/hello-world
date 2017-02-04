const express= require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
users = [];
connections = [];
messages = [];


const port = process.env.PORT || 3001
server.listen(port)
console.log("Server running...");

app.use(express.static('client'))
app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});

io.sockets.on('connection', function(socket){
  connections.push(socket);

  socket.on('disconnect', function(data){
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames()
    connections.splice(connections.indexOf(socket), 1);
  });
  //Send Message
  socket.on('send message', function(data){
    messages.push(data)
    console.log(messages);
    io.emit('new message', {msg: data, user: socket.username})
  })

  //New User
  socket.on('new user', function(data, callback){
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames()
  });
  function updateUsernames(){
    console.log(users)
    io.emit('get users', users);
  }
})
