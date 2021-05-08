const express=require('express');
const app=express();
const http=require('http');
const server=http.createServer(app);
const {Server}=require('socket.io');
//bind express server to io server
const io=new Server(server);

const PORT=3000;

const users={};

app.use(express.static('public'));

app.get('/',(req,res)=>{
    res.send('index.html');
})

io.on('connection',socket=>{
    console.log('new connection established');

    socket.on('name',(name)=>{
        console.log(`incoming name: ${name}`);
        users[socket.id]=name;
        socket.broadcast.emit('user-connected',{name:users[socket.id],users:users});
    });

    socket.on('chat message',(msg)=>{
        console.log(`message: ${msg}`);

        //emit the message to all connected sockets
        socket.broadcast.emit('chat message',{name:users[socket.id],message:msg});
    });

    socket.on('disconnect',()=>{
        console.log(`${users[socket.id]} disconnected`);
        socket.broadcast.emit('leave',{name:users[socket.id]});
        delete users[socket.id];
        io.emit('update-user-list',{users:users});
    });
})

server.listen(PORT,()=>console.log(`listening on ${PORT}`));