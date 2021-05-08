//this load the client side of the socket.io
var socket=io();

var messages=document.getElementById('messages');
var form=document.getElementById('form');
var input=document.getElementById('input');
var user;
var typing;
var timeout=undefined;

input.addEventListener('keypress',(e)=>{
    if(localStorage.name && e.code!=='Enter'){
        typing=true;
        socket.emit('typing',{user:user,typing:typing});
        clearTimeout(timeout);
        timeout=setTimeout(typingTimeout,3000);
    }else{
        clearTimeout(timeout);
        typingTimeout();
    }
});

function typingTimeout(){
    typing=false;
    socket.emit('typing',{user:user,typing:typing});
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(input.value.match(new RegExp('^name:.','i'))!=null){
        const name=input.value.substring(input.value.indexOf(':')+1);
        socket.emit('name',name);
        input.value='';
    }
    if(input.value){
        socket.emit('chat message',input.value);
        input.value='';
    }
});

socket.on('typing',(isTyping)=>{
    if(isTyping){
        var item=document.createElement('li');
        item.textContent=user+' is typing...';
        messages.appendChild(item);
        window.scrollTo(0,document.body.scrollHeight);
    }
});

socket.on('name',(name)=>{
    var item=document.createElement('li');
    user=name.substring(0,name.indexOf(' '));
    item.textContent=name;
    messages.appendChild(item);
    window.scrollTo(0,document.body.scrollHeight);
});

socket.on('leave',(msg)=>{
    var item=document.createElement('li');
    item.textContent=msg;
    messages.appendChild(item);
    window.scrollTo(0,document.body.scrollHeight);
})

socket.on('chat message',(msg)=>{
    //console.log(`message: ${msg}`)
    var item=document.createElement('li');
    item.textContent=msg;
    messages.appendChild(item);
    window.scrollTo(0,document.body.scrollHeight);
});