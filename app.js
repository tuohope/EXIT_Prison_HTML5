var express = require('express');
var path = require('path');
var five = require('johnny-five');

var app = express();

var index = require('./routes/index');
var settings = require('./routes/settings');
app.use('/', index);
app.use('/settings', settings);


var http = require('http').Server(app);
var io = require('socket.io')(http);


var myBoard = new five.Board({
    port:"/dev/cu.usbmodemFA121",
    repl: false,
    debug: false});

app.use(express.static(path.join(__dirname, 'public')));

const port = 3000;
var serverAddress = setupServer(port);
var gameTime = 45 * 60;
var hintTime = 5 * 60;
hintTime = 5;



var gameInProgress = false;
var hintTimeRunning = false;
var hintTriggered = false;

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

var turretActive = true;
var laserActive = true;
var fDoorLocked = true;
var laserTripped = false;

var bonus1Active = false;
var bonus2Active = false;
var bonus2Solved = false;
var bonus3Active = false;
var bonus3Solved = false;


// var currRoom = 0;
// var currStage = 0;

var currStar = 0;
var currGameTime = 0;
var currHintTime = 0;
var currStep = 0;
var currentObjective = "";


// var GameStatus = GenerateGameStatus();







myBoard.on("ready", function () {
    console.log("Arduino is ready.");

    var remoteA = new five.Button({pin: 2, isPullup: true});
    var remoteB = new five.Button({pin: 3, isPullup: true});
    var remoteC = new five.Button({pin: 4, isPullup: true});
    var remoteD = new five.Button({pin: 5, isPullup: true});

    var emerBtn = new five.Button({pin: 6, isPullup: true});
    var keySwitch = new five.Button({pin: 7, isPullup: true});
    var lever = new five.Button({pin: 8, isPullup: true});
    var fusebox = new five.Button({pin: 9, isPullup: true});
    var sndDoor = new five.Button({pin: 10, isPullup: true});
    var cuba = new five.Button({pin: 11, isPullup: true});
    var korea = new five.Button({pin: 12, isPullup: true});
    var russia = new five.Button({pin: 13, isPullup: true});

    var pill = new five.Button({pin: 14, isPullup: true});
    var uniform = new five.Button({pin: 15, isPullup: true});
    var wardenLocker = new five.Button({pin: 16, isPullup: true});
    var phoneGatget = new five.Button({pin: 17, isPullup: true});

    var pcLock = new five.Button({pin: 18, isPullup: true});
    var turret = new five.Button({pin: 19, isPullup: true});
    var laserControl = new five.Button({pin: 20, isPullup: true});
    var fDoorControl = new five.Button({pin: 21, isPullup: true});
    var alarm = new five.Button({pin: 22, isPullup: true});
    var laserSensor = new five.Button({pin: 23, isPullup: true});
    var fDoorSensor = new five.Button({pin: 24, isPullup: true});


    emerBtn.on("down",function(){
        io.emit("emerBtn","emerBtn");
        console.log("emerBtn on");
    });
    emerBtn.on("up",function(){
        console.log("emerBtn off");
    });
    remoteD.on("down",function(){
        resetGameStatus();
        resetHintTime();
        io.emit("resetGame","resetGame");
        console.log("remoteD on");
    });

    remoteA.on("down",function(){
        if (!gameInProgress){
            gameInProgress = true;
            resetGameStatus();
            resetHintTime();

            currGameTime += 11;
            currHintTime += 11;

            startHintTime();
            startGameTime();


            currStep = 1;
            // io.emit("gameStart", GenerativeObjectiveText());

            io.emit("gameStart", {
                text : GenerativeObjectiveText(),
                video : "e1",
                gameTime : gameTime
            })

        }
        console.log("remoteA on");

    });


    keySwitch.on("down",function(){
        if (gameInProgress && currStep <= 1){
            resetHintTime();
            startHintTime();
            cellOpened = true;
            currStep = 2;
            // io.emit("cellOpen",GenerativeObjectiveText());
            io.emit("playSound","prompt");
            io.emit("cellOpen", {
                text : GenerativeObjectiveText(),
                video : ""
            })
        }
        console.log("keySwitch on");
    });
    keySwitch.on("up",function(){
        console.log("keySwitch off");
    });

    lever.on("down",function(){
        if (gameInProgress && currStep <=2) {
            resetHintTime();
            startHintTime();
            leverPulled = true;
            currStep = 3;

            if (gameTime - currGameTime <= 5 * 60){
                bonus1Active = true;

                io.emit("leverPulled", {
                    text : GenerativeObjectiveText(),
                    video : "b1"
                })

            }else{
                io.emit("playSound","");
                io.emit("leverPulled", {
                    text : GenerativeObjectiveText(),
                    video : ""
                })
            }

            // io.emit("leverPulled", GenerativeObjectiveText());
        }
        console.log("lever on");
    });
    lever.on("up",function(){
        console.log("lever off");
    });

    fusebox.on("down",function(){
        io.emit("playSound","powerOut");
        if (gameInProgress && currStep <= 3 && !fusePulled) {
            resetHintTime();
            // startHintTime();
            fusePulled = true;
            currStep = 4;
            // io.emit("fusePulled", GenerativeObjectiveText());
            io.emit("fusePulled", {
                text : GenerativeObjectiveText(),
                video : "c1"
            })
        }
        console.log("fusebox on");
    });
    fusebox.on("up",function(){
        console.log("fusebox off");
    });

    sndDoor.on("down",function(){
        if (gameInProgress && currStep <= 4){
            resetHintTime();
            currStep = 5;

            io.emit("2ndDoor",{
                text : GenerativeObjectiveText(),
                video : "f3"
            });

            // io.emit("2ndDoor",GenerativeObjectiveText());
        }

        console.log("sndDoor on");
    });

    remoteB.on("down",function(){
        if (gameInProgress && (currStep == 4 || currStep == 5)) {
            resetHintTime();
            startHintTime();

            guardTraped = true;
            currStep = 6;
            bonus2Active = true;
            bonus3Active = true;
            // io.emit("guardTrapped", GenerativeObjectiveText());

            io.emit("guardTrapped", {
                text : GenerativeObjectiveText(),
                video : "c5"
            })

        }
        console.log("remoteB on");
    });



    pill.on("down",function(){
        if (gameInProgress && !pillTaken){
            pillTaken = true;
            bonus2Active = true;
            bonus3Active = true;
            if (!uniformTaken){
                currStep = 7;
            }else{
                resetHintTime();
                startHintTime();
                currStep = 9;
            }
            // io.emit("pillTaken",GenerativeObjectiveText());

            io.emit("pillTaken", {
                text : GenerativeObjectiveText(),
                video : "c3"
            });
        }
        console.log("pill on");
    });
    uniform.on("down",function(){
        if (gameInProgress && !uniformTaken){
            uniformTaken = true;
            resetHintTime();
            if (!pillTaken){
                currStep = 8;
            }else {
                startHintTime();
                currStep = 9;
            }
            io.emit("pillTaken", {
                text : GenerativeObjectiveText(),
                video : "c2"
            });

        }
        console.log("uniform on");
    });

    remoteC.on("down",function(){

        if (gameInProgress && currStep <= 9){
            guardDrugged = true;
            currStep = 10;
            resetHintTime();
            startHintTime();
            io.emit("playSound","prompt");
            io.emit("guardDrugged",{
                text : GenerativeObjectiveText(),
                video : ""
            });
        }

        console.log("remoteC on");
    });





    pcLock.on("down",function(){
        if (gameInProgress && currStep <= 10){
            resetHintTime();
            currStep = 11;
            io.emit("pcUnlocked",{
                text : GenerativeObjectiveText(),
                video : "c4"
            });
        }

        console.log("pcLock on");
    });

    turret.on("down",function(){
        if (gameInProgress){
            turretActive = false;
        }

        // io.emit("turretDisabled","turretDisabled");
        console.log("turret on");
    });
    turret.on("up",function(){
        if (gameInProgress){
            turretActive = false;
        }
        console.log("turret off");
    });

    laserControl.on("down",function(){
        if (gameInProgress){
            laserActive = false;
            io.emit("laserDisabled","laserDisabled");
            io.emit("playSound", "laserOff");
        }

        console.log("laserControl on");
    });
    laserControl.on("up",function(){
        if (gameInProgress){
            laserActive = true;
        }
        console.log("laserControl off");
    });

    fDoorControl.on("down",function(){
        if (gameInProgress){
            fDoorLocked = false;
            io.emit("playSound", "unlock");
        }

        console.log("fDoorControl on");
    });
    fDoorControl.on("up",function(){
        if (gameInProgress){
            fDoorLocked = true;
        }
        console.log("fDoorControl off");
    });

    alarm.on("down",function(){
        if (gameInProgress){
            if (laserTripped){
                io.emit("laserTripUnalarmed",{
                    text : GenerativeObjectiveText(),
                    video : "c6"
                });
            }
        }

        console.log("alarm on");
    });
    alarm.on("up",function(){
        console.log("alarm off");
    });

    laserSensor.on("down",function(){
        if (gameInProgress && currStep >= 9){
            if (laserActive && !laserTripped){
                laserTripped = true;
                io.emit("playSound", "alarm");
                io.emit("laserTripped",{
                    text : GenerativeObjectiveText(),
                    video : "f7"
                });
            }
        }

        console.log("laserSensor on");
    });
    laserSensor.on("up",function(){
        console.log("laserSensor off");
    });

    fDoorSensor.on("down",function(){
        if (gameInProgress){
            gameInProgress = false;
            if (turretActive){
                currStar+=2;
                io.emit("BonusSolved",{
                    text : "",
                    video : "",
                    star : currStar
                })
                io.emit("fDoorOpened",{
                    text : "",
                    video : "e1"
                });
            }else{
                currStar+=1;
                io.emit("BonusSolved",{
                    text : "",
                    video : "",
                    star : currStar
                })
                io.emit("fDoorOpened",{
                    text : "",
                    video : "e2"
                });
            }

        }
        console.log("fDoorSensor on");
    });
    fDoorSensor.on("up",function(){
        console.log("fDoorSensor off");
    });



    //bonus
    cuba.on("down",function(){
        if (!cubaPressed && !koreaPressed && !russiaPressed && bonus1Active){
            cubaPressed = true;
        }
    });
    korea.on("down",function(){
        if (cubaPressed && !koreaPressed && !russiaPressed && bonus1Active){
            koreaPressed = true;
        }else{
            cubaPressed = koreaPressed = russiaPressed = false;
        }
    });
    russia.on("down",function(){
        if (cubaPressed && !koreaPressed && !russiaPressed && bonus1Active){
            russiaPressed = true;
            if (cubaPressed && koreaPressed && russiaPressed){
                currStar++;
                bonus1Active = false;
                io.emit("bonusSolved", {
                    text : GenerativeObjectiveText(),
                    star : currStar,
                    video : "b2"
                })
            }
        }else{
            cubaPressed = koreaPressed = russiaPressed = false;
        }
    });


    wardenLocker.on("down",function(){
        if (gameInProgress && bonus3Active && !bonus3Solved){
            currStar++;
            bonus3Active = false;
            bonus3Solved = true;
            io.emit("bonusSolved", {
                text : GenerativeObjectiveText(),
                star : currStar,
                video : "b4"
            })
        }
        console.log("wardenLocker on");
    });

    phoneGatget.on("down",function(){
        if (gameInProgress && bonus2Active && !bonus2Solved){
            currStar++;
            bonus2Active = false;
            bonus2Solved = true;
            io.emit("bonusSolved", {
                text : GenerativeObjectiveText(),
                star : currStar,
                video : "b3"
            })
        }
    });
    phoneGatget.on("up",function(){
        console.log("phoneGatget off");
    });
})

