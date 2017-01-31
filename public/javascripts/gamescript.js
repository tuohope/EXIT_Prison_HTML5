var socket = io();

//game constant
var gameTime = 45 * 60;
var hintTime = 5 * 60;
var debug = true;

var cellOpened = false;
var leverPulled = false;
var fusePulled = false;
var guardTraped = false;
var sndDoorClosed = false;

var pillTaken = false;
var uniformTaken = false;

var guardDrugged = false;

var cubaPressed = false;
var koreaPressed = false;
var russiaPressed = false;

var bonus3Solved = false;

var bonus1Active = false;
var bonus2Active = false;
var bonus3Active = false;
var bonus4Active = false;

var turretActive = true;
var laserActive = true;
var fDoorLocked = true;
var laserTripped = false;


var isIntro = false;

var currStar = 0;
var currRoom = 0;
var currStage = 0;

var currentObjective = "";


//send
$("button").click(function () {
    socket.emit('buttonPress');
})


// $(".objectiveFrame").hide();
// $(".gameTimer").hide();

//receive
socket.on('gameStart', function (msg) {
    if (currRoom != 0){return;}

    isIntro = true;
    if (debug){
        console.log(msg);
        playVideo("e1");
    }else {
        playVideo("intro");
    }


    currRoom = 1;
    currStage = 1;
    currentObjective = "Find a way to open the cell gate.";
    changeObjectiveText(currentObjective);
    startHintTimer();

    bonus1Active = false;
    bonus2Active = false;
    bonus3Active = false;
    bonus4Active = false;

    bonus3Solved = false;

    turretActive = true;
    laserActive = true;
    fDoorLocked = true;
    laserTripped = false;


});

socket.on('guardTrapped', function (msg) {
    printDebugMsg(msg);
    if (guardTraped) {return;}
    stopHintTimer();

    guardTraped = true;

    currRoom = 2;
    currStage = 1;
    bonus2Active = true;
    bonus3Active = true;
    currentObjective = "Search the room quietly.";
    changeObjectiveText(currentObjective);
    playVideo("c5");
    startHintTimer();
});

socket.on('guardDrugged', function (msg) {
    printDebugMsg(msg);
    if (guardDrugged){return;}

    stopHintTimer();
    guardDrugged = true;

    currRoom = 3;
    currStage = 2;

    currentObjective = "Unlock the computer."
    changeObjectiveText(currentObjective);
});

socket.on('resetGame', function (msg) {
    if (debug){
        console.log(msg);
    }
    //todo
});

socket.on('emerBtn', function(msg){
    if (debug){
        console.log(msg);
    }
    //todo
});

socket.on('cellOpen', function(msg){
    printDebugMsg(msg);
    if (cellOpened){return;}
    stopHintTimer();
    cellOpened = true;

    currRoom = 1;
    currStage = 2;
    currentObjective = "Find a way out of the chains.";
    changeObjectiveText(currentObjective);
    startHintTimer()
});

socket.on('leverPulled', function(msg){
    printDebugMsg(msg);
    if (leverPulled){return;}
    stopHintTimer();
    leverPulled = true;


    currRoom = 1;
    currStage = 3;
    currentObjective = "Find a way to take the guard out of commission."

    if (gameTime >= 40*60){
        bonus1Active = true;
        playVideo("b1");
    }
    changeObjectiveText(currentObjective);
    startHintTimer();
});

socket.on('fusePulled', function(msg){
    printDebugMsg(msg);
    if (fusePulled){return;}
    stopHintTimer();
    fusePulled = true;

    currRoom = 1;
    currStage = 4;
    currentObjective = "Hide in your cells."
    changeObjectiveText(currentObjective);
    playVideo("c1");
});

socket.on('2ndDoor', function(msg){
    printDebugMsg(msg);
    if (sndDoorClosed){return;}
    stopHintTimer();

    currRoom = 1;
    currStage = 3;
    currentObjective = "Lock the guard in the boiler room when he’s distracted."
    changeObjectiveText(currentObjective);
    playVideo("f3");
});

socket.on('cubaPressed', function(msg){
    printDebugMsg(msg);
    if (!cubaPressed && !koreaPressed && !russiaPressed){
        cubaPressed = true;
        return;
    }

    cubaPressed = false;
    koreaPressed = false;
    russiaPressed = false;
});

socket.on('korea', function(msg){
    printDebugMsg(msg);
    if (cubaPressed && !russiaPressed){
        koreaPressed = true;
        return;
    }
    cubaPressed = false;
    koreaPressed = false;
    russiaPressed = false;
});

socket.on('russia', function(msg){
    printDebugMsg(msg);
    if (cubaPressed && koreaPressed){
        russiaPressed = true;
        bonus1Active = false;
        changeObjectiveText(currentObjective);
        incStar();
        playVideo("b2");
        return;
    }

    cubaPressed = false;
    koreaPressed = false;
    russiaPressed = false;
});

socket.on('pillTaken', function(msg){
    printDebugMsg(msg);
    if (pillTaken){return;}

    pillTaken = true;
    bonus2Active = true;
    bonus3Active = true;

    currRoom = 2;
    currStage = 1;


    if (pillTaken && uniformTaken){
        currRoom = 3;
        currStage = 1;
        currentObjective = "Find a way to use the sleeping pills on the guard.\nUse the guard disguise to get into the third room.";
        startHintTimer();
    }else{
        currentObjective = "Find a way to use the sleeping pills on the guard."
    }
    changeObjectiveText(currentObjective);
    playVideo("c3");


});

