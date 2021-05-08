//this load the client side of the socket.io
var socket=io('http://localhost:3000');

var messages=document.getElementById('messages');
var form=document.getElementById('form');
var input=document.getElementById('input');
var usersList=document.getElementById('users');

var users={};

const username=prompt('what is your name?');
appendMessage('Welcome');
socket.emit('name',username);

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(input.value){
        socket.emit('chat message',input.value);
        appendMessage('You: '+input.value);
        input.value='';
    }
});

socket.on('user-connected',(data)=>{
    updateUserList(data.users);
    appendMessage(`${data.name} joined the server`);
});

socket.on('leave',(data)=>{
    appendMessage(`${data.name} leave the chat`);
})

socket.on('chat message',(data)=>{
    appendMessage(`${data.name}: ${data.message}`);
});

socket.on('update-user-list',(data)=>{
    updateUserList(data.users);
})

function appendMessage(message){
    const msgElement=document.createElement('li');
    msgElement.textContent=message;
    messages.appendChild(msgElement);
    window.scrollTo(0,document.body.scrollHeight);
}

function updateUserList(list){
    users=list;
    removeAllChildNodes(usersList);
    for(const [key,value] of Object.entries(users)){
        mapUser(value);
    }
    console.log(users);
}

function mapUser(user){
    const li=document.createElement('li');
    li.textContent=user;
    usersList.appendChild(li);
}

function removeAllChildNodes(parent){
    while(parent.firstChild){
        parent.removeChild(parent.firstChild);
    }
}