io.on('connection', function (socket) {

    if (socket.handshake.headers.referer == "http://" + serverAddress + "/settings"){
        console.log("setting page connected");
    }else if (socket.handshake.headers.referer == "http://" + serverAddress + "/"){
        console.log("game page connected");
        // socket.emit("gameUserConnected",GameStatus);

        // socket.on('gameCountDown', function (data) {
            // GameStatus = data;
        //     console.log("GameStatus Updated, data is:")
        //     console.log(GameStatus);
        // })
    }

})

/**
 * @return {string}
 */
function GenerativeObjectiveText() {
    switch (currStep){
        case 1:
            currentObjective = !hintTriggered ? "Find a way to open the cell gate." : "Distract the guard.\nSteal the keys.\nOpen the jail cell.";
            break;
        case 2:
            currentObjective = !hintTriggered ? "Find a way out of the chains." : "Find a way out of the chains by pulling the lever.";
            break;
        case 3:
            currentObjective = !hintTriggered ? "Find a way to take the guard out of commission." : "Use the fuse box to get the guard in the boiler room.";
            break;
        case 4:
            currentObjective = "Hide in your cells.";
            break;
        case 5:
            currentObjective = "Lock the guard in the boiler room when he’s distracted.";
            break;
        case 6:
            currentObjective = !hintTriggered ? "Search the room quietly." : "Find the guard’s birthday to unlock the locker.";
            break;
        case 7:
            currentObjective = !hintTriggered ? "Find a way to use the sleeping pills on the guard." : "Find the guard’s birthday to unlock the locker.";
            break;
        case 8:
            currentObjective = "Use the guard disguise to get into the third room."; //uniform and !pill
            break;
        case 9:
            currentObjective = !hintTriggered ? "Find a way to use the sleeping pills on the guard.\nUse the guard disguise to get into the third room." : "Use the sleeping pills to drug the guard’s drink.";
            break;
        case 10:
            currentObjective = !hintTriggered ? "Unlock the computer." : "Use warden's middle name to unlock the computer.";
            break;
        case 11:
            currentObjective = "Escape!";
            break;
    }


    if (bonus1Active){
        currentObjective += "\nBonus - Show HQ the location of secret bases on the map in order of military strength."
    }
    if (bonus2Active){
        currentObjective += "\nBonus – Find their firewall bypass.";
    }
    if (bonus3Active && currStep >= 10){
        currentObjective += "\nBonus – Find a way into the warden’s locker.";
    }

    if (laserTripped){
        currentObjective = "Press PageUp, PageDown, Home, and End on the keyboard to shut down the alarm.";
    }


    return currentObjective;
}

