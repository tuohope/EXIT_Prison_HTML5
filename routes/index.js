var express = require('express');
var router = express.Router();
var path = require('path');


/* GET home page. */
router.get('/', function(req, res, next) {
    // console.log(req);
    // console.log(res);
    // console.log(next);
  res.render('helloworld', { title: 'Express' });
  //   res.sendFile(path.join(__dirname, 'arduino.html'));
});

router.get('/on',function(req,res){
    console.log("led on");
    // if(board.isReady){
    led.on();
    // }
    console.log("light is turned on");
    res.redirect('/');
})

router.get('/off',function(req,res){
    console.log("led off");
    // if(board.isReady){
    led.off();
    // }
    console.log("light is turned off");
    res.redirect('/');
})


// router.get('/helloworld', function(req, res) {
//     res.render('helloworld', { title: 'led HelloWorld'})
// });


module.exports = router;
