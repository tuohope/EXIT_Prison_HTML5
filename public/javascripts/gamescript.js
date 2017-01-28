var socket = io();

//game constant
var gameTime = 45 * 60;
var hintTime = 5 * 60;
var debug = true;
var isIntro = false;

var currRoom = 1;
var currStage = 1;







//send
$("button").click(function () {
    socket.emit('buttonPress');
})



//receive
socket.on('gameStart', function (msg) {
    isIntro = true;
    if (debug){
        console.log(msg);
        playVideo("e1.mp4");
    }else {
        playVideo("intro.mp4");
    }
});

socket.on('guardTrapped', function (msg) {

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

socket.on('emerBtn', function(msg){
    if (debug){
        console.log(msg);
    }
});

socket.on('cellOpen', function(msg){
    if (debug){
        console.log(msg);
    }
});

socket.on('leverPulled', function(msg){
    if (debug){
        console.log(msg);
    }
});

socket.on('fusePulled', function(msg){
    if (debug){
        console.log(msg);
    }
});

socket.on('2ndDoor', function(msg){
    if (debug){
        console.log(msg);
    }
});

socket.on('cubaPressed', function(msg){
    if (debug){
        console.log(msg);
    }
});

socket.on('korea', function(msg){
    if (debug){
        console.log(msg);
    }
});

socket.on('russia', function(msg){
    if (debug){
        console.log(msg);
    }
});

socket.on('pillTaken', function(msg){
    if (debug){
        console.log(msg);
    }
});

socket.on('uniformTaken', function(msg){
    if (debug){
        console.log(msg);
    }
});

socket.on('wardenlockerOpened', function(msg){
    if (debug){
        console.log(msg);
    }
});

socket.on('phoneCracked', function(msg){
    if (debug){
        console.log(msg);
    }
});

socket.on('pcUnlocked', function(msg){
    if (debug){
        console.log(msg);
    }
});

socket.on('turretDisabled', function(msg){
    if (debug){
        console.log(msg);
    }
});

socket.on('laserDisabled', function(msg){
    if (debug){
        console.log(msg);
    }
});

socket.on('fDoorUnlock', function(msg){
    if (debug){
        console.log(msg);
    }
});

socket.on('laserTripUnalarmed', function(msg){
    if (debug){
        console.log(msg);
    }
});

socket.on('laserTripped', function(msg){
    if (debug){
        console.log(msg);
    }
});

socket.on('fDoorOpened', function(msg){
    if (debug){
        console.log(msg);
    }
});




//helper
function playVideo(fileName) {
    $('#gv').show();
    var video = document.getElementById('gv');
    var sources = video.getElementsByTagName('source');
    sources[0].src = "video/"+fileName;
    video.load()
    video.play();}

document.getElementById('gv').addEventListener('ended',videoEndHandler,false);

function videoEndHandler(e) {
    $('#gv').hide();
    if (isIntro){
        countdown();
    }

}

function countdown() {
    var ctd = document.getElementById('countdown');
    var minutes = Math.floor(gameTime / 60);
    var seconds = gameMin % 60;

    if (gameTime > 0){
        gameTime--;
        setTimeout(countdown,1000);
    }

    var minText = minutes >= 10 ? minutes : "0" + minutes;
    var secText = seconds >= 10 ? seconds : "0" + seconds;

    ctd.innerHTML = '<span>' + minText + ":" + secText + '</span>';
}