/**
 * @return {string}
 */
function GenerateHintVideoName() {
    switch (currStep){
        case 2:
            return "f1";
        case 3:
            return "f2";
        case 6:
            return "f4";
        case 7:
            return "f4";
        case 9:
            return "f5";
        case 10:
            return "f6";
        default:
            return "";

    }

}

function resetHintTime() {
    hintTriggered = false;
    hintTimeRunning = false;
    currHintTime = hintTime;
}
function startHintTime() {
    hintTimeRunning = true;
    HintTimeCountDown();
}

function startGameTime() {
    gameInProgress = true;
    GameTimeCountDown();
}

function HintTimeCountDown() {
    if (hintTimeRunning){
        if (currHintTime > 0 ){
            console.log(currHintTime);
            hintTriggered = false;
            currHintTime--;
            setTimeout(HintTimeCountDown,1000);
        } else{
            hintTimeRunning = false;
            hintTriggered = true;
            io.emit("hintTriggered", {
                text : GenerativeObjectiveText(),
                video : GenerateHintVideoName()
            });
            console.log(GenerativeObjectiveText());
        }
    }
}

function GameTimeCountDown() {
    if (currGameTime > 0 && gameInProgress){
        currGameTime--;
        setTimeout(GameTimeCountDown,1000);
    }
}

function resetGameStatus() {
    gameInProgress = false;
    hintTimeRunning = false;
    hintTriggered = false;

    cellOpened = false;
    leverPulled = false;
    fusePulled = false;
    guardTraped = false;
    sndDoorClosed = false;

    pillTaken = false;
    uniformTaken = false;

    guardDrugged = false;

    cubaPressed = false;
    koreaPressed = false;
    russiaPressed = false;

    turretActive = true;
    laserActive = true;
    fDoorLocked = true;
    laserTripped = false;

    bonus1Active = false;
    bonus2Active = false;
    bonus2Solved = false;
    bonus3Active = false;
    bonus3Solved = false;

    currStar = 0;
    currGameTime = gameTime;
    currHintTime = hintTime;
    currStep = 0;
    currentObjective = "";
}

//setupServer
function setupServer() {
    var os = require('os');

    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }
    http.listen(port, addresses[0],function(){
        console.log('listening on ' + addresses[0] + ':' + port);
    });

    return addresses[0] + ':' + port;
}

module.exports = app;