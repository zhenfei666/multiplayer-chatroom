var express = require('express');
var app = express();
var server = require('http').createServer(app)；
var io = require("socket.io")(server);
var port = process.env.port || 3333;
var users = [];
server.listen(port,()=>{
    console.log("server listening at port %d",port);
});

//路由地址
app.use(express.static(__dirname + '/chatroom'));

var numUsers = 0;//用户数量

io.on('connect',(socket)=> {
    var addedUser = false;
    socket.on('add user',(username) =>{
        if(addedUser) return;
        if(users.indexOf(username) > -1){
            socket.emit('nameExisted');
        }else{
            users.push(username);
            //将用户名存储
            socket.username = username;
            ++ numUsers;
            addedUser = true;
            socket.emit('login',{
                username: socket.username,
                numUsers: numUsers
            });
        }
    });

    //监听用户断开连接
    socket.on('disconnect',()=> {
        users.splice(users.indexOf(socket.username),1);
        if(addedUser) [
            --numUsers;

            //广播给所有在线的用户
            socket.broadcast.emit('user left',{
                username: socket.username,
                numUsers: numUsers
            });
        ]
    })

    
})