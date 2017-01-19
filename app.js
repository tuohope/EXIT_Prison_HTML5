var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
var five = require('johnny-five');



var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var myBoard = new five.Board({
    port:"/dev/cu.usbmodemFA121",
    repl: false,
    debug: false})

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

var socketCon = false;
var arduinoCon = false;
var ledon = true;
var iosocket = null;
var led = null;
var keySwitch = null;

var remoteA, remoteB, remoteC, remoteD;
var keySwitch,lever,fusebox,cuba,korea,russia;


myBoard.on("ready", function () {
    console.log("Arduino is ready.");
    arduinoCon = true;

    this.pinMode(2, five.Pin.INPUT);
    this.pinMode(3, five.Pin.INPUT);
    this.pinMode(4, five.Pin.INPUT);
    this.pinMode(5, five.Pin.INPUT);
    this.pinMode(6, five.Pin.INPUT);
    this.pinMode(7, five.Pin.INPUT);
    this.pinMode(8, five.Pin.INPUT);
    this.pinMode(9, five.Pin.INPUT);



    remoteA = new five.Switch(2);
    remoteB = new five.Switch(3);
    remoteC = new five.Switch(4);
    remoteD = new five.Switch(5);

    keySwitch = new five.Switch(6);
    lever = new five.Switch(7);
    fusebox = new five.Switch(8);
    cuba = new five.Switch(9);
    korea = new five.Switch(10);
    russia = new five.Switch(11);

    led = new five.Led(13);




    fusebox.on("open", function () {
        console.log("fusebox open")
        io.emit("gameStart","game on!");
        // io.emit("ledState", "LED IS CURRENTLY ON!");
        led.off();
    });

    fusebox.on("close", function () {
        console.log("fusebox close")
        led.on();
    })


    cuba.on("open", function () {
        console.log("remoteA open")
        // io.emit("gameStart","game on!");
        // io.emit("ledState", "LED IS CURRENTLY ON!");
        led.off();
    });

    cuba.on("close", function () {
        console.log("remoteA close")
        led.on();
    })



})

io.on('connection', function (socket) {
    console.log("user connected!");
    iosocket = socket;
    socketCon = true;

    socket.on('buttonPress',function () {
        console.log("buttonPressed!");



        if (ledon){
            led.off();
            ledon = false;
            io.emit("ledState", "LED IS CURRENTLY OFF");
        }else{
            led.on();
            ledon = true;
            io.emit("ledState", "LED IS CURRENTLY ON");
        }
    })



})


// if (socketCon){
//     socket.on('buttonPress',function () {
//         console.log("buttonPressed!");
//
//
//
//         if (ledon){
//             led.off();
//             ledon = false;
//             io.emit("ledState", "LED IS CURRENTLY OFF");
//         }else{
//             led.on();
//             ledon = true;
//             io.emit("ledState", "LED IS CURRENTLY ON");
//         }
//     })
// }

// app.get('/on',function(req,res){
//     console.log("led on");
//     // if(board.isReady){
//     led.on();
//     // }
//     console.log("light is turned on");
//     res.redirect('/');
// })
//
// app.get('/off',function(req,res){
//     console.log("led off");
//     // if(board.isReady){
//     led.off();
//     // }
//     console.log("light is turned off");
//     res.redirect('/');
// })

// io.on('connection', function(socket){
//     console.log('a user connected');
//
//     socket.on('chat message', function(msg){
//         console.log('message: ' + msg);
//         io.emit('chat message', msg);
//     });
//
//     socket.on('disconnect', function(){
//         console.log('user disconnected');
//     });
// });


http.listen(3000, '192.168.0.10',function(){
    console.log('listening on *:3000');
});

// http.listen(3000,function(){
//     console.log('listening on *:3000');
// });


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