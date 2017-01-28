var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
var five = require('johnny-five');

var app = express();

var index = require('./routes/index');
// var users = require('./routes/users');
app.use('/', index);
// app.use('/users', users);


var http = require('http').Server(app);
var io = require('socket.io')(http);


var myBoard = new five.Board({
    port:"/dev/cu.usbmodemFA121",
    repl: false,
    debug: false})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



var remoteA, remoteB, remoteC, remoteD;
var emerBtn, keySwitch, lever, fusebox, sndDoor,cuba, korea, russia;
var pill, uniform, wardenLocker, phoneGatget;
var pcLock, turret, laserIn, fDoorIn, alarm, sensor, fDoorMS;


myBoard.on("ready", function () {
    console.log("Arduino is ready.");

    remoteA = new five.Button({pin: 2, isPullup: true});
    remoteB = new five.Button({pin: 3, isPullup: true});
    remoteC = new five.Button({pin: 4, isPullup: true});
    remoteD = new five.Button({pin: 5, isPullup: true});

    emerBtn = new five.Button({pin: 6, isPullup: true});
    keySwitch = new five.Button({pin: 7, isPullup: true});
    lever = new five.Button({pin: 8, isPullup: true});
    fusebox = new five.Button({pin: 9, isPullup: true});
    sndDoor = new five.Button({pin: 10, isPullup: true});
    cuba = new five.Button({pin: 11, isPullup: true});
    korea = new five.Button({pin: 12, isPullup: true});
    russia = new five.Button({pin: 13, isPullup: true});

    // led = new five.Led(13);

    pill = new five.Button({pin: 14, isPullup: true});
    uniform = new five.Button({pin: 15, isPullup: true});
    wardenLocker = new five.Button({pin: 16, isPullup: true});
    phoneGatget = new five.Button({pin: 17, isPullup: true});

    pcLock = new five.Button({pin: 18, isPullup: true});
    turret = new five.Button({pin: 19, isPullup: true});
    laserIn = new five.Button({pin: 20, isPullup: true});
    fDoorIn = new five.Button({pin: 21, isPullup: true});
    alarm = new five.Button({pin: 22, isPullup: true});
    sensor = new five.Button({pin: 23, isPullup: true});
    fDoorMS = new five.Button({pin: 24, isPullup: true});


    remoteA.on("down",function(){
        io.emit("gameStart","gameStart");
        console.log("remoteA on");

    });
    remoteA.on("up",function(){
        console.log("remoteA off");
    });

    remoteB.on("down",function(){
        io.emit("guardTrapped","guardTrapped");
        console.log("remoteB on");
    });
    remoteB.on("up",function(){
        console.log("remoteB off");
    });

    remoteC.on("down",function(){
        io.emit("guardDrugged","guardDrugged");
        console.log("remoteC on");
    });
    remoteC.on("up",function(){
        console.log("remoteC off");
    });

    remoteD.on("down",function(){
        io.emit("resetGame","resetGame");
        console.log("remoteD on");
    });
    remoteD.on("up",function(){
        console.log("remoteD off");
    });


    emerBtn.on("down",function(){
        io.emit("emerBtn","emerBtn");
        console.log("emerBtn on");
    });
    emerBtn.on("up",function(){
        console.log("emerBtn off");
    });

    keySwitch.on("down",function(){
        io.emit("cellOpen","cellOpen");
        console.log("keySwitch on");
    });
    keySwitch.on("up",function(){
        console.log("keySwitch off");
    });

    lever.on("down",function(){
        io.emit("leverPulled","leverPulled");
        console.log("lever on");
    });
    lever.on("up",function(){
        console.log("lever off");
    });

    fusebox.on("down",function(){
        io.emit("fusePulled","fusePulled");
        console.log("fusebox on");
    });
    fusebox.on("up",function(){
        console.log("fusebox off");
    });

    sndDoor.on("down",function(){
        io.emit("2ndDoor","2ndDoorClosed");
        console.log("sndDoor on");
    });
    sndDoor.on("up",function(){
        console.log("sndDoor off");
    });

    cuba.on("down",function(){
        io.emit("cubaPressed","cuba");
        console.log("cuba on");
    });
    cuba.on("up",function(){
        console.log("cuba off");
    });

    korea.on("down",function(){
        io.emit("korea","northKorea");
        console.log("korea on");
    });
    korea.on("up",function(){
        console.log("korea off");
    });

    russia.on("down",function(){
        io.emit("russia","russia");
        console.log("russia on");
    });
    russia.on("up",function(){
        console.log("russia off");
    });


    pill.on("down",function(){
        io.emit("pillTaken","pillTaken");
        console.log("pill on");
    });
    pill.on("up",function(){
        console.log("pill off");
    });

    uniform.on("down",function(){
        io.emit("uniformTaken","uniformTaken");
        console.log("uniform on");
    });
    uniform.on("up",function(){
        console.log("uniform off");
    });

    wardenLocker.on("down",function(){
        io.emit("wardenlockerOpened","wardenlockerOpened");
        console.log("wardenLocker on");
    });
    wardenLocker.on("up",function(){
        console.log("wardenLocker off");
    });

    phoneGatget.on("down",function(){
        io.emit("phoneCracked","phoneCracked");
        console.log("phoneGatget on");
    });
    phoneGatget.on("up",function(){
        console.log("phoneGatget off");
    });


    pcLock.on("down",function(){
        io.emit("pcUnlocked","pcUnlocked");
        console.log("pcLock on");
    });
    pcLock.on("up",function(){
        console.log("pcLock off");
    });

    turret.on("down",function(){
        io.emit("turretDisabled","turretDisabled");
        console.log("turret on");
    });
    turret.on("up",function(){
        console.log("turret off");
    });

    laserIn.on("down",function(){
        io.emit("laserDisabled","laserDisabled");
        console.log("laserIn on");
    });
    laserIn.on("up",function(){
        console.log("laserIn off");
    });

    fDoorIn.on("down",function(){
        io.emit("fDoorUnlock","fDoorUnlock");
        console.log("fDoorIn on");
    });
    fDoorIn.on("up",function(){
        console.log("fDoorIn off");
    });

    alarm.on("down",function(){
        io.emit("laserTripUnalarmed","laserTripUnalarmed");
        console.log("alarm on");
    });
    alarm.on("up",function(){
        console.log("alarm off");
    });

    sensor.on("down",function(){
        io.emit("laserTripped","laserTripped");
        console.log("sensor on");
    });
    sensor.on("up",function(){
        console.log("sensor off");
    });

    fDoorMS.on("down",function(){
        io.emit("fDoorOpened","fDoorOpened");
        console.log("fDoorMS on");
    });
    fDoorMS.on("up",function(){
        console.log("fDoorMS off");
    });
})

io.on('connection', function (socket) {
    console.log("user connected!");
})


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
http.listen(3000, addresses[0],function(){
    console.log('listening on ' + addresses[0] + ':3000');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;