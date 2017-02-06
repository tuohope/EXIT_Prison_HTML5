var socket = io.connect("192.168.0.19:3000");
var gameTime = 0;
var isIntro = false;
var isEnding = false;
var isPlaying = false;
var gameInProgress = false;
var videoQueue = [];


$(".objectiveFrame").hide();
$(".gameTimer").hide();

socket.on("test",function (data) {
    console.log(data);
    // console.log(msg);
})

socket.on("hintTriggered", function (msg) {
    // console.log(msg);
    changeObjectiveText(msg.text);
    if (msg.video!= ""){
        playVideo(msg.video);
    }

});
socket.on("bonusSolved", function (msg) {
    // console.log(msg);
    changeObjectiveText(msg.text);
    if (msg.video!= ""){
        playVideo(msg.video);
    }
    incStar(msg.star);

});
socket.on("resetGame", function(msg) {
  resetGame();
  console.log("reset game");
});
socket.on("playSound", function (msg) {
    playSound(msg);
})


socket.on("gameStart",function (msg) {
    console.log(msg.text);
    // console.log(msg.video);

    if (msg.video == "e1"){
        console.log(msg.video);
        isIntro = true;
        playVideo(msg.video);
    }
    gameTime = msg.gameTime;
    changeObjectiveText(msg.text);

});

socket.on('cellOpen', function (msg) {
    changeObjectiveText(msg.text);
});

socket.on('leverPulled', function (msg) {
    changeObjectiveText(msg.text);
    if (msg.video!= ""){
        playVideo(msg.video);
    }
});

socket.on('fusePulled', function (msg) {
    changeObjectiveText(msg.text);
    if (msg.video!= ""){
        playVideo(msg.video);
    }
});

socket.on('2ndDoor', function (msg) {
    changeObjectiveText(msg.text);
    if (msg.video!= ""){
        playVideo(msg.video);
    }
});

socket.on('guardTrapped', function (msg) {
    changeObjectiveText(msg.text);
    if (msg.video!= ""){
        playVideo(msg.video);
    }
});

socket.on('pillTaken', function (msg) {
    changeObjectiveText(msg.text);
    if (msg.video!= ""){
        playVideo(msg.video);
    }
});

socket.on('uniformTaken', function (msg) {
    changeObjectiveText(msg.text);
    if (msg.video!= ""){
        playVideo(msg.video);
    }
});

socket.on('guardDrugged', function (msg) {
    changeObjectiveText(msg.text);
    if (msg.video!= ""){
        playVideo(msg.video);
    }
});

socket.on('pcUnlocked', function (msg) {
    changeObjectiveText(msg.text);
    if (msg.video!= ""){
        playVideo(msg.video);
    }
});

socket.on('laserTripUnalarmed', function (msg) {
    changeObjectiveText(msg.text);
    if (msg.video!= ""){

        isPlaying = true;
        $('#gv').show();
        var video = document.getElementById('gv');
        var sources = video.getElementsByTagName('source');
        sources[0].src = "video/"+msg.video+".mp4";
        video.load();
        video.play();
        // playVideo(msg.video);
    }
});

socket.on('laserTripped', function (msg) {
    changeObjectiveText(msg.text);
    if (msg.video!= ""){
        isPlaying = true;
        $('#gv').show();
        var video = document.getElementById('gv');
        var sources = video.getElementsByTagName('source');
        sources[0].src = "video/"+msg.video+".mp4";
        video.load();
        video.play();

        // playVideo(msg.video);
    }
});

socket.on('fDoorOpened', function (msg) {
    // changeObjectiveText(msg.text);
    if (msg.video!= ""){
        isEnding = true;
        gameInProgress = false;
        playVideo(msg.video);
    }
});


function incStar(starCnt) {

    switch (starCnt){
        case 1:
            $('#starImg').attr("src","/images/s1.png");
            break;
        case 2:
            $('#starImg').attr("src","/images/s2.png");
            break;
        case 3:
            $('#starImg').attr("src","/images/s3.png");
            break;
        case 4:
            $('#starImg').attr("src","/images/s4.png");
            break;
        case 5:
            $('#starImg').attr("src","/images/s5.png");
            break;
        default:
            break;
    }

}

function resetGame(){
    gameTime = 0;
    isIntro = false;
    isPlaying = false;
    isEnding = false;
    gameInProgress = false;
    $(".objectiveFrame").hide();
    $(".gameTimer").hide();
    $('#starImg').attr("src","");
    $('#gv').hide();
}

function playSound(fileName) {
    var audio = new Audio("/SFX/"+ fileName +".mp3");
    audio.play();
}

function playVideo(fileName) {
    if (isPlaying){
        videoQueue.push(fileName);
    } else{
        isPlaying = true;
        $('#gv').show();
        var video = document.getElementById('gv');
        var sources = video.getElementsByTagName('source');
        sources[0].src = "video/"+fileName+".mp4";
        video.load();
        video.play();
    }
}

document.getElementById('gv').addEventListener('ended',videoEndHandler,false);

function showEnding() {
    $(".objectiveFrame").show();
    $(".gameTimer").show();
}

function videoEndHandler(e) {
    $('#gv').hide();
    isPlaying = false;

    if (isIntro){
        $(".objectiveFrame").show();
        $(".gameTimer").show();
        gameInProgress = true;
        GameTimeCountDown();
        isIntro = false;
    }
    if (isEnding){
       isEnding = false;
       showEnding();
    }

    if (videoQueue.length != 0){
        playVideo(videoQueue.shift());
    }
}


function changeObjectiveText(currentObjective){
    var obj = $("#objectiveText").text(currentObjective);
    obj.html(obj.html().replace(/\n/g,'<br/>'));

}

function GameTimeCountDown() {
    var ctd = document.getElementById('countdown');
    var minutes = Math.floor(gameTime / 60);
    var seconds = gameTime % 60;

    if (gameTime > 0 && gameInProgress){
        gameTime--;
        setTimeout(GameTimeCountDown,1000);
    }

    var minText = minutes >= 10 ? minutes : "0" + minutes;
    var secText = seconds >= 10 ? seconds : "0" + seconds;

    ctd.innerHTML = '<span>' + minText + ":" + secText + '</span>';
}
