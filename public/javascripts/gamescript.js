//helper

function playVideo(fileName) {
    $('#gv').show();
    var video = document.getElementById('gv');
    var sources = video.getElementsByTagName('source');
    sources[0].src = "intro.mp4";
    video.load()
    video.play();}


var socket = io();
document.getElementById('gv').addEventListener('ended',videoEndHandler,false);

function videoEndHandler(e) {
    $('#gv').hide();
}


//send
$("button").click(function () {
    socket.emit('buttonPress');
})



//receive
socket.on('gameStart', function (msg) {
    playVideo("intro.mp4");
})

socket.on('cellGateOpened',function (msg) {

})

socket.on('leverPulled',function (msg) {

})

socket.on('fuseboxPulled',function (msg) {

})

socket.on('secondDoorClosed',function (msg) {

})

socket.on('',function (msg) {

})

socket.on('',function (msg) {

})



socket.on('ledState', function (msg) {
    $('#messages').text(msg);
})

