//helper
var socket = io();
var gameMin = 45 * 60;
var debug = true;
var isIntro = false;

function playVideo(fileName) {
    $('#gv').show();
    var video = document.getElementById('gv');
    var sources = video.getElementsByTagName('source');
    sources[0].src = "video/"+fileName;
    video.load()
    video.play();}


document.getElementById('gv').addEventListener('ended',videoEndHandler,false);
countdown();
function videoEndHandler(e) {
    $('#gv').hide();
    if (isIntro){
        countdown();
    }

}


function countdown() {
    var ctd = document.getElementById('countdown');
    var minutes = Math.floor(gameMin / 60);
    var seconds = gameMin % 60;

    if (gameMin > 0){
        gameMin--;
        setTimeout(countdown,1000);
    }

    var minText = minutes >= 10 ? minutes : "0" + minutes;
    var secText = seconds >= 10 ? seconds : "0" + seconds;

    ctd.innerHTML = '<span>' + minText + ":" + secText + '</span>';
}


//send
$("button").click(function () {
    socket.emit('buttonPress');
})



//receive
socket.on('gameStart', function (msg) {
    if (debug){
        console.log(msg);
    }
    isIntro = true;
    playVideo("e1.mp4");
});

socket.on('guardTrapped', function (msg) {
    if (debug){
        console.log(msg);
    }
    playVideo("intro.mp4");
});

socket.on('guardDrugged', function (msg) {
    if (debug){
        console.log(msg);
    }
    // playVideo("intro.mp4");
});

socket.on('resetGame', function (msg) {
    if (debug){
        console.log(msg);
    }
    // playVideo("intro.mp4");
});


