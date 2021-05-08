const express=require('express');
const app=express();
const http=require('http');
const server=http.createServer(app);
const {Server}=require('socket.io');
//bind express server to io server
const io=new Server(server);

const PORT=3000;

app.use(express.static('public'));

app.get('/',(req,res)=>{
    res.send('index.html');
})

io.on('connection',socket=>{
    console.log('new connection established');

    socket.on('name',(name)=>{
        console.log(`incoming name: ${name}`);
        socket.username=name;
        io.emit('name',`${name} joined the server`);
    });

    socket.on('typing',(data)=>{
        if(data.typing==true){
            io.emit('typing',data.typing);
        }
        //io.emit('typing',msg);
    });

    socket.on('chat message',(msg)=>{
        console.log(`message: ${msg}`);

        //emit the message to all connected sockets
        io.emit('chat message',socket.username+': '+msg);
    });

    socket.on('disconnect',()=>{
        console.log(`${socket.username} disconnected`);
        io.emit('leave',`${socket.username} leave the chat`);
    });
})

server.listen(PORT,()=>console.log(`listening on ${PORT}`));