socket.on('uniformTaken', function(msg){
    printDebugMsg(msg);
    if (uniformTaken){return;}
    stopHintTimer();

    uniformTaken = true;
    bonus2Active = true;
    bonus3Active = true;

    currRoom = 2;
    currStage = 1;


    if (pillTaken && uniformTaken){
        currRoom = 3;
        currStage = 1;
        currentObjective = "Find a way to use the sleeping pills on the guard.\nUse the guard disguise to get into the third room.";
        startHintTimer();
    }else{
        currentObjective = "Use the guard disguise to get into the third room."
    }
    changeObjectiveText(currentObjective);
    playVideo("c2");
});

socket.on('wardenlockerOpened', function(msg){
    printDebugMsg(msg);
    if (!bonus3Active){return;}

    bonus3Active = false;
    changeObjectiveText(currentObjective);
    incStar();
    playVideo("b4");
});

socket.on('phoneCracked', function(msg){
    printDebugMsg(msg);
    if (!bonus2Active){return;}

    bonus2Active = false;
    changeObjectiveText(currentObjective);
    incStar();
    playVideo("b3");
});

socket.on('pcUnlocked', function(msg){
    printDebugMsg(msg);
    stopHintTimer();

    currRoom = 3;
    currStage = 3;

    currentObjective = "Escape!";
    changeObjectiveText(currentObjective);
    playVideo("c4");

});

socket.on('turretDisabled', function(msg){
    printDebugMsg(msg);

    turretActive = false;

});

socket.on('laserDisabled', function(msg){
    printDebugMsg(msg);

    laserActive = false;

});

socket.on('fDoorUnlock', function(msg){
    printDebugMsg(msg);

    fDoorLocked = false;

});

socket.on('laserTripUnalarmed', function(msg){
    printDebugMsg(msg);
    if (laserTripped) {
        laserTripped = false;
        changeObjectiveText(currentObjective);
        playVideo("c6");
    }

});

socket.on('laserTripped', function(msg){
    printDebugMsg(msg);
    if (currRoom != 3 || !laserActive){return;}
    laserTripped = true;

    $("#objectiveText").text("Press PageUp, PageDown, Home, and End on the keyboard to shut down the alarm.");
    playVideo("f7");
});

socket.on('fDoorOpened', function(msg){
    printDebugMsg(msg);
    //todo

    if (!laserActive && !fDoorLocked){
        incStar();
        if (turretActive){
            playVideo("e2");
        }else {
            incStar();
            playVideo("e1");
        }

    }

    //ShowFinalScore();

});




//helper
function incStar() {

}

function playVideo(fileName) {
    $('#gv').show();
    var video = document.getElementById('gv');
    var sources = video.getElementsByTagName('source');
    sources[0].src = "video/"+fileName+".mp4";
    video.load();
    video.play();
}

document.getElementById('gv').addEventListener('ended',videoEndHandler,false);

function videoEndHandler(e) {
    $('#gv').hide();

    if (isIntro){
        $(".objectiveFrame").show();
        $(".gameTimer").show();
        GameTimeCountDown();
    }

}

function changeObjectiveText(currentObjective){
    if (laserTripped){return;}

    currentObjective = currentObjective + "\n";

    if (bonus1Active){
        currentObjective += "\nBonus - Show HQ the location of secret bases on the map in order of military strength."
    }
    if (bonus2Active){
        currentObjective += "\nBonus – Find their firewall bypass.";
    }
    if (bonus3Active && currRoom == 3 && currStage == 2){
        currentObjective += "\nBonus – Find a way into the warden’s locker.";
    }

    var obj = $("#objectiveText").text(currentObjective);
    obj.html(obj.html().replace(/\n/g,'<br/>'));

}

function startHintTimer() {
    hintTime = 5*60;
    HintTimeCountDown();
}

function stopHintTimer() {
    hintTime = 5000000000;
}

function HintTimeCountDown() {
    if (hintTime > 0){
        hintTime--;
        setTimeout(HintTimeCountDown,1000);
    }else{
        switch (currRoom){
            case 1:
                switch (currStage){
                    case 1:
                        currentObjective = "Distract the guard.\nSteal the keys.\nOpen the jail cell.";
                        changeObjectiveText(currentObjective);
                        break;
                    case 2:
                        currentObjective = "Find a way out of the chains by pulling the lever.";
                        changeObjectiveText(currentObjective);
                        playVideo("f1");
                        break;
                    case 3:
                        currentObjective = "Use the fuse box to get the guard in the boiler room.";
                        changeObjectiveText(currentObjective);
                        playVideo("f2");
                        break;
                }
                break;
            case 2:
                currentObjective = "Find the guard’s birthday to unlock the locker.";
                changeObjectiveText(currentObjective);
                playVideo("f4");
                break;
            case 3:
                switch (currStage){
                    case 1:
                        currentObjective = "Use the sleeping pills to drug the guard’s drink.";
                        changeObjectiveText(currentObjective);
                        playVideo("f5");
                        break;
                    case 2:
                        currentObjective = "Use warden's middle name to unlock the computer.";
                        changeObjectiveText(currentObjective);
                        playVideo("f6");
                        break;
                }
                break;
            default:
                break;
        }

    }
}

function GameTimeCountDown() {
    var ctd = document.getElementById('countdown');
    var minutes = Math.floor(gameTime / 60);
    var seconds = gameTime % 60;

    if (gameTime > 0){
        gameTime--;
        setTimeout(GameTimeCountDown,1000);
    }

    var minText = minutes >= 10 ? minutes : "0" + minutes;
    var secText = seconds >= 10 ? seconds : "0" + seconds;

    ctd.innerHTML = '<span>' + minText + ":" + secText + '</span>';
}


function printDebugMsg(msg) {
    if (debug){
        console.log(msg);
    }
}