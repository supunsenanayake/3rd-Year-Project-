//make connection
var socket = io.connect('http://192.168.1.2/');


// Query DOM
var message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback');
    var profilePic = document.getElementById('profilePic');





// Emit events
btn.addEventListener('click', function(){
    socket.emit('chat', {
        message: message.value,
        handle: handle.value,
        profilePic: profilePic.value
    });
    message.value = "";
});

message.addEventListener('keypress', function () {

    socket.emit('typing', {
        handle: handle.value
    });

});

// Listen for events
socket.on('chat', function(data){
    feedback.innerHTML = "";
    output.innerHTML += '<p>'+ '<img src="'+data.profilePic+'" class="rounded" alt="..." height="30px" width="30px">'+' <strong> ' + data.handle + ': </strong>' + data.message +'</p>';
});

socket.on('typing', function (data) {
});    feedback.innerHTML = '<p><em>' + data.handle + ' is typing a message</em></p>';
